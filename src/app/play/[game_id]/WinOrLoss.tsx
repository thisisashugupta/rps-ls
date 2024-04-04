'use client'

import React, { useState, useEffect } from 'react'
import { useEthersProvider } from '@/app/providers/ethers/ethersProvider'
import RPS from '@/contracts/RPS.json'
import { Contract } from 'ethers'
import { useRecoilValue } from 'recoil'
import { gameAtom } from '@/app/store/atoms/game'
import Heading from '@/components/ui/heading'
import { useAccount } from 'wagmi'

export default function WinOrLoss() {
    const { address } = useAccount()
    const provider = useEthersProvider()
    const game = useRecoilValue(gameAtom)

    const isWon = localStorage.getItem('won')
    const [won, setWon] = useState<boolean | null>(isWon==='true' ? true : isWon==='false' ? false : null)

    useEffect(() => {
        const myMove = address === game.j1 ? game.c1 : game.c2
        const opponentMove = address === game.j1 ? game.c2 : game.c1
        console.log('c1:', game.c1, 'c2:', game.c2)
        async function checkWinOrLoss() {
            try {
                const contract = new Contract(game.contractAddress!, RPS.abi, provider)
                const result = await contract.win(myMove, opponentMove)
                console.log('win Or Loss:', result)
                localStorage.setItem('won', String(result))
                setWon(result)
                // setWon(result)
            } catch (error : any) {
                console.error(error)
            }
        }
        checkWinOrLoss()
    }, [game.contractAddress, provider, address, game.j1, game.c1, game.c2])

  return (
      <Heading>{won===null ? "Loading..." : won ? "You Won" : "You Lost"}</Heading>
  )
}
