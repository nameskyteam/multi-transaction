# Multi Transaction
Make the construction of the transaction easier on [NEAR](https://near.org) blockchain

Support [near-api-js](https://github.com/near/near-api-js) and [wallet-selector](https://github.com/near/wallet-selector)

## Install
```shell
yarn add multi-transaction
```

## Usage ( Base )

### Prepare
```typescript
import { MultiSendAccount } from "multi-transaction";
import { Near, keyStores, KeyPair } from "near-api-js";
```

```typescript
const networkId = 'mainnet';
const nodeUrl = 'https://rpc.mainnet.near.org';
const accountId = 'alice.near';
const keyPair = KeyPair.fromString('ed25519:<PRIVATE_KEY>');

const keyStore = new keyStores.InMemoryKeyStore();
await keyStore.setKey(networkId, accountId, keyPair);

const near = new Near({ networkId, nodeUrl, keyStore });
const account = MultiSendAccount.new(near.connection, accountId);
```

### Call a view only function
```typescript
import { Amount } from "multi-transaction";
```

```typescript
const amount = await account.view<string>({
  contractId: 'wrap.near',
  methodName: 'ft_balance_of',
  args: {
    account_id: 'alice.near'
  }
});

console.log(`Balance: ${ Amount.formatYoctoNear(amount) } NEAR`);
```

### Call a change function
```typescript
import { MultiTransaction, Gas, Amount } from "multi-transaction";
```

```typescript
const mTx = MultiTransaction
  .batch('wrap.near')
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parseYoctoNear('8.88')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.tera(10)
  });

await account.send(mTx);
```

### Batch transaction
```typescript
// a transaction that contains two actions
const mTx = MultiTransaction
  .batch('wrap.near')
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parseYoctoNear('8.88')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.tera(10)
  })
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'mike.near',
      amount: Amount.parseYoctoNear('8.88')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.tera(10)
  });

await account.send(mTx);
```

### Multiple transactions
```typescript
const USDT_DECIMALS = 6;

// two transactions, each contains one action
const mTx = MultiTransaction
  .batch('wrap.near')
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parseYoctoNear('8.88')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.tera(10)
  })
  .batch('usdt.tether-token.near')
  .functionCall({
    methodName: 'ft_transfer',
    args: {
      receiver_id: 'bob.near',
      amount: Amount.parse('8.88', USDT_DECIMALS).toFixed()
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.tera(10)
  });

await account.send(mTx);
```

### Complex transactions
```typescript
const USDT_DECIMALS = 6;

const mTx = MultiTransaction
  // First transaction: create account for honey
  .batch('honey.alice.near', 'alice.near')
  .createAccount()
  .transfer(Amount.parseYoctoNear('0.1'))
  .addKey('ed25519:<PUBLIC_KEY>', { permission: 'FullAccess' })
  // Second transaction: send 1000 USDT to honey
  .batch('usdt.tether-token.near')
  .nep145.storage_deposit({
    args: {
      account_id: 'honey.alice.near'
    },
    attachedDeposit: Amount.parseYoctoNear('0.00125')
  })
  .nep141.ft_transfer({
    args: {
      receiver_id: 'honey.alice.near',
      amount: Amount.parse('1000', USDT_DECIMALS).toFixed()
    }
  })

await account.send(mTx);
```

## Usage ( Frontend )

### Prepare
```typescript
import { setupMultiSendWalletSelector } from "multi-transaction";
import { useEffect, useState } from 'react';
```

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

### Call a view only function
```tsx
const Example = () => {
  const { selector } = useWalletSelector();
  
  const viewWnearBalance = async () => {
    if (!selector) {
      return
    };
    
    const amount = selector.view<string>({
      contractId: 'wrap.near',
      methodName: 'ft_balance_of',
      args: {
        account_id: 'alice.near'
      }
    });
    
    console.log(`Balance: ${ Amount.formatYoctoNear(amount) } NEAR`);
  };
  
  return (
    <button onclick={viewWnearBalance}>
      View Alice's wNEAR balance
    </button>
  );
}
```

### Call a change function
```tsx
const Example = () => {
  const { selector } = useWalletSelector();
  
  const sendWnear = async () => {
    if (!selector) {
      return
    };
    
    const mTx = MultiTransaction
      .batch('wrap.near')
      .functionCall({
        methodName: 'ft_transfer',
        args: {
          receiver_id: 'bob.near',
          amount: Amount.parseYoctoNear('8.88')
        },
        attachedDeposit: Amount.ONE_YOCTO,
        gas: Gas.tera(10)
      });
    
    await selector.send(mTx);
  };
  
  return (
    <button onclick={sendWnear}>
      Send 8.88 wNEAR to Bob
    </button>
  );
}
```
