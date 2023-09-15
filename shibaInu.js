const bip39 = require("bip39");
const hdkey = require("hdkey");
const Web3 = require('web3');

const providerURL = 'https://ethereum-goerli.publicnode.com'; // Replace with your Infura project ID
const web3 = new Web3(providerURL);

const shibContractAddress = '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE'; // Shiba Inu contract address
const shibContractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"},{"name":"totalSupply","type":"uint256"},{"name":"feeReceiver","type":"address"},{"name":"tokenOwnerAddress","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]; // Shiba Inu contract ABI

async function sendSHIBTransaction(mnemonic, amountInSHIB, recipientAddress) {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = hdkey.fromMasterSeed(seed);
    const hdPath = "m/44'/60'/0'"; // Ethereum HD path, including an account index
    const ethereumChild = root.derive(hdPath);
    const privateKey = ethereumChild.privateKey.toString('hex'); // Convert the private key to a hex string

    const senderAccount = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    console.log("Sender Account:", senderAccount.address);

    const shibContract = new web3.eth.Contract(shibContractABI, shibContractAddress); // Creating an instance of the SHIB contract

     //Balanace Checking
     const balanceInWei = await shibContract.methods.balanceOf(senderAccount.address).call();

     // Convert the balance from Wei to DAI (considering 18 decimals)
    const balanceInShib = web3.utils.fromWei(balanceInWei, 'ether');
    console.log(`ShibhaInu Balance for Address ${senderAccount.address}: ${balanceInShib} SHIB`);

    const amountInWei = web3.utils.toWei(amountInSHIB.toString(), 'ether');

    const transferData = shibContract.methods.transfer(recipientAddress, amountInWei).encodeABI();

    const nonce = await web3.eth.getTransactionCount(senderAccount.address, 'pending');
    
     //Calculating the gasPrice
     const gasPrice = await web3.eth.getGasPrice();
     const gasPriceBN = web3.utils.toBN(gasPrice);
 
     //Get the current base fee
     const block = await web3.eth.getBlock("latest");
     const baseFee = web3.utils.toBN(block.baseFeePerGas);
 
     // Calculate the maxFeePerGas to ensure it's at least equal to baseFee
     const maxFeePerGas = gasPriceBN.gte(baseFee) ? gasPrice : baseFee.toString();
 

    const transactionObject = {
      nonce: nonce,
      from: senderAccount.address,
      to: shibContractAddress,
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

sendSHIBTransaction("light shuffle sword will rude muscle pepper order symbol conduct bomb card", 0, "0xd87D25a7e3Ea78bB39c3A27EF20c5c918E2bf0e8"); // Replace with your mnemonic, amount, and recipient address
