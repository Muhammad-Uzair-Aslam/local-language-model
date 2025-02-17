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

const stopWords: string[] = [
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

const SYSTEM_PROMPT = `You are a highly capable AI assistant built on the DeepSeek model. You excel at providing accurate, well-reasoned responses in both English and Urdu. Follow these guidelines for every response:

1. First analyze the query in <think> tags:
   - Break down the question
   - Consider relevant context and knowledge
   - Plan your response approach
   - Your thinking must be thorough and visible in every response

2. Format your responses:
   - Use clear, natural language
   - Structure complex information with markdown
   - For Urdu responses, ensure proper grammar and culturally appropriate language
   - When using code, wrap it in \`\`\` code blocks
   - Keep responses focused and accurate

3. Quality standards:
   - Provide complete, accurate information
   - If unsure, acknowledge limitations
   - Stay relevant to the query
   - Be consistent in response quality regardless of language

Remember: Every response must begin with a thinking process in <think> tags before providing the answer.

Current conversation format:
`;

export const useChat = (model: LlamaContext | null) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    inputText: '',
    loading: false,
    numTokens: '2000',
  });

  const flatListRef = useRef<FlatList<Message>>(null);

  const formatConversationHistory = (messages: Message[]): string => {
    return messages.map(msg => 
      `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
    ).join('\n\n') + '\n\nAssistant:';
  };

  const sendMessage = async (): Promise<void> => {
    if (!model) {
      Alert.alert('Please wait', 'Model is still loading...');
      return;
    }

    if (!state.inputText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    const userMessage: Message = { role: 'user', content: state.inputText };
    setState((prev: ChatState) => ({
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
          prompt: SYSTEM_PROMPT + formatConversationHistory(conversation),
          messages: conversation,
          n_predict: parseInt(state.numTokens) || 2000,
          temperature: 0.7,
          stop: stopWords,
        },
        (data: { token: string }) => {
          responseContent += data.token;
          setState((prev: ChatState) => {
            const lastIndex = prev.messages.length - 1;
            if (prev.messages[lastIndex]?.role === 'system') {
              return {
                ...prev,
                messages: prev.messages.map((msg: Message, index: number) =>
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
      setState((prev: ChatState) => ({ ...prev, loading: false }));
    }
  };

  const updateInput = (text: string): void => {
    setState((prev: ChatState) => ({ ...prev, inputText: text }));
  };

  const updateNumTokens = (tokens: string): void => {
    setState((prev: ChatState) => ({ ...prev, numTokens: tokens }));
  };

  return {
    ...state,
    sendMessage,
    updateInput,
    updateNumTokens,
    flatListRef,
  };
};