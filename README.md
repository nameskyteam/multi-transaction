# Make the construction of the transaction easier on NEAR blockchain

Support [near-api-js](https://github.com/near/near-api-js) and [wallet-selector](https://github.com/near/wallet-selector)

## Usage and Examples
This package works with three major class `MultiTransaction`, `MultiSendAccount`, `MultiSendWalletSelector`
```typescript
import { MultiTransaction, MultiSendAccount, setupMultiSendWalletSelector, Amount, Gas } from "multi-transaction";
```
### Example call a view function
```typescript
async function exampleCallViewFunction(near: Near) {
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

### Example call a change function
```typescript
async function exampleCallChangeFunction(near: Near) {
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

### Example send complex transactions
```typescript
async function exampleSendComplexTransactions(near: Near) {
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

### Example use wallet selector
```tsx
const useWalletSelector = () => {
  const [ selector, setSelector ] = useState()
  
  useEffect(() => {
    if (selector) {
      return
    }
    setupMultiSendWalletSelector({
      network: 'mainnet',
      modules: [
        /* wallet modules */
      ]
    }).then(setSelector)
  }, [])
  
  return { selector }
}

const ExampleComponent = () => {
  const { selector } = useWalletSelector()
  
  const exampleSendWnear = async () => {
    const transaction = MultiTransaction
      .createTransaction('wrap.near')
      .ft_transfer({
        args: {
          receiver_id: 'bob.near',
          amount: Amount.parseYoctoNear(8.88)
        }
      })
    await selector!.send(transaction)
  }
  
  return (
    <button onclick={exampleSendWnear}>
      Example Button
    </button>
  )
}
```
