const axios = require('axios')
const {getUniswapTokens, insertUniswapToken} = require('../db/models/uniswap');

const queryUniswapAPI = async (dbTokens) => {

  const numberOfLoops = 10000
  let numberOfTokensQueried = 0;
  let tokensPerQuery = 1000;
  let currentQuery = numberOfTokensQueried + tokensPerQuery;
  let loopNumber = 0


  for (let i = 0; i < numberOfLoops; i++) {
    console.time('numberOfLoops');
    let query = `{
      tokens(first: ${currentQuery}, skip: ${numberOfTokensQueried}) {
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
    loopNumber++;
    let tokensToInsert = [];
    await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', {query}).then(async (response) => {
      const {tokens: uniswapTokens} = response.data.data;
      for (let i = 0; i < uniswapTokens.length; i++) {
        const newUniswapToken = uniswapTokens[i];
        const isTokenAlreadyInDatabase = dbTokens.find(token => token.name === newUniswapToken.name)
        // if Token is not in Postgres, insert row
        if (!isTokenAlreadyInDatabase) {
          tokensToInsert.push({
            symbol: newUniswapToken.symbol,
            name: newUniswapToken.name,
            decimals: newUniswapToken.decimals,
            totalSupply: newUniswapToken.totalSupply,
            tradeVolume: newUniswapToken.tradeVolume,
            untrackedVolumeUSD: newUniswapToken.untrackedVolumeUSD,
            tradeVolumeUSD: newUniswapToken.tradeVolumeUSD,
            txCount: newUniswapToken.txCount,
            derivedETH: newUniswapToken.derivedETH
          })
        }
      }

      const result = await insertUniswapToken(tokensToInsert).catch(error => {
          console.log('insertUniswapToken', error)
        })

    })
    numberOfTokensQueried = numberOfTokensQueried + tokensPerQuery;
    console.log(loopNumber, numberOfTokensQueried)
    console.timeEnd('numberOfLoops')
  }
}

const getTokenData = async () => {
const {rows: dbTokens} = await getUniswapTokens();

  await queryUniswapAPI(dbTokens)

}

getTokenData()

module.exports = {getTokenData}