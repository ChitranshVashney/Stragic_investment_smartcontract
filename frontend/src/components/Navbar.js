"use client";
import React, { useState } from 'react'
import { ethers } from 'ethers'
import { formatAddress, formatSignificantNumber, getNetworkName } from '@/utils/helperFunc';
import { Network } from '@/config/network';
function Navbar() {

  const [Balance,setBalance] = useState(0)
  const [Address, setAddress] = useState("")
  const [networkId, setNetworkId] = useState(0)
  const [isConnected,setIsConnected] = useState(false)
  const connectMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
  
// MetaMask requires requesting permission to connect users accounts
await provider.send("eth_requestAccounts", []);
let _networkId =  (await provider.getNetwork()).chainId
console.log("networkId",_networkId)
if(_networkId == 11155111){
setIsConnected(true)
let _address = await provider.getSigner().getAddress()
setNetworkId(_networkId)
setAddress(_address)
let _balance = await provider.getBalance("ethers.eth")
console.log("balance",_balance)
setBalance(_balance)
}else{
  alert("Please connect to Sepolia Testnet")
  if (window.ethereum) {
    try {
      await window.ethereum.enable();
      window.ethereum._handleChainChanged({
        chainId: 0x5,
        networkVersion: 1,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

  }
  const handleDisconnect = async () => {
    setIsConnected(false)
    setAddress("")
    setBalance(0)
  }

  // const { selectedNetworkId } = useWeb3ModalState();
  return (
    <nav className="bg-gradient-to-r from-pink-500 to-violet-500 p-4">
  <div className="container mx-auto flex justify-between items-center">
   
    <div className="flex items-center">
      <img src="/assets/logo.jpeg" alt="Strategic Investment Logo" className="h-8 w-8 mr-2 rounded-full" />
      <span className="text-white text-lg font-semibold">Strategic Investment</span>
    </div>
    {/* {/* <button onClick={() => open()}>Open Connect Modal</button> */}
    {isConnected && (
  <div className="flex items-center space-x-4">
    {/* Network Logo */}
    <img
      src={Network[0]?.networkLogo}    alt="Network Logo"
      className="w-6 h-6"
    />

    {/* Network Name */}
    <span className="text-gray-700">{Network[0]?.networkName}</span>

    {/* Address and Balance */}
    <span className="mr-2 text-gray-700">{formatAddress(Address)}</span>
    <span className="font-bold">Balance: {formatSignificantNumber(ethers.utils.formatEther(Balance))}</span>
  </div>
)}
   
    {  !isConnected &&
      <button onClick={() => connectMetamask() }  className="bg-white text-blue-500 px-4 py-2 rounded-full">Connect</button>}
     { isConnected && <button onClick={() => handleDisconnect() }  className="bg-white text-blue-500 px-4 py-2 rounded-full">Disconnect</button>}
   
  </div>
</nav>
  )
}

export default Navbar