# Multi Transaction Wallet Selector
Multi Transaction Wallet Selector implementation

## Install
```shell
pnpm add @multi-transaction/core @multi-transaction/wallet-selector
```

## Examples
```ts
import { MultiTransaction, Amount, Gas } from '@multi-transaction/core';
import { setupMultiSendWalletSelector } from '@multi-transaction/wallet-selector';
```

```ts
const selector = await setupMultiSendWalletSelector({
  network: 'mainnet',
  modules: [
    /* wallet modules */
  ],
});
```

### Send Transaction(s)
```ts
const mTransaction = MultiTransaction
  .batch('wrap.near')
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parse('8.88', 'NEAR'),
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T'),
  });

await selector.send(mTransaction);
```

### Call Contract Method
```ts
await selector.call({
  contractId: 'wrap.near',
  methodName: 'ft_transfer',
  args: {
    receiver_id: 'bob.near',
    amount: Amount.parse('8.88', 'NEAR'),
  },
  attachedDeposit: Amount.ONE_YOCTO,
  gas: Gas.parse('10', 'T'),
});
```

### View Contract Method
```ts
const amount: string = await selector.view({
  contractId: 'wrap.near',
  methodName: 'ft_balance_of',
  args: {
    account_id: 'alice.near',
  },
});
```
