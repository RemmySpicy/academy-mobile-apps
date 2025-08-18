import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@academy/mobile-shared';

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
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons 
          name="warning-outline" 
          size={64} 
          color={theme.colors.status.error} 
        />
        <Text style={styles.title}>
          Oops! Something went wrong
        </Text>
        <Text style={styles.message}>
          The student app encountered an unexpected error. Please try restarting.
        </Text>
        
        {__DEV__ && error && (
          <Text style={styles.error}>
            {error.toString()}
          </Text>
        )}
        
        <Pressable 
          style={styles.button} 
          onPress={onReset}
        >
          <Text style={styles.buttonText}>
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

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontConfig.fontWeight.bold,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  message: {
    fontSize: theme.fontSizes.base,
    textAlign: 'center',
    lineHeight: theme.fontSizes.base * 1.5,
    marginBottom: theme.spacing.lg,
    color: theme.colors.text.secondary,
  },
  error: {
    fontSize: theme.fontSizes.xs,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontFamily: 'monospace',
    color: theme.colors.status.error,
  },
  button: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.interactive.primary,
  },
  buttonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },
});

// Styles are now created dynamically using theme hook