const { Pool, Client } = require('pg')
const pool = new Pool()

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

function query(sql, prams) {

  const client = new Client()
  client.connect()

  const result = new Promise(async (resolve, reject) => {
      await client.query(sql, prams).then( data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
      await client.end()
  });

  return result;
}


module.exports = {query};