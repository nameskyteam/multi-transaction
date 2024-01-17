# Multi Transaction
Make the construction of the transaction easier on [NEAR](https://near.org) blockchain

## Install
```shell
yarn add multi-transaction
```

## Basic Usage
```typescript
import { MultiTransaction, MultiSendAccount, Amount, Gas } from 'multi-transaction';
```

```typescript
const account = MultiSendAccount.new(connection, accountId);
```

### Call a view method
```typescript
const amount = await account.view<string>({
  contractId: 'wrap.near',
  methodName: 'ft_balance_of',
  args: {
    account_id: 'alice.near'
  }
});

console.log(`Balance: ${Amount.format(amount, 'NEAR')} wNEAR`);
```

### Call a change method
```typescript
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

### Batch transaction
```typescript
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

await account.send(mTx);
```

### Multiple transactions
```typescript
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

await account.send(mTx);
```

## Frontend Usage
```typescript
import { setupMultiSendWalletSelector } from 'multi-transaction';
```

### Setup wallet selector

```typescript
const useWalletSelector = () => {
  const [selector, setSelector] = useState();
  
  useEffect(() => {
    setupMultiSendWalletSelector({
      network: 'mainnet',
      modules: [
        /* wallet modules */
      ]
    }).then(setSelector);
  }, []);
  
  return { selector };
}
```
