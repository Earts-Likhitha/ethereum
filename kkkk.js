const bip39 = require("bip39");
 const hdkey = require("hdkey");
const Monero = require("monero-javascript");
const bs58 = require("base-58");

async function sendMoneroTransaction(mnemonic) {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = hdkey.fromMasterSeed(seed);
    const networkType = "testnet";

    hdPath = "m/44'/128'/0'"; // Monero HD path for testnet
    const moneroChild = root.derive(hdPath);
    const privateKey = moneroChild.privateKey;
    const publicKey = moneroChild.publicKey;
    // Derive the public spend key and public view key from the private keys
    const publicSpendKey = Buffer.from(privateKey.slice(0, 32));
    const publicViewKey = Buffer.from(privateKey.slice(32, 64));

    const prefix = networkType === "mainnet" ? "8" : "9";
    const data = Buffer.concat([publicSpendKey, publicViewKey]);
    const checksum = Buffer.alloc(4);
    const dataWithChecksum = Buffer.concat([data, checksum]);
    const encodedAddress = bs58.encode(dataWithChecksum);
    const moneroAddress = prefix + encodedAddress;

    console.log("Monero Address:", moneroAddress);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

sendMoneroTransaction("elegant giggle step cause must can merge harvest guide rule ethics siren");

// const crypto = require('crypto');
// const bip39 = require('bip39');
// const base58 = require('base-58'); // Updated import
// const hdkey = require('hdkey');

// // Replace this with your 12-word mnemonic
// const existingMnemonic =
//   'elegant giggle step cause must can merge harvest guide rule ethics siren';

// // Generate 13 random words
// function generateRandomWords(wordCount) {
//   const wordList = bip39.wordlists['english'];
//   const randomWords = [];
//   const randomBytes = crypto.randomBytes(wordCount * 4);

//   for (let i = 0; i < wordCount; i++) {
//     const wordIndex =
//       randomBytes.readUInt32LE(i * 4) % wordList.length;
//     randomWords.push(wordList[wordIndex]);
//   }

//   return randomWords.join(' ');
// }

// // Generate the additional 13 random words
// const randomWords = generateRandomWords(13);

// // Combine the existing 12-word mnemonic with the 13 random words
// const moneroMnemonic = `${existingMnemonic} ${randomWords}`;

// console.log('Monero-Compatible Mnemonic (25 Words):');
// console.log(moneroMnemonic);

// async function monero() {
//   const seed = await bip39.mnemonicToSeed(moneroMnemonic);
//   const seedBuffer = seed.toString('hex');
//   const hdPath = "m/44'/128'/0'/0/0"; // Monero HD path for testnet
//   const root = hdkey.fromMasterSeed(seedBuffer);
//   const moneroChild = root.derive(hdPath);
//   const publicKey = moneroChild.publicKey;

//   const publicSpendKey = publicKey.slice(0, 32).toString('hex');
//   const publicViewKey = publicKey.slice(32, 64).toString("hex");

//   const moneroPrefix = "9"; // Testnet prefix

//   const moneroAddress = base58.encode(
//     moneroPrefix,
//     Buffer.from(publicSpendKey+publicViewKey,'hex') // Concatenate the public keys
//   );

//   console.log("Monero Address:", moneroAddress);
// }

// monero();
