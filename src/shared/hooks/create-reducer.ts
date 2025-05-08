import { Reducer } from 'react';

/**
 * 핸들러의 액션 타입을 매핑하는 타입
 */
type ActionMap<H> = {
  [K in keyof H]: H[K] extends (state: any) => any
    ? { type: K }
    : H[K] extends (state: any, payload: infer P) => any
      ? { type: K; payload: P }
      : never;
};

/**
 * 핸들러로부터 상태 타입을 추론하는 타입
 */
type InferState<H> = H extends {
  [K in keyof H]: (state: infer S, ...args: any[]) => any;
}
  ? S
  : never;

/**
 * 액션들의 유니온 타입
 */
type ActionUnion<H> = ActionMap<H>[keyof H];

/**
 * 핸들러 객체로부터 타입 안전한 리듀서를 생성합니다.
 *
 * @param handlers - 상태 업데이트 로직을 포함하는 핸들러 객체
 * @returns 타입이 정의된 리듀서 함수
 *
 * @example
 * // 1. 상태 타입 정의
 * interface Todo {
 *   id: string;
 *   text: string;
 *   completed: boolean;
 * }
 *
 * // 2. 초기 상태 설정
 * const initialState: Todo[] = [];
 *
 * // 3. 리듀서 생성
 * const todoReducer = createReducer({
 *   addTodo: (state: Todo[], payload: { text: string }) => {
 *     return [...state, { id: Date.now().toString(), text: payload.text, completed: false }];
 *   },
 *   removeTodo: (state: Todo[], payload: string) => {
 *     return state.filter(todo => todo.id !== payload);
 *   }
 * });
 *
 * // 4. useReducer와 함께 사용
 * function TodoList() {
 *   const [todos, dispatch] = useReducer(todoReducer, initialState);
 *
 *   const handleAdd = (text: string) => {
 *     dispatch({ type: 'addTodo', payload: { text } });
 *   };
 *
 *   const handleRemove = (id: string) => {
 *     dispatch({ type: 'removeTodo', payload: id });
 *   };
 *
 *   return (
 *     <div>
 *       {todos.map(todo => (
 *         <div key={todo.id}>
 *           <span>{todo.text}</span>
 *           <button onClick={() => handleRemove(todo.id)}>삭제</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */
export function createReducer<
  H extends Record<string, (state: any, ...args: any[]) => any>,
>(handlers: H) {
  type State = InferState<H>;
  type Action = ActionUnion<H>;

  const reducer: Reducer<State, Action> = (state, action) => {
    const handler = handlers[action.type as keyof H];
    if (handler) {
      return 'payload' in action
        ? (handler as any)(state, action.payload)
        : (handler as any)(state);
    }
    return state;
  };
  return reducer;
}
