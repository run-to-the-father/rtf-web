'use client';

import React, {
  Fragment,
  ReactElement,
  ReactNode,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';

interface StepProps {
  name: string;
  children: ReactNode;
}

interface FunnelProps<T> {
  children: ReactNode;
  currentStep: T;
}

type FunnelComponent = ({ children }: { children: ReactNode }) => ReactElement;

interface UseFunnel<T extends string> {
  currentStep: T;
  isLastStep: boolean;
  Funnel: FunnelComponent;
  Step: React.FC<StepProps>;
  setCurrentStep: React.Dispatch<React.SetStateAction<T>>;
  onPrevStep: () => void;
  onNextStep: () => void;
  onResetStep: () => void;
}

const Step = memo(({ children }: StepProps) => {
  return <Fragment>{children}</Fragment>;
});

Step.displayName = 'Step';

function Funnel<T extends string>({
  children,
  currentStep,
}: FunnelProps<T>): ReactElement {
  const childrenArray = useMemo(
    () => React.Children.toArray(children),
    [children],
  );

  const targetStep = useMemo(() => {
    return childrenArray.find(
      (child) =>
        React.isValidElement(child) &&
        (child as React.ReactElement<StepProps>).props.name === currentStep,
    );
  }, [childrenArray, currentStep]);

  return <Fragment>{targetStep}</Fragment>;
}

Funnel.displayName = 'Funnel';

const MemoizedFunnel = memo(Funnel) as typeof Funnel;
MemoizedFunnel.displayName = 'MemoizedFunnel';

export default function useFunnel<T extends string>(
  steps: readonly T[],
  initialStep?: T,
): UseFunnel<T> {
  const [currentStep, setCurrentStep] = useState<T>(
    () => initialStep ?? (steps[0] as T),
  );

  const onPrevStep = useCallback(() => {
    setCurrentStep((current) => {
      const currentIndex = steps.indexOf(current);
      return steps[currentIndex - 1] || current;
    });
  }, [steps]);

  const onNextStep = useCallback(() => {
    setCurrentStep((current) => {
      const currentIndex = steps.indexOf(current);
      return steps[currentIndex + 1] || current;
    });
  }, [steps]);

  const onResetStep = useCallback(() => {
    setCurrentStep(steps[0] as T);
  }, [steps]);

  const FunnelComponent = useCallback(
    ({ children }: { children: ReactNode }): ReactElement => (
      <MemoizedFunnel currentStep={currentStep}>{children}</MemoizedFunnel>
    ),
    [currentStep],
  );

  const isLastStep = useMemo(() => {
    return currentStep === steps[steps.length - 1];
  }, [currentStep, steps]);

  return {
    currentStep,
    isLastStep,
    Funnel: FunnelComponent,
    Step,
    setCurrentStep,
    onPrevStep,
    onNextStep,
    onResetStep,
  };
}
