const bip39 = require("bip39");
const hdkey = require("hdkey");
const Web3 = require('web3');

const providerURL = 'https://api.s0.b.hmny.io/'; // Harmony Testnet RPC URL
const web3 = new Web3(providerURL);

async function sendTransaction(mnemonic, amountInOne, recipientAddress) {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = hdkey.fromMasterSeed(seed);
    const hdPath = "m/44'/1023'/0'"; // Harmony HD path, including an account index
    const harmonyChild = root.derive(hdPath);
    const privateKey = harmonyChild.privateKey.toString('hex'); // Convert the private key to a hex string
    const amountInWei = web3.utils.toWei(amountInOne.toString(), 'ether');

    const senderAccount = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    console.log("Sender Account:", senderAccount.address);

    // Get the current gas price
    const gasPrice = await web3.eth.getGasPrice();
    const gasPriceBN = web3.utils.toBN(gasPrice);

    // Get the nonce for the sender address
    const nonce = await web3.eth.getTransactionCount(senderAccount.address, 'pending');

    const transactionObject = {
      nonce: nonce,
      from: senderAccount.address,
      to: recipientAddress,
      value: amountInWei,
      gas: 21000, // Use the standard gas limit
      gasPrice: gasPrice,
    };

    const signedTx = await web3.eth.accounts.signTransaction(transactionObject, privateKey);
    console.log("Signed Transaction:", signedTx);

    // Broadcast the signed transaction
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Transaction Receipt:", txReceipt);
  } catch (error) {
    console.error("Error:", error);
  }
}

sendTransaction("elegant giggle step cause must can merge harvest guide rule ethics siren", "0.0001", "0xd87D25a7e3Ea78bB39c3A27EF20c5c918E2bf0e8");
