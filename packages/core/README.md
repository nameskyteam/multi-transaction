# Multi Transaction Core
Multi Transaction Core implementation

## Install
```shell
pnpm add @multi-transaction/core
```

## Examples
```ts
import { MultiTransaction, Amount, Gas } from '@multi-transaction/core';
```

### Normal Transaction
One transaction that contains one action
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
    gas: Gas.parse('10', 'T'),
  });
```

### Batch Transaction
One transaction that contains multiple actions
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
  })
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'carol.near',
      amount: Amount.parse('8.88', 'NEAR'),
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T'),
  });
```

### Multiple Transactions
Multiple transactions and each contains one or more actions
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
  })
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'carol.near',
      amount: Amount.parse('8.88', 'NEAR'),
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T'),
  })
  .batch('usdt.tether-token.near')
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'david.near',
      amount: Amount.parse('8.88', 'USDT'),
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.parse('10', 'T'),
  });
```

### Fungible Token Transaction
```ts
const mTransaction = MultiTransaction
  .batch('wrap.near')
  .ft.transfer({
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parse('8.88', 'NEAR'),
    },
  });
```

### Non-Fungible Token Transaction
```ts
const mTransaction = MultiTransaction
  .batch('core.namesky.near')
  .nft.transfer({
    args: {
      receiver_id: 'bob.near',
      token_id: 'apple.near',
    },
  });
```

### Storage Management Transaction
```ts
const mTransaction = MultiTransaction
  .batch('wrap.near')
  .storage.deposit({ 
    attachedDeposit: Amount.parse('0.01', 'NEAR'),
  });
```
