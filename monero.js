const bip39 = require("bip39");
 const hdkey = require("hdkey");
 const web3 = require("web3");

// async function sendMoneroTrasaction(mnemonic,amount,recipientAddress){
//     const seed = await bip39.mnemonicToSeed(mnemonic);
//     const root = hdkey.fromMasterSeed(seed);
//     const hdPath = "m/44'/128'/0'/0/0"; // Ethereum HD path, including an account index
//     const moneroChild = root.derive(hdPath);
//     const privateKey = moneroChild.privateKey.toString('hex');
// }
const moneroWallet = require('monero-nodejs');

async function sendMoneroTransaction(mnemonic) {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = hdkey.fromMasterSeed(seed)
    const hdPath = "m/44'/128'/0'/0/0"; // Ethereum HD path, including an account index
    const moneroChild = root.derive(hdPath);
    console.log(moneroChild);
    const privateKey = moneroChild.privateKey.toString('hex');
    
  // Replace 'your_mnemonic' with your actual mnemonic
  

  const address = Wallet.prototype.createWalletFull('monero_wallet', privateKey, 'English');

  //await Wallet.restore(mnemonic);

  const recipientAddress ='0xd87D25a7e3Ea78bB39c3A27EF20c5c918E2bf0e8';
  const amountToSend = 1; // Amount in atomic units (1 XMR = 1e12 atomic units)

  const txConfig = {
    address: recipientAddress,
    amount: amountToSend,
    priority: Monero.TxPriority.Low,
  };

  try {
    const txHash = await wallet.send(txConfig);
    console.log('Transaction sent. Tx Hash:', txHash);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

sendMoneroTransaction('elegant giggle step cause must can merge harvest guide rule ethics siren');

