import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';
import { Eye, EyeOff } from 'lucide-react-native';

interface BalanceCardProps {
  balance: number;
  hideBalance: boolean;
  toggleHideBalance: () => void;
  currency: string;
}

export default function BalanceCard({ balance, hideBalance, toggleHideBalance, currency }: BalanceCardProps) {
  const formatBalance = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  
  return (
    <View style={styles.balanceCard}>
      <BlurView intensity={20} tint="light" style={styles.glassEffect}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>
              {hideBalance ? '••••••' : formatBalance(balance)}
            </Text>
            <TouchableOpacity
              style={styles.hideButton}
              onPress={toggleHideBalance}
            >
              {hideBalance ? (
                <EyeOff size={20} color="white" />
              ) : (
                <Eye size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceSubtext}>
            {hideBalance ? '••••••' : `${balance.toFixed(2)} ${currency}`}
          </Text>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: Layouts.spacing.lg,
  },
  glassEffect: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  balanceContainer: {
    flex: 1,
    padding: Layouts.spacing.lg,
    justifyContent: 'center',
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.grey[100],
    marginBottom: Layouts.spacing.xs,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
    marginRight: Layouts.spacing.sm,
  },
  hideButton: {
    padding: Layouts.spacing.xs,
  },
  balanceSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.secondary[400],
    marginTop: Layouts.spacing.xs,
  },
});