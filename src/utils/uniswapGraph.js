const axios = require('axios')
const {getUniswapTokens, insertUniswapToken} = require('../db/models/uniswap');

const queryUniswapAPI = async (dbTokens) => {

  const numberOfLoops = 10000
  let numberOfTokensQueried = 0;
  let tokensPerQuery = 1000;
  let currentQuery = numberOfTokensQueried + tokensPerQuery;
  let lastId = ""
  let loopNumber = 0
  if (dbTokens.length > 0) {
    lastId = dbTokens[dbTokens.length -1].uniswap_id
  }


  for (let i = 0; i < numberOfLoops; i++) {
    console.time('numberOfLoops');

    loopNumber++;
    let tokensToInsert = [];
    await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', {
      query: `query ($lastID: String) {
          tokens(orderBy: id, orderDirection: asc, first: 1000, where: { id_gt: $lastID  }) {
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
        }
      `,
      variables: {
        lastID: lastId
      }
    }).then(async (response) => {
      const {tokens: uniswapTokens} = response.data.data;
      if (uniswapTokens.length > 0) {
        for (let i = 0; i < uniswapTokens.length; i++) {
          const newUniswapToken = uniswapTokens[i];
          const isTokenAlreadyInDatabase = dbTokens.find(token => token.uniswap_id === newUniswapToken.uniswap_id)
          // if Token is not in Postgres, insert row
          if (!isTokenAlreadyInDatabase) {
            tokensToInsert.push({
              id: newUniswapToken.id,
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
        
        if (uniswapTokens.length > 0) {
          lastId = uniswapTokens[uniswapTokens.length - 1].id
        }
        numberOfTokensQueried = numberOfTokensQueried + tokensPerQuery;
        console.log(loopNumber, numberOfTokensQueried, lastId)
      } else {
        console.log('end of Tokens')
        process.exit(1)
      }
    })
    console.timeEnd('numberOfLoops')
  }
}

const getTokenData = async () => {
const {rows: dbTokens} = await getUniswapTokens();

  await queryUniswapAPI(dbTokens)

}

getTokenData()

module.exports = {getTokenData}