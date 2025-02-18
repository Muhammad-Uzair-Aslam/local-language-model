import { useState, useRef } from 'react';
import { Alert, FlatList } from 'react-native';
import { LlamaContext } from 'llama.rn';

export interface Message {
  role: 'user' | 'system';
  content: string;
}

interface ChatState {
  messages: Message[];
  inputText: string;
  loading: boolean;
  numTokens: string;
}

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
  '<|end_of_sentence|>',  
  '</s>',
  '<|END|>'
];

export const useChat = (model: LlamaContext | null) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    inputText: '',
    loading: false,
    numTokens: '2000',
  });

  const flatListRef = useRef<FlatList<Message>>(null);

  const sendMessage = async () => {
    if (!model) {
      Alert.alert('Please wait', 'Model is still loading...');
      return;
    }

    if (!state.inputText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    const userMessage: Message = { role: 'user', content: state.inputText };
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      inputText: '',
      loading: true,
    }));

    try {
      let responseContent = '';
      const conversation = [...state.messages, userMessage];
      
      await model.completion(
        {
          prompt:
            'This is a conversation between user and llama, a friendly chatbot. Respond in simple markdown. First think about the every answer in <think></think> and then send response\n\nUser: Hello!\nLlama:',
          messages: conversation,
          n_predict: parseInt(state.numTokens) || 2000,
          temperature: 0.7,
          stop: stopWords,
        },
        data => {
          responseContent += data.token;
          setState(prev => {
            const lastIndex = prev.messages.length - 1;
            if (prev.messages[lastIndex]?.role === 'system') {
              return {
                ...prev,
                messages: prev.messages.map((msg, index) =>
                  index === lastIndex
                    ? { ...msg, content: responseContent }
                    : msg,
                ),
              };
            }
            return {
              ...prev,
              messages: [...prev.messages, { role: 'system', content: responseContent }],
            };
          });
        },
      );
    } catch (error) {
      console.error('Error streaming response:', error);
      Alert.alert('Error', 'Failed to get response');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateInput = (text: string) => {
    setState(prev => ({ ...prev, inputText: text }));
  };

  const updateNumTokens = (tokens: string) => {
    setState(prev => ({ ...prev, numTokens: tokens }));
  };

  return {
    ...state,
    sendMessage,
    updateInput,
    updateNumTokens,
    flatListRef,
  };
};