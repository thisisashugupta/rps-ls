"use client"

import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { isAddress } from 'ethers'
import { useEthersProvider } from '@/app/providers/ethers/ethersProvider'
import RPS from '@/contracts/RPS.json'
import GameArea from './GameArea'
import ExitGame from './ExitGame'

export default function Page({ params }: { params: { game_id: string } }) {

  const { game_id } = params
  const provider = useEthersProvider()
  const { 
    isConnected, 
    isConnecting, 
    isDisconnected, 
    isReconnecting 
  } = useAccount()

  const [isRPSContract, setIsRPSContract] = useState(true);

  useEffect(() => {
    async function checkIsRPSContract() {
      if (!isAddress(game_id) || !provider) {
        setIsRPSContract(false);
        return;
      }
      try {
        const bytecode = await provider.getCode(game_id);
        setIsRPSContract(bytecode === RPS.deployedBytecode.object);
      } catch (error) {
        console.error("Error checking contract:", error);
        setIsRPSContract(false);
      }
    }
    checkIsRPSContract();
  }, [provider, game_id]);


  if (!isAddress(game_id)) return <div className='mt-16 flex justify-center'>Invalid game address</div>
  if (!isRPSContract) return <div className='mt-16 flex justify-center'>No such game found</div>
  if (isDisconnected) return <div className='mt-16 flex justify-center'>Connect Wallet to Continue</div>
  if (isConnecting) return <div className='mt-16 flex justify-center'>Connecting...</div>
  if (isReconnecting) return <div className='mt-16 flex justify-center'>Reconnecting...</div>


  return (
    <main className="flex min-h-screen flex-col items-center font-mono">
      {isConnected && <div className="max-w-7xl w-full mt-16 p-8">
        <GameArea game_id={game_id} />
        <ExitGame />
      </div>}
    </main>
  )    
}