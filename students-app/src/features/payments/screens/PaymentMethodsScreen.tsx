import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme, CustomButton } from '@academy/mobile-shared';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank' | 'mobile';
  title: string;
  subtitle: string;
  lastFour?: string;
  expiryDate?: string;
  icon: keyof typeof Ionicons.glyphMap;
  isDefault: boolean;
}

const PaymentMethodCard: React.FC<{
  method: PaymentMethod;
  onMakeDefault: () => void;
  onDelete: () => void;
  onEdit: () => void;
}> = ({ method, onMakeDefault, onDelete, onEdit }) => {
  const { theme } = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: method.isDefault ? 2 : 1,
      borderColor: method.isDefault ? theme.colors.interactive.primary : theme.colors.border.primary,
      ...theme.elevation.sm,
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
      }}>
        <View style={{
          width: 48,
          height: 48,
          backgroundColor: `${theme.colors.interactive.primary}15`,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Ionicons name={method.icon} size={24} color={theme.colors.interactive.primary} />
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.base,
            fontWeight: theme.fontConfig.fontWeight.semibold,
          }}>
            {method.title}
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            marginTop: 2,
          }}>
            {method.subtitle}
          </Text>
        </View>
        
        {method.isDefault && (
          <View style={{
            backgroundColor: theme.colors.interactive.primary,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs / 2,
            borderRadius: theme.borderRadius.sm,
          }}>
            <Text style={{
              color: 'white',
              fontSize: theme.fontSizes.xs,
              fontWeight: theme.fontConfig.fontWeight.medium,
            }}>
              DEFAULT
            </Text>
          </View>
        )}
      </View>
      
      {/* Card Details */}
      {method.lastFour && (
        <View style={{
          flexDirection: 'row',
          marginBottom: theme.spacing.md,
        }}>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            marginRight: theme.spacing.lg,
          }}>
            •••• {method.lastFour}
          </Text>
          {method.expiryDate && (
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.sm,
            }}>
              {method.expiryDate}
            </Text>
          )}
        </View>
      )}
      
      {/* Actions */}
      <View style={{
        flexDirection: 'row',
        gap: theme.spacing.sm,
      }}>
        {!method.isDefault && (
          <Pressable
            style={{
              flex: 1,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: theme.colors.interactive.primary,
              alignItems: 'center',
            }}
            onPress={onMakeDefault}
          >
            <Text style={{
              color: theme.colors.interactive.primary,
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontConfig.fontWeight.medium,
            }}>
              Make Default
            </Text>
          </Pressable>
        )}
        
        <Pressable
          style={{
            flex: 1,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            alignItems: 'center',
          }}
          onPress={onEdit}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontConfig.fontWeight.medium,
          }}>
            Edit
          </Text>
        </Pressable>
        
        <Pressable
          style={{
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.status.error,
            alignItems: 'center',
          }}
          onPress={onDelete}
        >
          <Ionicons name="trash-outline" size={16} color={theme.colors.status.error} />
        </Pressable>
      </View>
    </View>
  );
};

export const PaymentMethodsScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      title: 'Visa Card',
      subtitle: 'Personal Card',
      lastFour: '4242',
      expiryDate: '12/25',
      icon: 'card',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      title: 'Mastercard',
      subtitle: 'Business Card',
      lastFour: '8888',
      expiryDate: '08/26',
      icon: 'card',
      isDefault: false,
    },
    {
      id: '3',
      type: 'paypal',
      title: 'PayPal',
      subtitle: 'student@academy.com',
      icon: 'logo-paypal',
      isDefault: false,
    },
  ]);

  const handleMakeDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    Alert.alert(
      'Delete Payment Method',
      `Are you sure you want to delete ${method?.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(m => m.id !== id));
          }
        }
      ]
    );
  };

  const handleEdit = (id: string) => {
    console.log('Edit payment method:', id);
    // Navigate to edit screen
  };

  const handleAddPaymentMethod = () => {
    console.log('Add payment method');
    // Navigate to add payment method screen
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.lg,
          paddingHorizontal: theme.spacing.md,
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Manage your payment methods for Academy services and purchases
          </Text>
        </Animated.View>

        {/* Payment Methods List */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            marginBottom: theme.spacing.xl,
          }}
        >
          {paymentMethods.map((method, index) => (
            <Animated.View
              key={method.id}
              entering={FadeInDown.delay(300 + index * 100).springify()}
            >
              <PaymentMethodCard
                method={method}
                onMakeDefault={() => handleMakeDefault(method.id)}
                onDelete={() => handleDelete(method.id)}
                onEdit={() => handleEdit(method.id)}
              />
            </Animated.View>
          ))}
        </Animated.View>

        {/* Add Payment Method */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={{
            marginBottom: theme.spacing.xl,
          }}
        >
          <CustomButton
            title="Add Payment Method"
            variant="primary"
            size="lg"
            leftIcon="add"
            onPress={handleAddPaymentMethod}
            style={{ width: '100%' }}
          />
        </Animated.View>

        {/* Security Info */}
        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            ...theme.elevation.sm,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
          }}>
            <View style={{
              width: 40,
              height: 40,
              backgroundColor: `${theme.colors.status.success}15`,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
            }}>
              <Ionicons name="shield-checkmark" size={20} color={theme.colors.status.success} />
            </View>
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.base,
              fontWeight: theme.fontConfig.fontWeight.semibold,
            }}>
              Your payments are secure
            </Text>
          </View>
          
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            lineHeight: 20,
          }}>
            All payment information is encrypted and stored securely. Academy never stores your full card details on our servers.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};