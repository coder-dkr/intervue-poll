import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  userType: 'student' | 'teacher';
}

interface ChatState {
  messages: ChatMessage[];
  socket: any;
  isOpen: boolean;
}

const initialState: ChatState = {
  messages: [],
  socket: null,
  isOpen: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setSocket, addMessage, setMessages, toggleChat, setIsOpen } = chatSlice.actions;
export default chatSlice.reducer;