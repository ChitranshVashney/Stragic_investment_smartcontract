require("dotenv").config();
const ethers = require("ethers");
const cron = require("node-cron");
let DcaABI = require("../DCArun/dcaAB.json");
let ERC20ABI = require("../DCArun/ERC20abi.json");
const BigNumber = require("bignumber.js");
const fetch = require("node-fetch");
const fs = require("fs");
let contractAddress;
let contractAbi = DcaABI;

let id = "12d247b0e33c7b6fe4c2043571ba62f08ea3dbf97a4e7e44cc568841c1f260c7";
let provider = new ethers.providers.JsonRpcProvider(
  `https://rpc.ankr.com/eth_sepolia/${id}`
);
const contract = new ethers.Contract(contractAddress, contractAbi, provider);
async function getUserAndTotalSchedule() {

  let totalSchedule = await contract.getAllUsersSchedules();
  let allAddresses = totalSchedule[0];
  let getAllUsersSchedules = [];
  for (let i = 0; i < allAddresses.length; i++) {
    let getAllUserSchedule = await contract.getUserSchedules(allAddresses[i]);
    for (let j = 0; j < getAllUserSchedule.length; j++) {
      getAllUsersSchedules[allAddresses[i]] = getAllUserSchedule;
    }
  }
  // console.log([allAddresses, getAllUsersSchedules]);
  return [allAddresses, getAllUsersSchedules];
}


async function callContractFunction( owner, scheduleId, dcaSchedule) {
  // const id = process.env.ANKR_RPC_ID;
  const encryptedJson = fs.readFileSync(
    `${__dirname}/src/DCArun/encrp.js`,
    "utf8"
  );
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = wallet.connect(provider);
  // const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
  const ERC20 = new ethers.Contract(dcaSchedule.sellToken, ERC20ABI, wallet);

  let WETHaddress, ETHaddress;
  ETHaddress = await contract.ETH();
  WETHaddress = await contract.WETH();

  let gasFee = await contract.gasUsedForTransaction();
  let convertedGas = await contract.getLatestData();

  if (
    !(
      dcaSchedule.sellToken.toLowerCase() === ETHaddress.toLowerCase() ||
      dcaSchedule.sellToken.toLowerCase() === WETHaddress.toLowerCase()
    )
  ) {
    let decimal = await ERC20.decimals();
    gasFee = BigNumber(convertedGas.toString())
      .multipliedBy(gasFee.toString())
      .multipliedBy(BigNumber("10").exponentiatedBy(decimal.toString()))
      .dividedBy(BigNumber("10").exponentiatedBy("18"))
      .dividedBy(BigNumber("10").exponentiatedBy("8"))
      .integerValue(BigNumber.ROUND_DOWN);
  }

  let param = {
    method: "GET",
    headers: {
      "0x-api-key": process.env.ZERO_EX,
    },
  };
  let sellToken = dcaSchedule.sellToken;
  let sellAmount = BigNumber(dcaSchedule.tradeAmount.toString()).minus(
    gasFee.toString()
  );
  if (sellToken.toLowerCase() === ETHaddress.toLowerCase()) {
    sellToken = WETHaddress;
  }
  const response = await fetch(
    `https://sepolia.api.0x.org/swap/v1/quote?sellToken=${sellToken}&buyToken=0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9&sellAmount=${sellAmount}`,
    param
  );
  let swapQuoteJSON = await response.json();
  let gasPrice = await provider.getGasPrice();

  try {
    const tx = await contract.runUserDCA(
      owner,
      scheduleId,
      swapQuoteJSON.allowanceTarget,
      swapQuoteJSON.to,
      swapQuoteJSON.data,
      {
        gasPrice: gasPrice,
      }
    );
    console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait(1);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

const runDca = async () => {
  let allUser = await getUserAndTotalSchedule();
  let allAddress = allUser[0];
  let allUserInfo = allUser[1];
  for (let i = 0; i < allAddress.length; i++) {
    // console.log(i, "----------------", allAddress[i]);
    let userInfo = allUserInfo[allAddress[i]];
    for (let j = 0; j < userInfo.length; j++) {
      // console.log(j, "___________________________", userInfo[j]);
      if (
        Date.now() / 1000 >= userInfo[j].scheduleDates[2] &&
        userInfo[j].isActive
      ) {
        console.log( allAddress[i], j, userInfo[j]);
        await callContractFunction( allAddress[i], j, userInfo[j]);
      }
    }
  }
};

// Schedule the function to run every 10 minutes
const runDcaTask = cron.schedule("*/5 * * * *", async function () {
  await runDca();
});
// EveryChainDCArun()