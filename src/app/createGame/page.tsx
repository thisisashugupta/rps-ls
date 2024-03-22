"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { ethers, parseEther, BaseContract, Contract, ContractFactory, type Addressable } from 'ethers'
import crypto from 'crypto'
import RPS from '@/contracts/abi/RPS.json'
import Hasher from '@/contracts/abi/Hasher.json'
import { hasherContractAddress } from '@/contracts/Hasher'
import { type UseAccountParameters, useAccount } from 'wagmi'
import { useEthersSigner } from '@/app/providers/ethers/ethersSigner'

export default function CreateGame() {

  const signer = useEthersSigner()
  // console.log('signer', signer)

  const [RPSContract, setRPSContract] = useState<string | Addressable | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [deployed, setDeployed] = useState<boolean>(false)
  const [deploying, setDeploying] = useState<boolean>(false)
  const [readyToDeploy, setReadyToDeploy] = useState<boolean>(false)

  const [move, setMove] = useState<number>(1)
  const [salt, setSalt] = useState<BigInt | null>(null)
  const [moveHash, setMoveHash] = useState<string | null>(null)
  const [secondPlayerAddress, setSecondPlayerAddress] = useState<string | null>(null)
  const [stakeAmount, setStakeAmount] = useState<string>('')
  const [constructorArgs, setConstructorArgs] = useState<[string | null, string | null]>([moveHash, null])

  const { address, connector, isConnected, isConnecting, isDisconnected, isReconnecting } = useAccount()
  // console.log(connector);

  useEffect(() => {
    if (!secondPlayerAddress || !stakeAmount) setReadyToDeploy(false)
    else {
    setConstructorArgs([moveHash, secondPlayerAddress])
    setReadyToDeploy(true)

  }
    // bytes32 _c1Hash, address _j2
  }, [moveHash, secondPlayerAddress, stakeAmount])

  // Function to generate a random uint256 salt
  function generateRandomSalt() {
    const randomBytes = crypto.randomBytes(32); // Generate 32 bytes (256 bits) of random data
    const buffer = Buffer.from(randomBytes); // Convert the random bytes to a Buffer
    const salt = BigInt('0x' + buffer.toString('hex')); // Convert the buffer to a BigInt
    return salt;
  }

  const generateMoveHash = async (salt: bigint) => {
    try {
      const hasherContract = new Contract(hasherContractAddress, Hasher.abi, signer);
      const hashedCommitment = await hasherContract.hash(move, salt);
      return hashedCommitment;
    } catch (error) {
      console.error(error)
    }
  }

  const handleHashCall = async () => {
    const salt = generateRandomSalt();
    setSalt(salt);
    const movehash = await generateMoveHash(salt);
    setMoveHash(movehash);
    return movehash;
    // setMoveHash(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['string', 'uint256'], [move, salt])));
  }

  const deployContract = async (movehash: string) => {
    setDeploying(true)
    try {

      const factory = new ContractFactory(RPS.abi, RPS.bytecode, signer);
      console.log('contract factory created');

      const tx = await factory.getDeployTransaction(movehash, secondPlayerAddress, { value: parseEther(stakeAmount) });
      console.log(tx);
      console.log(tx.data);

      setMessage('Approve Request for Contract Deployment');
      const contract = await factory.deploy(movehash, secondPlayerAddress, { value: parseEther(stakeAmount) });
      setMessage(`deploying contract...`)

      const waitfordepl = await contract.waitForDeployment()
      const gameContract = waitfordepl.target
      setMessage(`contract deployed at ${gameContract}`)
      setDeployed(true)
      localStorage.setItem('gameContract', String(gameContract))
      setRPSContract(gameContract)

      /* ----------------------------------------------------------- */

      const saveGameContract = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ game_contract_address : gameContract })
      })

      console.log(await saveGameContract.json());
      

      /* ----------------------------------------------------------- */
      
    } catch (error) {
      console.error(error)
      setMessage(String(error))
    } finally {
      setDeploying(false)
    }
  }

  const handleCreateGame = async () => {
    setReadyToDeploy(false);
    const movehash = await handleHashCall();
    await deployContract(movehash);
  }

  if (isDisconnected) return <div className='mt-16'>Disconnected</div>
  if (isConnecting) return <div className='mt-16'>Connecting</div>
  if (isReconnecting) return <div className='mt-16'>Reconnecting</div>

  return (
    <>
    <main className="flex min-h-screen flex-col items-center">
      <div className='w-full h-16' />
      {isConnected && <div className="max-w-7xl w-full p-12 font-mono text-sm">
        
        <div className='mb-8 mx-auto border border-gray-300/50 rounded-lg p-4'>
        <p>Message: {message}</p>
        {/* <p>Salt: {salt===null ? '' : `${salt}`}</p> */}
        {/* <p>MoveHash: {moveHash===null ? '' : `${moveHash}`}</p> */}
        {/* <p>Second Player Address: {secondPlayerAddress}</p> */}
        {/* <p>Move: {move}</p> */}
        <p>Stake Amount: {stakeAmount || 0} ETH</p>
        {/* <p>constructorArgs: {String(constructorArgs)}</p> */}
        <p>RPSContract: {String(RPSContract)}</p>
        
        </div>
        {/* <button className={` ${deployed ? 'border-green-500' : 'border-red-500' } border px-3 py-1 rounded`} onClick={deployContract} disabled={deploying} >{deploying ? 'Deploying...' : 'Deploy GAME'}</button> */}
        {/* {hasherContract && <div>Deployed Contract Address: <span className='text-green-500'>{`${hasherContract}`}</span></div>} */}

        <div className='text-purple-500 font-semibold text-lg'>Allow a party to create a RPS game</div>

        <ol typeof='1'>
          <li>1. The first party creates the game</li>
          <li>2. puts a commitment of his move</li>
          <li>3. selects the other player</li>
          <li>4. and stakes some ETH</li>
        </ol>

        <div id='rps_contract' className='border border-purple-500 rounded-lg p-6 my-6'>

          <div className='space-x-3'>
            <label htmlFor="move_1">move:</label>
            <select id="move_1" onChange={(e) => setMove(Number(e.target.value))} className='bg-gray-500' required >
              <option value={1}>Rock</option>
              <option value={2}>Paper</option>
              <option value={3}>Scissors</option>
              <option value={4}>Spock</option>
              <option value={5}>Lizard</option>
            </select>
          </div>

          {/* <div className='my-4'><button onClick={handleHashCall} className='bg-purple-500/40 border border-purple-500 rounded px-4 py-1'>hash</button></div> */}

          <div className='mt-4 space-x-3 flex'>
            <label htmlFor="_j2" className='min-w-max'>second_player_address:</label>
            <input type="text" id="_j2" name="_j2" onChange={(e) => setSecondPlayerAddress(e.target.value)} className='w-full bg-gray-600' required />
          </div>

          <div className='mt-4 space-x-3 flex'>
            <label htmlFor="stake_amount" className='min-w-max'>stake amount (ETH):</label>
            <input type="number" id="stake_amount" name="stake_amount" onChange={(e) => setStakeAmount(e.target.value)} defaultValue={stakeAmount} className='w-full bg-gray-600' required />
          </div>

          <div className='my-4'><button onClick={handleCreateGame} disabled={!readyToDeploy} className='bg-purple-500/40 border border-purple-500 rounded px-4 py-1 disabled:opacity-50'>Create Game</button></div>

          <div className='mt-4 space-x-3 flex'>
            <label htmlFor="salt">salt:</label>
            <input type="text" id="salt" name="salt" className='w-full bg-gray-600' value={String(salt)} disabled />
          </div>
          
          <div className='mt-4 space-x-3 flex'>
            <label htmlFor="c1Hash">move_hash:</label>
            <input type="text" id="c1Hash" name="c1Hash" className='w-full bg-gray-600' value={String(moveHash)} disabled />
          </div>
        </div>

        {deployed && <div className='border border-purple-500 rounded-lg p-4'>
          <p className='text-lg text-purple-500'>game created!</p>
        </div>}

      </div>}
    </main>
    </>
  );
}
