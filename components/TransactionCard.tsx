import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';
import { Transaction } from '@/types/Transaction';
import { ArrowUp, ArrowDown, RefreshCcw } from 'lucide-react-native';

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getTransactionIcon = () => {
    if (transaction.type === 'send') {
      return <ArrowUp size={20} color="white" />;
    } else if (transaction.type === 'receive') {
      return <ArrowDown size={20} color="white" />;
    } else {
      return <RefreshCcw size={20} color="white" />;
    }
  };
  
  const getTransactionIconBackgroundColor = () => {
    if (transaction.type === 'send') {
      return Colors.primary[700];
    } else if (transaction.type === 'receive') {
      return Colors.success.main;
    } else {
      return Colors.warning.main;
    }
  };
  
  const getTransactionTitle = () => {
    if (transaction.type === 'send') {
      return `Sent USDC ${transaction.contactName ? `to ${transaction.contactName}` : ''}`;
    } else if (transaction.type === 'receive') {
      return `Received USDC ${transaction.contactName ? `from ${transaction.contactName}` : ''}`;
    } else {
      return 'Exchanged USDC';
    }
  };
  
  const getTransactionAmount = () => {
    if (transaction.type === 'send') {
      return `-${transaction.amount.toFixed(2)}`;
    } else if (transaction.type === 'receive') {
      return `+${transaction.amount.toFixed(2)}`;
    } else {
      return `${transaction.amount.toFixed(2)}`;
    }
  };
  
  const getTransactionAmountColor = () => {
    if (transaction.type === 'send') {
      return Colors.grey[900];
    } else if (transaction.type === 'receive') {
      return Colors.success.main;
    } else {
      return Colors.grey[900];
    }
  };
  
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: getTransactionIconBackgroundColor() }
        ]}
      >
        {getTransactionIcon()}
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{getTransactionTitle()}</Text>
        <Text style={styles.date}>{formatDate(transaction.timestamp)}</Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text 
          style={[
            styles.amount, 
            { color: getTransactionAmountColor() }
          ]}
        >
          {getTransactionAmount()} USDC
        </Text>
        <Text style={styles.status}>{transaction.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layouts.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layouts.spacing.md,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.grey[900],
    marginBottom: 2,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey[500],
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  status: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.grey[500],
    textTransform: 'capitalize',
  },
});