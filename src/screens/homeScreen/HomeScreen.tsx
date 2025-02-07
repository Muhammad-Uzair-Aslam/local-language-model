import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {initLlama, LlamaContext} from 'llama.rn';
import * as RNFS from '@dr.pogodin/react-native-fs';

const modelUrl = 'https://huggingface.co/talhabytheway/DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M-GGUF/resolve/main/deepseek-r1-distill-qwen-1.5b-q4_k_m.gguf?download=true';
const modelPath = `${RNFS.DocumentDirectoryPath}/deepseek-r1-distill-qwen-1.5b-q4_k_m.gguf`;

const loadLlamaModel = async ({_modelPath}: {_modelPath: string}) => {
  const context = await initLlama({
    model: _modelPath,
    use_mlock: true,
    n_ctx: 2048,
    n_gpu_layers: 1,
  });
  return context;
};

const HomeScreen = () => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modal, setModal] = useState<LlamaContext | null>(null);
  const [messages, setMessages] = useState<{role: 'system' | 'user'; content: string}[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [numTokens, setNumTokens] = useState<string>('200');
  
  const flatListRef = useRef<FlatList>(null);

  const stopWords = [
    '</s>',
    '<|end|>',
    '<|eot_id|>',
    '<|end_of_text|>',
    '<|im_end|>',
    '<|EOT|>',
    '<|END_OF_TURN_TOKEN|>',
    '<|end_of_turn|>',
    '<|endoftext|>',
  ];

  useEffect(() => {
    async function downloadModel() {
      try {
        const fileExists = await RNFS.exists(modelPath);
        if (!fileExists) {
          await RNFS.downloadFile({
            fromUrl: modelUrl,
            toFile: modelPath,
            progress: res => {
              const P = (res.bytesWritten / res.contentLength) * 100;
              setProgress(P);
            },
          }).promise;
        }
        setIsDownloaded(true);
      } catch (error) {
        console.error('Download error:', error);
        Alert.alert('Error', 'Failed to download model');
      }
    }

    async function loadModel() {
      try {
        const exists = await RNFS.exists(modelPath);
        if (!exists) return;
        const llamaModal = await loadLlamaModel({_modelPath: modelPath});
        setModal(llamaModal);
      } catch (error) {
        console.error('Error loading model:', error);
        Alert.alert('Error', 'Failed to load model');
      }
    }

    if (!isDownloaded) downloadModel();
    else loadModel();
  }, [isDownloaded]);

  const sendMessage = async () => {
    if (!modal) {
      Alert.alert('Error', 'Model not loaded');
      return;
    }

    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    const userMessage = {role: 'user' as 'user', content: inputText};
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const conversation = [...messages, userMessage];
      await modal.completion(
        {
          prompt: 'This is a conversation between user and llama, a friendly chatbot. respond in simple markdown.\n\nUser: Hello!\nLlama:',
          messages: conversation,
          n_predict: parseInt(numTokens) || 200,
          temperature: 0.7,
          stop: stopWords,
        },
        data => {
          setMessages(prev => {
            const lastIndex = prev.length - 1;
            if (prev[lastIndex]?.role === 'system') {
              return prev.map((msg, index) =>
                index === lastIndex
                  ? {...msg, content: msg.content + data.token}
                  : msg,
              );
              
            }
            return [...prev, {role: 'system', content: data.token}];
          });
        },
      );
    } catch (error) {
      console.error('Error streaming response:', error);
      Alert.alert('Error', 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({animated: true});
    }
  }, [messages]);

  const renderMessage = ({item}: {item: {role: string; content: string}}) => (
    <View
      style={[
        styles.messageContainer,
        item.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
      ]}>
      <Text style={[styles.messageText, item.role === 'user' ? styles.userMessageText : styles.botMessageText]}>
        {item.content}
      </Text>
      <Text style={styles.timeText}>
        {new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
      </Text>
    </View>
  );

  if (!isDownloaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Downloading model: {progress.toFixed(2)}%</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Chat</Text>
        {loading && <ActivityIndicator size="small" color="#007AFF" />}
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
      />

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
  <View style={styles.inputContainer}>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder="Chat with me...."
        value={inputText}
        onChangeText={setInputText}
        multiline
        maxLength={1000}
        placeholderTextColor="#666"
      />
    </View>
    {/* Send Button */}
    <TouchableOpacity
      style={[styles.sendButton, loading && styles.sendButtonDisabled]}
      onPress={sendMessage}
      disabled={loading}>
      <Text style={styles.sendButtonText}>Send</Text>
    </TouchableOpacity>
  </View>
</KeyboardAvoidingView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  messageList: {
    padding: 8,
  },
  messageContainer: {
    maxWidth: '90%',
    marginVertical: 8,
    padding: 10,
    borderRadius: 20,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 2,
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#1a1a1a',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  micButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    fontSize: 24,
    color: '#B76E79', // Microphone icon color
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;