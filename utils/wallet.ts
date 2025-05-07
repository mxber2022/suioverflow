// helpers/wallet.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchRecentTransactions } from './fetchRecentTransactions';

export const getStoredWalletAddress = async (): Promise<string | null> => {
  try {
    const address = await AsyncStorage.getItem('zkLoginAddress');
    return address;
  } catch (err) {
    console.error('Failed to load wallet address:', err);
    return null;
  }
};

export const loadTransactionsForAddress = async (address: string) => {
  try {
    const recent = await fetchRecentTransactions(address);
    return recent;
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
    return [];
  }
};
