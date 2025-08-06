import React, { ReactNode, FC, Fragment, isValidElement, Children } from 'react';

/**
 * Conditional rendering component with improved TypeScript support and performance
 * 
 * Usage:
 * <Show>
 *   <Show.When isTrue={condition1}>Content 1</Show.When>
 *   <Show.When isTrue={condition2}>Content 2</Show.When>
 *   <Show.Else>Fallback content</Show.Else>
 * </Show>
 * 
 * Or simple usage:
 * <Show.When isTrue={condition}>Content</Show.When>
 */

interface ShowProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ShowWhenProps {
  isTrue: boolean | undefined | null;
  children: ReactNode;
  fallback?: ReactNode;
}

interface ShowElseProps {
  children: ReactNode;
}

interface ShowUnlessProps {
  isTrue: boolean | undefined | null;
  children: ReactNode;
  fallback?: ReactNode;
}

interface ShowSwitchProps {
  value: string | number | boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

interface ShowCaseProps {
  value: string | number | boolean;
  children: ReactNode;
}

interface ShowDefaultProps {
  children: ReactNode;
}

// Utility type for better type inference
type ConditionalRenderResult = ReactNode | null;

/**
 * Main Show component that evaluates children and renders the first matching condition
 */
const Show: FC<ShowProps> & {
  When: FC<ShowWhenProps>;
  Else: FC<ShowElseProps>;
  Unless: FC<ShowUnlessProps>;
  Switch: FC<ShowSwitchProps> & {
    Case: FC<ShowCaseProps>;
    Default: FC<ShowDefaultProps>;
  };
} = ({ children, fallback = null }) => {
  let matchedCondition: ConditionalRenderResult = null;
  let elseContent: ConditionalRenderResult = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    // Handle Show.When components
    if (child.type === ShowWhen) {
      const { isTrue, children: whenChildren } = child.props as ShowWhenProps;
      if (!matchedCondition && Boolean(isTrue)) {
        matchedCondition = whenChildren;
      }
    }
    
    // Handle Show.Else components
    if (child.type === ShowElse) {
      elseContent = child.props.children;
    }

    // Handle Show.Unless components
    if (child.type === ShowUnless) {
      const { isTrue, children: unlessChildren } = child.props as ShowUnlessProps;
      if (!matchedCondition && !Boolean(isTrue)) {
        matchedCondition = unlessChildren;
      }
    }
  });

  return <Fragment>{matchedCondition || elseContent || fallback}</Fragment>;
};

/**
 * Renders children when condition is truthy
 */
const ShowWhen: FC<ShowWhenProps> = ({ 
  isTrue, 
  children, 
  fallback = null 
}) => {
  return Boolean(isTrue) ? <Fragment>{children}</Fragment> : <Fragment>{fallback}</Fragment>;
};

/**
 * Renders children when condition is falsy (opposite of ShowWhen)
 */
const ShowUnless: FC<ShowUnlessProps> = ({ 
  isTrue, 
  children, 
  fallback = null 
}) => {
  return !Boolean(isTrue) ? <Fragment>{children}</Fragment> : <Fragment>{fallback}</Fragment>;
};

/**
 * Default/fallback content for Show component
 */
const ShowElse: FC<ShowElseProps> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

/**
 * Switch-like conditional rendering
 */
const ShowSwitch: FC<ShowSwitchProps> & {
  Case: FC<ShowCaseProps>;
  Default: FC<ShowDefaultProps>;
} = ({ value, children, fallback = null }) => {
  let matchedCase: ConditionalRenderResult = null;
  let defaultCase: ConditionalRenderResult = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === ShowCase) {
      const { value: caseValue, children: caseChildren } = child.props as ShowCaseProps;
      if (!matchedCase && value === caseValue) {
        matchedCase = caseChildren;
      }
    }

    if (child.type === ShowDefault) {
      defaultCase = child.props.children;
    }
  });

  return <Fragment>{matchedCase || defaultCase || fallback}</Fragment>;
};

/**
 * Case component for ShowSwitch
 */
const ShowCase: FC<ShowCaseProps> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

/**
 * Default case for ShowSwitch
 */
const ShowDefault: FC<ShowDefaultProps> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

// Attach sub-components
Show.When = ShowWhen;
Show.Else = ShowElse;
Show.Unless = ShowUnless;
Show.Switch = ShowSwitch;

ShowSwitch.Case = ShowCase;
ShowSwitch.Default = ShowDefault;

Show.Switch = ShowSwitch;

/**
 * Higher-order component for conditional rendering with loading states
 */
export const withConditionalRender = <P extends object>(
  Component: React.ComponentType<P>,
  condition: (props: P) => boolean,
  LoadingComponent?: React.ComponentType,
  ErrorComponent?: React.ComponentType<{ error?: any }>
) => {
  return React.forwardRef<any, P & { isLoading?: boolean; error?: any }>((props, ref) => {
    const { isLoading, error, ...restProps } = props;

    if (isLoading && LoadingComponent) {
      return <LoadingComponent />;
    }

    if (error && ErrorComponent) {
      return <ErrorComponent error={error} />;
    }

    if (condition(restProps as P)) {
      return <Component {...(restProps as P)} ref={ref} />;
    }

    return null;
  });
};

/**
 * Hook for conditional rendering with state
 */
export const useConditionalRender = (condition: boolean) => {
  return React.useMemo(() => ({
    when: (content: ReactNode) => condition ? content : null,
    unless: (content: ReactNode) => !condition ? content : null,
    render: (content: ReactNode, fallback?: ReactNode) => condition ? content : fallback,
  }), [condition]);
};

/**
 * Utility function for inline conditional rendering
 */
export const when = (condition: boolean | undefined | null, content: ReactNode): ReactNode => {
  return Boolean(condition) ? content : null;
};

/**
 * Utility function for inline conditional rendering (opposite of when)
 */
export const unless = (condition: boolean | undefined | null, content: ReactNode): ReactNode => {
  return !Boolean(condition) ? content : null;
};

/**
 * Utility function for ternary-like conditional rendering
 */
export const either = (
  condition: boolean | undefined | null, 
  truthyContent: ReactNode, 
  falsyContent: ReactNode = null
): ReactNode => {
  return Boolean(condition) ? truthyContent : falsyContent;
};

/**
 * Utility for rendering content based on multiple conditions
 */
export const switchRender = (
  value: string | number | boolean,
  cases: Record<string | number, ReactNode>,
  defaultCase: ReactNode = null
): ReactNode => {
  return cases[value] || defaultCase;
};

export {
  Show,
  ShowWhen,
  ShowElse,
  ShowUnless,
  ShowSwitch,
  ShowCase,
  ShowDefault,
};

export default Show;