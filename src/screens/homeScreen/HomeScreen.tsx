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

const Main = () => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modal, setModal] = useState<LlamaContext | null>(null);
  const [messages, setMessages] = useState<{role: 'system' | 'user'; content: string}[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [numTokens, setNumTokens] = useState<string>('2000');
  
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
          n_predict: parseInt(numTokens) || 2000,
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
    <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
    
    <View style={styles.header}>
      <Text style={styles.headerTitle}>AI Assistant</Text>
      {loading && <ActivityIndicator size="small" color="#FFF" />}
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
           {/* <TextInput
              style={styles.tokenInput}
              placeholder="Tokens"
              keyboardType="numeric"
              value={numTokens}
              onChangeText={setNumTokens}
            /> */}
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
        </View>
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
  backgroundColor: '#F5F7FB',
},
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 16,
  backgroundColor: '#4A90E2',
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
},
headerTitle: {
  fontSize: 24,
  fontWeight: '700',
  color: '#FFF',
  letterSpacing: 1,
},
messageList: {
  padding: 12,
},
messageContainer: {
  maxWidth: '85%',
  marginVertical: 8,
  padding: 12,
  borderRadius: 20,
},
tokenInput: {
  width: 60,
  borderWidth: 1,
  borderColor: '#ddd',
  padding: 10,
  borderRadius: 5,
},
userMessageContainer: {
  alignSelf: 'flex-end',
  backgroundColor: '#4A90E2',
  borderBottomRightRadius: 4,
},
botMessageContainer: {
  alignSelf: 'flex-start',
  backgroundColor: '#FFF',
  borderBottomLeftRadius: 4,
},
messageText: {
  fontSize: 16,
  lineHeight: 24,
},
userMessageText: {
  color: '#FFF',
},
botMessageText: {
  color: '#333',
},
timeText: {
  fontSize: 11,
  marginTop: 4,
  alignSelf: 'flex-end',
},
userTimeText: {
  color: '#FFF',
  opacity: 0.8,
},
botTimeText: {
  color: '#666',
},
inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 10,
  backgroundColor: '#FFF',
  borderTopWidth: 1,
  borderTopColor: '#E5E5E5',
},
inputWrapper: {
  flex: 1,
  backgroundColor: '#F5F7FB',
  borderRadius: 25,
  paddingHorizontal: 16,
  paddingVertical: 8,
  marginRight: 12,
  borderWidth: 1,
  borderColor: '#E5E5E5',
},
input: {
  fontSize: 16,
  color: '#333',
  maxHeight: 100,
},
sendButton: {
  backgroundColor: '#4A90E2',
  borderRadius: 25,
  paddingHorizontal: 20,
  paddingVertical: 12,
  alignItems: 'center',
  justifyContent: 'center',
},
sendButtonDisabled: {
  backgroundColor: '#B0C4DE',
},
sendButtonText: {
  color: '#FFF',
  fontSize: 16,
  fontWeight: '600',
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
});

export default Main;
