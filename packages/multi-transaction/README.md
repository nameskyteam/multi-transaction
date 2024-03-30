# Multi Transaction
Make the construction of the transaction easier on [NEAR](https://near.org) blockchain

## Install
```shell
pnpm add multi-transaction
```

This package includes following sub packages, you can also install with your needs

```shell
pnpm add @multi-transaction/core
```

```shell
pnpm add @multi-transaction/account
```

```shell
pnpm add @multi-transaction/wallet-selector
```

## MultiTransaction
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
      amount: Amount.parse('8.88', 'NEAR'),
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T'),
  });

console.log(mTransaction.toTransactions());
```

More information about [MultiTransaction](../core/README.md)

## MultiSendAccount
```ts
import { MultiSendAccount } from 'multi-transaction';
```

```ts
const account = MultiSendAccount.new(connection, 'alice.near');
```

```ts
await account.send(mTransaction);
```

More information about [MultiSendAccount](../account/README.md)

## MultiSendWalletSelector
```ts
import { setupMultiSendWalletSelector } from 'multi-transaction';
```

```ts
const selector = await setupMultiSendWalletSelector({
  network: 'mainnet',
  modules: [
    /* wallet modules */
  ],
});
```

```ts
await selector.send(mTransaction);
```

More information about [MultiSendWalletSelector](../wallet-selector/README.md)
