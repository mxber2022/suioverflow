import { Contact } from '@/types/Contact';

export const CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    lastTransaction: Date.now() - 1000 * 60 * 60 * 24 * 2,
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    walletAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    lastTransaction: Date.now() - 1000 * 60 * 60 * 24 * 5,
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Charlie Doe',
    walletAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    lastTransaction: Date.now() - 1000 * 60 * 60 * 24 * 7,
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Diana Miller',
    walletAddress: '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
    lastTransaction: Date.now() - 1000 * 60 * 60 * 24 * 10,
    isFavorite: false,
  },
  {
    id: '5',
    name: 'Ethan Williams',
    walletAddress: '0x617F2E2fD72FD9D5503197092aC168c91465E7f2',
    isFavorite: false,
  },
  {
    id: '6',
    name: 'Fiona Garcia',
    walletAddress: '0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C',
    isFavorite: false,
  },
];