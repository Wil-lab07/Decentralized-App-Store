# Decentralized-App-Store

## IF671-A Blockchain & Cryptocurrency Universitas Multimedia Nusantara

- Name : William Chandra
- NIM : 00000034995

## Project Overview

Decentralized App Store merupakan aplikasi yang menyediakan platform jual beli online terdesentralisasi yang berjalan pada blockchain EVM testnet yaitu Ropsten Testnet. Pada dApps ini, user membeli barang yang tersedia pada aplikasi tersebut dengan mata uang currency yaitu Eth. User yang sudah membeli dan melakukan pembayaran melalui platform ini akan diberi NFT sebagai reward. NFT tersebut dapat dicek pada aplikasi Metamask mobile.

Pada aplikasi tersebut, akan ada 2 jenis user yang berperan yaitu:
- Owner/Admin: sebagai orang yang akan menconfirm apakah barang yang dipesan user sudah sampai atau belum.
- Buyer/User: sebagai orang yang membeli barang pada aplikasi tersebut.

Aplikasi ini juga telah menerapkan 4 fitur utama yaitu: 
- Byzantine Fault Tolerance: dikarenakan aplikasi ini telah mengimplementasikan blockchain berbasis EVM, sehingga Byzantine Fault Tolerance sudah diterapkan pada aplikasi ini.
- No Choke Point: blockchain berbasis EVM memiliki fitur backend yaitu smart contract dan seperti yang telah diketahui bahwa data yang tersimpan pada smart contract yang telah dideploy ke Ropsten testnet secara langsung tersimpan juga pada Blockchain tersebut, sehingga data tersebut terdistribusi dan terdesentralisasi yang menghilangkan sifat single point of failure pada aplikasi ini.
- Transparent: smart contract yang telah terdeploy tentu akan menjadi transparant dan setiap transaksi yang ada pada contract tersebut dapat diakses melalui https://ropsten.etherscan.io. Seperti contoh: https://ropsten.etherscan.io/address/0x9807080eb749a38A033abDf50175F5B048c8d1D2
![image](https://user-images.githubusercontent.com/79161142/145343325-e9fa3a0d-8212-45d6-8835-cad107422128.png)
- Scalable: dApps ini mengimplementasikan blockchain berbasis EVM sehingga, walaupun smart contract saat ini masih terdeploy pada Ethereum testnet yaitu Rospten. EVM memampukan juga untuk mendeploy ke jaringan yang lebih scalable seperti Polygon, binance, ataupun Avalanche. Sehingga bisa dipastikan blockchain berbasis EVM ini scalable tergantung jaringan mana yang digunakan pada saat mendeploy smart contract.

## Library and Tools

### Frontend and Styling
- React.js
- Tailwind CSS
- react-toastify
- Chakra UI

### Smart Contract Development & Testing
- Remix IDE
- Hardhat 

### Client Interaction with Smart Contract
- ethers.js
- useDApp

## Quickstart

Melakukan Clone project dari github

```
git clone https://github.com/Wil-lab07/Decentralized-App-Store.git
```

Kemudian install semua dependency

```
cd Decentralized-App-Store
npm install
```

Setelah itu, melakukan compile smart contract untuk menghasilkan artifacts

```
npx hardhat compile
```

Kemudian jalankan aplikasi
```
npm start
```

## Smart Contract Deployment Script
Pada deployment smart contract, akan dilakukan sebanyak tiga kali yaitu mendeploy contract nft, contract pembelian, dan menginitial state address contract pembelian ke contract nft.

Ketika akan melakukan deploy smart contract ke Ropsten Testnet dengan mengeksekusi file deployStoreNFT.js terlebih dahulu pada folder scripts

```
npx hardhat run scripts/deployStoreNFT.js
```

Kemudian mengeksekusi file deployStore.js

```
npx hardhat run scripts/deployStore.js
```

Setelah itu mengeksekusi initialState.js yang bertujuan untuk memasukkan address contract store.sol ke contract storeNFT.sol sehingga dari smart contract store.sol dapat memanggil fungsi storeNFT.sol untuk minting NFT.

```
npx hardhat run scripts/initialState.js
```

Catatan: pada dApps ini, smart contract telah di-deploy ke Ropsten Testnet sehingga anda tidak perlu menjalankan script ini lagi.

- deployStoreNFT.js

``` javascript
const hre = require('hardhat')

async function main() {
    const StoreNFT = await hre.ethers.getContractFactory("StoreNFT")
  
    // Start deployment, returning a promise that resolves to a contract object
    const storeNFT = await StoreNFT.deploy()
  
    await storeNFT.deployed()
  
    console.log("Contract deployed to address:", storeNFT.address)
}
  
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```

- deployStore.js

``` javascript
require('dotenv/config')
const hre = require("hardhat")

async function main(){
    const Store = await hre.ethers.getContractFactory("Store")
    const store = await Store.deploy(process.env.STORENFT_CONTRACT);

    await store.deployed()

    console.log("Store is deployed to:", store.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  
```

- initialState.js

``` javascript
require('dotenv/config')
const DEV_API_URL = process.env.DEV_API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

const {createAlchemyWeb3} = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(DEV_API_URL)

const contract = require("../src/artifacts/contracts/StoreNFT.sol/StoreNFT.json")
const contractAddress = process.env.STORENFT_CONTRACT
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function addContractCaller(StoreAddress) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce
  
    //the transaction
    const tx = {
      from: PUBLIC_KEY,
      to: contractAddress,
      nonce: nonce,
      gas: 500000,
      data: nftContract.methods.addContractCaller(StoreAddress).encodeABI(),
    }
  
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    signPromise
      .then((signedTx) => {
        web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          function (err, hash) {
            if (!err) {
              console.log(
                "The hash of your transaction is: ",
                hash,
                "\nCheck Alchemy's Mempool to view the status of your transaction!"
              )
            } else {
              console.log(
                "Something went wrong when submitting your transaction:",
                err
              )
            }
          }
        )
      })
      .catch((err) => {
        console.log("Promise failed:", err)
      })
}
addContractCaller(process.env.STORE_CONTRACT)
```

## Interacting with Blockchain from Client-side

Pada dApps ini, library useDapp digunakan untuk membangun interaksi antara client-side dan blockchain. UseDapp adalah library yang menyediakan React Hooks khusus sehingga dapat digunakan untuk berinteraksi dengan blockchain.

Sebelum menggunakan dApps, terdapat beberapa variable yang harus dideclare terlebih dahulu yaitu contract ABI, contract Address, yang kemudian digunakan untuk menghubungkan ke smart contract. 

``` javascript
const StoreABI = new utils.Interface(Store.abi) 
const StoreAddress = process.env.REACT_APP_STORE_CONTRACT 
const contract = new Contract(StoreAddress, StoreABI)
```

### Connect Metamask Wallet to the Client-side Application

Dalam penggunaan dApps, tentu akan melibatkan wallet untuk melakukan proses transaksi pada aplikasi tersebut. Disini wallet yang kita gunakan ialah Metamask. 

Dalam menghubungkan client-side ke metamask, memerlukan 2 komponen library useDApp yaitu:
- activateBrowserWallet: berfungsi dalam membuka metamask window dan menghubungkan wallet mereka dengan dApps kita.

- account: merupakan alamat wallet yang saat ini terhubung dengan metamask.

- useEtherBalance: bertujuan untuk mendapatkan balance dari alamat wallet yang saat ini terhubung dengan metamask.

``` javascript
// menghubungkan ke metamask
const {activateBrowserWallet, account } = useEthers();

// mendapatkan balance
const etherBalance = useEtherBalance(account);
```

### Getting Value from Smart Contract (public attribute or getter function)

Dalam mendapatkan data atau value dari smartContract, useContractCall digunakan untuk memanggil function pada smart contract. Pada kali ini akan dimanfaatkan abi, alamat, dan metode yang dipanggil dan kemudian mengembalikan nilai dari smart contract.

``` javascript
  const itemLength = useContractCall({
    abi: StoreABI,
    address: StoreAddress,
    method: "getItemLength",
    args: [],
  }) ?? [];
```

### Execute Operation in Smart Contract Function

Dalam mengeksekusi function pada smart contract, kita akan menggunakan salah satu komponen useDapp yaitu "useContractFunction". UseContractFunction melibatkan dua argument yaitu state dan send.

- state: merupakan argumen yang bertujuan untuk memberikan informasi status transaksi. Apakah transaksi tersebut sukses atau gagal.

- send: merupakan argumen yang berguna dalam memanggil function pada smart contract. Penggunaan send dimampukan untuk mengirim value (ETH) ke contract tersebut ketika kita melakukan pembayaran. 

``` javascript
const { state, send } = useContractFunction(contract, 'buyStore', { transactionName: 'buyStore'})

await send(index, nftList[nftIndex], {value: utils.parseEther(price.toString())});
```

## How to use the dApp

Pastikan telah terinstall metamask pada browser extention anda. Jika belum, maka dapat menginstall melalui tautan berikut ini: https://metamask.io/

![image](https://user-images.githubusercontent.com/79161142/145342096-596661b7-d65f-462b-950f-511efca8b82c.png)

Kemudian, pilih lah network Ropsten dan pastikan terdapat jumlah balance (ETH) yang cukup untuk melakukan transaksi pada aplikasi ini. 























