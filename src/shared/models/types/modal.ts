// User 관련
export const USER_MODAL_TYPES = {
  EDIT_USER_INFO: 'EDIT_USER_INFO',
} as const;

// 전체 MODAL_TYPES
export const MODAL_TYPES = {
  ...USER_MODAL_TYPES,
} as const;

export type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

export type ModalTypes = keyof typeof MODAL_TYPES;

export interface ModalConfig {
  modal: React.ReactElement;
  modalName: ModalTypes;
}

export interface ModalState {
  openedModals: ModalConfig[];
}
