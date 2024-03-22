const HASHER_CONTRACT_ADDRESS = process.env.HASHER_CONTRACT_ADDRESS;

if (!HASHER_CONTRACT_ADDRESS) {
  throw new Error('HASHER_CONTRACT_ADDRESS is not set');
}

export const hasherContractAddress = HASHER_CONTRACT_ADDRESS;