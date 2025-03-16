import { useState, useRef } from 'react';
import { Alert, FlatList } from 'react-native';
import { LlamaContext } from 'llama.rn';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHook';
import { addMessage, setMessages } from '../store/slices/chatSlice';

export interface Message {
  role: 'user' | 'system';
  content: string;
  
}

const stopWords: string[] = [
  '</s>', '<|end|>', '<|eot_id|>', '<|end_of_text|>', '<|im_end|>',
  '<|EOT|>', '<|END_OF_TURN_TOKEN|>', '<|end_of_turn|>', '<|endoftext|>',
  '<|end_of_sentence|>', '</s>', '<|END|>',
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

export const useChat = (model: LlamaContext | null, activeChatId: string | null) => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chat.messages);
  const currentUserId = useAppSelector((state) => state.chat.currentUserId);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [numTokens, setNumTokens] = useState('2000');
  const flatListRef = useRef<FlatList<Message>>(null);

  const formatConversationHistory = (msgs: Message[]): string => {
    return msgs
      .map((msg) => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n\n') + '\n\nAssistant:';
  };

  const sendMessage = async (): Promise<void> => {
    if (!model) {
      Alert.alert('Please wait', 'Model is still loading...');
      return;
    }

    if (!currentUserId) {
      Alert.alert('Error', 'Please log in to send messages');
      return;
    }

    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    if (!activeChatId) {
      Alert.alert('Error', 'No active chat selected');
      return;
    }

    const userMessage: Message = { role: 'user', content: inputText };
    dispatch(addMessage({ chatId: activeChatId, message: userMessage }));
    setInputText('');
    setLoading(true);

    try {
      let responseContent = '';
      const conversation = [...messages, userMessage];

      await model.completion(
        {
          prompt: SYSTEM_PROMPT + formatConversationHistory(conversation),
          messages: conversation,
          n_predict: parseInt(numTokens) || 2000,
          temperature: 0.7,
          stop: stopWords,
        },
        (data: { token: string }) => {
          responseContent += data.token;
          // Dispatch streaming update to Redux for the specific chat
          dispatch(addMessage({ 
            chatId: activeChatId, 
            message: { role: 'system', content: responseContent } 
          }));
        },
      );

      // Final update is already handled by the streaming callback
    } catch (error) {
      console.error('Error streaming response:', error);
      Alert.alert('Error', 'Failed to get response');
      dispatch(addMessage({ 
        chatId: activeChatId, 
        message: { role: 'system', content: 'Error occurred' } 
      }));
    } finally {
      setLoading(false);
    }
  };

  const updateInput = (text: string): void => {
    setInputText(text);
  };

  const updateNumTokens = (tokens: string): void => {
    setNumTokens(tokens);
  };

  return {
    messages, // Use Redux messages directly, no streamingResponse
    inputText,
    loading,
    numTokens,
    sendMessage,
    updateInput,
    updateNumTokens,
    flatListRef,
  };
};









// import { useState, useRef } from 'react';
// import { Alert, FlatList } from 'react-native';
// import { LlamaContext } from 'llama.rn';
// import { useAppSelector, useAppDispatch } from '../hooks/reduxHook';
// import { addMessage, setMessages } from '../store/slices/chatSlice';

// export interface Message {
//   role: 'user' | 'system';
//   content: string;
// }

// const stopWords: string[] = [
//   '</s>', '<|end|>', '<|eot_id|>', '<|end_of_text|>', '<|im_end|>',
//   '<|EOT|>', '<|END_OF_TURN_TOKEN|>', '<|end_of_turn|>', '<|endoftext|>',
//   '<|end_of_sentence|>', '</s>', '<|END|>',
// ];

// const SYSTEM_PROMPT = `You are a highly capable AI assistant built on the DeepSeek model. You excel at providing accurate, well-reasoned responses in both English and Urdu. Follow these guidelines for every response:

// 1. First analyze the query in <think> tags:
//    - Break down the question
//    - Consider relevant context and knowledge
//    - Plan your response approach
//    - Your thinking must be thorough and visible in every response

// 2. Format your responses:
//    - Use clear, natural language
//    - Structure complex information with markdown
//    - For Urdu responses, ensure proper grammar and culturally appropriate language
//    - When using code, wrap it in \`\`\` code blocks
//    - Keep responses focused and accurate

// 3. Quality standards:
//    - Provide complete, accurate information
//    - If unsure, acknowledge limitations
//    - Stay relevant to the query
//    - Be consistent in response quality regardless of language

// Remember: Every response must begin with a thinking process in <think> tags before providing the answer.

// Current conversation format:
// `;

// export const useChat = (model: LlamaContext | null) => {
//   const dispatch = useAppDispatch();
//   const messages = useAppSelector((state) => state.chat.messages);
//   const [inputText, setInputText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [numTokens, setNumTokens] = useState('2000');
//   const flatListRef = useRef<FlatList<Message>>(null);

//   const formatConversationHistory = (msgs: Message[]): string => {
//     return msgs
//       .map((msg) => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
//       .join('\n\n') + '\n\nAssistant:';
//   };

//   const sendMessage = async (): Promise<void> => {
//     if (!model) {
//       Alert.alert('Please wait', 'Model is still loading...');
//       return;
//     }

//     if (!inputText.trim()) {
//       Alert.alert('Error', 'Please enter a message');
//       return;
//     }

//     const userMessage: Message = { role: 'user', content: inputText };
//     dispatch(addMessage(userMessage));
//     setInputText('');
//     setLoading(true);

//     try {
//       let responseContent = '';
//       const conversation = [...messages, userMessage];

//       await model.completion(
//         {
//           prompt: SYSTEM_PROMPT + formatConversationHistory(conversation),
//           messages: conversation,
//           n_predict: parseInt(numTokens) || 2000,
//           temperature: 0.7,
//           stop: stopWords,
//         },
//         (data: { token: string }) => {
//           responseContent += data.token;
//           dispatch(setMessages([...conversation, { role: 'system', content: responseContent }])); 
//         },
//       );
//     } catch (error) {
//       console.error('Error streaming response:', error);
//       Alert.alert('Error', 'Failed to get response');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateInput = (text: string): void => {
//     setInputText(text);
//   };

//   const updateNumTokens = (tokens: string): void => {
//     setNumTokens(tokens);
//   };

//   return {
//     messages,
//     inputText,
//     loading,
//     numTokens,
//     sendMessage,
//     updateInput,
//     updateNumTokens,
//     flatListRef,
//   };
// };