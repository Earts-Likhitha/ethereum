const bip39 = require("bip39");
const hdkey = require("hdkey");
const Caver = require("caver-js"); // Import Caver library

const providerURL = 'https://public-node-api.klaytnapi.com/v1/ba'; // Klaytn Public Node URL
const caver = new Caver(providerURL);

async function sendTransaction(mnemonic, amountInKLAY, recipientAddress) {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = hdkey.fromMasterSeed(seed);
    const hdPath = "m/44'/8217'/0'/0/0"; // Klaytn HD path, including an account index
    const klaytnChild = root.derive(hdPath);
    const privateKey = klaytnChild.privateKey.toString('hex'); // Convert the private key to a hex string
    const amountInWei = caver.utils.toPeb(amountInKLAY, "KLAY"); // Convert KLAY to Peb

    const senderAddress = caver.wallet.keyring.createFromPrivateKey(privateKey).address;
    console.log("Sender Address:", senderAddress);

    // Get the nonce for the sender address
    const nonce = await caver.klay.getTransactionCount(senderAddress);

    const transactionObject = {
      from: senderAddress,
      to: recipientAddress,
      value: amountInWei,
      gas: 21000, // Use an appropriate gas limit
      gasPrice: caver.utils.toPeb("0.00000001", "KLAY"), // Gas price in Peb
      nonce: nonce,
    };

    // Get the current base fee
    const baseFee = await caver.klay.getGasPrice();

    // Calculate the maxGasPrice to ensure it's at least equal to baseFee
    const maxGasPrice = Math.max(transactionObject.gasPrice, baseFee);

    transactionObject.gasPrice = maxGasPrice;

    const signedTx = await caver.klay.accounts.signTransaction(transactionObject, privateKey);
    console.log("Signed Transaction:", signedTx);

    // Send the signed transaction
    const receipt = await caver.klay.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Transaction Receipt:", receipt);
  } catch (error) {
    console.error("Error:", error);
  }
}

sendTransaction("elegant giggle step cause must can merge harvest guide rule ethics siren", "0.1", "0xd87D25a7e3Ea78bB39c3A27EF20c5c918E2bf0e8");
