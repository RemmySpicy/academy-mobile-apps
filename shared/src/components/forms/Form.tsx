import React, { 
  useActionState, 
  useOptimistic, 
  useTransition, 
  useMemo,
  ReactNode,
  FormEvent,
  useRef
} from 'react';
import { View, ViewProps, Platform } from 'react-native';

interface FormAction<T = any> {
  (prevState: T, formData: FormData): Promise<T> | T;
}

interface FormProps<T = any> extends Omit<ViewProps, 'onSubmit'> {
  action?: FormAction<T>;
  initialState?: T;
  onSubmit?: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  resetOnSuccess?: boolean;
  optimisticUpdate?: (formData: FormData) => Partial<T>;
}

export function Form<T = any>({
  action,
  initialState,
  onSubmit,
  children,
  resetOnSuccess = false,
  optimisticUpdate,
  style,
  ...props
}: FormProps<T>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  
  // Use React 19's useActionState for form handling
  const [state, formAction, isFormPending] = useActionState(
    action || (async (prevState: T, formData: FormData) => prevState),
    initialState as T
  );

  // Optimistic updates for better UX
  const [optimisticState, updateOptimisticState] = useOptimistic(
    state,
    (currentState: T, update: Partial<T>) => ({ ...currentState, ...update })
  );

  const handleSubmit = useMemo(() => {
    if (Platform.OS === 'web') {
      return (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (action) {
          // Let useActionState handle the form submission
          const form = e.currentTarget;
          const formData = new FormData(form);
          
          if (optimisticUpdate) {
            const update = optimisticUpdate(formData);
            updateOptimisticState(update);
          }
          
          startTransition(() => {
            formAction(formData);
          });
        } else if (onSubmit) {
          const form = e.currentTarget;
          const formData = new FormData(form);
          
          startTransition(async () => {
            await onSubmit(formData);
            
            if (resetOnSuccess) {
              form.reset();
            }
          });
        }
      };
    }
    
    // For native platforms, we'll handle form submission differently
    return undefined;
  }, [action, onSubmit, optimisticUpdate, updateOptimisticState, formAction, resetOnSuccess, startTransition]);

  const isLoading = isPending || isFormPending;

  if (Platform.OS === 'web') {
    return React.createElement(
      'form',
      {
        ref: formRef,
        onSubmit: handleSubmit,
        style,
        ...props,
      },
      React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            formState: optimisticState,
            isSubmitting: isLoading,
          });
        }
        return child;
      })
    );
  }

  // Native fallback
  return (
    <View style={style} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            formState: optimisticState,
            isSubmitting: isLoading,
          });
        }
        return child;
      })}
    </View>
  );
}

// Hook for accessing form context in child components
export function useFormContext<T = any>() {
  return {
    isPending: false, // This would be provided by context in a full implementation
    formState: null as T | null,
    isSubmitting: false,
  };
}

export default Form;