"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import { useAccount } from 'wagmi'

const J1Rules = dynamic(() => import('./J1Rules'), {ssr: false})
const CreateGame = dynamic(() => import('./CreateGame'), {ssr: false})
const ResetGame = dynamic(() => import('./ResetGame'), {ssr: false})

export default function Page() {  
  const { isConnected, isConnecting, isDisconnected, isReconnecting } = useAccount()

  if (isDisconnected) return <div className='mt-16 flex justify-center'>Connect Wallet to Continue</div>
  if (isConnecting) return <div className='mt-16 flex justify-center'>Connecting</div>
  if (isReconnecting) return <div className='mt-16 flex justify-center'>Reconnecting</div>

  return (
    <>
    <main className="flex min-h-screen flex-col items-center">
      <div className='w-full h-16' />
      {isConnected && <div className="max-w-7xl w-full flex flex-col items-center justify-center p-12 font-mono text-sm">
        <J1Rules />
        <CreateGame />
        <ResetGame />
      </div>}
    </main>
    </>
  );
}
