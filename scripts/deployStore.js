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