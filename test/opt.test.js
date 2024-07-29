const { expect, assert } = require("chai");
const { ethers, getNamedAccounts, network } = require("hardhat");
const { addressConfig } = require("../utils/addressconfig");
const axios = require("axios");
const { BigNumber } = require("bignumber.js");
const qs = require("qs");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
// const fetch = require("fetch")
describe.only("Strategy DCA", function () {
  let deployer,
    AVDCA,
    avdca,
    WETH,
    user,
    USDC,
    amountIN,
    amountIN2,
    contractAddress,
    ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  before(async function () {
    [deployer, user] = await ethers.getSigners();
    AVDCA = await ethers.getContractFactory("DcaOperation");
    avdca = await AVDCA.deploy(
      addressConfig[10].WethAddress,
      addressConfig[10].chainlinkFeed,
      addressConfig[10].forwarder,
      addressConfig[10].fee
    );
    contractAddress = avdca.target;

    console.log(contractAddress);
    avdca.connect(user);
    amountIN = ethers.parseUnits("10", 18);
    amountIN2 = ethers.parseUnits("300", 6);
    // amountIN1 = ethers.utils.parseUnits("0.1", 18);
    WETH = await ethers.getContractAt(
      "IWETH",
      addressConfig[10].WethAddress,
      user
    );
    USDC = await ethers.getContractAt(
      "IWETH",
      addressConfig[10].UsdcAddress,
      user
    );
  });

  it("approve USDC token for dca", async function () {
    let tokenAdd = await avdca.addToken(addressConfig[10].UsdcAddress);
    tokenAdd.wait();
    let allToken = await avdca.connect(user).getAllTokens();
    console.log("----1----", allToken);
  });

  it("add user funds in dca", async function () {
    user = await ethers.getImpersonatedSigner(
      "0x92BD687953Da50855AeE2Df0Cff282cC2d5F226b"
    );
    let USDCapprove = await USDC.connect(user).approve(
      contractAddress,
      amountIN2
    );
    await USDCapprove.wait();
    const start = Math.floor(Date.now() / 1000);
    let depoDCA = await avdca
      .connect(user)
      .depositMultipleFunds(
        [
          amountIN2.toString() / 3,
          amountIN2.toString() / 3,
          amountIN2.toString() / 3,
        ],
        100,
        [
          addressConfig[10].LinkAddress,
          addressConfig[10].WethAddress,
          addressConfig[10].WbtcAddress,
        ],
        addressConfig[10].UsdcAddress,
        start,
        start + 300
      );
    await depoDCA.wait(1);
    let getUserAllTokenBalances = await avdca
      .connect(user)
      .getUserAllTokenBalances();
    console.log("----2----", getUserAllTokenBalances.toString());
    let getUserScheduleNumber = await avdca
      .connect(user)
      .getAllUsersSchedules();
    console.log("----2----", getUserScheduleNumber.toString());
    let getUserSchedules = await avdca
      .connect(user)
      .getUserSchedules(user.address);
    for (let i = 0; i < getUserSchedules.length; i++) {
      console.log(getUserSchedules[i]);
    }
    // console.log("----2----", getUserSchedules.toString());
  });

  it("it will delete user dca ", async function () {
    let withdrawDCA = await avdca.connect(user).deleteSchedule(0);
    await withdrawDCA.wait(1);
    let getUserAllTokenBalances = await avdca
      .connect(user)
      .getUserAllTokenBalances();
    console.log("----2----", getUserAllTokenBalances.toString());
    let getUserScheduleNumber = await avdca
      .connect(user)
      .getAllUsersSchedules();
    console.log("----2----", getUserScheduleNumber.toString());
    let getUserSchedules = await avdca
      .connect(user)
      .getUserSchedules(user.address);
    for (let i = 0; i < getUserSchedules.length; i++) {
      console.log(getUserSchedules[i]);
    }
  });

  it("will run dca", async function () {
    let gasFee = await avdca.gasUsedForTransaction();
    let convertedGas = await avdca.getLatestData();
    let decimal = await USDC.decimals();
    convertedGas = BigNumber(convertedGas.toString())
      .multipliedBy(gasFee.toString())
      .multipliedBy(BigNumber("10").exponentiatedBy(decimal.toString()))
      .dividedBy(BigNumber("10").exponentiatedBy("18"))
      .dividedBy(BigNumber("10").exponentiatedBy("8"))
      .integerValue(BigNumber.ROUND_DOWN);
    console.log(convertedGas.toString());
    let getUserSchedules = await avdca
      .connect(user)
      .getUserSchedules(user.address);
    for (let j = 1; j <= 3; j++) {
      console.log(
        `$--------------------------------${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}--------------------------------`
      );
      for (let i = 0; i < getUserSchedules.length; i++) {
        let amountRem = getUserSchedules[i][1];
        console.log("amount before", amountRem.toString());
        amountRem = BigNumber(amountRem.toString())
          .minus(convertedGas.toString())
          .integerValue(BigNumber.ROUND_DOWN);
        console.log("amount after", amountRem.toString());

        const params = {
          sellToken: getUserSchedules[i][4],
          buyToken: getUserSchedules[i][3],
          sellAmount: amountRem.toString(),
        };
        console.log(params);
        const ex = process.env.Ex_API;
        const response = await axios.get(
          `https://optimism.api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
          { headers: { "0x-api-key": ex } }
        );
        // // const responses = await response.json;
        // console.log(response.data);
        await helpers.time.increase(100);
        let runDCA = await avdca.runUserDCA(
          user.address,
          i,
          response.data.to,
          response.data.allowanceTarget,
          response.data.data
        );
        await runDCA.wait();
        let getUserSchedules1 = await avdca
          .connect(user)
          .getUserSchedules(user.address);
        console.log(getUserSchedules1[i]);
      }
      console.log(
        `--------------------------------${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}${j}--------------------------------`
      );
    }
  });
});
