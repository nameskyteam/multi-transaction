# Multi Transaction
Make the construction of the transaction easier on [NEAR](https://near.org) blockchain

Support [near-api-js](https://github.com/near/near-api-js) and [wallet-selector](https://github.com/near/wallet-selector)

## Dependencies
```json
{
  "near-api-js": "^1.1.0",
  "@near-wallet-selector/core": "^7.9.0"
}
```

## Install
```shell
yarn add multi-transaction
```

## Usage
This package contains `MultiTransaction`, `MultiSendAccount`, `MultiSendWalletSelector` and other helpful utils.

### Backend
```typescript
import { MultiTransaction, MultiSendAccount, Amount, Gas } from "multi-transaction";
```

#### Call view function
Call view function on backend

```typescript
async function exampleCallViewFunction(near: Near) {
  const account = new MultiSendAccount(near.connection);
  
  const amount: string = await account.view({
    contractId: 'wrap.near',
    methodName: 'ft_balance_of',
    args: {
      account_id: 'alice.near'
    }
  });
  
  console.log(`Balance: ${ Amount.formatYoctoNear(amount) } NEAR`);
}
```

#### Call change function
Call change function on backend

```typescript
async function exampleCallChangeFunction(near: Near) {
  const account = new MultiSendAccount(near.connection, 'alice.near');
  
  const multiTransaction = MultiTransaction
    .createTransaction('wrap.near')
    .functionCall({
      methodName: 'ft_transfer',
      args: {
        receiver_id: 'bob.near',
        amount: Amount.parseYoctoNear('8.88')
      },
      attachedDeposit: Amount.ONE_YOCTO,
      gas: Gas.tera(10)
    });
  
  await account.send(multiTransaction);
}
```

### Frontend
```tsx
import { setupMultiSendWalletSelector, Amount, Gas } from "multi-transaction";

// Example Hook
const useWalletSelector = () => {
  const [selector, setSelector] = useState();
  
  useEffect(() => {
    if (selector) {
      return;
    }
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
#### Call view function
Call view function on frontend
```tsx
const ExampleCallViewFunction = () => {
  const { selector } = useWalletSelector();
  
  const viewWnearBalance = async () => {
    const amount: string = selector!.view({
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

#### Call change function
Call change function on frontend

```tsx
const ExampleCallChangeFunction = () => {
  const { selector } = useWalletSelector();
  
  const sendWnear = async () => {
    const multiTransaction = MultiTransaction
      .createTransaction('wrap.near')
      .ft_transfer({
        args: {
          receiver_id: 'bob.near',
          amount: Amount.parseYoctoNear(8.88)
        },
        gas: Gas.tera(10)
      });
    await selector!.send(multiTransaction);
  };
  
  return (
    <button onclick={sendWnear}>
      Send 8.88 wNEAR to Bob
    </button>
  );
}
```

### Construct complex transactions
`MultiTransaction` allow you to construct complex multiple transactions (not only multiple actions)

```typescript
async function exampleConstructComplexTransactions(near: Near) {
  const account = new MultiSendAccount(near.connection, 'alice.near');
  
  const multiTransaction = MultiTransaction
    // 1st transaction for creating account
    .createTransaction('honey.alice.near')
    .createAccount()
    .transfer(Amount.parseYoctoNear('0.1'))
    .addKey('ed25519:<data>', { permission: 'FullAccess' })
    // 2nd transaction for sending USDT.e
    .appendTransaction('dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near')
    .storage_deposit({
      args: {
        account_id: 'honey.alice.near'
      },
      attachedDeposit: Amount.parseYoctoNear('0.0125'),
    })
    .ft_transfer({
      args: {
        receiver_id: 'honey.alice.near',
        amount: Amount.parse(888, 6).toFixed(),
        memo: 'Happy Birthday'
      },
    });
  
  await account.send(multiTransaction);
}
```

### Manual Convert Transactions
Maybe you don't want to use `MultiSendAccount` or `MultiSendWalletSelector`, you can convert transactions manually

```typescript
import { MultiTransaction, parseNearApiJsTransactions, parseNearWalletSelectorTransactions } from "multi-transaction";

// Backend
async function exampleManualConvertToNearApiJsTransactions(near: Near, multiTransaction: MultiTransaction) {
  const account = await near.account('alice.near');
  const transactions = parseNearApiJsTransactions(multiTransaction);

  for (const transaction of transactions) {
    // Won't call as `account.signAndSendTransaction` because it is a protected method.
    await account['signAndSendTransaction'](transaction);
  }
}

// Frontend
async function exampleManualConvertToNearWalletSelectorTransactions(selector: WalletSelector, multiTransaction: MultiTransaction) {
  const wallet = await selector.wallet();
  const transactions = parseNearWalletSelectorTransactions(multiTransaction);

  if (transactions.length === 1) {
    // `signAndSendTransactions` doesn't use login key, so if transaction is not multiple, we suggest to use 
    // `signAndSendTransaction` instead.
    await wallet.signAndSendTransaction(transactions[0]);
  } else {
    await wallet.signAndSendTransactions({ transactions });
  }
}
```
