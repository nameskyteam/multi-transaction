# Multi Transaction
Make the construction of the transaction easier on [NEAR](https://near.org) blockchain

## Install
```shell
yarn add multi-transaction
```

## View
```ts
import { MultiSendAccount, Amount } from 'multi-transaction';
```

```ts
const msAccount = MultiSendAccount.fromAccount(account);

const amount: string = await msAccount.view({
  contractId: 'wrap.near',
  methodName: 'ft_balance_of',
  args: {
    account_id: 'alice.near'
  }
});

console.log(`Balance: ${Amount.format(amount, 'NEAR')} wNEAR`);
```

### Call
```ts
import { MultiSendAccount, Amount, Gas } from 'multi-transaction';
```

```ts
const msAccount = MultiSendAccount.fromAccount(account);

await msAccount.call({
  contractId: 'wrap.near',
  methodName: 'ft_transfer',
  args: {
    receiver_id: 'bob.near',
    amount: Amount.parse('8.88', 'NEAR')
  },
  attachedDeposit: Amount.ONE_YOCTO,
  gas: Gas.parse('10', 'T')
});
```

### Batch Transaction
```ts
import { MultiTransaction, MultiSendAccount, Amount, Gas } from 'multi-transaction';
```

```ts
const msAccount = MultiSendAccount.fromAccount(account);

// one transaction that contains two actions
const mTx = MultiTransaction
  .batch('wrap.near')
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parse('8.88', 'NEAR')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T')
  })
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'carol.near',
      amount: Amount.parse('8.88', 'NEAR')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T')
  });

await msAccount.send(mTx);
```

### Multiple Transactions
```ts
import { MultiTransaction, MultiSendAccount, Amount, Gas } from 'multi-transaction';
```

```ts
const msAccount = MultiSendAccount.fromAccount(account);

// two transactions, each contains one action
const mTx = MultiTransaction
  .batch('wrap.near')
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parse('8.88', 'NEAR')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T')
  })
  .batch('usdt.tether-token.near')
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parse('8.88', 'USDT')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T')
  });

await msAccount.send(mTx);
```

## Wallet Selector
You can replace the official `WalletSelector` with `MultiSendWalletSelector`, while keeping other usage unchanged

```ts
import { setupMultiSendWalletSelector } from 'multi-transaction';
```

```ts
const msSelector = await setupMultiSendWalletSelector({
  network: 'mainnet',
  modules: [
    /* wallet modules */
  ]
});
```

If you already use `WalletSelector` in your project

```ts
const msSelector = await setupMultiSendWalletSelector(selector);
```
