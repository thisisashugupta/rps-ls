"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import RPS from '@/contracts/RPS.json'
import { useEthersSigner } from '@/app/providers/ethers/ethersSigner'
import { parseEther, ContractFactory, isAddress } from 'ethers'
import { encryptMove } from '@/lib/actions'
import { Move } from '@/app/store/types/move'
import SelectMove from '@/components/common/SelectMove'
import { useRecoilState } from 'recoil'
import { deployGameAtom } from '@/app/store/atoms/game'
import { c1State } from '@/app/store/selectors/move'
import Heading from '@/components/ui/heading'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { toast } from 'sonner'

interface DeployStateProps {
  deploying: boolean,
  deployed: boolean,
  readyToDeploy: boolean
}

export default function CreateGame() {  
  const router = useRouter()
  const signer = useEthersSigner()

  // states
  const [game, setGame] = useRecoilState(deployGameAtom);
  const [deployState, setDeployState] = useState<DeployStateProps>({
    deploying: false,
    deployed: Boolean(localStorage.getItem('game-contract-address')),
    readyToDeploy: false
  })
  
  const isAddressValid = useMemo(() => isAddress(game.secondPlayerAddress.trim()), [game.secondPlayerAddress])


  // effects
  useEffect(() => {
    if (game.move===Move.Null || !game.stakeAmount || !game.secondPlayerAddress) {
      setDeployState((prev) => ({ ...prev, readyToDeploy: false }))
    }
    else {
      setDeployState((prev) => ({ ...prev, readyToDeploy: true }))
    }
  }, [game.move, game.stakeAmount, game.secondPlayerAddress])

  

  
  const deployContract = async (moveHash: string) => {
    try {
      const factory = new ContractFactory(RPS.abi, RPS.bytecode, signer);
      toast('Approve Request for Contract Deployment');
      const contract = await factory.deploy(moveHash, game.secondPlayerAddress, { value: parseEther(game.stakeAmount) });
      toast(`waiting for the contract to be deployed...`)
      const txReceipt = await contract.waitForDeployment()
      const gameContractAddress = txReceipt.target
      localStorage.setItem('game-contract-address', String(gameContractAddress))
      toast(`contract deployed at ${gameContractAddress}`)
      return gameContractAddress;
    } catch (error:any) {
      console.error(error)
      toast(String(error?.info?.error?.message))
    }
  }

  const handleCreateGame = async () => {
    setDeployState({ 
      ...deployState, 
      deploying: true,
      deployed: false,
    })

    const { ciphertext, iv, c1Hash } = await encryptMove(String(game.move));
    localStorage.setItem('ciphertext', ciphertext);
    localStorage.setItem('iv', iv);
    localStorage.setItem('c1-hash', c1Hash);
    
    const gameContractAddress = await deployContract(c1Hash!)
    if (!gameContractAddress) {
      setDeployState({ 
        ...deployState, 
        deploying: false,
        deployed: false,
      })
      return
    } else {
      setDeployState({ 
        ...deployState, 
        deploying: false,
        deployed: true,
      })
      router.push(`/play/${gameContractAddress}`)
    }
  }


  return (
    <div id='rps_contract' className='max-w-lg w-full border border-purple-500 rounded-lg p-6 flex flex-col items-center'>
      <Heading>Create Game</Heading>

          {/* move */}
          <label>
            Move:
            <SelectMove 
              moveState={c1State} 
              className='mb-4' 
            />
          </label>
          
          {/* second player address */}
          <label className='w-full min-w-max'>
            second player&apos;s wallet address:
            <Input 
              type="text" 
              value={game.secondPlayerAddress}
              onChange={(e) => setGame({ ...game, secondPlayerAddress: e.target.value })}
              required 
            />
          </label>
          {!isAddressValid && <p className='text-red-500 mt-2'>Enter Valid EOA</p>}
          <br />

          {/* stake amount */}
          <label className='w-full min-w-max'>
            stake amount (ETH):
            <Input 
              type="number" 
              onChange={(e) => setGame({ ...game, stakeAmount: e.target.value })}
              value={game.stakeAmount}
              required 
            />
          </label>
          <br />

          {/* create game */}
          <div className='my-4'>
            <Button 
              text='Start'
              onClick={handleCreateGame} 
              disabled={deployState.deploying || !deployState.readyToDeploy || !isAddressValid}
            />
          </div>
    </div>
  );
}