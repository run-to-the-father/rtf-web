import { createContext, useContext as useReactContext } from 'react';

/**
 * 타입 안전한 React Context를 생성하는 유틸리티 함수입니다.
 * Context 값이 null이거나 undefined일 때 에러를 발생시켜 타입 안전성을 보장합니다.
 *
 * @template T - Context에서 공유할 값의 타입
 * @param initialValue - Context의 초기값 (null 가능)
 * @returns [Provider, useContext] - Provider 컴포넌트와 커스텀 훅을 포함하는 튜플
 *
 * @example
 * // Context 생성
 * interface UserContextType {
 *   name: string;
 *   email: string;
 * }
 *
 * const [UserProvider, useUserContext] = createSafeContext<UserContextType>(null);
 *
 * // Provider 사용
 * function App() {
 *   return (
 *     <UserProvider value={{ name: "John", email: "john@example.com" }}>
 *       <UserProfile />
 *     </UserProvider>
 *   );
 * }
 *
 * // Context 값 사용
 * function UserProfile() {
 *   const user = useUserContext(); // UserContextType 타입이 보장됨
 *   return <div>{user.name}</div>; // null 체크 불필요
 * }
 */
export const createSafeContext = <T>(initialValue: T | null) => {
  const Context = createContext<T | null>(initialValue);

  /**
   * Context 값을 안전하게 가져오는 커스텀 훅
   * Provider가 제공되지 않은 경우 에러를 발생시킵니다.
   * @throws {Error} Context Provider가 없는 경우 발생
   */
  const useContext = () => {
    const value = useReactContext(Context);
    if (!value) {
      throw new Error('should provide context');
    }
    return value;
  };

  const Provider = Object.assign(Context.Provider, {
    Consumer: Context.Consumer,
  });

  return [Provider, useContext] as const;
};
