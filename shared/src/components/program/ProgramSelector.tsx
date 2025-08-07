import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  StyleSheet,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useProgramContext } from './ProgramContextProvider';
import { useTheme, componentThemes } from '../../theme';
import { ProgramContext } from '../../types';

interface ProgramSelectorProps {
  /** Show the selector as a compact button */
  variant?: 'button' | 'dropdown' | 'card';
  /** Custom styling */
  style?: any;
  /** Called when program is switched */
  onProgramChange?: (program: ProgramContext) => void;
  /** Show refresh button */
  showRefresh?: boolean;
}

export function ProgramSelector({ 
  variant = 'button', 
  style, 
  onProgramChange,
  showRefresh = true 
}: ProgramSelectorProps) {
  const { 
    currentProgram, 
    availablePrograms, 
    switchProgram, 
    isLoading, 
    refreshPrograms, 
    error 
  } = useProgramContext();
  const theme = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleProgramSelect = async (program: ProgramContext) => {
    if (program.id === currentProgram?.id) {
      setIsModalVisible(false);
      return;
    }

    try {
      setIsSwitching(true);
      await switchProgram(program.id);
      onProgramChange?.(program);
      setIsModalVisible(false);
    } catch (error: any) {
      Alert.alert(
        'Switch Failed',
        error.message || 'Failed to switch program',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSwitching(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    try {
      await refreshPrograms();
    } catch (error: any) {
      Alert.alert(
        'Refresh Failed',
        error.message || 'Failed to refresh programs',
        [{ text: 'OK' }]
      );
    }
  }, [refreshPrograms]);

  const renderTriggerButton = () => {
    if (variant === 'card') {
      return (
        <TouchableOpacity
          style={[
            componentThemes.card.default(theme),
            styles.cardTrigger,
            style
          ]}
          onPress={() => setIsModalVisible(true)}
          disabled={isLoading || availablePrograms.length <= 1}
        >
          <View style={styles.cardContent}>
            <Text style={[theme.typography.body.small, { color: theme.colors.text.tertiary }]}>
              Current Program
            </Text>
            <Text style={[
              theme.typography.heading.h4, 
              { color: theme.colors.text.primary, marginTop: theme.spacing[1] }
            ]}>
              {currentProgram?.name || 'No Program Selected'}
            </Text>
            {availablePrograms.length > 1 && (
              <Text style={[
                theme.typography.body.small, 
                { color: theme.colors.interactive.primary, marginTop: theme.spacing[2] }
              ]}>
                Tap to switch programs
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[
          componentThemes.button.secondary(theme),
          variant === 'dropdown' && styles.dropdownTrigger,
          style
        ]}
        onPress={() => setIsModalVisible(true)}
        disabled={isLoading || availablePrograms.length <= 1}
      >
        <Text style={[
          theme.typography.button.base,
          { color: theme.colors.text.primary }
        ]}>
          {currentProgram?.name || 'Select Program'}
        </Text>
        {availablePrograms.length > 1 && (
          <Text style={[
            { color: theme.colors.text.tertiary, marginLeft: theme.spacing[2] }
          ]}>
            ▼
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderProgramItem = useCallback(({ item }: { item: ProgramContext }) => (
    <TouchableOpacity
      style={[
        styles.programItem,
        {
          backgroundColor: item.id === currentProgram?.id 
            ? theme.colors.interactive.primaryBackground 
            : theme.colors.background.primary,
          borderColor: item.id === currentProgram?.id 
            ? theme.colors.interactive.primary 
            : theme.colors.border.primary,
          borderWidth: item.id === currentProgram?.id ? 2 : 1,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing[4],
          marginVertical: theme.spacing[1],
        }
      ]}
      onPress={() => handleProgramSelect(item)}
      disabled={isSwitching}
    >
      <View style={styles.programItemContent}>
        <Text style={[
          theme.typography.body.base,
          { 
            color: item.id === currentProgram?.id 
              ? theme.colors.interactive.primary 
              : theme.colors.text.primary,
            fontWeight: item.id === currentProgram?.id ? '600' : 'normal',
          }
        ]}>
          {item.name}
        </Text>
        {item.description && (
          <Text style={[
            theme.typography.body.small,
            { 
              color: item.id === currentProgram?.id 
                ? theme.colors.interactive.primaryText 
                : theme.colors.text.secondary,
              marginTop: theme.spacing[1],
            }
          ]}>
            {item.description}
          </Text>
        )}
        {item.id === currentProgram?.id && (
          <View style={[
            styles.currentBadge,
            { backgroundColor: theme.colors.interactive.primary }
          ]}>
            <Text style={[
              theme.typography.body.small,
              { color: theme.colors.text.inverse, fontWeight: '600' }
            ]}>
              Current
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  ), [currentProgram?.id, handleProgramSelect, isSwitching, theme]);

  if (!currentProgram && !isLoading && !error) {
    return null;
  }

  return (
    <>
      {renderTriggerButton()}
      
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={[
            componentThemes.modal.backdrop(theme),
            styles.modalBackdrop
          ]}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View
            style={[
              componentThemes.modal.container(theme),
              styles.modalContainer
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={[
                theme.typography.heading.h3,
                { color: theme.colors.text.primary }
              ]}>
                Select Program
              </Text>
              {showRefresh && (
                <TouchableOpacity
                  style={[
                    componentThemes.button.tertiary(theme),
                    styles.refreshButton
                  ]}
                  onPress={handleRefresh}
                >
                  <Text style={[
                    theme.typography.button.small,
                    { color: theme.colors.interactive.primary }
                  ]}>
                    Refresh
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {error && (
              <View style={[
                componentThemes.alert.error(theme),
                { marginBottom: theme.spacing[4] }
              ]}>
                <Text style={[
                  theme.typography.body.small,
                  { color: theme.colors.status.error }
                ]}>
                  {error}
                </Text>
              </View>
            )}

            <FlatList
              data={availablePrograms}
              keyExtractor={(item) => item.id}
              renderItem={renderProgramItem}
              style={styles.programList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={[
                  theme.typography.body.base,
                  { 
                    color: theme.colors.text.secondary,
                    textAlign: 'center',
                    padding: theme.spacing[4] 
                  }
                ]}>
                  No programs available
                </Text>
              }
            />

            {isSwitching && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator 
                  size="large" 
                  color={theme.colors.interactive.primary} 
                />
                <Text style={[
                  theme.typography.body.base,
                  { 
                    color: theme.colors.text.primary,
                    marginTop: theme.spacing[2] 
                  }
                ]}>
                  Switching programs...
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                componentThemes.button.secondary(theme),
                styles.closeButton
              ]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={[
                theme.typography.button.base,
                { color: theme.colors.text.primary }
              ]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  cardTrigger: {
    minHeight: 80,
  },
  cardContent: {
    flex: 1,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 200,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  programList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  programItem: {
    position: 'relative',
  },
  programItemContent: {
    flex: 1,
  },
  currentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  closeButton: {
    marginTop: 8,
  },
});