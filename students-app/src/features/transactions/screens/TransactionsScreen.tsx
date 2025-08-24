import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '@academy/mobile-shared';

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'subscription';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  category: string;
  paymentMethod: string;
  receiptUrl?: string;
}

const TransactionCard: React.FC<{ transaction: Transaction; index: number }> = ({
  transaction,
  index,
}) => {
  const { theme } = useTheme();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.status.success;
      case 'pending':
        return theme.colors.status.warning;
      case 'failed':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return 'card';
      case 'refund':
        return 'return-up-back';
      case 'subscription':
        return 'refresh';
      default:
        return 'receipt';
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'refund' ? '+' : '-';
    return `${sign}$${amount.toFixed(2)}`;
  };
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={[
        styles.transactionCard,
        {
          backgroundColor: theme.colors.background.primary,
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.md,
          ...theme.elevation.sm,
        }
      ]}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
      }}>
        <View style={{
          width: 40,
          height: 40,
          backgroundColor: `${getStatusColor(transaction.status)}15`,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Ionicons
            name={getTransactionIcon(transaction.type)}
            size={20}
            color={getStatusColor(transaction.status)}
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.base,
            fontWeight: theme.fontConfig.fontWeight.medium,
            marginBottom: 2,
          }}>
            {transaction.description}
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
          }}>
            {transaction.category} • {transaction.paymentMethod}
          </Text>
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{
            color: transaction.type === 'refund'
              ? theme.colors.status.success
              : theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: 2,
          }}>
            {formatAmount(transaction.amount, transaction.type)}
          </Text>
          <View style={{
            backgroundColor: `${getStatusColor(transaction.status)}15`,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: 2,
            borderRadius: theme.borderRadius.full,
          }}>
            <Text style={{
              color: getStatusColor(transaction.status),
              fontSize: theme.fontSizes.xs,
              fontWeight: theme.fontConfig.fontWeight.medium,
              textTransform: 'capitalize',
            }}>
              {transaction.status}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.primary,
        paddingTop: theme.spacing.sm,
      }}>
        <Text style={{
          color: theme.colors.text.secondary,
          fontSize: theme.fontSizes.sm,
        }}>
          {transaction.date}
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {transaction.receiptUrl && (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: theme.spacing.md,
              }}
            >
              <Ionicons
                name="download-outline"
                size={16}
                color={theme.colors.interactive.primary}
                style={{ marginRight: theme.spacing.xs }}
              />
              <Text style={{
                color: theme.colors.interactive.primary,
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                Receipt
              </Text>
            </Pressable>
          )}
          
          <Pressable>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={theme.colors.icon.secondary}
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export const TransactionsScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  const filters = [
    { id: 'all', title: 'All' },
    { id: 'payments', title: 'Payments' },
    { id: 'refunds', title: 'Refunds' },
    { id: 'subscriptions', title: 'Subscriptions' },
  ];

  const periods = [
    { id: '7days', title: 'Last 7 days' },
    { id: '30days', title: 'Last 30 days' },
    { id: '3months', title: 'Last 3 months' },
    { id: '1year', title: 'Last year' },
  ];

  const transactions: Transaction[] = [
    {
      id: 'tx-001',
      type: 'payment',
      description: 'Personal Training Session',
      amount: 80.00,
      date: 'Aug 20, 2024',
      status: 'completed',
      category: 'Training',
      paymentMethod: 'Visa •••• 4321',
      receiptUrl: 'https://example.com/receipt1',
    },
    {
      id: 'tx-002',
      type: 'subscription',
      description: 'Monthly Membership',
      amount: 149.99,
      date: 'Aug 15, 2024',
      status: 'completed',
      category: 'Membership',
      paymentMethod: 'Auto-pay',
      receiptUrl: 'https://example.com/receipt2',
    },
    {
      id: 'tx-003',
      type: 'payment',
      description: 'Swimming Equipment',
      amount: 45.99,
      date: 'Aug 12, 2024',
      status: 'pending',
      category: 'Store',
      paymentMethod: 'Apple Pay',
    },
    {
      id: 'tx-004',
      type: 'refund',
      description: 'Cancelled Group Class',
      amount: 25.00,
      date: 'Aug 10, 2024',
      status: 'completed',
      category: 'Training',
      paymentMethod: 'Visa •••• 4321',
      receiptUrl: 'https://example.com/receipt3',
    },
    {
      id: 'tx-005',
      type: 'payment',
      description: 'Performance Analysis',
      amount: 120.00,
      date: 'Aug 8, 2024',
      status: 'failed',
      category: 'Training',
      paymentMethod: 'Mastercard •••• 8765',
    },
    {
      id: 'tx-006',
      type: 'payment',
      description: 'Academy T-Shirt',
      amount: 24.99,
      date: 'Aug 5, 2024',
      status: 'completed',
      category: 'Store',
      paymentMethod: 'Google Pay',
      receiptUrl: 'https://example.com/receipt4',
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'payments') return transaction.type === 'payment';
    if (selectedFilter === 'refunds') return transaction.type === 'refund';
    if (selectedFilter === 'subscriptions') return transaction.type === 'subscription';
    return true;
  });

  const totalSpent = transactions
    .filter(tx => tx.type === 'payment' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalRefunded = transactions
    .filter(tx => tx.type === 'refund' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.md,
          }}>
            <View style={{
              backgroundColor: theme.colors.background.primary,
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.md,
              flex: 1,
              marginRight: theme.spacing.sm,
              alignItems: 'center',
              ...theme.elevation.sm,
            }}>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
                marginBottom: theme.spacing.xs,
              }}>
                Total Spent
              </Text>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontConfig.fontWeight.bold,
              }}>
                ${totalSpent.toFixed(2)}
              </Text>
            </View>
            
            <View style={{
              backgroundColor: theme.colors.background.primary,
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.md,
              flex: 1,
              marginLeft: theme.spacing.sm,
              alignItems: 'center',
              ...theme.elevation.sm,
            }}>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
                marginBottom: theme.spacing.xs,
              }}>
                Total Refunded
              </Text>
              <Text style={{
                color: theme.colors.status.success,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontConfig.fontWeight.bold,
              }}>
                ${totalRefunded.toFixed(2)}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            {filters.map((filter, index) => (
              <Pressable
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={{
                  backgroundColor: selectedFilter === filter.id
                    ? theme.colors.interactive.primary
                    : theme.colors.background.primary,
                  borderColor: selectedFilter === filter.id
                    ? theme.colors.interactive.primary
                    : theme.colors.border.primary,
                  borderWidth: 1,
                  borderRadius: theme.borderRadius.full,
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.sm,
                  marginRight: theme.spacing.md,
                }}
              >
                <Text style={{
                  color: selectedFilter === filter.id
                    ? 'white'
                    : theme.colors.text.primary,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  fontSize: theme.fontSizes.sm,
                }}>
                  {filter.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Period Selector */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Pressable style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.lg,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
          }}>
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.base,
              fontWeight: theme.fontConfig.fontWeight.medium,
            }}>
              {periods.find(p => p.id === selectedPeriod)?.title}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={theme.colors.icon.secondary}
            />
          </Pressable>
        </Animated.View>

        {/* Transactions List */}
        <View style={{ paddingHorizontal: theme.spacing.lg }}>
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
              marginBottom: theme.spacing.md,
            }}
          >
            Recent Transactions
          </Animated.Text>
          
          {filteredTransactions.map((transaction, index) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              index={index}
            />
          ))}

          {filteredTransactions.length === 0 && (
            <Animated.View
              entering={FadeInDown.delay(500).springify()}
              style={{
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing['2xl'],
                alignItems: 'center',
                marginTop: theme.spacing.xl,
              }}
            >
              <Ionicons
                name="receipt-outline"
                size={48}
                color={theme.colors.icon.tertiary}
                style={{ marginBottom: theme.spacing.md }}
              />
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.medium,
                textAlign: 'center',
                marginBottom: theme.spacing.sm,
              }}>
                No transactions found
              </Text>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.base,
                textAlign: 'center',
              }}>
                Try adjusting your filters or date range
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Export Options */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={{
            margin: theme.spacing.lg,
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            ...theme.elevation.sm,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Export Transactions
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            marginBottom: theme.spacing.lg,
          }}>
            Download your transaction history for tax purposes or record keeping.
          </Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Pressable style={{
              backgroundColor: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.lg,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              flex: 1,
              marginRight: theme.spacing.sm,
              alignItems: 'center',
            }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.sm,
              }}>
                Export PDF
              </Text>
            </Pressable>
            
            <Pressable style={{
              backgroundColor: theme.colors.interactive.primary,
              borderRadius: theme.borderRadius.lg,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              flex: 1,
              marginLeft: theme.spacing.sm,
              alignItems: 'center',
            }}>
              <Text style={{
                color: 'white',
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.sm,
              }}>
                Export CSV
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionCard: {
    borderWidth: 1,
  },
});