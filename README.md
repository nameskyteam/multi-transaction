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
const account = MultiSendAccount.new(near.connection);

const amount: string = await account.view({
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
const account = MultiSendAccount.new(near.connection, 'alice.near');

await account.call({
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
const account = MultiSendAccount.new(near.connection, 'alice.near');

// one transaction that contains two actions
const mTransaction = MultiTransaction
  .batch({ receiverId: 'wrap.near' })
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

await account.send(mTransaction);
```

### Multiple Transactions
```ts
import { MultiTransaction, MultiSendAccount, Amount, Gas } from 'multi-transaction';
```

```ts
const account = MultiSendAccount.new(near.connection, 'alice.near');

// two transactions, each contains one action
const mTransaction = MultiTransaction
  .batch({ receiverId: 'wrap.near' })
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parse('8.88', 'NEAR')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T')
  })
  .batch({ receiverId: 'usdt.tether-token.near' })
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parse('8.88', 'USDT')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T')
  });

await account.send(mTransaction);
```

## Wallet Selector
You can replace the official `WalletSelector` with `MultiSendWalletSelector` while keeping other usage unchanged

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
