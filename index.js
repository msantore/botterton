require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const db = require('./src/db/db')

// const wallet = require('./src/utils/ethereum')
// const infura = require('./src/utils/infura')
const {getData} = require('./src/utils/uniswapGraph');
