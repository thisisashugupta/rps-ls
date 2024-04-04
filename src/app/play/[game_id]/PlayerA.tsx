import React, { useEffect } from 'react'
import RPS from '@/contracts/RPS.json'
import { useEthersSigner } from '@/app/providers/ethers/ethersSigner'
import { Contract } from 'ethers'
import { useRecoilState } from 'recoil'
import { gameAtom, gamePlayAtom } from '@/app/store/atoms/game'
import { Move } from '@/app/store/types/move'
import { decryptMove } from '@/lib/actions'
import useMonitorTxs from '@/hooks/useMonitorTxs'
import { toast } from 'sonner'
import Heading from '@/components/ui/heading'
import Button from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'
import dynamic from 'next/dynamic'
const WinOrLoss = dynamic(() => import('./WinOrLoss'), { ssr: false })

export default function PlayerA() {
  // signer
  const signer = useEthersSigner()
  const { monitorPlayer2Move } = useMonitorTxs()

  const [game, setGame] = useRecoilState(gameAtom)
  const [gamePlay, setGamePlay] = useRecoilState(gamePlayAtom)

  useEffect(() => {
    monitorPlayer2Move(game.j2!, game.contractAddress!)
  }, [game.j2, game.contractAddress, monitorPlayer2Move])

  function handleRevealMove() {
    async function solve() {
      try {
        const ciphertext = localStorage.getItem('ciphertext')!
        const iv = localStorage.getItem('iv')!
        const c1Hash = localStorage.getItem('c1-hash')!
        const { salt, move }= await decryptMove(ciphertext, iv, c1Hash)

        // TODO: ?????? SUSCEPTIBLE TO FRONT-RUNNING ATTACK, OTHER PARTY CAN OBSERVE MEMPOOL AND FRONTRUN TRANSACTIONS TO TIMEOUT PLAYER1 ??????
        const contract = new Contract(game.contractAddress!, RPS.abi, signer);
        toast('Approve the transaction request in your wallet.');
        const tx = await contract.solve(Number(move), salt);
        toast('tx mined. waiting for confirmations...');
        const receipt = await tx.wait(1); // wait(confirms?: number, timeout?: number)⇒ Promise< null | TransactionReceipt >
        // console.log('receipt:', receipt);
        toast('Tx Successful!');
        localStorage.setItem('c1', String(move))
        localStorage.setItem('hasPlayer1Revealed', String(true))
        setGame((prev) => ({...prev, c1: Number(move)}))
        setGamePlay((prev) => ({...prev, hasPlayer1Revealed:true}))
      } catch (error : any) {
        console.error(error)
        toast(String(error?.info?.error?.message))
      }
    }
    solve();
  }

  function handleJ2Timeout() {
    async function j2Timeout() {
      try {
        const contract = new Contract(game.contractAddress!, RPS.abi, signer);
        toast('Approve the transaction request in your wallet.');
        const tx = await contract.j2Timeout();
        toast('tx mined. waiting for confirmations...');
        const receipt = await tx.wait(1); // wait(confirms?: number, timeout?: number)⇒ Promise< null | TransactionReceipt >
        // console.log('receipt:', receipt);
        toast('Tx Successful!');
        localStorage.removeItem('game-contract-address')
      } catch (error : any) {
        console.error(error)
        toast(String(error)) //?.info?.error?.message
      }
    }
    j2Timeout();
  }


  return (
    <div className='grid grid-rows-2 space-y-2'>

      <div id='player2' className='border border-purple-500 rounded-lg p-6 my-6'>
        {gamePlay.hasPlayer2Played ? 
          <Heading>{`Player 2's Move: ${Move[Number(game.c2)]}`}</Heading> : 
          <Heading>Waiting for Player 2 to play...</Heading>
        }
      </div>
      
      <div id='player1' className='border border-purple-500 rounded-lg p-6 my-6'>

      {gamePlay.hasPlayer2Played ?
        gamePlay.hasPlayer1Revealed ?
        <WinOrLoss /> : 
        <>
          <Heading>Reveal your Move</Heading>
          <div className='my-4'>
            <Button 
              text='Reveal' 
              onClick={handleRevealMove} 
            />
          </div>
        </> :
        gamePlay.isPlayer2TimedOut ? 
        <>
          <Heading>Timeout for j2 to play</Heading>
          <Button 
            text='Get stake back' 
            onClick={handleJ2Timeout} 
            className='my-4'
          />
        </> :
        <Spinner/>
        }
      </div>
      
    </div>
  )
}