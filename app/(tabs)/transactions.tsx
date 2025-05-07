import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';
import { ArrowLeft, Filter, ArrowUp, ArrowDown } from 'lucide-react-native';
import { Transaction } from '@/types/Transaction';
import { RECENT_TRANSACTIONS } from '@/data/transactions';
import { fetchRecentTransactions } from '@/utils/fetchRecentTransactions';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FilterOption = 'all' | 'sent' | 'received';

export default function TransactionsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [transactions, setTransactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [walletAddress, setWalletAddress] = useState("");

  //const address = '0xf4334696ef3a277b7cc18ac1018bd00f17701074bc5d4c347ffc7764961b0cf8'; // <-- Replace with real connected address

  useEffect(() => {
    const loadAddress = async () => {
      const storedAddress = await AsyncStorage.getItem('zkLoginAddress');
      if (storedAddress) setWalletAddress(storedAddress);
    };
    loadAddress();
  }, []);


  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const recent = await fetchRecentTransactions(walletAddress);
        console.log("recent hellossssss: ", recent);
        setAllTransactions(recent);
        setTransactions(recent);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      }
    };
  
    if (walletAddress) {
      loadTransactions();
    }
  }, [walletAddress]);
  
  const filterTransactions = (filter: FilterOption) => {
    setActiveFilter(filter);
  
    if (filter === 'all') {
      setTransactions(allTransactions);
    } else if (filter === 'sent') {
      setTransactions(allTransactions.filter(t => t.type === 'send'));
    } else if (filter === 'received') {
      setTransactions(allTransactions.filter(t => t.type === 'receive'));
    }
  };

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) {
      return 'Invalid date'; // Handle undefined or null timestamp
    }
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid date'; // Handle invalid date
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    if (amount === undefined || amount === null) {
      return 'Invalid amount';
    }
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  const shortenAddress = (address: string): string => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.grey[900]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={Colors.grey[900]} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity
            style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]}
            onPress={() => filterTransactions('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, activeFilter === 'sent' && styles.activeFilterTab]}
            onPress={() => filterTransactions('sent')}
          >
            <Text style={[styles.filterText, activeFilter === 'sent' && styles.activeFilterText]}>
              Sent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, activeFilter === 'received' && styles.activeFilterTab]}
            onPress={() => filterTransactions('received')}
          >
            <Text style={[styles.filterText, activeFilter === 'received' && styles.activeFilterText]}>
              Received
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {transactions.length > 0 ? (
          transactions.map((transaction,  index) => (
            <TouchableOpacity 
            key={transaction.id || index} 
              style={styles.transactionCard}
              onPress={() => {
                // Handle transaction details view
              }}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: transaction.type === 'send' ? Colors.error.light : Colors.success.light }
              ]}>
                {transaction.type === 'send' ? (
                  <ArrowUp size={20} color={Colors.error.main} />
                ) : (
                  <ArrowDown size={20} color={Colors.success.main} />
                )}
              </View>

              <View style={styles.transactionInfo}>
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionTitle}>
                    {transaction.type === 'send' ? 'Sent to ' : 'Received from '}
                    <Text style={styles.contactName}>
                      {transaction.contactName || shortenAddress(transaction.sender)}
                    </Text>
                  </Text>
                  <Text style={[
                    styles.amount,
                    { color: transaction.type === 'send' ? Colors.error.main : Colors.success.main }
                  ]}>
                    {transaction.type === 'send' ? '-' : '+'}
                    {formatAmount(transaction.amount/(10 ** 6))}
                  </Text>
                </View>

                <View style={styles.transactionFooter}>
                  <Text style={styles.date}>{formatDate(transaction.timestamp)}</Text>
                  {/* <Text style={styles.fee}>Fee: {formatAmount(transaction.fee)}</Text> */}
                </View>

                {transaction.note && (
                  <Text style={styles.note}>{transaction.note}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
    paddingTop: Platform.select({ web: 40, default: 60 }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layouts.spacing.xl,
    paddingBottom: Layouts.spacing.md,
  },
  backButton: {
    padding: Layouts.spacing.sm,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.grey[900],
  },
  filterButton: {
    padding: Layouts.spacing.sm,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layouts.spacing.lg,
    paddingBottom: Layouts.spacing.lg,
    gap: Layouts.spacing.md,
  },
  filterTab: {
    paddingHorizontal: Layouts.spacing.lg,
    paddingVertical: Layouts.spacing.sm,
    borderRadius: Layouts.borderRadius.full,
    backgroundColor: Colors.grey[100],
  },
  activeFilterTab: {
    backgroundColor: Colors.primary[700],
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.grey[600],
  },
  activeFilterText: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: Layouts.spacing.lg,
  },
  transactionCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: Layouts.borderRadius.lg,
    padding: Layouts.spacing.lg,
    marginBottom: Layouts.spacing.md,
    shadowColor: Colors.grey[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layouts.spacing.lg,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layouts.spacing.xs,
  },
  transactionTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.grey[600],
    flex: 1,
    marginRight: Layouts.spacing.md,
  },
  contactName: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.grey[900],
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.grey[500],
  },
  fee: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.grey[500],
  },
  note: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.grey[600],
    marginTop: Layouts.spacing.xs,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layouts.spacing.xxl,
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.grey[500],
  },
});