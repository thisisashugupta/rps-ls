
import React from 'react'
import { useRouter } from 'next/navigation'
import { useSetRecoilState } from 'recoil'
import { gameAtom, gamePlayAtom, deployGameAtom } from '@/app/store/atoms/game'
import { Move } from '@/app/store/types/move'
import Button from '@/components/ui/button'
import { clearLocalStorage } from '@/lib/localStorage'


function ExitGame() {
  const router = useRouter()
  const setDeployGame = useSetRecoilState(deployGameAtom)
  const setGame = useSetRecoilState(gameAtom)
  const setGamePlay = useSetRecoilState(gamePlayAtom)

    const handleExitGame = () => {
        clearLocalStorage();
        setDeployGame({
          move: Move.Null,
          secondPlayerAddress: "",
          stakeAmount: "",
          salt: BigInt(""),
          moveHash: null,
        })
        setGame({
          contractAddress: null,
          j1: null,
          j2: null,
          c1Hash: null,
          c1: Move.Null,
          c2: Move.Null,
          stake: null,
          TIMEOUT: null,
          lastAction: null,
        });
        setGamePlay({
          hasPlayer1Played: true,
          hasPlayer2Played: false,
          hasPlayer1Revealed: false,
          isPlayer1TimedOut: false,
          isPlayer2TimedOut: false,
        });
        router.push('/');
      }


  return (
    <div className='p-4 flex justify-center'>
        <Button
            text='Exit Game'
            onClick={handleExitGame}
        />
    </div>
  )
}

export default ExitGame
