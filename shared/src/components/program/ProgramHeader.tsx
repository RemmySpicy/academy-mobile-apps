import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useProgramContext } from './ProgramContextProvider';
import { useTheme } from '../../theme/ThemeProvider';

interface ProgramHeaderProps {
  /** Show program description */
  showDescription?: boolean;
  /** Custom styling */
  style?: any;
  /** Text alignment */
  textAlign?: 'left' | 'center' | 'right';
}

export function ProgramHeader({ 
  showDescription = true, 
  style, 
  textAlign = 'left' 
}: ProgramHeaderProps) {
  const { currentProgram } = useProgramContext();
  const theme = useTheme();

  if (!currentProgram) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={[
        theme.typography.heading.h2,
        { 
          color: theme.colors.text.primary,
          textAlign,
        }
      ]}>
        {currentProgram.name}
      </Text>
      {showDescription && currentProgram.description && (
        <Text style={[
          theme.typography.body.base,
          { 
            color: theme.colors.text.secondary,
            textAlign,
            marginTop: theme.spacing[1],
          }
        ]}>
          {currentProgram.description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});