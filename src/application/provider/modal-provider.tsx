'use client';

import { Fragment, useEffect } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/utils';
import { useModalData } from '@/shared/models/store/modal';

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
