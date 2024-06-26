import React, { useEffect } from 'react'
import RPS from '@/contracts/RPS.json'
import { useEthersSigner } from '@/app/providers/ethers/ethersSigner'
import { useEthersProvider } from '@/app/providers/ethers/ethersProvider'
import { Contract } from 'ethers'
import { useRecoilState, useRecoilValue } from 'recoil'
import { gameAtom, gamePlayAtom } from '@/app/store/atoms/game'
import useMonitorTxs from '@/hooks/useMonitorTxs'
import SelectMove from '@/components/common/SelectMove'
import { c2State } from '@/app/store/selectors/move'
import { toast } from 'sonner'
import Heading from '@/components/ui/heading'
import Button from '@/components/ui/button'
import { Move } from '@/app/store/types/move'
import Spinner from '@/components/ui/spinner'
import dynamic from 'next/dynamic'
const WinOrLoss = dynamic(() => import('./WinOrLoss'), { ssr: false })

export default function PlayerB() {
  // signer
  const signer = useEthersSigner()
  // provider
  const provider = useEthersProvider()
  const { monitorPlayer1Reveal } = useMonitorTxs()

  const [game, setGame] = useRecoilState(gameAtom)
  const [gamePlay, setGamePlay] = useRecoilState(gamePlayAtom)
  const c2 = useRecoilValue(c2State)

  useEffect(() => {
    monitorPlayer1Reveal(game.j1!, game.contractAddress!)
  }, [game.j1, game.contractAddress, monitorPlayer1Reveal])


  function handlePlay() {

    async function getLastAction() {
      const contract = new Contract(game.contractAddress!, RPS.abi, provider)
      const lastAction = await contract.lastAction()
      localStorage.setItem('lastAction', String(lastAction))
      setGame((prev) => ({...prev, lastAction: Number(lastAction)}));
    }

    async function play() {
      try {
        const contract = new Contract(game.contractAddress!, RPS.abi, signer);
        toast('Approve the transaction request in your wallet.');
        const tx = await contract.play(c2, { value: game.stake });
        toast('tx submitted. waiting for confirmations...');
        const receipt = await tx.wait(1); // wait(confirms?: number, timeout?: number)⇒ Promise< null | TransactionReceipt >
        // console.log('receipt:', receipt);
        toast('Tx Successful!');
        getLastAction();
        localStorage.setItem('hasPlayer2Played', 'true')
        setGamePlay((prev) => ({...prev, hasPlayer2Played: true}))
      } catch (error : any) {
          console.error(error)
        toast(String(error?.info?.error?.message))
      }
    }

    play();
  }

  function handleJ1Timeout() {
    async function j1Timeout() {
      try {
        const contract = new Contract(game.contractAddress!, RPS.abi, signer);
        toast('Approve the transaction request in your wallet.');
        const tx = await contract.j1Timeout();
        toast('tx submitted. waiting for confirmations...');
        const receipt = await tx.wait(1); // wait(confirms?: number, timeout?: number)⇒ Promise< null | TransactionReceipt >
        // console.log('receipt:', receipt);
        toast('Tx Successful!');
        localStorage.removeItem('game-contract-address')
      } catch (error : any) {
        console.error(error)
        toast(String(error?.info?.error?.message))
      }
    }
    j1Timeout();
  }


  return (
    <div className='grid grid-rows-2 space-y-2'>

      <div id='player1' className='border border-purple-500 rounded-lg p-6 my-6'>
        {gamePlay.isPlayer1TimedOut ? 
        <>
          <Heading>Timeout for j1 to reveal</Heading>
          <div className='my-4'>
            <Button 
              text='Get stake back' 
              onClick={handleJ1Timeout} 
            />
          </div>
        </> : 
        gamePlay.hasPlayer1Revealed ? 
        <Heading>{`Player 1 has revealed Move: ${Move[Number(game.c1)]}`}</Heading> :
        gamePlay.hasPlayer2Played ? 
        <Heading>Waiting for Player 1 to Reveal move</Heading> :
        <Heading>Player 1 has played. Your Turn</Heading>
        }
      </div>

      
      <div id='player2' className='border border-purple-500 rounded-lg p-6 my-6'>
        {gamePlay.hasPlayer2Played ? 
        <>
          {gamePlay.hasPlayer1Revealed ? 
          <WinOrLoss /> : 
          <Spinner/>
          }
        </> : 
        <>
          <SelectMove 
            moveState={c2State}
            keyTag='c2'
          />
          <Button 
            text='Play' 
            onClick={handlePlay} 
            className='mt-4'
          />
        </>
        }
      </div>


    </div>
  )
}