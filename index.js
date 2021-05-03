require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const wallet = require('./src/utils/ethereum')
const infura = require('./src/utils/infura')

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

infura.start()

console.log(wallet, infura)