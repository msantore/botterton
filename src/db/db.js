const { Pool, Client } = require('pg')

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
// pool.on('error', (err, client) => {
//   console.error('Unexpected error on idle client', err)
//   process.exit(-1)
// })

async function query(sql, prams, multipleQueries = false) {

  const pool = new Pool()
  const results = [];

  if(multipleQueries) {
    for (let i = 0; i < prams.length; i++) {
      const currentRowPrams = prams[i];
      const result = await pool.query(sql, [currentRowPrams.symbol, currentRowPrams.name, currentRowPrams.decimals, currentRowPrams.totalSupply, currentRowPrams.tradeVolume, currentRowPrams.untrackedVolumeUSD, currentRowPrams.tradeVolumeUSD, currentRowPrams.txCount, currentRowPrams.derivedETH, currentRowPrams.id])
      results.push(result)
    }
    await pool.end()
    return results
  } else {
    const result = new Promise(async (resolve, reject) => {
      await pool.query(sql, prams).then( data => {
        resolve(data)
      }).catch(error => {
        console.log('db error', error)
        reject(error)
      })
    });
    return result;
  }
}


module.exports = {
  query: (sql, prams, multipleQueries) => query(sql, prams, multipleQueries)
};