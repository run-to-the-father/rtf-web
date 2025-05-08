import { useState } from 'react';

export interface UseListStateHandlers<T> {
  /** 배열 상태를 직접 설정하는 setState 함수 */
  setState: React.Dispatch<React.SetStateAction<T[]>>;

  /** 배열의 끝에 하나 이상의 항목을 추가
   * @param items - 추가할 항목들
   */
  append: (...items: T[]) => void;

  /** 배열의 시작에 하나 이상의 항목을 추가
   * @param items - 추가할 항목들
   */
  prepend: (...items: T[]) => void;

  /** 지정된 인덱스 위치에 하나 이상의 항목을 삽입
   * @param index - 항목을 삽입할 위치
   * @param items - 삽입할 항목들
   */
  insert: (index: number, ...items: T[]) => void;

  /** 배열의 마지막 항목을 제거 */
  pop: () => void;

  /** 배열의 첫 번째 항목을 제거 */
  shift: () => void;

  /** 모든 배열 항목에 변환 함수를 적용
   * @param fn - 각 항목을 변환할 함수
   */
  apply: (fn: (item: T, index?: number) => T) => void;

  /** 조건을 만족하는 항목들에만 변환 함수를 적용
   * @param condition - 항목을 선택하는 조건 함수
   * @param fn - 선택된 항목을 변환할 함수
   */
  applyWhere: (
    condition: (item: T, index: number) => boolean,
    fn: (item: T, index?: number) => T,
  ) => void;

  /** 지정된 인덱스의 항목들을 제거
   * @param indices - 제거할 항목들의 인덱스 배열
   */
  remove: (...indices: number[]) => void;

  /** 항목의 위치를 변경
   * @param params - from: 원본 위치, to: 목표 위치
   */
  reorder: ({ from, to }: { from: number; to: number }) => void;

  /** 두 항목의 위치를 교환
   * @param params - from: 첫 번째 항목 위치, to: 두 번째 항목 위치
   */
  swap: ({ from, to }: { from: number; to: number }) => void;

  /** 특정 인덱스의 항목을 새 항목으로 교체
   * @param index - 교체할 항목의 인덱스
   * @param item - 새로운 항목
   */
  setItem: (index: number, item: T) => void;

  /** 특정 인덱스 항목의 속성값을 변경
   * @param index - 대상 항목의 인덱스
   * @param prop - 변경할 속성 키
   * @param value - 새로운 속성값
   */
  setItemProp: <K extends keyof T, U extends T[K]>(
    index: number,
    prop: K,
    value: U,
  ) => void;

  /** 조건을 만족하는 항목만 유지하도록 필터링
   * @param fn - 필터링 조건 함수
   */
  filter: (fn: (item: T, i: number) => boolean) => void;
}

/**
 * useListState 훅이 반환하는 튜플 타입
 * @template T - 배열 항목의 타입
 */
export type UseListState<T> = [T[], UseListStateHandlers<T>];

/**
 * 배열 상태를 관리하기 위한 React 커스텀 훅
 * 배열 조작을 위한 다양한 유틸리티 메서드들을 제공합니다.
 *
 * @template T - 배열 항목의 타입
 * @param initialValue - 초기 배열 값 (기본값: 빈 배열)
 * @returns [상태 배열, 핸들러 객체] 튜플
 *
 * @example
 * ```typescript
 * // 기본 사용법
 * const [list, handlers] = useListState(['a', 'b', 'c']);
 *
 * // 항목 추가
 * handlers.append('d');
 *
 * // 항목 제거
 * handlers.remove(0);
 *
 * // 객체 배열 사용
 * interface Todo {
 *   id: number;
 *   text: string;
 *   completed: boolean;
 * }
 *
 * const [todos, handlers] = useListState<Todo>([
 *   { id: 1, text: '할일 1', completed: false }
 * ]);
 *
 * // 특정 속성 변경
 * handlers.setItemProp(0, 'completed', true);
 * ```
 */
export function useListState<T>(initialValue: T[] = []): UseListState<T> {
  const [state, setState] = useState(initialValue);

  const append = (...items: T[]) =>
    setState((current) => [...current, ...items]);
  const prepend = (...items: T[]) =>
    setState((current) => [...items, ...current]);

  const insert = (index: number, ...items: T[]) =>
    setState((current) => [
      ...current.slice(0, index),
      ...items,
      ...current.slice(index),
    ]);

  const apply = (fn: (item: T, index?: number) => T) =>
    setState((current) => current.map((item, index) => fn(item, index)));

  const remove = (...indices: number[]) =>
    setState((current) =>
      current.filter((_, index) => !indices.includes(index)),
    );

  const pop = () =>
    setState((current) => {
      const cloned = [...current];
      cloned.pop();
      return cloned;
    });

  const shift = () =>
    setState((current) => {
      const cloned = [...current];
      cloned.shift();
      return cloned;
    });

  const reorder = ({ from, to }: { from: number; to: number }) =>
    setState((current) => {
      const cloned = [...current];
      const item = current[from];

      cloned.splice(from, 1);
      cloned.splice(to, 0, item!);

      return cloned;
    });

  const swap = ({ from, to }: { from: number; to: number }) =>
    setState((current) => {
      const cloned = [...current];
      const fromItem = cloned[from];
      const toItem = cloned[to];

      cloned.splice(to, 1, fromItem!);
      cloned.splice(from, 1, toItem!);

      return cloned;
    });

  const setItem = (index: number, item: T) =>
    setState((current) => {
      const cloned = [...current];
      cloned[index] = item;
      return cloned;
    });

  const setItemProp = <K extends keyof T, U extends T[K]>(
    index: number,
    prop: K,
    value: U,
  ) =>
    setState((current) => {
      const cloned = [...current];
      //@ts-ignore
      cloned[index] = { ...cloned[index], [prop]: value };
      return cloned;
    });

  const applyWhere = (
    condition: (item: T, index: number) => boolean,
    fn: (item: T, index?: number) => T,
  ) =>
    setState((current) =>
      current.map((item, index) =>
        condition(item, index) ? fn(item, index) : item,
      ),
    );

  const filter = (fn: (item: T, i: number) => boolean) => {
    setState((current) => current.filter(fn));
  };

  return [
    state,
    {
      setState,
      append,
      prepend,
      insert,
      pop,
      shift,
      apply,
      applyWhere,
      remove,
      reorder,
      swap,
      setItem,
      setItemProp,
      filter,
    },
  ];
}
