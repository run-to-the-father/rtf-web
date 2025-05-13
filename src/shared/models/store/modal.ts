import { ModalConfig, ModalState, ModalTypes } from '../types/modal';
import { createCustomStore } from './store';

const initialState: ModalState = {
  openedModals: [],
};

interface ModalActions {
  openModal: (config: ModalConfig) => void;
  closeModal: (modalName: ModalTypes) => () => void;
  closeAllModals: () => void;
}

interface ModalStore {
  data: ModalState;
  actions: ModalActions;
}

export const useModalStore = createCustomStore<ModalStore>((set) => ({
  data: initialState,

  actions: {
    openModal: (config) => {
      set((state) => {
        const isModalOpen = state.data.openedModals.some(
          (modal) => modal.modalName === config.modalName,
        );

        if (!isModalOpen) {
          state.data.openedModals.push(config);
        }
      });
    },
    closeModal: (modalName) => () => {
      set((state) => {
        state.data.openedModals = state.data.openedModals.filter(
          (modal) => modal.modalName !== modalName,
        );
      });
    },
    closeAllModals: () => {
      set((state) => {
        state.data.openedModals = [];
      });
    },
  },
}));

export const useModalActions = () => useModalStore((state) => state.actions);
export const useModalData = () => useModalStore((state) => state.data);
