# Multi Transaction Core
Multi Transaction implementation. This package is usually used with [@multi-transaction/account](../account/README.md) or [@multi-transaction/wallet-selector](../wallet-selector/README.md)

## Install
```shell
pnpm add @multi-transaction/core
```

## Examples
```ts
import { MultiTransaction, Amount, Gas } from '@multi-transaction/core';
```

Normal Transaction (i.e. one transaction that contains one action)
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

console.log(mTransaction.toTransactions());
```

Batch transaction (i.e. one transaction that contains multiple actions)
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

console.log(mTransaction.toTransactions());
```

Multiple transactions (i.e. multiple transactions and each contains one or more actions)
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
  })
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'carol.near',
      amount: Amount.parse('8.88', 'NEAR')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T')
  })
  .batch('usdt.tether-token.near')
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'david.near',
      amount: Amount.parse('8.88', 'USDT')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T')
  });

console.log(mTransaction.toTransactions());
```
