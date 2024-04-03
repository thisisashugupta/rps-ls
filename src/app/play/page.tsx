"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import { useAccount } from 'wagmi'

const SearchNewGame = dynamic(() => import('./SearchNewGame'), { ssr: false })
const SearchOldGame = dynamic(() => import('./SearchOldGame'), { ssr: false })

export default function Page() {
  
  const { 
    isConnected, 
    isConnecting, 
    isDisconnected, 
    isReconnecting 
  } = useAccount()

  if(isDisconnected) return <div className='mt-16 flex justify-center'>Connect Wallet to Continue</div>
  if(isConnecting) return <div className='mt-16 flex justify-center'>isConnecting</div>
  if(isReconnecting) return <div className='mt-16 flex justify-center'>isReconnecting</div>

  return (
    <main className="min-h-screen flex flex-col items-center">
      {isConnected && <div className="mt-16 max-w-7xl w-full flex flex-col items-center p-12 font-mono">
        <SearchNewGame/>
        <SearchOldGame/>
      </div>}
    </main>
  );
}