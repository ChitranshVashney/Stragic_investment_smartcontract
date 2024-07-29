

async function swapTokens(sellToken,buyToken,sellAmount){

  const response = await Functions.makeHttpRequest({
    url:`https://sepolia.api.0x.org/swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}`,
    method: "GET",
    headers: {
        "0x-api-key": process.env.Ex_API,
      },
});
if (response.error) {
    throw new Error(JSON.stringify(response));
  }
//   let swapQuoteJSON = await response.json();
return response;
}
module.exports={swapTokens}