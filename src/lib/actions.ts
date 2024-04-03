"use server"
// SERVER ACTIONS

import crypto from 'crypto';
import { solidityPackedKeccak256 } from 'ethers';
import { Move } from '@/app/store/types/move';

if(!process.env.ENCRYPTION_PRIVATE_KEY) throw new Error('ENCRYPTION_PRIVATE_KEY not found in .env file');

const aesKey: Buffer = hashPrivateKey(process.env.ENCRYPTION_PRIVATE_KEY!);

type HashMoveProps = {
    move: Move,
    salt: bigint
}




// THIS FUNCTION TAKES A Move AND RETURNS ciphertext, iv, AND encryptedSalt
export async function encryptMove(move: string): Promise<{ ciphertext: string, iv: string, c1Hash: string }> {

  const salt = generateRandomSalt();
  const c1Hash = hashMove({ move: Number(move) as Move, salt });

  const { ciphertext, iv }: { ciphertext: Buffer, iv: Buffer } = encryptWithPrivateKey(aesKey, String(salt));
  
  return { ciphertext: ciphertext.toString('hex'), iv: iv.toString('hex'), c1Hash };
}
// EXAMPLE USAGE:
// const move: Move = Move.Paper;
// const { ciphertext, iv, c1Hash } = encryptMove(move);




export async function decryptMove(ciphertext: string, iv: string, c1Hash: string) : Promise<{ salt: string, move: String }>{

  const saltString = decryptWithPrivateKey(aesKey, Buffer.from(ciphertext, 'hex'), Buffer.from(iv, 'hex'));
  const salt = BigInt(saltString);

  for (let move in Move) {
    if (hashMove({ move: Number(move), salt }) === c1Hash) {
        return { salt: saltString, move }
    }
  }

  return { salt: "", move: "0" }
}
// EXAMPLE USAGE:
// const { salt, move } = decryptMove(ciphertext, iv, c1Hash);
// console.log('Decrypted move:', salt, move);




//// Helper functions:

// Function to generate a random uint256 salt
function generateRandomSalt () {
    const randomBytes = crypto.randomBytes(32); // Generate 32 bytes (256 bits) of random data
    const buffer = Buffer.from(randomBytes); // Convert the random bytes to a Buffer
    const salt = BigInt('0x' + buffer.toString('hex')); // Convert the buffer to a BigInt
    
    return salt;
}




// Function to hash a move with a salt
function hashMove ({move, salt}: HashMoveProps) {
    return solidityPackedKeccak256([ "uint8", "uint256" ], [ move, salt ]);
}




// Function to hash a string private key for encryption
function hashPrivateKey(privateKey: string): Buffer {
  // Ensure the encryption key is of the correct length for AES encryption (256 bits or 32 bytes)
  const keyBuffer: Buffer = Buffer.from(privateKey, 'utf-8');
  const aesKey: Buffer = crypto.createHash('sha256').update(keyBuffer).digest();

  return aesKey;
}




// Function to encrypt a plaintext string using a private (aes) key
function encryptWithPrivateKey(privateKey: Buffer, plaintext: string): { ciphertext: Buffer, iv: Buffer } {
  // Generate a random initialization vector (IV)
  const iv: Buffer = crypto.randomBytes(16);

  // Create a cipher using AES encryption in CBC mode
  const cipher: crypto.Cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(privateKey), iv);
  
  // Encrypt the plaintext
  let ciphertext: string = cipher.update(plaintext, 'utf-8', 'hex');
  ciphertext += cipher.final('hex');

  return { ciphertext: Buffer.from(ciphertext, 'hex'), iv };
}

//// Example usage:
// const { ciphertext, iv }: { ciphertext: Buffer, iv: Buffer } = encryptWithPrivateKey(aesKey, plaintext);
// console.log('Ciphertext:', ciphertext.toString('hex'));
// console.log('IV:', iv.toString('hex'));




// Function to decrypt a plaintext string using same old private (aes) key, ciphertext, and iv
function decryptWithPrivateKey(privateKey: Buffer, ciphertext: Buffer, iv: Buffer): string {
  // Create a decipher using AES decryption in CBC mode
  const decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(privateKey), iv);

  // Decrypt the ciphertext
  let decrypted: Buffer = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf-8');
}

//// Example usage:
// const decryptedText: string = decryptWithPrivateKey(aesKey, ciphertext, iv);
// console.log('Decrypted plaintext:', decryptedText);