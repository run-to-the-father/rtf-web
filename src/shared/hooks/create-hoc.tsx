import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';

/**
 * React 컴포넌트를 프로바이더 컴포넌트로 감싸는 고차 컴포넌트(HOC) 팩토리 함수를 생성합니다.
 *
 * @description
 * 이 유틸리티 함수는 다음 두 가지 방식으로 사용할 수 있는 HOC 팩토리를 생성합니다:
 * 1. 프로바이더 props 없이: 추가 props 없이 컴포넌트를 감쌉니다
 * 2. 프로바이더 props 포함: 제공된 props를 프로바이더 컴포넌트에 전달하면서 컴포넌트를 감쌉니다
 *
 * @template ProviderProps - 프로바이더 컴포넌트가 받을 수 있는 props의 타입
 * @param HocComponent - 대상 컴포넌트를 감싸게 될 프로바이더 컴포넌트
 *
 * @example
 * // 프로바이더 props 없이 사용하는 경우
 * const withSimpleProvider = createHoc(SimpleProvider);
 * const WrappedComponent = withSimpleProvider(MyComponent);
 *
 * @example
 * // 프로바이더 props와 함께 사용하는 경우
 * const withThemedProvider = createHoc(ThemeProvider);
 * const WrappedComponent = withThemedProvider(MyComponent, { theme: 'dark' });
 *
 * @returns 컴포넌트와 선택적 프로바이더 props를 받아 래핑된 컴포넌트를 반환하는 함수
 * 래핑된 컴포넌트의 displayName은 `Certified(${ComponentName})` 형식을 따릅니다
 */
export function createHoc<ProviderProps extends Record<string, any>>(
  HocComponent: (props: PropsWithChildren<{}>) => ReactNode,
): <ComponentProps extends Record<string, any>>(
  Component: FunctionComponent<ComponentProps>,
) => FunctionComponent<ComponentProps>;

/**
 * 프로바이더 props를 받는 createHoc의 오버로드 버전
 *
 * @template ProviderProps - 프로바이더 컴포넌트가 받을 수 있는 props의 타입
 * @template ComponentProps - 대상 컴포넌트가 받을 수 있는 props의 타입
 * @param HocComponent - 대상 컴포넌트를 감싸게 될 프로바이더 컴포넌트
 * @param providerProps - 프로바이더 컴포넌트에 전달될 props
 *
 * @returns 대상 컴포넌트를 프로바이더로 감싸는 고차 컴포넌트
 */
export function createHoc<ProviderProps extends Record<string, any>>(
  HocComponent: (props: ProviderProps) => ReactNode,
): <ComponentProps extends Record<string, any>>(
  Component: FunctionComponent<ComponentProps>,
  providerProps: Omit<ProviderProps, 'children'>,
) => FunctionComponent<ComponentProps>;

export function createHoc<ProviderProps extends Record<string, any>>(
  HocComponent: (props: ProviderProps) => ReactNode,
) {
  return <ComponentProps extends Record<string, any>>(
    Component: FunctionComponent<ComponentProps>,
    providerProps?: Omit<ProviderProps, 'children'>,
  ) => {
    const WrappingComponent = (props: ComponentProps) => {
      return (
        <HocComponent {...(providerProps as ProviderProps)}>
          <Component {...props} />
        </HocComponent>
      );
    };
    const displayName = Component.displayName || Component.name || 'Component';
    WrappingComponent.displayName = `Certified(${displayName})`;
    return WrappingComponent;
  };
}
