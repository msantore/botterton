// const jswallet = require("ethereumjs-wallet");
// // const privateKey = "5f83be83fdd3c38bdc3f383896260604f42053fd4d6591af0cf946b841bbb4b1";
// // const wallet = jswallet.fromPrivateKey(Buffer.from(privateKey, "hex"));
// // console.log(wallet.toV3("password"));

// const numberOfWalletsToCreate = process.env.NUMBER_OF_WALLETS

// const wallets = []

// while (wallets.length < numberOfWalletsToCreate) {
//     let addressData = jswallet['default'].generate();
//     wallets.push(addressData)
// }

// console.log(wallets)

const jswallet = require("ethereumjs-wallet");
const fs = require('fs');
const privateKey = process.env.WALLET_KEY;
export const wallet = jswallet['default'].fromPrivateKey(Buffer.from(privateKey, "hex"));
