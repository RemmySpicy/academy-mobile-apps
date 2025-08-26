import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Program, ProgramContextValue, ProgramContext } from '../../types';
import { useAuthStore } from '../../store/authStore';
import apiClient from '../../services/apiClient';
import { useTheme } from '../../theme/ThemeProvider';
import { View, ActivityIndicator, Text } from 'react-native';
import { programAssignmentToProgram } from '../../utils/programUtils';

interface ProgramContextProviderProps {
  children: ReactNode;
}

const ProgramReactContext = createContext<ProgramContextValue | null>(null);

export function ProgramContextProvider({ children }: ProgramContextProviderProps) {
  const [currentProgram, setCurrentProgram] = useState<ProgramContext | null>(null);
  const [availablePrograms, setAvailablePrograms] = useState<ProgramContext[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAuthenticated, currentProgram: authCurrentProgram, availablePrograms: authAvailablePrograms } = useAuthStore();
  const { theme } = useTheme();

  // Mock programs for development/testing
  const mockPrograms: ProgramContext[] = [
    {
      id: 'swimming-1',
      name: 'Swimming Academy',
      description: 'Professional swimming instruction for all ages',
      is_active: true,
      organization_id: 'mock-org-1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'football-1', 
      name: 'Football Training',
      description: 'Youth and adult football development program',
      is_active: true,
      organization_id: 'mock-org-1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'basketball-1',
      name: 'Basketball Club',
      description: 'Basketball skills training and competition',
      is_active: true,
      organization_id: 'mock-org-1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'music-1',
      name: 'Music Academy',
      description: 'Piano, guitar, and voice lessons',
      is_active: true,
      organization_id: 'mock-org-1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  // Initialize program context when auth state changes
  useEffect(() => {
    if (isAuthenticated && user && authAvailablePrograms) {
      initializeProgramContext(authAvailablePrograms, authCurrentProgram);
    } else {
      // For development/testing: Initialize with mock programs
      initializeProgramContextWithMockData();
    }
  }, [isAuthenticated, user?.id, authAvailablePrograms, authCurrentProgram]);

  const initializeProgramContextWithMockData = () => {
    console.log('🧪 Initializing with mock programs for testing');
    setIsLoading(false);
    setError(null);
    setAvailablePrograms(mockPrograms);
    setCurrentProgram(mockPrograms[0]); // Default to swimming
  };

  const initializeProgramContext = async (
    availablePrograms: typeof authAvailablePrograms, 
    currentProgram: typeof authCurrentProgram
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Convert auth store program assignments to program contexts
      const programs = availablePrograms.map(programAssignmentToProgram);
      setAvailablePrograms(programs);

      if (programs.length === 0) {
        setError('No programs available. Please contact your administrator.');
        setIsLoading(false);
        return;
      }

      // Use current program from auth store if available
      if (currentProgram) {
        const currentProgramContext = programAssignmentToProgram(currentProgram);
        setCurrentProgram(currentProgramContext);
      } else {
        // No current program, use first available
        const firstProgram = programs[0];
        await switchToProgram(firstProgram);
      }
    } catch (error: any) {
      console.error('Failed to initialize program context:', error);
      setError(error.message || 'Failed to load programs');
    } finally {
      setIsLoading(false);
    }
  };

  const switchToProgram = async (program: ProgramContext): Promise<void> => {
    setCurrentProgram(program);
    
    // Only call API if we have real auth data (not in mock mode)
    if (isAuthenticated && user && authAvailablePrograms) {
      await apiClient.setProgramContext(program.id);
      
      // Find corresponding program assignment and update auth store
      const programAssignment = authAvailablePrograms.find(p => p.program_id === program.id);
      if (programAssignment) {
        useAuthStore.getState().setCurrentProgram(programAssignment);
      }
    } else {
      // Mock mode - just log the switch
      console.log('🧪 Mock program switch to:', program.name);
    }
  };

  const switchProgram = useCallback(async (programId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const program = availablePrograms.find(p => p.id === programId);
      if (!program) {
        throw new Error('Program not found in available programs');
      }

      await switchToProgram(program);
    } catch (error: any) {
      console.error('Failed to switch program:', error);
      setError(error.message || 'Failed to switch program');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [availablePrograms]);

  const refreshPrograms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Refresh user data in auth store (this will update available programs)
      await useAuthStore.getState().refreshUser();
      
      // Get fresh state after refresh
      const { currentProgram: freshCurrentProgram, availablePrograms: freshAvailablePrograms } = useAuthStore.getState();
      
      // Re-initialize with fresh data
      if (freshAvailablePrograms) {
        await initializeProgramContext(freshAvailablePrograms, freshCurrentProgram);
      }
    } catch (error: any) {
      console.error('Failed to refresh programs:', error);
      setError(error.message || 'Failed to refresh programs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const contextValue: ProgramContextValue = {
    currentProgram,
    availablePrograms,
    switchProgram,
    isLoading,
    refreshPrograms,
    error,
  };

  // Show loading screen while initializing
  if (isAuthenticated && isLoading && !currentProgram) {
    return (
      <View style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background.primary,
          padding: theme.spacing[6],
        }
      ]}>
        <ActivityIndicator 
          size="large" 
          color={theme.colors.interactive.primary} 
          style={{ marginBottom: theme.spacing[4] }} 
        />
        <Text style={[
          theme.typography.body.lg,
          { color: theme.colors.text.secondary, textAlign: 'center' }
        ]}>
          Loading programs...
        </Text>
      </View>
    );
  }

  // Show error screen if there are no available programs
  if (isAuthenticated && error) {
    return (
      <View style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background.primary,
          padding: theme.spacing[6],
        }
      ]}>
        <Text style={[
          theme.typography.heading.h3,
          { 
            color: theme.colors.status.error, 
            textAlign: 'center',
            marginBottom: theme.spacing[4],
          }
        ]}>
          Unable to Load Programs
        </Text>
        <Text style={[
          theme.typography.body.base,
          { color: theme.colors.text.secondary, textAlign: 'center' }
        ]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ProgramReactContext.Provider value={contextValue}>
      {children}
    </ProgramReactContext.Provider>
  );
}

export function useProgramContext() {
  const context = useContext(ProgramReactContext);
  if (!context) {
    throw new Error('useProgramContext must be used within a ProgramContextProvider');
  }
  return context;
}

export { ProgramReactContext as ProgramContext };