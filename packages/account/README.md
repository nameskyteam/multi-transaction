# Multi Transaction Account
Multi Transaction Account implementation

## Install
```shell
pnpm add @multi-transaction/core @multi-transaction/account
```

## Examples
```ts
import { MultiTransaction, Amount, Gas } from '@multi-transaction/core';
import { MultiSendAccount } from '@multi-transaction/account';
```

```ts
const account = MultiSendAccount.new(connection, 'alice.near');
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

await account.send(mTransaction);
```

### Call Contract Method
```ts
await account.call({
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
const amount: string = await account.view({
  contractId: 'wrap.near',
  methodName: 'ft_balance_of',
  args: {
    account_id: 'alice.near',
  },
});

console.log(`Balance: ${Amount.format(amount, 'NEAR')} wNEAR`);
```
