const sdk = require("@crypto-org-chain/chain-jslib");
const HDKey = sdk.HDKey;
const Secp256k1KeyPair = sdk.Secp256k1KeyPair;
const Units = sdk.Units;
const Big = sdk.utils.Big;
const CroSDK = sdk.CroSDK
const axios = require('axios');
const {assertIsBroadcastTxSuccess} = require('@cosmjs/stargate')


async function generateCroeseidTestnetAddress(mnemonic,amountInCRO,recipientAddress) {
try{
    const hdPath = "m/44'/394'/0'/0/0"; // HD path for Croeseid testnet

  // Create an HD wallet instance from the mnemonic
   const wallet = await HDKey.fromMnemonic(mnemonic);
  // Derive a private key for the testnet address
  const privateKey = await wallet.derivePrivKey(hdPath);
  // Create a Secp256k1KeyPair from the private key
  const keyPair = Secp256k1KeyPair.fromPrivKey(privateKey);
   // Specify the network (Croeseid testnet)
   const cro = CroSDK({ 
    network: {
    defaultNodeUrl: 'https://crypto.org/explorer/croeseid4/',
    chainId: 'testnet-croeseid-4',
    addressPrefix: 'tcro',
    validatorAddressPrefix: 'tcrocncl',
    validatorPubKeyPrefix: 'tcrocnclconspub',
    coin: {
        baseDenom: 'basetcro',
        croDenom: 'tcro',
    },
    bip44Path: {
        coinType: 394,
        account: 0,
    },
    rpcUrl: 'https://testnet-croeseid-4.crypto.org:26657',
    }, 
    });
 

  // Generate a Croeseid testnet address
  const senderAddress = new cro.Address(keyPair.getPubKey()).account()
  console.log(`Croeseid Testnet Address: ${senderAddress}`) //

  //Balance checking 
  const apiUrl = `https://crypto.org/explorer/croeseid4/api/v1/accounts/${senderAddress}`;
  const response = await axios.get(apiUrl);
  console.log(response.data.result.balance);
  
  

  // Create a Cro client
  const client = await cro.CroClient.connect();

  const rawTx = new cro.RawTransaction();
  
  const res = await axios.get("https://testnet-croeseid-4.crypto.org:26657/block")
  const blockHeight = res.data.result.block.header.height+10;

  const feeAmount = new cro.Coin("28000", Units.BASE);

// Customize transaction parameters
rawTx.setMemo("Hello Test Memo");
rawTx.setGasLimit("280000");//gas limit for standard transaction
rawTx.setFee(feeAmount);
rawTx.setTimeOutHeight(blockHeight.toString())




  // Create a message for sending CRO
  const sendAmount = new cro.Coin(amountInCRO, Units.BASE);
  const msgSend = new cro.bank.MsgSend({
    fromAddress: senderAddress,
    toAddress:senderAddress, // Replace with the recipient's address
    amount: sendAmount,
  });
  

  const account1 = await client.getAccount(senderAddress);
  const accountNumber = account1["accountNumber"];
  const accountSequence = account1["sequence"];

  // Append the message to the raw transaction
  rawTx.appendMessage(msgSend);
  // Add the signer information
  const signableTx = rawTx.addSigner({
    publicKey: keyPair.getPubKey(),
    accountNumber:new Big(accountNumber),
    accountSequence: new Big(accountSequence),
  }).toSignable();

  // Sign the transaction
  const signedTx = signableTx.setSignature(0, keyPair.sign(signableTx.toSignDoc(0))).toSigned();
  
  // Broadcast the signed transaction
    const result = await client.broadcastTx(signedTx.encode().toUint8Array());
    assertIsBroadcastTxSuccess(result);
    console.log(result)
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

generateCroeseidTestnetAddress("elegant giggle step cause must can merge harvest guide rule ethics siren","1","0xd87D25a7e3Ea78bB39c3A27EF20c5c918E2bf0e8")
  
