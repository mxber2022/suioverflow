export interface Contact {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
  lastTransaction?: number; // timestamp
  isFavorite: boolean;
}