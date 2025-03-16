import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../../hooks/useChat';

interface ChatItem {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  userId: string;
}

export interface ChatState {
  chats: ChatItem[];
  activeChatId: string | null;
  messages: Message[];
  currentUserId: string | null;
}

const initialState: ChatState = {
  chats: [],
  activeChatId: null,
  messages: [],
  currentUserId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload;
      const userChats = state.chats.filter(chat => chat.userId === action.payload);
      state.activeChatId = userChats.length > 0 ? userChats[0].id : null;
      state.messages = state.activeChatId 
        ? userChats.find(chat => chat.id === state.activeChatId)?.messages || [] 
        : [];
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const { chatId, message } = action.payload;
      if (!state.currentUserId) return;

      const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        // If this is a system message and the last message was also system (streaming update),
        // replace the last message instead of adding a new one
        const lastMessage = state.chats[chatIndex].messages[state.chats[chatIndex].messages.length - 1];
        if (message.role === 'system' && lastMessage?.role === 'system') {
          state.chats[chatIndex].messages[state.chats[chatIndex].messages.length - 1] = message;
        } else {
          state.chats[chatIndex].messages.push(message);
        }
        // Only update state.messages if this is the active chat
        if (state.activeChatId === chatId) {
          state.messages = [...state.chats[chatIndex].messages];
        }
        if (state.chats[chatIndex].title === 'New Chat' && message.role === 'user') {
          state.chats[chatIndex].title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
        }
      }
    },
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      const { chatId, messages } = action.payload;
      if (!state.currentUserId) return;

      const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].messages = messages;
        if (state.activeChatId === chatId) {
          state.messages = [...messages];
        }
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    createNewChat: (state) => {
      if (!state.currentUserId) return;
      const newChatId = Date.now().toString();
      
      if (!state.chats) {
        state.chats = [];
      }
      
      state.chats.unshift({
        id: newChatId,
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
        userId: state.currentUserId,
      });
      state.activeChatId = newChatId;
      state.messages = [];
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChatId = action.payload;
      const chat = state.chats.find(chat => chat.id === action.payload && chat.userId === state.currentUserId);
      if (chat) {
        state.messages = [...chat.messages];
      } else {
        state.messages = [];
      }
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      if (!state.currentUserId) return;
      state.chats = state.chats.filter(chat => chat.id !== action.payload);
      
      if (state.activeChatId === action.payload) {
        const userChats = state.chats.filter(chat => chat.userId === state.currentUserId);
        if (userChats.length > 0) {
          state.activeChatId = userChats[0].id;
          state.messages = [...userChats[0].messages];
        } else {
          state.activeChatId = null;
          state.messages = [];
        }
      }
    },
    logout: (state) => {
      state.activeChatId = null;
      state.messages = [];
      state.currentUserId = null;
    },
  },
});

export const {
  setCurrentUser,
  addMessage,
  setMessages,
  clearMessages,
  createNewChat,
  setActiveChat,
  deleteChat,
  logout,
} = chatSlice.actions;

export default chatSlice.reducer;



// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Message } from '../../hooks/useChat';

// interface ChatItem {
//   id: string;
//   title: string;
//   messages: Message[];
//   createdAt: number;
// }

// interface ChatState {
//   chats: ChatItem[];
//   activeChatId: string | null;
//   messages: Message[];
// }

// const initialState: ChatState = {
//   chats: [],
//   activeChatId: null,
//   messages: [],
// };

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState,
//   reducers: {
//     addMessage: (state, action: PayloadAction<Message>) => {
//       state.messages.push(action.payload);
      
//       // Update the chat if it exists
//       if (state.activeChatId) {
//         const chatIndex = state.chats.findIndex(chat => chat.id === state.activeChatId);
//         if (chatIndex !== -1) {
//           state.chats[chatIndex].messages = [...state.messages];
          
//           // Update chat title if it's the first user message
//           if (state.chats[chatIndex].title === 'New Chat' && action.payload.role === 'user') {
//             state.chats[chatIndex].title = action.payload.content.slice(0, 30) + (action.payload.content.length > 30 ? '...' : '');
//           }
//         }
//       }
//     },
//     setMessages: (state, action: PayloadAction<Message[]>) => {
//       state.messages = action.payload;
      
//       // Update the chat if it exists
//       if (state.activeChatId) {
//         const chatIndex = state.chats.findIndex(chat => chat.id === state.activeChatId);
//         if (chatIndex !== -1) {
//           state.chats[chatIndex].messages = [...action.payload];
//         }
//       }
//     },
    
//     clearMessages: (state) => {
//       state.messages = [];
//     },
//     createNewChat: (state) => {
//       const newChatId = Date.now().toString();
      
//       // Initialize chats array if it doesn't exist
//       if (!state.chats) {
//         state.chats = [];
//       }
      
//       state.chats.unshift({
//         id: newChatId,
//         title: 'New Chat',
//         messages: [],
//         createdAt: Date.now(),
//       });
//       state.activeChatId = newChatId;
//       state.messages = [];
//     },
//     setActiveChat: (state, action: PayloadAction<string>) => {
//       state.activeChatId = action.payload;
//       const chat = state.chats.find(chat => chat.id === action.payload);
//       if (chat) {
//         state.messages = [...chat.messages];
//       }
//     },
//     deleteChat: (state, action: PayloadAction<string>) => {
//       state.chats = state.chats.filter(chat => chat.id !== action.payload);
      
//       if (state.activeChatId === action.payload) {
//         if (state.chats &&state.chats.length > 0) {
//           state.activeChatId = state.chats[0].id;
//           state.messages = [...state.chats[0].messages];
//         } else {
//           state.activeChatId = null;
//           state.messages = [];
//         }
//       }
//     },
//   },
// });

// export const {
//   addMessage,
//   setMessages,
//   clearMessages,
//   createNewChat,
//   setActiveChat,
//   deleteChat,
// } = chatSlice.actions;

// export default chatSlice.reducer;