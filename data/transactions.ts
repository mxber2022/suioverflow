import { Transaction } from '@/types/Transaction';

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    amount: 250.00,
    fee: 0.05,
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    status: 'completed',
    senderAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    contactName: 'Alice Johnson',
    note: 'Monthly rent',
  },
  {
    id: '2',
    type: 'send',
    amount: 75.50,
    fee: 0.02,
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    status: 'completed',
    recipientAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    contactName: 'Bob Smith',
    note: 'Dinner split',
  },
  {
    id: '4',
    type: 'send',
    amount: 32.40,
    fee: 0.01,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    status: 'completed',
    recipientAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    contactName: 'Charlie Doe',
    note: 'Coffee meetup',
  },
  {
    id: '5',
    type: 'receive',
    amount: 125.75,
    fee: 0.03,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    status: 'completed',
    senderAddress: '0x617F2E2fD72FD9D5503197092aC168c91465E7f2',
    note: 'Project payment',
  },
  {
    id: '6',
    type: 'send',
    amount: 50.00,
    fee: 0.01,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
    status: 'completed',
    recipientAddress: '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
    contactName: 'Diana Miller',
    note: 'Birthday gift',
  },
];