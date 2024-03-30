# Multi Transaction
Make the construction of the transaction easier on [NEAR](https://near.org) blockchain

## Install
```shell
pnpm add multi-transaction
```

## Multi Transaction
```ts
import { MultiTransaction, Amount, Gas } from 'multi-transaction';
```

```ts
const mTransaction = MultiTransaction
  .batch('wrap.near')
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parse('8.88', 'NEAR')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T')
  });

console.log(mTransaction);
```

More usage about [MultiTransaction](packages/core/README.md)

## Multi Send Account
```ts
import { MultiSendAccount, Amount, Gas } from 'multi-transaction';
```

```ts
const account = MultiSendAccount.new(connection, 'alice.near');
```

```ts
await account.send(mTransaction);
```

More usage about [MultiSendAccount](packages/account/README.md)

## Multi Send Wallet Selector
```ts
import { setupMultiSendWalletSelector } from 'multi-transaction';
```

```ts
const selector = await setupMultiSendWalletSelector({
  network: 'mainnet',
  modules: [
    /* wallet modules */
  ]
});
```

```ts
await selector.send(mTransaction);
```

More usage about [MultiSendWalletSelector](packages/wallet-selector/README.md)
