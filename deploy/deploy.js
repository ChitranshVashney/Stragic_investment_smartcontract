const { run, network, ethers } = require("hardhat");
// const ethers = require("ethers");
const hre = require("hardhat");
const fs = require("fs-extra");
const { addressConfig } = require("../utils/addressconfig");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  // const { deployer } = await getNamedAccounts();
  const ankr_api = process.env.Ankr_API;
  const provider = new ethers.providers.JsonRpcProvider(
    `https://rpc.ankr.com/eth_/${ankr_api}`
  );
  // console.log(provider);
  console.log(addressConfig[11155111].fee.toString());
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  let deployer = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );

  deployer = deployer.connect(provider);


  const alpha = await hre.ethers.getContractFactory("DcaOperation", deployer);
  // console.log(alpha);
  const AlphaVault = await alpha.deploy(
    addressConfig[11155111].WethAddress,
    addressConfig[11155111].chainlinkFeed,
    addressConfig[11155111].forwarder,
    addressConfig[11155111].fee.toString(),
    { gasLimit: 5000000 }
  );
  let a=await AlphaVault.deployed();
  let b= await a.deployTransaction.wait();
  console.log(b);
// await a.wait(2)
 
  
  console.log("AlphaVault deployed to:", AlphaVault.address);
  const verify = async (contractAddress, args) => {
    console.log("Verifying contract...");
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
      });
    } catch (e) {
      if (e.message.toLowerCase().includes("already verified")) {
        console.log("Already Verified!");
      } else {
        console.log(e);
      }
    }
  };
  if (true) {
    await verify(AlphaVault.address, [
      addressConfig[11155111].WethAddress,
      addressConfig[11155111].chainlinkFeed,
      addressConfig[11155111].forwarder,
      addressConfig[11155111].fee,
    ]);
  }
};
