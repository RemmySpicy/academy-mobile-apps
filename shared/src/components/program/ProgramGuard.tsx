import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { useProgramContext } from './ProgramContextProvider';
import { useTheme } from '../../theme/ThemeProvider';
import { componentThemes } from '../../theme';
import { CustomButton } from '../forms';
import { hasRoleInProgram, hasMinimumRoleLevel } from '../../utils/programUtils';

interface ProgramGuardProps {
  children: ReactNode;
  /** Required role to access the content */
  requiredRole?: string;
  /** Required minimum role level */
  minimumRoleLevel?: string;
  /** Custom error message */
  errorMessage?: string;
  /** Custom fallback component */
  fallback?: ReactNode;
  /** Whether to show refresh option */
  showRefresh?: boolean;
}

export function ProgramGuard({
  children,
  requiredRole,
  minimumRoleLevel,
  errorMessage,
  fallback,
  showRefresh = true,
}: ProgramGuardProps) {
  const { currentProgram, isLoading, error, refreshPrograms } = useProgramContext();
  const { theme } = useTheme();

  // Show loading state
  if (isLoading) {
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
        <Text 
          style={[
            theme.typography.body.base,
            { color: theme.colors.text.secondary, textAlign: 'center' }
          ]}
          accessibilityRole="text"
          accessibilityLabel="Loading program context"
        >
          Loading program context...
        </Text>
      </View>
    );
  }

  // Show error state
  if (error || !currentProgram) {
    const displayError = error || 'No program context available';
    
    if (fallback) {
      return <>{fallback}</>;
    }

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
        <Text 
          style={[
            theme.typography.heading.h3,
            { 
              color: theme.colors.status.error,
              textAlign: 'center',
              marginBottom: theme.spacing[4],
            }
          ]}
          accessibilityRole="header"
          accessibilityLabel="Access Restricted"
        >
          Access Restricted
        </Text>
        <Text style={[
          theme.typography.body.base,
          { 
            color: theme.colors.text.secondary,
            textAlign: 'center',
            marginBottom: theme.spacing[6],
          }
        ]}>
          {errorMessage || displayError}
        </Text>
        {showRefresh && (
          <CustomButton
            title="Retry"
            onPress={refreshPrograms}
            variant="outline"
            size="md"
          />
        )}
      </View>
    );
  }

  // Check role permissions
  if (requiredRole && !hasRoleInProgram(currentProgram, requiredRole)) {
    const message = errorMessage || `This feature requires ${requiredRole} role in ${currentProgram.name}`;
    
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View style={[
        componentThemes.alert.warning(theme),
        { margin: theme.spacing[4] }
      ]}>
        <Text style={[
          theme.typography.body.base,
          { color: theme.colors.status.warning }
        ]}>
          {message}
        </Text>
      </View>
    );
  }

  // Check minimum role level
  if (minimumRoleLevel && !hasMinimumRoleLevel(currentProgram.user_role, minimumRoleLevel)) {
    const message = errorMessage || `This feature requires minimum ${minimumRoleLevel} role level`;
    
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View style={[
        componentThemes.alert.warning(theme),
        { margin: theme.spacing[4] }
      ]}>
        <Text style={[
          theme.typography.body.base,
          { color: theme.colors.status.warning }
        ]}>
          {message}
        </Text>
      </View>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}

/**
 * Higher-order component version of ProgramGuard
 */
export function withProgramGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<ProgramGuardProps, 'children'>
) {
  return function GuardedComponent(props: P) {
    return (
      <ProgramGuard {...guardProps}>
        <Component {...props} />
      </ProgramGuard>
    );
  };
}