export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  fee: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  recipientAddress?: string;
  senderAddress?: string;
  note?: string;
  contactName?: string;
}