"use client"

import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'ethers'
import { useGameDetails } from '@/hooks/useGameDetails'
import { useSetRecoilState } from 'recoil'
import { gameAtom } from '@/app/store/atoms/game'
import dynamic from 'next/dynamic'
const PlayerA = dynamic(() => import('./PlayerA'), { ssr: false })
const PlayerB = dynamic(() => import('./PlayerB'), { ssr: false })
const TimeoutTimer = dynamic(() => import('./TimeoutTimer'), { ssr: false })

export default function GameArea({ game_id }: { game_id: string }) {

  const { address } = useAccount()
  const setGame = useSetRecoilState(gameAtom)
  const gameDetails:any = useGameDetails(game_id as `0x${string}`)

  useEffect(() => {
    console.log('gameDetails:', gameDetails);
    setGame((prev) => ({ ...prev, ...gameDetails }))
  }, [gameDetails, setGame])
  
  return (
    <>
        {/* GAME DETAILS */}
        <div className='w-full flex flex-col items-center border border-purple-500'>
            <p className='px-4 py-2'>Game Contract Address: {game_id}</p>
            {(address === gameDetails?.j1 as `0x${string}`) && <p className='px-4 py-2'>Player2: {gameDetails?.j2}</p>}
            {(address === gameDetails?.j2 as `0x${string}`) && <p className='px-4 py-2'>Player1: {gameDetails?.j1}</p>}
            {gameDetails?.stake && <p className='px-4 py-2'>Stake: {String(formatEther(String(gameDetails?.stake)))} ETH</p>}
        </div>

        {/* SHOW VALID PLAYER */}
        <div className='my-4'>
          {Boolean(gameDetails.j1 && gameDetails.j2) ? 
            <>
              {
                (address === gameDetails?.j1 as `0x${string}`) ?
                <PlayerA /> :
                (address === gameDetails.j2 as `0x${string}`) ?
                <PlayerB /> :
                <p>You are not a valid player for this game.</p>
              }
            </> :
            <>Loading...</>
          }
        </div>

        {/* TODO: TIMEOUT TIMER */}
        <div className='w-full my-4 flex flex-col items-center border border-purple-500'>
          <TimeoutTimer />
        </div>
    </>
  )    
}