const bip39 = require("bip39");
const hdkey = require("hdkey");
const Web3 = require('web3');

const providerURL = 'https://public-node-api.klaytnapi.com/v1/ba'; // Klaytn Public Node URL
const web3 = new Web3(providerURL);

async function sendTransaction(mnemonic, amountInKLAY, recipientAddress) {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = hdkey.fromMasterSeed(seed);
    const hdPath = "m/44'/8217'/0'/0/0"; // Klaytn HD path, including an account index
    const klaytnChild = root.derive(hdPath);
    const privateKey = klaytnChild.privateKey.toString('hex'); // Convert the private key to a hex string
    const amountInWei = web3.utils.toWei(amountInKLAY.toString(), 'ether'); // Convert KLAY to Wei

    const senderAccount = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    console.log("Sender Account:", senderAccount.address);

    // Get the current gas price
    const gasPrice = await web3.eth.getGasPrice();
    const gasPriceBN = web3.utils.toBN(gasPrice);

    // Get the current base fee
    const block = await web3.eth.getBlock("latest");
    const baseFee = web3.utils.toBN(block.baseFeePerGas);

    // Calculate the maxFeePerGas to ensure it's at least equal to baseFee
    const maxFeePerGas = gasPriceBN.gte(baseFee) ? gasPrice : baseFee.toString();

    // Get the nonce for the sender address
    const nonce = await web3.eth.getTransactionCount(senderAccount.address, 'pending');

    const transactionObject = {
      nonce: nonce,
      from: senderAccount.address,
      to: recipientAddress,
      value: amountInWei,
      gas: 21000, // Use an appropriate gas limit
      gasPrice: maxFeePerGas,
    };

    const signedTx = await web3.eth.accounts.signTransaction(transactionObject, privateKey);
    console.log("Signed Transaction:", signedTx);

    // Send the signed transaction
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Transaction Receipt:", txReceipt);
  } catch (error) {
    console.error("Error:", error);
  }
}

sendTransaction("elegant giggle step cause must can merge harvest guide rule ethics siren", "0.1", "0xd87D25a7e3Ea78bB39c3A27EF20c5c918E2bf0e8");
