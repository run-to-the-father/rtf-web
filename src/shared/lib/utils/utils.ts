import { type ClassValue, clsx } from 'clsx';
import { customTwMerge } from '@shared/config/tailwind/utils';

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export function lockBodyScroll() {
  const body = document.querySelector('body');
  if (body) {
    body.style.overflow = 'hidden';
    body.dataset.scrollLocked = 'true';
  }
}

export function unlockBodyScroll() {
  const body = document.querySelector('body');
  if (body) {
    body.style.overflow = '';
    delete body.dataset.scrollLocked;
  }
}
