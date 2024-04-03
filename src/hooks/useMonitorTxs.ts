'use client'

import RPS from '@/contracts/RPS.json'
import { Contract } from 'ethers'
import { useEthersProvider } from '@/app/providers/ethers/ethersProvider'
import { gameAtom, gamePlayAtom } from '../app/store/atoms/game'
import { c2State } from '@/app/store/selectors/move'
import { Move } from '@/app/store/types/move'
import { useSetRecoilState } from 'recoil'
import { useAccount } from 'wagmi'
import { decodeFunctionData } from 'viem'
import { toast } from 'sonner'

export default function useMonitorTxs() {

  const provider = useEthersProvider()
  const { address } = useAccount()
  const setGame = useSetRecoilState(gameAtom)
  const setGamePlay = useSetRecoilState(gamePlayAtom)
  const setC2 = useSetRecoilState(c2State)

  /*
  monitorNewTransactions
    fetches all the transactions that are mined after the current block
    checks if the transaction is a contract creation transaction
    checks if the contract is a RockPaperScissors contract
    checks if the address of the second player is the last argument of the constructor
  */
 
  const monitorNewGameDeployments = () => {
    console.log("Monitoring new Game Deployments")
    
    if (!provider) {
      console.log('provider is null');
      return;
    }

    provider.on('block', async (blockNumber) => {
      try {
        console.log('blockNumber', blockNumber);
        const block = await provider.getBlock(blockNumber, true);
        if (!block) return;
        
        const blockPayload = await Promise.all(block!.transactions.map(hash => block!.getPrefetchedTransaction(hash)))
        const contractCreationTxs = blockPayload.filter(tx => !tx.to)
        console.log('contractCreationTxs', contractCreationTxs)
        
        for (const tx of contractCreationTxs) {
          
          const inputData = tx.data; // bytecode + constructor arguments
          if (inputData.startsWith(RPS.bytecode.object)) 
          {
            // last constructor argument is the address of second player for that contract
            // address = 20 bytes = 40 characters
            // it is padded with 12 bytes of 0s to the left
            const last40Chars = inputData.substring(inputData.length - 40);
            if (address?.toLowerCase() === `0x${last40Chars}`) 
            {
              // new game has been deployed for the connected address
              const txReceipt = await provider.getTransactionReceipt(tx.hash);
              const contractAddress = txReceipt?.contractAddress;
              console.log('new game:', contractAddress);
              toast('new game found')
              contractAddress && setGame((prev) => ({...prev, contractAddress}));
              break;
            }
          }
        }
      } catch (error) {
        console.log('oops, error occured')
        console.error(error)
      }
    })
  }


  const stopMonitorNewGameDeployments = () => {
    console.log("Stopping Monitoring of new Game Deployments");
    if (!provider) return;
    provider.off('block')
  }


  const monitorContract = (contractAddress: string) => {
    console.log(`Monitoring Contract Address: ${contractAddress}`);
    
    if (!provider) {
      console.log('provider is null');
      return;
    }

    provider.on('block', async (blockNumber) => {
      try {
        console.log('blockNumber', blockNumber);
        const block = await provider.getBlock(blockNumber, true);
        if (!block) return
        const blockPayload = await Promise.all(block!.transactions.map(hash => block!.getPrefetchedTransaction(hash)))
        // blockPayload is an array of transactions
        // we are interested in the transactions that interact with the contract
        const contractIntreactionTxs = blockPayload.filter(tx => tx.to === contractAddress)
        console.log('contractIntreactionTxs', contractIntreactionTxs);
        for (const tx of contractIntreactionTxs) {
          const txReceipt = await provider.getTransactionReceipt(tx.hash)
          console.log('txReceipt', txReceipt)
          const contractAddress = txReceipt?.contractAddress
          console.log('contractAddress', contractAddress)
          const inputData = tx.data // bytecode + constructor arguments
          console.log('inputData', inputData)
          toast('contract interaction found')
          // contractAddress && setGame((prev) => ({...prev, contractAddress}))
          // break
        }
      } catch (error) {
        console.log('oops, error occured')
        console.error(error)
      }
    })
  }

  
  const monitorPlayer2Move = (player2: string, contractAddress: string) => {
    console.log(`Monitoring Play of player2:${player2} to Contract Address:${contractAddress}`);

    if (!provider) {
      console.log('provider is null');
      return;
    }

    provider.on('block', async (blockNumber) => {
      try {
        console.log('blockNumber', blockNumber)
        const block = await provider.getBlock(blockNumber, true)
        if (!block) return
        const blockPayload = await Promise.all(block!.transactions.map(hash => block!.getPrefetchedTransaction(hash)))
        // blockPayload is an array of transactions
        // we are interested in the transactions from player2 that interact with the contract
        const playTxs = blockPayload.filter(tx => ((tx.from?.toLowerCase() === player2?.toLowerCase()) && (tx.to?.toLowerCase() === contractAddress?.toLowerCase())))
        if (playTxs.length === 0) return
        toast('contract interaction found')
        // create a function call to contractAddress to check the state of c2
        const contract = new Contract(contractAddress, RPS.abi, provider)
        const c2 = await contract.c2()
        if (c2 !== BigInt(0)) {
          localStorage.setItem('c2', String(c2))
          setC2(c2)
          localStorage.setItem('hasPlayer2Played', String(true))
          setGamePlay((prev) => ({...prev, hasPlayer2Played:true}))
        }
      } catch (error) {
        console.log('oops, error occured')
        console.error(error)
      }
    })
  }


  const monitorPlayer1Reveal = (player1: string, contractAddress: string) => {
    console.log(`Monitoring Reveal of player1:${player1} to Contract Address:${contractAddress}`);

    if (!provider) {
      console.log('provider is null');
      return;
    }

    provider.on('block', async (blockNumber) => {
      try {
        console.log('blockNumber', blockNumber)
        const block = await provider.getBlock(blockNumber, true)
        if (!block) return
        const blockPayload = await Promise.all(block!.transactions.map(hash => block!.getPrefetchedTransaction(hash)))
        // blockPayload is an array of transactions
        // we are interested in the transactions from player1 that interact with the contract
        const playTxs = blockPayload.filter(tx => ((tx.from?.toLowerCase() === player1?.toLowerCase()) && (tx.to?.toLowerCase() === contractAddress?.toLowerCase())))
        if (playTxs.length === 0) return
        const tx = playTxs[0]
        const { functionName, args } = decodeFunctionData({
          abi: RPS.abi,
          data: tx.data as `0x${string}`
        })
        toast('contract interaction found')
        // create a function call to contractAddress to check the state of stake
        const contract = new Contract(contractAddress, RPS.abi, provider)
        const stake = await contract.stake()
        console.log('stake:', stake, typeof stake);
        if (stake === BigInt(0)) {
          setGame((prev) => ({...prev, stake, c1: args?.[0] as Move}))
          localStorage.setItem('stake', String(stake))
          localStorage.setItem('c1', String(args?.[0]))
          localStorage.setItem('hasPlayer1Revealed', String(true))
          setGamePlay((prev) => ({...prev, hasPlayer1Revealed:true}))
        }
      } catch (error) {
        console.log('oops, error occured')
        console.error(error)
      }
    })
  }
  
  
  return { monitorNewGameDeployments, stopMonitorNewGameDeployments, monitorContract, monitorPlayer2Move, monitorPlayer1Reveal }
}
