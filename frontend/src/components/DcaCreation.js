"use client";
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Modal from './Modal';
import TokenJson from "../lib/allToken.json";
import { Network } from '@/config/network';
import dcaABI from "../DCArun/dcaABI.json";
import erc20ABI from "../DCArun/ERC20abi.json";
function DcaCreation() {
  const [sum, setSum] = useState(0);
   // store all input data into a state and then use it to create a dca
   const [dcaData, setDcaData] = useState({
    sellToken: {
      symbol: "DAI",
      address: "",
      decimals: 18,
      thumbnail: "",
      quantity: 0
    },
    buyToken: [],
    sellAmount: 0,
    tradeEvery: "day",
    monthDay: 1,          //for daily dca {MON:1,TUE:2,WED:3,THU:4,FRI:5,SAT:6,SUN:7
    noOfTrades: 2,
    dcaSchedule: "01-10-2023",
    startDate: (new Date()),
    startTime: Date.now(),
  })
  const [dcaTimeFrame, setDcaTimeFrame] = useState("Daily") // Daily, Monthly , Weekly
  const [selectedDay, setSelectedDay] = useState('Sunday'); // Default selected day is Sunday
  const [Hours, setHours] = useState(new Date().getHours());
  const [Minutes, setMinutes] = useState(new Date().getMinutes());
  const [showAddTokenModal, setShowAddTokenModal] = useState(false)
  const [coinList, setCoinList] = useState([]);
  const [sellCoinList, setSellCoinList] = useState([]);
  const [chainLogo, setChainLogo] = useState("")
  const [filteredCoinList, setFilteredCoinList] = useState([]);
  const [coinsLoader, setCoinsLoader] = useState(false);
  const [type, setType] = useState("buy") //buy or sell
  const [errorMessage, setErrorMessage] = useState("");
  const [actionsStatus, setactionsStatus] = useState("review") // review, transactionsModal ,tokensModal
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [activeTab, setActiveTab] = useState('Low Risk'); //  "Low Risk", "Medium Risk", "High Risk"
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending

// useEffect(() => {
//   setCoinList(TokenJson); 
//   setFilteredCoinList(TokenJson);
//   filterCoinsByRisk("Low Risk");
  
// }, [])

const filterCoinsByRisk = (riskLevel) => {
  // Assuming your data has a property named "risk" indicating the risk level
  const filtered = TokenJson.filter((coin) => coin["riskCategory"] === riskLevel);
  console.log("filtered", filtered)
  const sortedCoins = [...filtered].sort((a, b) => {
    const returnsA = a.expectedReturns * 100;
    const returnsB = b.expectedReturns * 100;

    if (sortOrder === 'asc') {
      return returnsB - returnsA; // Sort in descending order
    } else {
      return returnsA - returnsB; // Sort in ascending order
    }
  });

  setCoinList(sortedCoins);
};
const handleTabClick = (riskLevel) => {
  setActiveTab(riskLevel);
  filterCoinsByRisk(riskLevel);
};
const handleSortByReturns = () => {
  const sortedCoins = [...coinList].sort((a, b) => {
    const returnsA = a.expectedReturns * 100;
    const returnsB = b.expectedReturns * 100;

    if (sortOrder === 'desc') {
      return returnsB - returnsA; // Sort in descending order
    } else {
      return returnsA - returnsB; // Sort in ascending order
    }
  });

  setCoinList(sortedCoins);

  // Toggle the sort order for the next click
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
};
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSave = () => {
    // Add your save logic here
    closeModal();
  };
  const createPostions = async (
    _sellToken,
    _buyToken,
    _totalSellAmount,
    _sellAmount,
    _tradeFrequency,
    _noOfTrade,
    _startDate,
  ) => {

    // setTransactionProgressModal(true);
    setactionsStatus("transactionsModal")
    try {
      let _web3Instance = new ethers.providers.Web3Provider(window.ethereum)
      const signer = _web3Instance.getSigner();
      let chainData = findNetworkConfig(chainId);
      let buyTokenAddress = _buyToken
      let sellTokenAddress = _sellToken?.address == "0x0000000000000000000000000000000000000000" ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" : _sellToken?.address?.toLowerCase();
      let tradeFrequency = _tradeFrequency == "Daily" ? 24 * 60 * 60 : _tradeFrequency == "Weekly" ? 7 * 24 * 60 * 60 : 30 * 24 * 60 * 60;
      let startTime = (_startDate / 1000).toFixed(0);
      let endTime = new BigNumber(_startDate / 1000).plus(new BigNumber(_noOfTrade * tradeFrequency)).toFixed(0);
      const erc20abi =[
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_from",
                    "type": "address"
                },
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "name": "_spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        }
    ]
    
      const contract = new ethers.Contract(chainData.dcaContractAddress?.toLowerCase(), dcaABI, signer);
      const contractERC20 = new ethers.Contract(_sellToken?.address?.toLowerCase(), erc20ABI, signer);

      if (sellTokenAddress !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        //keep the obj value to zero if sell token is not ether
        //Check allowance and take approval from wallet 
        console.log("sell token address", sellTokenAddress)
        let _allowance = await contractERC20.allowance(
          walletAddress.toLowerCase(),
          chainData.dcaContractAddress?.toLowerCase()
        );
        console.log("allowance ", _allowance?.toString())
        if (+_allowance < +_totalSellAmount) {
          let approved = await contractERC20.approve(
            chainData.dcaContractAddress?.toLowerCase(),
            _totalSellAmount
          );
          await approved.wait();
        }
      }

      console.log(
        _sellAmount,
        tradeFrequency,
        buyTokenAddress,
        sellTokenAddress,
        startTime,
        endTime,
      );
      console.log("contract", contract);
      // deposit fund from wallet to smart contract
const ETHe=await contract.ETH();
console.log("eth",ETHe)
      const tx = await contract.depositMultipleFunds(
        _sellAmount,
        tradeFrequency,
        buyTokenAddress,
        sellTokenAddress,
        startTime,
        endTime,
      );
      // wait for the transaction to be mined
      await tx.wait();
      setTransactionProgress("successful")
    } catch (error) {
      console.log(error);
      setTransactionProgress("failed")
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDcaData({
      ...dcaData,
      [name]: value
    });
  };
  const handleSelectToken = (type = "buy") => {
    setType(type);
    if (type === "sell") {
      let _filteredCoinList = [
        {
          name:"USD Coins",
          symbol: "USDC",
          address:"0x8267cF9254734C6Eb452a7bb9AAF97B392258b21",
          thumbnail: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
          decimals: 18,
         quantity: 10
        },
        {
          name: "Tether",
          symbol: "USDT",
          address:"0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
          thumbnail: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
          decimals: 18,
       quantity: 25
        }
      ]
      console.log("filtered coin list", _filteredCoinList)
      setCoinList(_filteredCoinList);
      // setFilteredCoinList(_filteredCoinList);
    } else {
      setCoinList(TokenJson); 
      setFilteredCoinList(TokenJson);
      filterCoinsByRisk("Low Risk");
      // setFilteredCoinList(coinList);
    }
    // setModalOpen(true);
    setactionsStatus("tokensModal")
    setErrorMessage("")
  };

  //Selecting only one sell token
  const tokenSelected = (e, i) => {
    console.log("sell Token",
      e, i)
    if (type == "buy") {
      setDcaData({
        ...dcaData,
        buyToken: { symbol: e.symbol, address: e.address, thumbnail: e.thumbnail, decimals: e?.decimals, buyAmount: 0 },

      });
    } else {
      setDcaData({
        ...dcaData,
        sellToken: { quantity: e.quantity, symbol: e.symbol, address: e.address, thumbnail: e.thumbnail, decimals: e?.decimals },
      });
    }
    setShowAddTokenModal(false)
    setactionsStatus("review")
  }

  //Selecting multiple buy tokens
     // Filter tokens based on the search query for both name and symbol
    //  const filteredCoins = coinList.filter((token) => {
    //   const nameMatch = token?.name.toLowerCase().includes(searchQuery.toLowerCase());
    //   const symbolMatch = token?.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    //   return nameMatch || symbolMatch;
    // });
  //function to select tokens
  const tokenSelection = (e, index) => {
    let isAlreadypresent = false;
    let alreadyPresentIndex = 0;
    console.log("token selected", e);
    console.log("selected tokens", selectedTokens);
    selectedTokens.forEach((t, index) => {
      if (t.symbol === e.symbol) {
        isAlreadypresent = true;
        alreadyPresentIndex = index;
      }
    });
    //adding token if its not present   
    if (!isAlreadypresent) {
      let obj = {
        symbol: e.symbol,
        address: e.address,
        coinLogoUrl: e.coinLogoUrl,
        decimals: e.decimals,
        buyAmount: 0,

      }
      setSelectedTokens((t) => [...t, obj]);


    }
    // removing already present token
    else {
      const newSelectedTokens = [...selectedTokens];
      newSelectedTokens.splice(alreadyPresentIndex, 1)
      setSelectedTokens(newSelectedTokens)
    }

  };
  //function to validate token is selected or not return true or false if found the same coin with the selected array
  const validateTokenSelection = (e) => {
    let isSelected = false;
    selectedTokens.map((t) => {
      if (t.symbol === e.symbol) {
        isSelected = true;
      }
    });
    return isSelected; 
  }
  //function to handle confirm selection button
  const handleAddTokensButton = () => {
    let percValue = (100 / selectedTokens.length).toFixed(0);
    // Update each object's buyAmount property by percValue
    const updatedTokens = selectedTokens.map(token => ({
      ...token,
      buyAmount: percValue
    }));
    // Calculate the total sum of buyAmount properties
    const totalSum = updatedTokens.reduce((accumulator, token) => accumulator + +token.buyAmount, 0);

    // Update the tokens state with the updated array of objects
    setDcaData({
      ...dcaData, buyToken: updatedTokens
    })
    setSum(totalSum);
    setShowAddTokenModal(false)
    setactionsStatus("review")
  }
  const handleCreateDCA = async () => {
    if (!dcaData?.sellToken?.address) {
      setErrorMessage("Sell token is required");
      return;
    } else if (!(dcaData?.sellAmount > 0)) {
      setErrorMessage("Sell amount should be greater than 0");
      return;
    } else if (!(dcaData?.noOfTrades > 1)) {
      setErrorMessage("Number of trades should be greater than 1");
      return;
    }
     setTimeout(() => {
      alert("DCA created successfully")
    }, 5000);
    console.log(Web3Instance, isWalletConnected)
    let _startDate = new Date(dcaData.startDate);
    //if Hours or Minutes are zero then set it to current Hour and Minutes
    Hours == 0 && setHours();
    Hours == 0 ? _startDate.setHours(new Date().getHours()) : _startDate.setHours(Hours);
    Minutes == 0 ? _startDate.setMinutes(new Date().getMinutes()) : _startDate.setMinutes(Minutes);
    _startDate.setSeconds(0);
    _startDate.setMilliseconds(0);
    console.log("start date", _startDate);
    setDcaData({ ...dcaData, startTime: _startDate.getTime() })
    //check whether wallet and chain connected or not if connected go ahead with dca creation or first connect wallet 
    if (!isWalletConnected) {
      setErrorMessage("Please Connect Your Wallet");
    }
    //find quantity of buy tokens from perc and put it into array of buyTokenAmounts
    let buyTokenAmounts = [];
    dcaData.buyToken.map((e) => {
      let buyTokenAmount = (BigNumber(dcaData.sellAmount).multipliedBy(
        BigNumber(10).exponentiatedBy(dcaData.sellToken?.decimals))).multipliedBy(
          BigNumber(e?.buyAmount).dividedBy(100)).toString()
      buyTokenAmounts.push(buyTokenAmount);
    })
    let totalSellAmount = (BigNumber(dcaData.sellAmount).multipliedBy(
      BigNumber(10).exponentiatedBy(dcaData.sellToken?.decimals))).multipliedBy(
        BigNumber(dcaData.noOfTrades)).toString()
    let buyTokenAddresses = dcaData.buyToken.map((e) => e?.address == "0x0000000000000000000000000000000000000000" ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" : e?.address);


    try {
      await createPostions(
        dcaData.sellToken,
        buyTokenAddresses,
        totalSellAmount,
        buyTokenAmounts,
        dcaTimeFrame,
        dcaData.noOfTrades,
        dcaData.startTime
      );
      setCreationStatus("configDca");
    } catch (error) {
      console.log(error)
    }

  }
  //func to sum all the percentage of selected tokens
  const sumPerc = () => {
    let totalSum = 0;
    console.log("dcaData again 1", dcaData.buyToken);
    dcaData.buyToken.map(token => {
      totalSum = totalSum + token.buyAmount
      console.log(+token.buyAmount);
    });
    setSum(totalSum);
    //error message if sum is greater than 100
    if (totalSum > 100) {
      setErrorMessage("Total sum of percentage should be 100");
    } else {
      setErrorMessage("");
    }
    console.log("dcaData again", dcaData.buyToken);

  }
  //func to remove token from selected tokens
  const removeToken = (e) => {
    let newSelectedTokens = [...dcaData.buyToken];
    newSelectedTokens.splice(e, 1)
    setSelectedTokens(newSelectedTokens)
    setDcaData({
      ...dcaData, buyToken: newSelectedTokens
    })
    console.log("dcaData after splice", dcaData.buyToken);
  }
  //func to remove all token at once
  const removeAllTokens = () => {
    setSelectedTokens([])
    setDcaData({
      ...dcaData, buyToken: []
    })
    setSum(0);
  }
  const handleDayClick = (day) => {
    setSelectedDay(day);
    setDcaData({ ...dcaData, startDate: findNearestDay(day) });
  };

  return (
    <div className="dcaBox ">
        <div className='flex'>
          <div className="creationContainer">
            {/* buying part */}
            <div className="title">BUY</div>
            <div className='infoAndClearAll'>
              <p><span> </span></p>
              <button className='clearAll' onClick={() => removeAllTokens()} >Clear All</button>
            </div>
            {
              errorMessage && <div className="error__message"><p>{errorMessage}</p></div>
            }


            <div className='tokensContainer'>
              {
                dcaData.buyToken.length && dcaData.buyToken.map((e, index) => {
                  return (
                    <div className='buyToken' key={e?.address}>
                      <div className='token'>
                        <div className='tokenInfo'>
                          <img src={e?.thumbnail} alt="" />
                          <h2>{e?.symbol}</h2>
                        </div>
                        <div className='tokenPercentage'>
                          <input max={100} min={0} type="number" placeholder='0' value={e?.buyAmount} onChange={(value) => {
                            setDcaData((prevDcaData) => {
                              let newDcaData = { ...prevDcaData };
                              newDcaData.buyToken[index].buyAmount = +value.target.value;
                              return newDcaData;
                            })
                            console.log("dcaData", dcaData.buyToken);
                            sumPerc()
                          }} />

                        </div>
                        <p className='Percentage'>%</p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 448 512"
                        onClick={() => {
                          removeToken(index)
                          sumPerc()
                        }

                        }
                      >
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                      </svg>
                    </div>
                  )
                }
                )
              }
            </div>




            <button className='addTokenButton' onClick={() => handleSelectToken("buy")}>
              <img src="/assets/addIcon.png" alt="" />
              Add Tokens
            </button>


            <div className='seprator'></div>


            {/* selling part */}
            <div className="title">SELL</div>
           <div className='inputGroupContainer'>
           <div className='inputGroup'>
            <p className='smallTitle'>Amount</p>
<div className='sellInput'>
  <input type="number" placeholder='Max 20 USDT' onChange={(e) => setDcaData({ ...dcaData, sellAmount: e.target.value })} value={dcaData.sellAmount} />
  <div className='inputSeprator'></div>
  <div className='sellTokenInfo' onClick={() => handleSelectToken("sell")}>
    <img src= {dcaData?.sellToken?.thumbnail} alt="" />
    <h3>{dcaData?.sellToken?.symbol}</h3>
    <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" fill="none" width="24" height="24" />
      <g>
        <path d="M7 10l5 5 5-5" />
      </g>
    </svg>
  </div>
</div>
            </div>
            <div className='inputGroup'>
            <p className='smallTitle'>No of Trades</p>
            <div className='sellInputTrade'>
              <input type="number" placeholder='Min no of Trade 2' onChange={(e) => setDcaData({ ...dcaData, noOfTrades: e.target.value })} value={dcaData.noOfTrades} />
              {/* <div className='inputSeprator'></div> */}
            </div>
            </div>
            </div>
            <div className='seprator'></div>

            {/* Interval  */}
            <div className="title">Buying cycle</div>

            <p className='smallTitle'>I want to purchase</p>
            <div className='cycle_container'>
              <div onClick={() => {
                setDcaTimeFrame("Daily")
              }} className={`cycle ${dcaTimeFrame == "Daily" && "active"}`}>Daily</div>
              <div onClick={() => {
                setDcaTimeFrame("Weekly")
              }} className={`cycle ${dcaTimeFrame == "Weekly" && "active"}`}>Weekly</div>
              <div onClick={() => {
                setDcaTimeFrame("Monthly")
              }} className={`cycle ${dcaTimeFrame == "Monthly" && "active"}`}>Monthly</div>
            </div>
            {/* Daily */}

            {dcaTimeFrame == "Daily" && <>
              <p className='smallTitle'>At my local time</p>
              <div className="localTime">
                <h4>Local Time</h4>
                <div className='localTimeInputs'>
                  <input type="Number" placeholder='17' min={0} max={24} value={Hours} onChange={(input) => setHours(input.target.value)} />
                  <p className='localTime_seprator'>:</p>
                  <input type="Number" placeholder='00' min={0} max={59} value={Minutes} onChange={(input) => setMinutes(input.target.value)} />
                </div>
              </div>
            </>}



            {/* Weekly */}

            {dcaTimeFrame == "Weekly" && <>
              <p className='smallTitle'>Repeats every</p>
              <div className="weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className={`weekday ${day === selectedDay ? 'active' : ''}`}
                    onClick={() => handleDayClick(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <p className='smallTitle'>At my local time</p>
              <div className="localTime">
                <h4>Local Time</h4>
                <div className='localTimeInputs'>
                  <input type="Number" placeholder='17' min={0} max={24} value={Hours} onChange={(input) => setHours(input.target.value)} />
                  <p className='localTime_seprator'>:</p>
                  <input type="Number" placeholder='00' min={0} max={59} value={Minutes} onChange={(input) => setMinutes(input.target.value)} />
                </div>
              </div>
            </>}



            {/* Monthly  */}
            {dcaTimeFrame == "Monthly" && <>

              <p className='smallTitle'>Repeats On</p>
              <div className="monthDate">
                <h4>Date of the month</h4>
                <div className='localTimeInputs'>
                  <input type="number" placeholder='1-28' min={1} max={28} value={dcaData.monthDay} onChange={(val) => setDcaData({ ...dcaData, monthDay: val.target.value })} />
                </div>
              </div>
              <p className='smallTitle'>At my local time</p>
              <div className="localTime">
                <h4>Local Time</h4>
                <div className='localTimeInputs'>
                  <input type="Number" placeholder='17' min={0} max={24} value={Hours} onChange={(input) => setHours(input.target.value)} />
                  <p className='localTime_seprator'>:</p>
                  <input type="Number" placeholder='00' min={0} max={59} value={Minutes} onChange={(input) => setMinutes(input.target.value)} />
                </div>
              </div>
            </>}




            {
             }
            {/* <button className='reviewBTN' onClick={(e) => handleReviewDCA(e)}>Review Dca</button> */}

          </div>
          <div className='actions'>
            {actionsStatus == "review" && <div className='reviewDca'>
            <p className='smallTimeLine'>The 1st purchase will begin on {(dcaData.startDate).toLocaleDateString()} at {Hours?.toString().length < 2 ? '0' + Hours : Hours}:{Minutes?.toString().length < 2 ? '0' + Minutes : Minutes}</p>
           
              <h3 className='title'>Your Schedule Details</h3>
              <div className="text">
                {/* <div className='bulletContainer'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">

                                    <path fillRule="evenodd" clip-rule="evenodd" d="M3 6C3.79565 6 4.55871 5.68393 5.12132 5.12132C5.68393 4.55871 6 3.79565 6 3C6 2.20435 5.68393 1.44129 5.12132 0.87868C4.55871 0.31607 3.79565 0 3 0C2.20435 0 1.44129 0.31607 0.87868 0.87868C0.31607 1.44129 0 2.20435 0 3C0 3.79565 0.31607 4.55871 0.87868 5.12132C1.44129 5.68393 2.20435 6 3 6ZM4.9575 3C4.9575 3.51916 4.75126 4.01706 4.38416 4.38416C4.01706 4.75126 3.51916 4.9575 3 4.9575C2.48084 4.9575 1.98294 4.75126 1.61584 4.38416C1.24874 4.01706 1.0425 3.51916 1.0425 3C1.0425 2.48084 1.24874 1.98294 1.61584 1.61584C1.98294 1.24874 2.48084 1.0425 3 1.0425C3.51916 1.0425 4.01706 1.24874 4.38416 1.61584C4.75126 1.98294 4.9575 2.48084 4.9575 3Z" fill="#843EA1" />
                                </svg>
                            </div> */}

                <p>You are depositing <span> {dcaData.sellAmount * dcaData?.noOfTrades} {dcaData.sellToken?.symbol}</span> to our secure smart contract. Over the next <span>{dcaData.noOfTrades} {dcaTimeFrame == "Daily" ? "day" : dcaTimeFrame == "Weekly" ? "week" : "month"}{dcaData.noOfTrades > 1 ? "s" : ""}</span> from <span>{(new Date(dcaData.startTime)).toLocaleDateString()}</span>, We will purchase <span> {dcaData.buyToken?.symbol}</span> worth <span>{dcaData.sellAmount} {dcaData.sellToken?.symbol} {dcaTimeFrame.toLowerCase()}</span> on your behalf and instant transfer into your wallet. </p>

              </div>


              <div className="text">
                <div className='bulletContainer'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">

                    <path fillRule="evenodd" clip-rule="evenodd" d="M3 6C3.79565 6 4.55871 5.68393 5.12132 5.12132C5.68393 4.55871 6 3.79565 6 3C6 2.20435 5.68393 1.44129 5.12132 0.87868C4.55871 0.31607 3.79565 0 3 0C2.20435 0 1.44129 0.31607 0.87868 0.87868C0.31607 1.44129 0 2.20435 0 3C0 3.79565 0.31607 4.55871 0.87868 5.12132C1.44129 5.68393 2.20435 6 3 6ZM4.9575 3C4.9575 3.51916 4.75126 4.01706 4.38416 4.38416C4.01706 4.75126 3.51916 4.9575 3 4.9575C2.48084 4.9575 1.98294 4.75126 1.61584 4.38416C1.24874 4.01706 1.0425 3.51916 1.0425 3C1.0425 2.48084 1.24874 1.98294 1.61584 1.61584C1.98294 1.24874 2.48084 1.0425 3 1.0425C3.51916 1.0425 4.01706 1.24874 4.38416 1.61584C4.75126 1.98294 4.9575 2.48084 4.9575 3Z" fill="#843EA1" />
                  </svg>
                </div>
                <p>Amount Per Swap : <span> {dcaData.sellAmount} {dcaData.sellToken?.symbol}</span></p>
              </div>
              <h3 className='title'></h3>
              <div className="text">
                <div className='bulletContainer'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">

                    <path fillRule="evenodd" clip-rule="evenodd" d="M3 6C3.79565 6 4.55871 5.68393 5.12132 5.12132C5.68393 4.55871 6 3.79565 6 3C6 2.20435 5.68393 1.44129 5.12132 0.87868C4.55871 0.31607 3.79565 0 3 0C2.20435 0 1.44129 0.31607 0.87868 0.87868C0.31607 1.44129 0 2.20435 0 3C0 3.79565 0.31607 4.55871 0.87868 5.12132C1.44129 5.68393 2.20435 6 3 6ZM4.9575 3C4.9575 3.51916 4.75126 4.01706 4.38416 4.38416C4.01706 4.75126 3.51916 4.9575 3 4.9575C2.48084 4.9575 1.98294 4.75126 1.61584 4.38416C1.24874 4.01706 1.0425 3.51916 1.0425 3C1.0425 2.48084 1.24874 1.98294 1.61584 1.61584C1.98294 1.24874 2.48084 1.0425 3 1.0425C3.51916 1.0425 4.01706 1.24874 4.38416 1.61584C4.75126 1.98294 4.9575 2.48084 4.9575 3Z" fill="#843EA1" />
                  </svg>
                </div>
                <p>No. of Trades : <span>{dcaData?.noOfTrades}</span></p>
              </div>
              <div className="text">
                <div className='bulletContainer'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">

                    <path fillRule="evenodd" clip-rule="evenodd" d="M3 6C3.79565 6 4.55871 5.68393 5.12132 5.12132C5.68393 4.55871 6 3.79565 6 3C6 2.20435 5.68393 1.44129 5.12132 0.87868C4.55871 0.31607 3.79565 0 3 0C2.20435 0 1.44129 0.31607 0.87868 0.87868C0.31607 1.44129 0 2.20435 0 3C0 3.79565 0.31607 4.55871 0.87868 5.12132C1.44129 5.68393 2.20435 6 3 6ZM4.9575 3C4.9575 3.51916 4.75126 4.01706 4.38416 4.38416C4.01706 4.75126 3.51916 4.9575 3 4.9575C2.48084 4.9575 1.98294 4.75126 1.61584 4.38416C1.24874 4.01706 1.0425 3.51916 1.0425 3C1.0425 2.48084 1.24874 1.98294 1.61584 1.61584C1.98294 1.24874 2.48084 1.0425 3 1.0425C3.51916 1.0425 4.01706 1.24874 4.38416 1.61584C4.75126 1.98294 4.9575 2.48084 4.9575 3Z" fill="#843EA1" />
                  </svg>
                </div>
                <p><b>Total Investment :</b> <span>{dcaData.sellAmount * dcaData?.noOfTrades} {dcaData.sellToken?.symbol}</span> </p>
              </div>

              {
                errorMessage && <div className="error__message"><p>{errorMessage}</p></div>
              }

              <div className='revieweDcaBTNContinaer'>
                {/* <button className='edit' onClick={() => setCreationStatus("configDca")}>Edit Details</button> */}

                <button className='confirm' onClick={() => handleCreateDCA()}>Confirm</button>
        
              </div>
            </div>}



            {/* add token modals */}
           
       {
        actionsStatus == "tokensModal" && 
        <div className={"p-4  "}>
        <div className="flex bg-white rounded-lg items-center border-b border-gray-300 p-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            className="mr-2"
          >
            <path
              d="M17.8109 16.884L13.719 12.792C14.9047 11.3682 15.4959 9.54208 15.3696 7.69351C15.2433 5.84494 14.4091 4.11623 13.0407 2.86698C11.6723 1.61772 9.87502 0.944104 8.02262 0.986239C6.17021 1.02837 4.40536 1.78299 3.09517 3.09317C1.78499 4.40336 1.03033 6.1682 0.988192 8.0206C0.946057 9.873 1.61969 11.6704 2.86894 13.0388C4.1182 14.4072 5.84693 15.2413 7.6955 15.3676C9.54407 15.494 11.3702 14.9028 12.7939 13.717L16.886 17.8089C17.0086 17.9316 17.175 18.0006 17.3485 18.0006C17.5219 18.0006 17.6883 17.9316 17.8109 17.8089C17.9336 17.6863 18.0025 17.52 18.0025 17.3465C18.0025 17.1731 17.9336 17.0067 17.8109 16.884ZM2.31096 8.19297C2.31096 7.02902 2.6561 5.89122 3.30275 4.92343C3.9494 3.95565 4.86851 3.20138 5.94385 2.75595C7.01919 2.31053 8.20248 2.19398 9.34406 2.42105C10.4856 2.64813 11.5342 3.20862 12.3573 4.03165C13.1803 4.85468 13.7408 5.90332 13.9679 7.04489C14.1949 8.18647 14.0784 9.3697 13.633 10.445C13.1876 11.5204 12.4333 12.4395 11.4655 13.0862C10.4977 13.7328 9.3599 14.078 8.19596 14.078C6.63547 14.0767 5.13926 13.4562 4.03574 12.3529C2.93221 11.2495 2.31154 9.75345 2.30995 8.19297H2.31096Z"
              fill="#707070"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by Name or Symbol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none outline-none text-black"
          />
        </div>
      { type === "buy" &&  <div className="flex mb-4 justify-evenly">
        <div
          onClick={() => handleTabClick('Low Risk')}
          className={`hover:border-violet-600 hover:border ${activeTab === 'Low Risk' ? 'bg-violet-600' : ''} rounded-md p-2 `}
        >
          Low Risk
        </div>
        <div
          onClick={() => handleTabClick('Medium Risk')}
          className={`${activeTab === 'Medium Risk' ? 'bg-violet-600' : ''} hover:border-violet-600 hover:border rounded-md p-2`}
        >
          Medium Risk
        </div>
        <div
          onClick={() => handleTabClick('High Risk')}
          className={`${activeTab === 'High Risk' ? 'bg-violet-600' : '' } hover:border-violet-600 hover:border rounded-md  p-2`}
        >
          High Risk
        </div>
      </div>}
        <div className="tokens ">
          <div className="header flex justify-around mb-2">
            <h2>Tokens</h2>
            <h2 onClick={handleSortByReturns} >{type === "sell" ? "Quantity" : "Expected Returns %"}{' '} {type === "buy" && (sortOrder === 'asc' ? '▲' : '▼')}</h2>
          </div>
          <div className="tokensContainer h-96 overflow-y-scroll overflow-x-visible p-4  ">
            { coinList?.length &&
              coinList.map((e, i) => {
                return (
                  <div
                    key={i}
                    onClick={() =>
                      type === "buy" ? tokenSelection(e, i) : tokenSelected(e, i)
                    }
                    className={`token ${
                      validateTokenSelection(e) ? "bg-grey-100" : ""
                    } ${selectedTokens.length === 8 ? "disabled" : ""} ${
                      e.isAlreadyPresent === true ? "bg-grey-100" : ""
                    } cursor-pointer border flex justify-between p-2 mb-2 rounded transition duration-300 ease-in-out transform hover:scale-105`}
                  >
                    <div className="token__info flex items-center">
                      <img
                        src={e?.thumbnail}
                        className="coinLogo w-8 h-8 mr-2"
                        alt=""
                      />
                      <div className="nameAndSymbol ml-2">
                        <h3>{e?.name }</h3>
                        <p>{e?.symbol?.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="priceAndSelected text-right">
                      <h3 className="price">
                       { type === "sell" && (e?.quantity)?.toFixed(2)}
                       { type === "buy" && (e?.expectedReturns*100)?.toFixed(2)}
                      </h3>
                      {type === "buy" && (
                        <svg
                          className="isSelected inline-block ml-1"
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="#B4B4B4"
                        >
                          <circle cx="10.3568" cy="10.1497" r="9.47786" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
           
          </div>
        </div>
        {type === "buy" && (
          <button
            className="selectD bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleAddTokensButton}
          >
            Select ({selectedTokens.length} of 8)
          </button>
        )}
      </div>
      
       }


          </div>
        </div>



      </div>

  )
}

export default DcaCreation