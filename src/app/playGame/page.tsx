"use client"

import React, { useState, useEffect, useMemo } from 'react'
import RPS from '@/contracts/abi/RPS.json'
import { formatEther, parseEther, Contract } from 'ethers'
import { useEthersSigner } from '@/app/providers/ethers/ethersSigner'
import { useEthersProvider } from '@/app/providers/ethers/ethersProvider'
import { useAccount } from 'wagmi'

export default function PlayGame() {
    
    const provider = useEthersProvider()
    const signer = useEthersSigner()
    const { address, connector, isConnected, isConnecting, isDisconnected, isReconnecting } = useAccount()
    
    const [rpsContractAddr, setRPSContractAddr] = useState<string | null>(null)
    const [secondPlayerAddr, setSecondPlayerAddr] = useState<string | null>(null)
    const [validPlayer, setValidPlayer] = useState<boolean>(true)
    const [message, setMessage] = useState<string | null>(null)
    const [stakeAmount, setStakeAmount] = useState<string>()
    const [move, setMove] = useState<number>(1)
    const [txSuccess, setTxSuccess] = useState<boolean>(false)
    
    /* 
        send contract address from first party to second party. 
        if address.j2 === address, then allow the second user to play, else 
    */

    useEffect(() => {
        console.log('useEffect with empty dependency array - should be called once');
        async function getGameContract() {
            const response = await fetch('/api');
            const body = await response.json();
            setRPSContractAddr(body.address); // will create a re-render
        }
        getGameContract();
    }, []);

    useEffect(() => {
        async function getSecondPlayer() {
            // create contract class
            const contract = new Contract(rpsContractAddr!, RPS.abi, provider);
            // Read j2
            const secondPlayerAddr = await contract.j2.staticCall();
            setSecondPlayerAddr(secondPlayerAddr);
            // Read stake
            const stake = await contract.stake.staticCall();            
            setStakeAmount(formatEther(stake));
        }      
        rpsContractAddr && getSecondPlayer();
    }, [rpsContractAddr, provider])

    useEffect(() => {
        if (String(address) === String(secondPlayerAddr)) {
            setValidPlayer(true);
            setMessage('booyaah! you are the second player.');
        } else {
            setValidPlayer(false);
        }
    }, [address, secondPlayerAddr]);

    /*  ------------------------- start -----------------------------  */

    if (!rpsContractAddr) 
        return (<main className="flex min-h-screen flex-col items-center">
            <div className='w-full h-16' />
            <div>No game created yet.</div>
        </main>);

    function handlePlay() {
        /*
         * @dev To be called by j2 and provided stake.
         * @param _c2 The move submitted by j2.
        function play(Move _c2) payable {}
         */
        async function play() {
            try {   
                const contract = new Contract(rpsContractAddr!, RPS.abi, signer);
                setMessage('Approve the transaction request in your wallet.');
                const tx = await contract.play(move, {value: parseEther(stakeAmount || '0')});
                console.log('tx:', tx);
                setMessage('Waiting for the tx to be mined...');
                const receipt = await tx.wait(1); // wait(confirms?: number, timeout?: number)⇒ Promise< null | TransactionReceipt >
                console.log('receipt:', receipt);
                setMessage('Tx Successful!');
                setTxSuccess(true);
                setTimeout(() => setTxSuccess(false), 5000);
            } catch (error : any) {
                console.error(error)
                setMessage(String(error?.info?.error?.message))
            }
        }
        stakeAmount && play();
    }

    function handleJ1Timeout() {
        /*
         * @dev To be called by j2 if j1 stops responding.
        function j1Timeout() {}
         */
        async function j1Timeout() {
            try {
                const contract = new Contract(rpsContractAddr!, RPS.abi, signer);
                setMessage('Approve the transaction request in your wallet.');
                const tx = await contract.j1Timeout();
                console.log('tx:', tx);
                setMessage('Waiting for the tx to be mined...');
                const receipt = await tx.wait(1); // wait(confirms?: number, timeout?: number)⇒ Promise< null | TransactionReceipt >
                console.log('receipt:', receipt);
                setMessage('Tx Successful!');
                setTxSuccess(true);
                setTimeout(() => setTxSuccess(false), 5000);
            } catch (error : any) {
                console.error(error)
                setMessage(String(error?.info?.error?.message))
            }
        }
        j1Timeout();
    }

  return (
    <>
    <main className="flex min-h-screen flex-col items-center">
      <div className='w-full h-16' />
      {!validPlayer && <>
        <p>You are not the Valid Player.</p>
        {secondPlayerAddr && <p>Only {secondPlayerAddr} can play this game.</p>}
        <p>Try after some time.</p>
        </>}
      {isDisconnected && <div>Disconnected</div>}
      {isConnecting && <div>isConnecting</div>}
      {isReconnecting && <div>isReconnecting</div>}
      {validPlayer && isConnected && <div className="max-w-7xl w-full p-12 font-mono text-sm">
        
        <div className='mb-8 mx-auto border border-gray-300/50 rounded-lg p-4'>
            <p>rpsContractAddr: {rpsContractAddr}</p>
            <p>Message: {message}</p>
            <p>Stake Amount: {stakeAmount || "Loading..."} ETH</p>
            <p>Move: {move}</p>
        </div>

        <div className='text-purple-500 font-semibold text-lg'>For Player j2</div>

        <ol typeof='1'>
          <li>1. The second party pays the same amount of ETH</li>
          <li>2. and chooses his move</li>
          <li>3. The first party reveals his move and the contract distributes the ETH to the winner or splits them in case of a tie.</li>
          <li>4. If some party stops responding there are some timeouts.</li>
        </ol>

        <div id='play-game' className='border border-purple-500 rounded-lg p-6 my-6'>
            
          <p className='text-purple-500 font-semibold text-lg'>Play</p>

          <div className='mt-4 space-x-3'>
            <label htmlFor="move_1">move:</label>
            <select id="move_1" onChange={(e) => setMove(Number(e.target.value))} className='bg-gray-500' required >
              <option value={1}>Rock</option>
              <option value={2}>Paper</option>
              <option value={3}>Scissors</option>
              <option value={4}>Spock</option>
              <option value={5}>Lizard</option>
            </select>
          </div>

          <div className='mt-4 space-x-3 flex'>
            <label htmlFor="stake_amount" className='min-w-max'>stake amount (ETH):</label>
            <input type="number" id="stake_amount" name="stake_amount" defaultValue={stakeAmount} className='bg-gray-600' required disabled />
          </div>

          <div className='my-4'><button onClick={handlePlay} disabled={!stakeAmount} className='bg-purple-500/40 border border-purple-500 rounded px-4 py-1 disabled:opacity-50'>Play!</button></div>

        </div>

        <div id='get-money-back' className='border border-purple-500 rounded-lg p-6 my-6'>
          <p className='text-purple-500 font-semibold text-lg'>Get Back your Stake (j1Timeout)</p>
          <div className='my-4'><button onClick={handleJ1Timeout} className='bg-purple-500/40 border border-purple-500 rounded px-4 py-1 disabled:opacity-50'>Get it Back</button></div>
        </div>

        {txSuccess && <div className='border border-purple-500 rounded-lg p-4'>
          <p className='text-lg text-purple-500'>Tx Successful!</p>
        </div>}

      </div>}
    </main>
    </>
  );
}
