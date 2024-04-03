import React from 'react'
import { useAccount } from 'wagmi'
import { useRecoilState } from 'recoil'
import { gameAtom } from '@/app/store/atoms/game'

export default function TimeoutTimer() {

    const { address } = useAccount()
    const [game, setGame] = useRecoilState(gameAtom)

    // TODO: Implement Timeout Timer
    // get TIMEOUT and lastAction from the contract

    // if j2 did not make a move within the timeout period, j1 can withdraw the stake
    // if j1 did not reveal within the timeout period, j2 can withdraw the stake

    // 1. Create a timer that starts for 5 minutes
    // 2. If the timer reaches 0, make a state change to the game state

  return (
    <div>
      Timeout Timer
    </div>
  )
}