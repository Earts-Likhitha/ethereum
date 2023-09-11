// //const Monero = require("./node_modules/monerojs/index"); 
// //const monerojs = require("monero-javascript");
// const bip39 = require("bip39");
// const hdkey = require("hdkey");

// //async function sendMoneroTransaction(mnemonic) {
// //   let monerojs = require("monero-javascript");
// //   const seed = await bip39.mnemonicToSeed(mnemonic);
// //   hdPath = "m/44'/128'/0'"; // Monero HD path for testnet
// //   const root = hdkey.fromMasterSeed(seed);
// //     const moneroChild = root.derive(hdPath);
// //     const privateSpendKey = moneroChild.privateKey;
// // // create keys-only wallet
// // let wallet = await monerojs.createWalletKeys({
// //    networkType: "testnet",
// //});

// // 

// const MoneroWallet = require("monero-javascript");
// const MoneroNetworkType = require("monero-javascript").MoneroNetworkType;

// // Create keys-only wallet
// (async () => {
//   const seed = await bip39.mnemonicToSeed("elegant giggle step cause must can merge harvest guide rule ethics siren");
//   const wallet = await MoneroWallet.createWalletKeys({
//     password: "abc123",
//     networkType: MoneroNetworkType.TESTNET, // Use the appropriate network type
//     seed: seed, // Replace with your 25-word mnemonic
//   });

//   console.log("Monero Address:", wallet.getAddress());
// })();

// //}
// //sendMoneroTransaction("elegant giggle step cause must can merge harvest guide rule ethics siren")



