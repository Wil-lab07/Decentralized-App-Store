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
  