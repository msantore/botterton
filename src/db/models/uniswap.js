const {query} = require('../db');

async function getUniswapTokens(email) {
    return await query('select * from uniswap_tokens;')
}

async function insertUniswapToken(symbol, name, decimals, totalSupply, tradeVolume, untrackedVolumeUSD, tradeVolumeUSD, txCount, derivedETH) {
    return await query('INSERT INTO uniswap_tokens(symbol, name, decimals, total_supply, trade_volume, untracked_volume_usd, trade_volume_usd, tx_count, derived_eth) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)', [symbol, name, decimals, totalSupply, tradeVolume, untrackedVolumeUSD, tradeVolumeUSD, txCount, derivedETH])
}

module.exports = {getUniswapTokens, insertUniswapToken}