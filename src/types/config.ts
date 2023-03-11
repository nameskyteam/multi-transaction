import { WalletSelectorParams } from '@near-wallet-selector/core/lib/wallet-selector.types';

export interface MultiSendWalletSelectorConfig extends WalletSelectorParams {
  keyStorePrefix?: string;
}
