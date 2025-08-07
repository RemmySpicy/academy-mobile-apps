import React, { Component, ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '@shared/components/forms';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in child components and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorBoundaryContent 
          onRetry={this.handleRetry}
          error={this.state.error}
        />
      );
    }

    return this.props.children;
  }
}

// Separate functional component to use hooks
const ErrorBoundaryContent: React.FC<{
  onRetry: () => void;
  error?: Error;
}> = ({ onRetry, error }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle" size={32} color="#EF4444" />
      </View>
      
      <Text style={styles.title}>
        Something went wrong
      </Text>
      
      <Text style={styles.message}>
        We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
      </Text>
      
      <CustomButton
        title="Try Again"
        onPress={onRetry}
        variant="primary"
        style={styles.button}
      />
      
      {__DEV__ && error && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            {error.toString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // gray-50
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    backgroundColor: '#FEE2E2', // red-100
    borderRadius: 50,
    padding: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827', // gray-900
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#4B5563', // gray-600
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    minWidth: 120,
  },
  debugContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#FEF2F2', // red-50
    borderRadius: 8,
    width: '100%',
  },
  debugText: {
    fontSize: 12,
    color: '#991B1B', // red-800
    fontFamily: 'monospace',
  },
});