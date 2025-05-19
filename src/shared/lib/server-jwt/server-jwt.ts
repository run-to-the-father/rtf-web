'use server';

import { cookies } from 'next/headers';
import { decrypt, encrypt } from '@/shared/lib/cookie';
import {
  COOKIE_KEY,
  SESSION_COOKIE_OPTION,
} from '@/shared/models/constant/cookie-option';

const JWT_SECRET = process.env.JWT_SECRET!;

const getServerSession = async () => {
  const cookieStore = await cookies();

  const jwt = cookieStore.get(COOKIE_KEY.USER_SESSION)?.value;

  if (!jwt) return null;

  const user = decrypt<any>(JWT_SECRET, jwt);

  return user;
};

const setServerSession = async (user: any) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const value = encrypt(JWT_SECRET, user);

  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_KEY.USER_SESSION,
    value,
    ...SESSION_COOKIE_OPTION,
  });

  return null;
};

const updateServerSession = async (partialUser: Partial<any>) => {
  const cookieStore = await cookies();

  const jwt = cookieStore.get(COOKIE_KEY.USER_SESSION)?.value;

  if (!jwt) return null;

  const user = decrypt<any>(JWT_SECRET, jwt);

  const updatedUser = { ...user, ...partialUser };
  const value = encrypt(JWT_SECRET, updatedUser);

  cookieStore.set({
    name: COOKIE_KEY.USER_SESSION,
    value,
  });

  return updatedUser ?? null;
};

const removeServerSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_KEY.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_KEY.USER_SESSION);
  return null;
};

export {
  getServerSession,
  removeServerSession,
  setServerSession,
  updateServerSession,
};
