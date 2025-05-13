'use client';

import { Fragment, useEffect } from 'react';
import { useModalData } from '@/shared/models/store/modal';
import { lockBodyScroll, unlockBodyScroll } from '@shared/lib/utils';

export default function ModalProvider() {
  const { openedModals } = useModalData();

  useEffect(() => {
    if (openedModals.length > 0) {
      lockBodyScroll();
      return;
    }

    unlockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [openedModals]);

  return (
    <Fragment>
      {openedModals.map(({ modal, modalName }) => (
        <Fragment key={modalName}>{modal}</Fragment>
      ))}
    </Fragment>
  );
}
