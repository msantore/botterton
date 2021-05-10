const db = require('../db');

async function getUniswapTokens(email) {
    return await db.query('select * from uniswap_tokens;')
}

async function insertUniswapToken(tokensToInsert) {
    return await db.query('INSERT INTO uniswap_tokens(symbol, name, decimals, total_supply, trade_volume, untracked_volume_usd, trade_volume_usd, tx_count, derived_eth, uniswap_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', tokensToInsert, true)
}

module.exports = {getUniswapTokens, insertUniswapToken}