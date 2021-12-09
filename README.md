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

### Notes
- Untuk mendapatkan private key dan public key admin pada dApps ini, terdapat pada file .env yang terupload pada github ini.

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

Ketika memasuki halaman website, akan ditampilkan halaman seperti ini dibawah ini. Tampilan halaman ini menandakan bahwa user belum menghubungkan website mereka dengan metamask sehingga untuk menghubungkannya, silahkan tekan tombol wallet. 

![image](https://user-images.githubusercontent.com/79161142/145349401-7dd17df6-83ed-4d04-911d-80a8149a9c89.png)

![image](https://user-images.githubusercontent.com/79161142/145349924-aa90f23e-61af-4d56-b448-4facfd97cac6.png)

Kemudian, pilih lah network Ropsten dan pastikan terdapat jumlah balance (ETH) yang cukup untuk melakukan transaksi pada aplikasi ini. 

![image](https://user-images.githubusercontent.com/79161142/145351143-f51096d3-af95-4319-bbf6-ef6f9959a9dc.png)

### User Page

Jika alamat wallet yang dihubungkan bukan alamat owner alias buyer/user, maka akan ditampilkan halaman seperti berikut ini.

![image](https://user-images.githubusercontent.com/79161142/145351330-a80919e9-dc92-4b49-83a0-21cb7781cd59.png)

- Buy Object
User dapat membeli satu item yang tertera pada halaman tersebut dengan menekan tombol buy. Ketika menekan tombol buy, popup metamask dengan harga yang akan dibayar secara langsung muncul. Untuk melakukan transaksi tersebut, silahkan tekan confirm. 

![image](https://user-images.githubusercontent.com/79161142/145351637-1fa40fc1-4d77-4bbe-8de1-71d77ffac637.png)

Berikut adalah fungsi dari smart contract yang melaksanakan proses pembelian dan pembayaran.

``` solidity
function buyStore(uint _index, string memory _metadataURL) payable public returns(string memory message, uint256){
    StoreNFT storeNFT = StoreNFT(nftAddress);
    uint nft;

    if(item[_index].qty == 0){
        message = "Maaf barang yang anda pesan telah habis";
    }
    else if((msg.sender).balance < item[_index].price){
        message = "Maaf saldo anda tidak mencukupi";
    }
    else if((msg.value) < item[_index].price){
        message = "Maaf value yang anda berikan tidak memenuhi";
    }
    else{
        nft = storeNFT.mintNFT(msg.sender, _metadataURL);
        payable (address(this)).transfer(msg.value);  

        item[_index].qty -= 1;

        LedgerSchema memory temp_struct;

        temp_struct.user = msg.sender;
        temp_struct.name = item[_index].name;
        temp_struct.price = item[_index].price;
        temp_struct.imageUrl = item[_index].imageUrl;
        temp_struct.deskripsi = item[_index].deskripsi;
        temp_struct.status = false;
        temp_struct.chainID = nft;

        history.push(temp_struct);

        realHistory.push(temp_struct);

        message = "Pembayaran Berhasil";
    }
    return (message, nft);
}
```

Setelah itu, tunggu hingga transaksi selesai. Jika sudah selesai maka akan muncul toast pada pojok kanan bawah seperti gambar berikut ini. 

![image](https://user-images.githubusercontent.com/79161142/145352844-0962eeaf-0f6f-4d7a-8635-8f8b2d56ff1a.png)

Secara langsung, balance yang terlihat pada website di pojok kiri atas dan juga quantities (qty) yang ada pada card akan langsung berkurang. Jika quantities pada card tersebut 0 atau sudah habis maka tombol pada card akan berubah menjadi sold out dan tidak bisa ditekan seperti pada gambar berikut ini.

![image](https://user-images.githubusercontent.com/79161142/145353226-31744261-89fa-4de6-b8ab-d06e1ca4c845.png)

- Get a NFT
Ketika user telah membeli barang yang ada pada situs tersebut, maka user akan dihadiahi sebuah NFT. Untuk mendapatkan NFT tersebut, user dapat memasukkan address contract NFT dan token ID pada metamask Mobile. Token ID dapat dilihat pada history pembelian user jika user tersebut lupa akan Token ID tersebut.

![image](https://user-images.githubusercontent.com/79161142/145354487-e3b35db4-bcce-40bd-a43c-78acbdd57531.png)

Untuk address smart contract (storeNFT.sol) dapat dilihat pada history transaction pada metamask yang akan mengarahkan ke situs ropsten.etherscan.io seperti pada gambar berikut ini.

![image](https://user-images.githubusercontent.com/79161142/145354687-2c91fa1d-283b-4292-a484-3d55aef94eef.png)

![image](https://user-images.githubusercontent.com/79161142/145355085-fb6ff9b4-af2a-4ae1-bdd4-3afd92f0c917.png)

![image](https://user-images.githubusercontent.com/79161142/145355218-474f1ec9-a5b7-4de2-ab9a-8682ba09d7f2.png)


Untuk mendapatkan NFT tersebut, harus melalui metamask yang terinstall pada mobile device. Jika pada metamask mobile belum tersedia akun alamat anda yang ada pada metamask pc, silahkan mengimport private key. Private key bisa didapatkan dengan ke menu metamask, ke account details, menekan export private key, memasukkan password metamask anda, dan melakukan pengcopyan private key anda.

![image](https://user-images.githubusercontent.com/79161142/145356085-1fd92d9e-0047-4beb-99d8-bc66585523dd.png)

![image](https://user-images.githubusercontent.com/79161142/145356126-a5561ad5-a5a3-4159-b8cd-955f0859be0f.png)

![image](https://user-images.githubusercontent.com/79161142/145356403-5bd14a1e-c60e-412a-9966-b2e78c7fbd0f.png)

Kemudian melakukan import private key ke metamask mobile dengan menekan icon profile terlebih dahulu, memilih import akun dan mencopy private key ke form yang tersedia.

![image](https://user-images.githubusercontent.com/79161142/145357035-58eab48f-9775-4253-b413-532e38d7dae0.png)

![image](https://user-images.githubusercontent.com/79161142/145357085-9b2949d1-87d2-4794-94d1-1ccecc6f026b.png)

Pada halaman metamask Mobile, silahkan klik tambahkan NFT dan masukkan token ID dan contract address NFT (storeNFT.sol) tersebut. 

![image](https://user-images.githubusercontent.com/79161142/145357491-0acb7246-4cff-49c6-9f95-205c6d3d5012.png)

![image](https://user-images.githubusercontent.com/79161142/145357520-872a9e37-2531-45b7-8d9b-844627525602.png)

Kemudian akan mendapatkan NFT seperti berikut ini.

![image](https://user-images.githubusercontent.com/79161142/145357607-7e2873a6-c3e8-46d8-b42e-35b2728ea98b.png)

NFT yang tersedia pada dApps ini ada lima dan reward yang diberikan user akan diberikan secara acak.

![image](https://user-images.githubusercontent.com/79161142/145357970-4dc9cd73-da3e-4759-9d99-1cbddda8dc58.png)

Berikut merupakan kode function smart contract dalam minting NFT (storeNFT.sol)

``` solidity
function mintNFT(address recipient, string memory tokenURI)
    public onlyContractCaller
    returns (uint256)
{
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(recipient, newItemId);
    _setTokenURI(newItemId, tokenURI);

    return newItemId;
}
```

### Admin Page

Jika alamat wallet yang dihubungkan merupakan alamat owner alias admin, maka akan ditampilkan halaman seperti berikut ini. 

![image](https://user-images.githubusercontent.com/79161142/145358360-208ebd35-07a0-433f-83bf-048ae7de4002.png)

- confirm the transaction

Pada halaman tersebut terdapat beberapa transaksi yang dilakukan oleh akun lain namun barang yang dipesan belum sampai. Jika admin telah mendapatkan info kalau barang telah sampai ke tangan pembeli, maka admin dapat mengonfirmasi pesanan tersebut dengan menekan tombol confirmed. Ketika mengklik button tersebut maka topup metamask akan muncul. Ketika sudah muncul silahkan tekan confirmed. 

![image](https://user-images.githubusercontent.com/79161142/145358761-e4fc1b1e-484e-440d-b125-d41652c00bea.png)

Kemudian transaksi yang telah diconfirmed oleh admin akan hilang pada tabel unconfirmed transaction list tersebut. Namun admin harus melihat proses transaksi pada metamask. Jika proses tersebut yang tadinya pending telah selesai maka admin dapat merefresh page tersebut dan transaksi tersebut akan hilang pada data table tersebut.

![image](https://user-images.githubusercontent.com/79161142/145359180-201bb3ae-b75a-4935-9dda-a2582e1f03e8.png)

Jika sudah maka list transaksi pada tabel user akan yang tadinya 'on the way' berubah menjadi 'arrived'.

![image](https://user-images.githubusercontent.com/79161142/145359506-f2b6081a-4de6-46ad-88e1-204319ba63f0.png)

Berikut adalah kode function yang melakukan proses confirmed berikut ini.

``` solidity
function approveItem(uint _index) onlyOwner public {
    history[_index].status = true;
    realHistory[_index].status = true;

    for (uint i = _index; i < history.length - 1; i++) {
        history[i] = history[i + 1];
    }

    delete history[history.length - 1];

    history.pop();
}
 ```
 
 ## Conclusion & Suggestion
 
 ### Conclusion
 
Dari perancangan ini dapat disimpulkan bahwa, pengembangan dApps serta proses pembacaan data dan pembayaran menggunakan smart contract yang telah terdeploy melalui jaringan ropsten testnet (Ethereum) telah berhasil dilakukan. 

### Saran

Pada dApps ini, terdapat banyak hal yang bisa dikembangkan lebih lanjut lagi yaitu:
- Menerapkan CRUD pada smart contract dan Admin Site.
- Mendeploy smart contract ke jaringan berbasis EVM yang lebih scalable seperti Binance, Avalance, ataupun Polygon.
