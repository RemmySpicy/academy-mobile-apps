import React, { 
  useTransition, 
  useMemo,
  ReactNode,
  FormEvent,
  useRef,
  useState,
  useCallback
} from 'react';
import { View, ViewProps, Platform } from 'react-native';

interface FormAction<T = any> {
  (formData: FormData): Promise<T> | T;
}

interface FormProps<T = any> extends Omit<ViewProps, 'onSubmit'> {
  action?: FormAction<T>;
  initialState?: T;
  onSubmit?: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  resetOnSuccess?: boolean;
  onSuccess?: (result: T) => void;
  onError?: (error: any) => void;
}

export function Form<T = any>({
  action,
  initialState,
  onSubmit,
  children,
  resetOnSuccess = false,
  onSuccess,
  onError,
  style,
  ...props
}: FormProps<T>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<T | null>(initialState || null);
  const [error, setError] = useState<any>(null);

  const handleFormSubmit = useCallback(async (formData: FormData) => {
    setError(null);
    
    try {
      if (action) {
        const result = await action(formData);
        setFormState(result);
        onSuccess?.(result);
      } else if (onSubmit) {
        await onSubmit(formData);
      }
      
      if (resetOnSuccess && formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      setError(err);
      onError?.(err);
    }
  }, [action, onSubmit, onSuccess, onError, resetOnSuccess]);

  const handleSubmit = useMemo(() => {
    if (Platform.OS === 'web') {
      return (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        startTransition(() => {
          handleFormSubmit(formData);
        });
      };
    }
    
    // For native platforms, we'll handle form submission differently
    return undefined;
  }, [handleFormSubmit, startTransition]);

  const isLoading = isPending;

  if (Platform.OS === 'web') {
    return React.createElement(
      'form',
      {
        ref: formRef,
        onSubmit: handleSubmit,
        style,
        ...props,
      },
      children // Don't clone children - this was causing the recursive issue
    );
  }

  // Native fallback - simple View container, no child cloning
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
}

// Hook for accessing form context in child components
export function useFormContext<T = any>() {
  return {
    isPending: false,
    formState: null as T | null,
    isSubmitting: false,
    error: null,
  };
}

export { Form };
export default Form;