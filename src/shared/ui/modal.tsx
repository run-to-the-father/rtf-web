'use client';

import { ReactNode, SyntheticEvent, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

// Modal Context 생성
interface ModalContextType {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

// Context Hook
const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal 컴포넌트 내부에서만 사용할 수 있습니다');
  }
  return context;
};

interface ModalBaseProps {
  onClose: () => void;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  hideOnClickOutside?: boolean;
}

const Modal = ({
  onClose,
  children,
  className,
  overlayClassName,
  hideOnClickOutside = true,
}: ModalBaseProps) => {
  const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

  return createPortal(
    <ModalContext.Provider value={{ onClose }}>
      <div
        className={cn(
          'fixed inset-0 z-[9999] flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm',
          overlayClassName,
        )}
        onClick={hideOnClickOutside ? onClose : undefined}
      >
        <div
          className={cn('relative flex flex-col overflow-hidden', className)}
          onClick={stopPropagation}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.querySelector('#modalRoot')!,
  );
};

interface ModalHeaderProps {
  children?: ReactNode;
  className?: string;
  hasCloseButton?: boolean;
  buttonClassName?: string;
}

const ModalHeader = ({
  children,
  className,
  buttonClassName,
  hasCloseButton = false,
}: ModalHeaderProps) => {
  const { onClose } = useModalContext();

  return (
    <header
      className={cn(
        'relative flex w-full items-center justify-center',
        className,
      )}
    >
      {children}
      {hasCloseButton && (
        <button
          title='닫기'
          onClick={onClose}
          className={cn(
            'text-secondary-600 hover:text-secondary-600/80 absolute right-0 top-0 h-full transition-colors',
            buttonClassName,
          )}
        >
          <X />
        </button>
      )}
    </header>
  );
};

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

const ModalContent = ({ children, className }: ModalContentProps) => {
  return (
    <div className={cn('flex flex-col overflow-y-auto', className)}>
      {children}
    </div>
  );
};

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

const ModalFooter = ({ children, className }: ModalFooterProps) => {
  return (
    <footer className={cn('flex items-center justify-center gap-2', className)}>
      {children}
    </footer>
  );
};

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
