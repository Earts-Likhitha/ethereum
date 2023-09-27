const bip39 = require("bip39");
const hdkey = require("hdkey");
const Web3 = require('web3');
const {from} = require("@iotexproject/iotex-address-ts")
const axios = require('axios');


// Define your IoTeX mnemonic and HD path
async function IoTeXSendTransaction(mnemonic,amount,recipientAddress){
  try{
    const providerURL = 'https://babel-api.testnet.iotex.io'; // Use the appropriate Infura URL for the Ethereum network you want to use
    const web3 =await new Web3(providerURL);
    const hdPath = "m/44'/304'/0'/0/0";  // This is an example, make sure to use the correct HD path for IoTeX

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = hdkey.fromMasterSeed(seed);
  const ioTexChild = root.derive(hdPath);
  const privateKey = ioTexChild.privateKey.toString('hex'); // Convert the private key to a hex string
 

const senderAccount = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
const ioTexAddress = from(senderAccount.address);
console.log(ioTexAddress.string());

 //checkIoTeXBalance(address) 
// const response = await axios.get(`https://testnet.iotexscan.io/_next/data/O-e0GQLRf6FhyeBCmlK-U/address/${ioTexAddress.string()}.json`);
// const balance = response.data.pageProps.accountInfo.balance
// console.log(balance/(10**18)+ " IOTX");

//checking ioTex balance based on ethereum address
await web3.eth.getBalance(senderAccount.address).then(
  function (balance) {
      let iotxBalance = (balance)/(10**18);
      console.log("Balance of %s is %s IOTX",ioTexAddress.string(),iotxBalance)
}); 


//Send Transaction

// Configure the transfer settings
let txConfig = {
  from: senderAccount.address,
  to: recipientAddress,
  gasPrice: "1000000000000",
  gas: "85000",
  value: amount*(10**18),  //converting amount in Rau to IOTX
  chainId :"4690"
};

// Sign the tx
const signedTx = await web3.eth.accounts.signTransaction(txConfig, privateKey);
    console.log("Signed Transaction:", signedTx);

    // Broadcast the signed transaction
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Transaction Receipt:", txReceipt);
  }
  catch(error){
    console.log(error)
  }

}

IoTeXSendTransaction("elegant giggle step cause must can merge harvest guide rule ethics siren",1,"0xdbf7c3059834a26240b35cfddbd07677501be42b")



