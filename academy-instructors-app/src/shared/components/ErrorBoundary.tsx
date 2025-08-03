import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Error Boundary Component
 * 
 * Production-ready error boundary that catches JavaScript errors
 * and displays a user-friendly fallback UI.
 * 
 * Features:
 * - Graceful error handling with stack traces
 * - Restart app functionality
 * - Error reporting preparation
 * - User-friendly error messages
 * - Professional styling
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console for development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In production, you would send this to your error reporting service
    // Example: Sentry, Bugsnag, etc.
    // crashlytics().recordError(error);
  }

  handleRestart = async () => {
    try {
      await Updates.reloadAsync();
    } catch {
      // Fallback: reset component state
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView
            className="flex-1 px-6 py-8"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          >
            <View className="items-center mb-8">
              <View className="bg-red-100 p-4 rounded-full mb-4">
                <Ionicons name="alert-circle" size={48} color="#EF4444" />
              </View>
              
              <Text className="text-gray-900 text-2xl font-bold text-center mb-2">
                Oops! Something went wrong
              </Text>
              
              <Text className="text-gray-600 text-center text-base leading-6 mb-6">
                We're sorry for the inconvenience. The app encountered an unexpected error.
                You can try restarting the app or contact support if the problem persists.
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="space-y-4">
              <TouchableOpacity
                onPress={this.handleRestart}
                className="bg-blue-600 px-6 py-3 rounded-lg"
              >
                <Text className="text-white text-center text-base font-semibold">
                  Restart App
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // In production, this would open support/feedback
                  console.log('Contact support pressed');
                }}
                className="border border-gray-300 px-6 py-3 rounded-lg"
              >
                <Text className="text-gray-700 text-center text-base font-medium">
                  Contact Support
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Details (Development Only) */}
            {__DEV__ && this.state.error && (
              <View className="mt-8 p-4 bg-gray-100 rounded-lg">
                <Text className="text-gray-800 font-semibold mb-2">
                  Error Details (Development):
                </Text>
                <ScrollView className="max-h-32">
                  <Text className="text-red-600 text-sm font-mono">
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text className="text-gray-600 text-xs font-mono mt-2">
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </ScrollView>
              </View>
            )}

            {/* Footer Info */}
            <View className="mt-8 pt-6 border-t border-gray-200">
              <Text className="text-center text-gray-500 text-sm">
                Academy Instructors App v2.0.0
              </Text>
              <Text className="text-center text-gray-400 text-xs mt-1">
                Error ID: {Date.now().toString(36)}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}