const { ethers } = require("hardhat");

const addressConfig = {
  //Mainnet
  1: {
    WethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    chainlinkFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    forwarder: "0x84a0856b038eaAd1cC7E297cF34A7e72685A8693",
    fee: ethers.utils.parseUnits("0.0001", 18),
    UsdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    LinkAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    WbtcAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  },
  //Polygon
  137: {
    WethAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    chainlinkFeed: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
    forwarder: "0x86C80a8aa58e0A4fa09A69624c31Ab2a6CAD56b8",
    fee: ethers.utils.parseUnits("0.1", 18),
    UsdcAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    LinkAddress: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
    WbtcAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
  },
  //Arbi
  42161: {
    WethAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    chainlinkFeed: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
    forwarder: "0xfe0fa3C06d03bDC7fb49c892BbB39113B534fB57",
    fee: ethers.utils.parseUnits("0.0001", 18),
    UsdcAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    LinkAddress: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    WbtcAddress: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
  },
  //Optimism
  10: {
    WethAddress: "0x4200000000000000000000000000000000000006",
    chainlinkFeed: "0x13e3Ee699D1909E989722E753853AE30b17e08c5",
    forwarder: "0xefba8a2a82ec1fb1273806174f5e28fbb917cf95",
    fee: ethers.utils.parseUnits("0.0001", 18),
    UsdcAddress: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    LinkAddress: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
    WbtcAddress: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
  },
  //Binance
  56: {
    WethAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    chainlinkFeed: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",
    forwarder: "0x61456BF1715C1415730076BB79ae118E806E74d2",
    fee: ethers.utils.parseUnits("0.0003", 18),
    UsdcAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    LinkAddress: "0x404460C6A5EdE2D891e8297795264fDe62ADBB75",
    WbtcAddress: "0x8b9b4c5bFc50Bab521bF8016054fC8afbc381400",
  },
  //Avalanche
  43114: {
    WethAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    chainlinkFeed: "0x0A77230d17318075983913bC2145DB16C7366156",
    forwarder: "0x64CD353384109423a966dCd3Aa30D884C9b2E057",
    fee: ethers.utils.parseUnits("0.027", 18),
    UsdcAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    LinkAddress: "0x5947BB275c521040051D82396192181b413227A3",
    WbtcAddress: "0x50b7545627a5162F82A992c33b87aDc75187B218",
  },
  //Fantom
  250: {
    WethAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    chainlinkFeed: "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc",
    forwarder: "0x64CD353384109423a966dCd3Aa30D884C9b2E057",
    fee: ethers.utils.parseUnits("0.03", 18),
    UsdcAddress: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    LinkAddress: "0x6F43FF82CCA38001B6699a8AC47A2d0E66939407",
    WbtcAddress: "0x1e1fdb53451C5262A5ba449271789C7F551a9142",
  },
  5: {
    WethAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    chainlinkFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    forwarder: "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792",
    fee: ethers.utils.parseUnits("0.01", 18),
    UsdcAddress: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    LinkAddress: "0x6F43FF82CCA38001B6699a8AC47A2d0E66939407",
    WbtcAddress: "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05",
  },
};
module.exports = { addressConfig };
