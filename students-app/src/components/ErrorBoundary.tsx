import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '@academy/mobile-shared';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

// Error display component that uses theme
const ErrorDisplay: React.FC<{
  error?: Error;
  onReset: () => void;
}> = ({ error, onReset }) => {
  const theme = lightTheme; // Use theme directly since we can't use hooks in class component

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.content}>
        <Ionicons 
          name="warning-outline" 
          size={64} 
          color={theme.colors.status.error} 
        />
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Oops! Something went wrong
        </Text>
        <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
          The student app encountered an unexpected error. Please try restarting.
        </Text>
        
        {__DEV__ && error && (
          <Text style={[styles.error, { color: theme.colors.status.error }]}>
            {error.toString()}
          </Text>
        )}
        
        <Pressable 
          style={[styles.button, { backgroundColor: theme.colors.interactive.primary }]} 
          onPress={onReset}
        >
          <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>
            Try Again
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay 
          error={this.state.error} 
          onReset={this.handleReset} 
        />
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  error: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});