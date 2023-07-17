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
import { Near, keyStores } from "near-api-js";
import path from "path";
import os from "os";
```

```typescript
const near = new Near({
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  keyStore: new keyStores.UnencryptedFileSystemKeyStore(path.join(os.homedir(), '.near-credentials'))
});

const account = new MultiSendAccount(near.connection, 'alice.near');
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
import { MultiTransaction, Gas } from "multi-transaction";
```

```typescript
const tx = MultiTransaction
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

await account.send(tx);
```

### Batch transaction
```typescript
// a transaction that contains two actions
const tx = MultiTransaction
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

await account.send(tx);
```

### Multiple transactions
```typescript
// two transactions, each contains one action
const txs = MultiTransaction
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
      amount: Amount.parseYoctoNear('8.88')
    },
    attachedDeposit: Amount.ONE_YOCTO,
    gas: Gas.tera(10)
  });

await account.send(txs);
```

## Usage ( With Wallet Selector )

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
    
    const tx = MultiTransaction
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
    
    await selector.send(tx);
  };
  
  return (
    <button onclick={sendWnear}>
      Send 8.88 wNEAR to Bob
    </button>
  );
}
```
