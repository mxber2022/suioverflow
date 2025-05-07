// fetchReceivedUsdcTransactions.ts
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const USDC_TYPE =
  '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

export interface UsdcTransaction {
  digest: string;
  timestamp: string | null;
  sender: string;
  recipient: string;
  amount: string;
}

export async function fetchRecentTransactions(address: string): Promise<UsdcTransaction[]> {
  try {
    const response = await client.queryTransactionBlocks({
      filter: { ToAddress: address },
      options: {
        showBalanceChanges: true,
        showInput: true,
        showEffects: true,
      },
      limit: 100,
    });

    console.log("responsex: ", response);

    const filtered = response.data
      .filter((tx) =>
        tx.balanceChanges?.some(
          (change) =>
            change.owner?.AddressOwner?.toLowerCase() === address.toLowerCase() &&
            change.coinType === USDC_TYPE &&
            Number(change.amount) > 0
        )
      )
      .map((tx) => {
        const usdcChange = tx.balanceChanges!.find(
          (change) =>
            change.owner?.AddressOwner?.toLowerCase() === address.toLowerCase() &&
            change.coinType === USDC_TYPE &&
            Number(change.amount) > 0
        );

        return {
          digest: tx.digest,
          timestamp: tx.timestampMs ? new Date(Number(tx.timestampMs)).toISOString() : null,
          sender: tx.transaction?.data?.sender || 'unknown',
          recipient: usdcChange?.owner?.AddressOwner || address,
          amount: usdcChange?.amount || '0',
        };
      });

    return filtered;
  } catch (error) {
    console.error('Failed to fetch received USDC transactions:', error);
    return [];
  }
}
