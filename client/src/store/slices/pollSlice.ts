import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PollOption {
  id: string;
  text: string;
  votes: number;
  isCorrect?: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  timeLimit: number;
  isActive: boolean;
  createdAt: string;
  endTime?: string;
}

interface Participant {
  id: string;
  name: string;
  hasAnswered: boolean;
}

interface PollState {
  currentPoll: Poll | null;
  polls: Poll[];
  participants: Participant[];
  userAnswer: string | null;
  timeRemaining: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
  isWaitingForQuestion: boolean;
}

const initialState: PollState = {
  currentPoll: null,
  polls: [],
  participants: [],
  userAnswer: null,
  timeRemaining: 0,
  socket: null,
  isWaitingForQuestion: true,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setCurrentPoll: (state, action: PayloadAction<Poll | null>) => {
      state.currentPoll = action.payload;
      state.userAnswer = null;
      state.isWaitingForQuestion = false;
    },
    addPoll: (state, action: PayloadAction<Poll>) => {
      state.polls.push(action.payload);
    },
    updatePollResults: (state, action: PayloadAction<PollOption[]>) => {
      if (state.currentPoll) {
        state.currentPoll.options = action.payload;
      }
    },
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
    updateParticipantAnswer: (state, action: PayloadAction<{ userId: string; hasAnswered: boolean }>) => {
      const participant = state.participants.find(p => p.id === action.payload.userId);
      if (participant) {
        participant.hasAnswered = action.payload.hasAnswered;
      }
    },
    setUserAnswer: (state, action: PayloadAction<string>) => {
      state.userAnswer = action.payload;
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    endPoll: (state) => {
      if (state.currentPoll) {
        state.currentPoll.isActive = false;
        state.currentPoll.endTime = new Date().toISOString();
      }
    },
    setWaitingForQuestion: (state, action: PayloadAction<boolean>) => {
      state.isWaitingForQuestion = action.payload;
    },
    removeParticipant: (state, action: PayloadAction<string>) => {
      state.participants = state.participants.filter(p => p.id !== action.payload);
    },
  },
});

export const {
  setSocket,
  setCurrentPoll,
  addPoll,
  updatePollResults,
  setParticipants,
  updateParticipantAnswer,
  setUserAnswer,
  setTimeRemaining,
  endPoll,
  setWaitingForQuestion,
  removeParticipant,
} = pollSlice.actions;

export default pollSlice.reducer;