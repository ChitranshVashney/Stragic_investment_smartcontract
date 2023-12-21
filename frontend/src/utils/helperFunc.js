//format number to 4 significant digits
import { Network } from "@/config/network";
import BigNumber from "bignumber.js";
export function formatSignificantNumber(number) {
    if (number === 0) {
      return 0;
    }
  
    var magnitude = Math.pow(
      10,
      4 - Math.floor(Math.log10(Math.abs(number))) - 1
    );
    var roundedNumber = Math.round(number * magnitude) / magnitude;
    return new BigNumber(roundedNumber).toString();
  }

// function for formating walletAddress
export const formatAddress = (address) => {
  let newAddress =
    address?.substr(0, 6) + "..." + address?.substr(address?.length - 5);
  return newAddress;
};

// Create a utility function to find network configuration
export function findNetworkName(chainId) {

  return Network.find((config) => config.networkId === chainId);
}
