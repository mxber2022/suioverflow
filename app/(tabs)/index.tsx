import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';
import { ArrowDown, Eye, EyeOff, Send, ChevronRight, ArrowUp, Plus, BanknoteIcon, CreditCard } from 'lucide-react-native';
import { RECENT_TRANSACTIONS } from '@/data/transactions';
import ReceiveModal from '@/components/ReceiveModal';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BankCardModal from '@/components/BankCardModal';

export default function HomeScreen() {
  const router = useRouter();
  //const [balance, setBalance] = useState(1250.75);
  const [hideBalance, setHideBalance] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [showCardModal, setShowCardModal] = useState(false);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const renderBalanceCard = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.balanceCardBg} />
      );
    }
    return (
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
    );
  };

  async function getUsdcBalance() {
    console.log("hey");
    const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
    setWalletAddress(await AsyncStorage.getItem('zkLoginAddress'));
    // const suiBalance = await suiClient.getBalance({
    //   owner: await AsyncStorage.getItem('zkLoginAddress'),
    //   coinType: "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC"
    // });

    // 1. Get the coin metadata to find decimals
    const coinMetadata = await suiClient.getCoinMetadata({
      coinType: "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC"
    });
    const decimals = coinMetadata.decimals;

    const suiBalance = await suiClient.getBalance({
      owner: await AsyncStorage.getItem('zkLoginAddress'),
      coinType: "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC"
    });
    const humanBalance = Number(suiBalance.totalBalance) / (10 ** decimals);
    console.log(humanBalance);

    setBalance(humanBalance);
    console.log("usdc balance is: ", suiBalance);
  }

  useEffect (()=> {
    getUsdcBalance()
  },[]
)

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={[Colors.primary[700], Colors.primary[900]]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
       <View style={styles.header}>          
          <View style={styles.balanceCard}>
            {renderBalanceCard()}
            <View style={styles.balanceContent}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceAmount}>
                  {hideBalance ? '••••••' : `$${balance.toLocaleString()}`}
                </Text>
                <TouchableOpacity
                  style={styles.hideButton}
                  onPress={() => setHideBalance(!hideBalance)}
                >
                  {hideBalance ? (
                    <EyeOff size={20} color="white" />
                  ) : (
                    <Eye size={20} color="white" />
                  )}
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.cardButton}
                onPress={() => setShowCardModal(true)}
              >
                <CreditCard size={20} color="white" />
                <Text style={styles.cardButtonText}>View Card Details</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.quickActions}>
                  {/* Add Money */}
          <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/send')}
            >
              <View style={styles.plusIcon}>
                <Plus size={20} color={Colors.primary[700]} />
              </View>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>


            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/send')}
            >
              <View style={styles.actionIcon}>
                <Send size={20} color={Colors.primary[700]} />
              </View>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowReceiveModal(true)}
            >
              <View style={styles.actionIcon}>
                <ArrowDown size={20} color={Colors.primary[700]} />
              </View>
              <Text style={styles.actionText}>Receive</Text>
            </TouchableOpacity>


          </View>

          
        </View>

        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(tabs)/transactions')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={Colors.primary[700]} />
            </TouchableOpacity>
          </View>

          {RECENT_TRANSACTIONS.slice(0, 3).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={[
                styles.transactionIcon,
                { backgroundColor: transaction.type === 'send' ? Colors.error.light : Colors.success.light }
              ]}>
                {transaction.type === 'send' ? (
                  <ArrowUp size={16} color={Colors.error.main} />
                ) : (
                  <ArrowDown size={16} color={Colors.success.main} />
                )}
              </View>
              
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>
                  {transaction.type === 'send' ? 'Sent to ' : 'Received from '}
                  <Text style={styles.transactionName}>{transaction.contactName || 'Unknown'}</Text>
                </Text>
                <Text style={styles.transactionDate}>{formatDate(transaction.timestamp)}</Text>
              </View>
              
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.amountText,
                  { color: transaction.type === 'send' ? Colors.error.main : Colors.success.main }
                ]}>
                  {transaction.type === 'send' ? '-' : '+'}${transaction.amount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      <ReceiveModal
        visible={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        walletAddress={walletAddress}
      />

    <BankCardModal
        visible={showCardModal}
        onClose={() => setShowCardModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: Platform.select({ web: 80, default: 100 }),
    paddingHorizontal: Layouts.spacing.xl,
    paddingBottom: Layouts.spacing.xl,
  },
  balanceCard: {
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  balanceCardBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  balanceContent: {
    padding: Layouts.spacing.xl,
    justifyContent: 'center',
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.grey[100],
    letterSpacing: 0.5,
    opacity: 0.9,
    marginBottom: Layouts.spacing.md,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 42,
    color: 'white',
    marginRight: Layouts.spacing.sm,
    letterSpacing: -0.5,
  },
  hideButton: {
    padding: Layouts.spacing.xs,
  },
  balanceSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.secondary[400],
    marginTop: 4,
    opacity: 0.9,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layouts.spacing.xl * 2,
    marginTop: Layouts.spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layouts.spacing.sm,
    shadowColor: Colors.primary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  plusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white', // Corrected background color to match actionIcon
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layouts.spacing.sm,
    shadowColor: Colors.primary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'white',
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  transactionsSection: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Layouts.spacing.xl,
    marginTop: Layouts.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layouts.spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.grey[900],
    letterSpacing: -0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.primary[700],
    marginRight: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layouts.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layouts.spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey[700],
    marginBottom: 2,
  },
  transactionName: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.grey[900],
  },
  transactionDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.grey[500],
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    letterSpacing: -0.2,
  },

  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layouts.spacing.sm,
    marginTop: Layouts.spacing.md,
    padding: Layouts.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layouts.borderRadius.full,
    alignSelf: 'flex-start',
  },
  cardButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
});