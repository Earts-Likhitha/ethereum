const crypto = require('crypto');
const base58 = require('base-58');
const SHA3 = require('crypto-js/sha3');

// Network byte for Monero testnet (18 in hexadecimal)
const networkByte = Buffer.from([0x12]);

// Generate a random 32-byte private spend key and public spend key
const privateSpendKey = crypto.randomBytes(32);
const publicSpendKey = crypto.randomBytes(32);

// Generate a random 32-byte private view key and public view key
const privateViewKey = crypto.randomBytes(32);
const publicViewKey = crypto.randomBytes(32);

// Concatenate the keys and network byte
const dataToHash = Buffer.concat([networkByte, publicSpendKey, publicViewKey]);

// Calculate the Keccak-256 hash
const hash = SHA3(dataToHash, { outputLength: 256 });

// Extract the first four bytes (32 bits) of the hash as the checksum
const checksum = Buffer.from(hash.toString().substring(0, 8), 'hex');

// Concatenate the parts to create the address
const addressBytes = Buffer.concat([
  networkByte, // Network byte
  publicSpendKey, // Public spend key
  publicViewKey, // Public view key
  checksum, // Checksum
]);

// Encode the address in Base58
const address = base58.encode(addressBytes);

console.log('Monero Testnet Address:', address);



