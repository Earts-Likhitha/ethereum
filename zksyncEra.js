const Web3 = require('web3');
const HDKey = require('hdkey');
const bip39 = require('bip39');
const zksync = require('zksync');

const providerURL = 'https://testnet.era.zksync.dev'; // Replace with your Infura project ID
const web3 = new Web3(new Web3.providers.HttpProvider(providerURL));

//const zkSyncProvider = new zksync.Provider('ropsten'); // Replace with the appropriate network

const mnemonic = 'elegant giggle step cause must can merge harvest guide rule ethics siren'; // Replace with your mnemonic phrase
const recipientAddress = '0xd87D25a7e3Ea78bB39c3A27EF20c5c918E2bf0e8'; // Replace with recipient address
const amountInEther = 0.01; // Amount in ETH

async function sendTransaction() {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = HDKey.fromMasterSeed(seed);
    const hdPath = "m/44'/60'/0'/0/0"; // Ethereum HD path, including an account index
    const ethereumChild = root.derive(hdPath);
    const privateKey = ethereumChild.privateKey.toString('hex');

    const fromAddress = web3.eth.accounts.privateKeyToAccount('0x' + privateKey).address;

    console.log("Sender Address:", fromAddress);

    const syncWallet = await zksync.Wallet.fromEthSigner(
      new zksync.ethers.Wallet(privateKey), //zkSyncProvider),
      //zkSyncProvider
    );

    const transfer = await syncWallet.syncTransfer({
      to: recipientAddress,
      token: 'ETH',
      amount: web3.utils.toWei(amountInEther.toString(), 'ether'),
      fee: 0, // Set your desired fee
    });

    await transfer.awaitReceipt();

    console.log('Transfer completed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

sendTransaction();
