import { type AddressLike } from 'ethers';

const etherscan_api_key = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
if (!etherscan_api_key) throw new Error('No Etherscan API Key Provided');

export const getTransactions = async (userAddress: AddressLike) => {
    try {
        const response = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscan_api_key}`); // &page=1&offset=10
        const { result } = await response.json()
        return result;  
    } catch (error) {
        console.error(error)
    }
}