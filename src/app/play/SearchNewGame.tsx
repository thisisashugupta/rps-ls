"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRecoilValue } from 'recoil'
import { gameAtom } from '@/app/store/atoms/game'
import useMonitorTxs from '@/hooks/useMonitorTxs'
import Spinner from '@/components/ui/spinner'


export default function SearchNewGame() {
  const router = useRouter()
  const game = useRecoilValue(gameAtom)
  const { monitorNewGameDeployments } = useMonitorTxs()

  useEffect(() => {
    monitorNewGameDeployments()
  }, [monitorNewGameDeployments])

  useEffect(() => {
    if (game.contractAddress) {
      localStorage.setItem('game-contract-address', game.contractAddress)
      router.push(`/play/${game.contractAddress}`)
    }
  }, [game.contractAddress, router])

  return (
    <div className='p-4'>
        <Spinner className='w-8 h-8'/>
        <p className='my-4'>Looking for a Game for you</p>
    </div>
  );
}