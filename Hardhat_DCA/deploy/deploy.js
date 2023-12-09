const { run, network, ethers } = require("hardhat");
// const ethers = require("ethers");
const hre = require("hardhat");
const fs = require("fs-extra");
const { addressConfig } = require("../utils/addressconfig");
module.exports = async ({ getNamedAccounts, deployments }) => {
  // const { deploy, log } = deployments;
  // // const { deployer } = await getNamedAccounts();
  // const ankr_api = process.env.Ankr_API;
  // const provider = new ethers.providers.JsonRpcProvider(
  //   `https://rpc.ankr.com/eth_goerli/${ankr_api}`
  // );
  // // console.log(provider);
  // console.log(addressConfig[5].fee.toString());
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  // let deployer = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );

  // deployer = deployer.connect(provider);

  // const alpha = await hre.ethers.getContractFactory("DcaOperation", deployer);
  // // console.log(alpha);
 
  
  // console.log("AlphaVault deployed to:", AlphaVault.address);
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
    await verify("0x918B48F9da5207d2DeA423c4ed143A397065BAD6", [
      addressConfig[5].WethAddress,
      addressConfig[5].chainlinkFeed,
      addressConfig[5].forwarder,
      addressConfig[5].fee,
    ]);
  }
};
