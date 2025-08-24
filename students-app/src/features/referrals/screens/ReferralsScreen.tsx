import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme, Header } from '@academy/mobile-shared';

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'signed_up' | 'completed';
  date: string;
  reward: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'earned' | 'redeemed';
}

const ReferralCard: React.FC<{ referral: Referral; index: number }> = ({
  referral,
  index,
}) => {
  const { theme } = useTheme();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.status.success;
      case 'signed_up':
        return theme.colors.interactive.primary;
      case 'pending':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Reward Earned';
      case 'signed_up':
        return 'Signed Up';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={[
        styles.referralCard,
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
          backgroundColor: `${getStatusColor(referral.status)}15`,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Text style={{
            color: getStatusColor(referral.status),
            fontWeight: theme.fontConfig.fontWeight.bold,
            fontSize: theme.fontSizes.sm,
          }}>
            {referral.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.base,
            fontWeight: theme.fontConfig.fontWeight.medium,
            marginBottom: 2,
          }}>
            {referral.name}
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
          }}>
            {referral.email}
          </Text>
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{
            color: referral.status === 'completed'
              ? theme.colors.status.success
              : theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: 4,
          }}>
            ${referral.reward}
          </Text>
          <View style={{
            backgroundColor: `${getStatusColor(referral.status)}15`,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: 2,
            borderRadius: theme.borderRadius.full,
          }}>
            <Text style={{
              color: getStatusColor(referral.status),
              fontSize: theme.fontSizes.xs,
              fontWeight: theme.fontConfig.fontWeight.medium,
            }}>
              {getStatusText(referral.status)}
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
          Referred on {referral.date}
        </Text>
        
        {referral.status === 'pending' && (
          <Pressable>
            <Text style={{
              color: theme.colors.interactive.primary,
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontConfig.fontWeight.medium,
            }}>
              Send Reminder
            </Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

export const ReferralsScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [referralCode] = useState('ALEX2024');
  const [email, setEmail] = useState('');

  const referrals: Referral[] = [
    {
      id: 'ref-001',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      status: 'completed',
      date: 'Aug 15, 2024',
      reward: 50,
    },
    {
      id: 'ref-002',
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      status: 'signed_up',
      date: 'Aug 20, 2024',
      reward: 25,
    },
    {
      id: 'ref-003',
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      status: 'pending',
      date: 'Aug 22, 2024',
      reward: 50,
    },
  ];

  const rewards: Reward[] = [
    {
      id: 'reward-001',
      title: 'Referral Bonus',
      description: 'Sarah completed her first month',
      amount: 50,
      date: 'Aug 15, 2024',
      status: 'earned',
    },
    {
      id: 'reward-002',
      title: 'Sign-up Bonus',
      description: 'Mike signed up with your code',
      amount: 25,
      date: 'Aug 20, 2024',
      status: 'pending',
    },
  ];

  const totalEarned = rewards
    .filter(reward => reward.status === 'earned')
    .reduce((sum, reward) => sum + reward.amount, 0);

  const totalPending = rewards
    .filter(reward => reward.status === 'pending')
    .reduce((sum, reward) => sum + reward.amount, 0);

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Join Academy with my referral code ${referralCode} and we both get $50! Download the app and start your fitness journey today.`,
        url: 'https://academyapp.com/referral/' + referralCode,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSendInvitation = () => {
    if (email.trim()) {
      // Send invitation logic here
      console.log('Sending invitation to:', email);
      setEmail('');
    }
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <Header
        title="Referrals"
        showBackButton={true}
        style={{ paddingTop: insets.top }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Referral Code Section */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            backgroundColor: theme.colors.interactive.primary,
            margin: theme.spacing.lg,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="gift"
            size={32}
            color="white"
            style={{ marginBottom: theme.spacing.md }}
          />
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.xl,
            fontWeight: theme.fontConfig.fontWeight.bold,
            marginBottom: theme.spacing.sm,
          }}>
            Earn $50 for Each Friend!
          </Text>
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            opacity: 0.9,
            marginBottom: theme.spacing.lg,
            lineHeight: 22,
          }}>
            Share your referral code and earn rewards when your friends join Academy
          </Text>
          
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: theme.borderRadius.lg,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
          }}>
            <Text style={{
              color: 'white',
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.bold,
              marginRight: theme.spacing.md,
            }}>
              {referralCode}
            </Text>
            <Pressable
              onPress={() => {
                // Copy to clipboard logic
                console.log('Copied to clipboard:', referralCode);
              }}
            >
              <Ionicons
                name="copy"
                size={20}
                color="white"
              />
            </Pressable>
          </View>
          
          <Pressable
            onPress={handleShareCode}
            style={{
              backgroundColor: 'white',
              borderRadius: theme.borderRadius.lg,
              paddingHorizontal: theme.spacing.xl,
              paddingVertical: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="share"
              size={20}
              color={theme.colors.interactive.primary}
              style={{ marginRight: theme.spacing.sm }}
            />
            <Text style={{
              color: theme.colors.interactive.primary,
              fontWeight: theme.fontConfig.fontWeight.medium,
              fontSize: theme.fontSizes.base,
            }}>
              Share Code
            </Text>
          </Pressable>
        </Animated.View>

        {/* Earnings Summary */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
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
                Total Earned
              </Text>
              <Text style={{
                color: theme.colors.status.success,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontConfig.fontWeight.bold,
              }}>
                ${totalEarned}
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
                Pending
              </Text>
              <Text style={{
                color: theme.colors.status.warning,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontConfig.fontWeight.bold,
              }}>
                ${totalPending}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Invite Friends */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Invite Friends
          </Text>
          
          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            ...theme.elevation.sm,
          }}>
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.base,
              marginBottom: theme.spacing.md,
            }}>
              Send a personal invitation via email
            </Text>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.background.secondary,
                  borderRadius: theme.borderRadius.lg,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.md,
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                  marginRight: theme.spacing.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary,
                }}
                placeholder="Enter email address"
                placeholderTextColor={theme.colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <Pressable
                onPress={handleSendInvitation}
                disabled={!email.trim()}
                style={{
                  backgroundColor: email.trim()
                    ? theme.colors.interactive.primary
                    : theme.colors.background.secondary,
                  borderRadius: theme.borderRadius.lg,
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.md,
                  opacity: email.trim() ? 1 : 0.5,
                }}
              >
                <Text style={{
                  color: email.trim() ? 'white' : theme.colors.text.secondary,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  fontSize: theme.fontSizes.sm,
                }}>
                  Send
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Referrals List */}
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
            My Referrals ({referrals.length})
          </Animated.Text>
          
          {referrals.map((referral, index) => (
            <ReferralCard
              key={referral.id}
              referral={referral}
              index={index}
            />
          ))}
        </View>

        {/* How It Works */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
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
            How It Works
          </Text>
          
          <View style={{ marginBottom: theme.spacing.md }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.sm,
            }}>
              <View style={{
                width: 24,
                height: 24,
                backgroundColor: theme.colors.interactive.primary,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}>
                <Text style={{
                  color: 'white',
                  fontWeight: theme.fontConfig.fontWeight.bold,
                  fontSize: theme.fontSizes.xs,
                }}>
                  1
                </Text>
              </View>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
                flex: 1,
              }}>
                Share your referral code with friends
              </Text>
            </View>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.sm,
            }}>
              <View style={{
                width: 24,
                height: 24,
                backgroundColor: theme.colors.interactive.primary,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}>
                <Text style={{
                  color: 'white',
                  fontWeight: theme.fontConfig.fontWeight.bold,
                  fontSize: theme.fontSizes.xs,
                }}>
                  2
                </Text>
              </View>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
                flex: 1,
              }}>
                They sign up and get $25 off their first month
              </Text>
            </View>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <View style={{
                width: 24,
                height: 24,
                backgroundColor: theme.colors.interactive.primary,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}>
                <Text style={{
                  color: 'white',
                  fontWeight: theme.fontConfig.fontWeight.bold,
                  fontSize: theme.fontSizes.xs,
                }}>
                  3
                </Text>
              </View>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
                flex: 1,
              }}>
                You earn $50 when they complete their first month
              </Text>
            </View>
          </View>
          
          <View style={{
            backgroundColor: theme.colors.status.infoBackground,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            marginTop: theme.spacing.md,
          }}>
            <Text style={{
              color: theme.colors.interactive.primary,
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontConfig.fontWeight.medium,
              textAlign: 'center',
            }}>
              💡 Tip: Personal invitations convert 3x better than social sharing!
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  referralCard: {
    borderWidth: 1,
  },
});