const axios = require('axios')
const {getUniswapTokens, insertUniswapToken} = require('../db/models/uniswap');

const queryUniswapAPI = async (dbTokens) => {

  const numberOfTokens = 0;
  const tokensPerQuery = 1000;
  const currentQuery = numberOfTokens + tokensPerQuery;
  let loopNumber = 0

  const query = `{
    tokens(first: ${currentQuery}, skip: ${numberOfTokens}) {
      id,
      symbol,
      name,
      decimals,
      totalSupply,
      tradeVolume,
      tradeVolumeUSD,
      untrackedVolumeUSD,
      txCount,
      totalLiquidity,
      derivedETH
      }
    }`

  const numberOfLoops = 10000
  for (let i = 0; i < numberOfLoops; i++) {
    loopNumber++;
    await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', {query}).then(async (response) => {
      const {tokens: uniswapTokens} = response.data.data;
      for (let i = 0; i < uniswapTokens.length; i++) {
        const newUniswapToken = uniswapTokens[i];
        // if Token is not in Postgres, insert row
        if (!dbTokens.includes(newUniswapToken.symbol)) {
          const result = await insertUniswapToken(
            newUniswapToken.symbol,
            newUniswapToken.name,
            newUniswapToken.decimals,
            newUniswapToken.totalSupply,
            newUniswapToken.tradeVolume,
            newUniswapToken.untrackedVolumeUSD,
            newUniswapToken.tradeVolumeUSD,
            newUniswapToken.txCount,
            newUniswapToken.derivedETH
            )
        }
      }
    }).catch((error) => {
      console.error(error)
    })
    console.log(loopNumber, numberOfTokens)
  }
}

const getTokenData = async () => {
const {rows: dbTokens} = await getUniswapTokens();

  await queryUniswapAPI(dbTokens)

}

getTokenData()

module.exports = {getTokenData}