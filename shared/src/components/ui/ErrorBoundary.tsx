import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

// Themed wrapper component
const ThemedErrorFallback: React.FC<{
  error: Error;
  retry: () => void;
}> = ({ error, retry }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.message}>
        We're sorry, but something unexpected happened. Please try again.
      </Text>
      <Pressable style={styles.retryButton} onPress={retry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </Pressable>
    </View>
  );
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);

    // Log error details for debugging
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }
  }

  componentDidUpdate(prevProps: ModernErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((key, idx) => prevProps.resetKeys?.[idx] !== key)) {
        this.resetErrorBoundary();
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }, 0) as unknown as number;
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback && error && errorInfo) {
        return fallback(error, errorInfo, this.resetErrorBoundary);
      }

      return (
        <ThemedErrorFallback 
          error={error!} 
          retry={this.resetErrorBoundary} 
        />
      );
    }

    return children;
  }
}

const useThemedStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.status.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: theme.colors.interactive.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.elevation.sm,
  },
  retryButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
}));

export { ErrorBoundary };
export default ErrorBoundary;