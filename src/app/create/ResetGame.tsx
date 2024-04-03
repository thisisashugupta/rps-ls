import React from 'react'
import { useSetRecoilState } from 'recoil'
import { deployGameAtom } from '@/app/store/atoms/game'
import { Move } from '@/app/store/types/move'
import { clearLocalStorage } from '@/lib/localStorage'
import Button from '@/components/ui/button'

export default function ResetGame() {
    const setDeployGame = useSetRecoilState(deployGameAtom)

    function handleReset() {
        clearLocalStorage()
        setDeployGame({
          move: Move.Null,
          secondPlayerAddress: '',
          stakeAmount: '',
          salt: BigInt(''),
          moveHash: null
        })
    }

    return (
        <Button 
            text='Reset'
            onClick={handleReset} 
            className='my-4'
        />
    )
}