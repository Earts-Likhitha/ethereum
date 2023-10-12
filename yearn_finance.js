const bip39 = require("bip39");
const hdkey = require("hdkey");
const Web3 = require('web3');

const providerURL = 'https://ethereum-goerli.publicnode.com';
const web3 = new Web3(providerURL);

const YFIContractAddress = '0x6c260F702B6Bb9AC989DA4B0fcbE7fddF8f749c4'; //Yearn Finanace contract address
const YFIContractABI =[{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

 async function sendYFITransaction(mnemonic, amountInYFI, recipientAddress) {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = hdkey.fromMasterSeed(seed);
    const hdPath = "m/44'/60'/0'"; // Ethereum HD path, including an account index
    const ethereumChild = root.derive(hdPath);
    const privateKey = ethereumChild.privateKey.toString('hex'); // Convert the private key to a hex string

    const senderAccount = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    console.log("Sender Account:", senderAccount.address);

    const YFIContract = new web3.eth.Contract(YFIContractABI, YFIContractAddress);
    //Balanace Checking
    const balanceInWei = await YFIContract.methods.balanceOf(senderAccount.address).call();

    // Convert the balance from Wei to LINK (considering 18 decimals)
    const balanceInYFI = web3.utils.fromWei(balanceInWei, 'ether');

    console.log(`YFI Balance for Address ${senderAccount.address}: ${balanceInYFI} YFI`);
    
     // Get the current gas price
     const gasPrice = await web3.eth.getGasPrice();
     const gasPriceBN = web3.utils.toBN(gasPrice);
 
     //Get the current base fee
     const block = await web3.eth.getBlock("latest");
     const baseFee = web3.utils.toBN(block.baseFeePerGas);
 
     // Calculate the maxFeePerGas to ensure it's at least equal to baseFee
     const maxFeePerGas = gasPriceBN.gte(baseFee) ? gasPrice : baseFee.toString()

    //Transferring the amount
    const amountInWei = web3.utils.toWei(amountInYFI.toString(), 'ether');

    
    const transferData = YFIContract.methods.transfer(recipientAddress, amountInWei).encodeABI();

    const nonce = await web3.eth.getTransactionCount(senderAccount.address, 'pending');

    const transactionObject = {
      nonce: nonce,
      from: senderAccount.address,
      to: YFIContractAddress,
      gas: 210000, // Adjust the gas limit as needed
      gasPrice: maxFeePerGas,
      data: transferData,
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

sendYFITransaction("light shuffle sword will rude muscle pepper order symbol conduct bomb card", "0.000000001", "0xd87D25a7e3Ea78bB39c3A27EF20c5c918E2bf0e8");




