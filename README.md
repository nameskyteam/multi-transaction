# Make the construction of the transaction easier on NEAR blockchain

Support [near-api-js](https://github.com/near/near-api-js) and [wallet-selector](https://github.com/near/wallet-selector)

## Usage

### View function example
```typescript
import { Amount, MultiSendAccount } from "multi-transaction";
import { Near } from "near-api-js";

// View wNEAR balance of Alice
async function viewFunctionExample(near: Near) {
  const account = new MultiSendAccount(near.connection)
  
  const amount: string = await account.view({
    contractId: 'wrap.near',
    methodName: 'ft_balance_of',
    args: {
      account_id: 'alice.near'
    }
  })
  
  console.log(`Balance: ${ Amount.formatYoctoNear(amount) } NEAR`)
}
```

### Change function example
```typescript
import { Amount, Gas, MultiSendAccount, MultiTransaction } from "multi-transaction";
import { Near } from "near-api-js";

// Alice sends 8.88 wNEAR to Bob
async function changeFunctionExample(near: Near) {
  const account = new MultiSendAccount(near.connection, 'alice.near')
  
  const transaction = MultiTransaction
    .createTransaction('wrap.near')
    .functionCall({
      methodName: 'ft_transfer',
      args: {
        receiver_id: 'bob.near',
        amount: Amount.parseYoctoNear('8.88')
      },
      attachedDeposit: Amount.ONE_YOCTO,
      gas: Gas.tera(20)
    })
  
  await account.send(transaction)
}
```

### Complex transaction example
```typescript
import { Amount, MultiSendAccount, MultiTransaction } from "multi-transaction";
import { Near } from "near-api-js";

// Alice creates an account for her honey and send 888 USDT.e to this account as birthday gift
async function complexTransactionExample(near: Near) {
  const account = new MultiSendAccount(near.connection, 'alice.near')
  
  const transaction = MultiTransaction
    // 1st transaction for creating account
    .createTransaction('honey.alice.near')
    .createAccount()
    .transfer(Amount.parseYoctoNear('0.1'))
    .addKey('ed25519:<data>', { permission: 'FullAccess' })
    // 2nd transaction for sending funds
    .createTransaction('dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near')
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
    })
  
  await account.send(transaction)
}
```

### With Wallet Selector
```typescript
import { Amount, MultiTransaction } from "multi-transaction";
import { WalletSelector } from "@near-wallet-selector/core";

// Sends 8.88 wNEAR to Bob
async function withWalletSelectorExample(selector: WalletSelector) {
  const wallet = await selector.wallet()
  
  const transaction = MultiTransaction
    .createTransaction('wrap.near')
    .ft_transfer({
      args: {
        receiver_id: 'bob.near',
        amount: Amount.parseYoctoNear(8.88)
      }
    })
  
  await wallet.signAndSendTransactions({
    transactions: transaction.toNearWalletSelectorTransactions()
  })
}
```
