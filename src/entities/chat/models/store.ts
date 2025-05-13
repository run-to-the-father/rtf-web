import { createCustomStore } from '@/shared/models/store/store';

export type ChatMode = 'surrender' | 'bible';

interface ChatState {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
}

export const useChatStore = createCustomStore<ChatState>((set) => ({
  mode: 'surrender',
  setMode: (mode) => set({ mode }),
}));
