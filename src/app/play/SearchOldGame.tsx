"use client"

import React, { useState } from 'react'
import { isAddress } from 'ethers'
import { getTransactions } from '@/lib/transactionHistory'
import { isRPSContractTx } from '@/contracts/helper'
import { type AddressLike } from 'ethers'
import { gameAtom } from '../store/atoms/game'
import { useSetRecoilState } from 'recoil'
import { toast } from 'sonner'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import Heading from '@/components/ui/heading'

const etherscan_api_key = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
if (!etherscan_api_key) throw new Error('No Etherscan API Key Provided');

export default function SearchGame() {

  // state
  const setGame = useSetRecoilState(gameAtom)
  const [searching, setSearching] = useState<boolean>(false)
  const [firstPlayerAddress, setFirstPlayerAddress] = useState<AddressLike>("")
  const [addressNotValid, setAddressNotValid] = useState<boolean>(false)

  const handleSearch = async () => {
    // search for the contract in the latest transactions of first player address
    setSearching(true)
    try {
      const txs = await getTransactions(firstPlayerAddress);
      for (let tx of txs) {
        if (tx.to === '' || tx.to === null) {
          if (isRPSContractTx(tx.input)) { // verify that the contract is a RPS contract by checking the bytecode
            toast(`Game Contract Address: ${tx.contractAddress}`);
            setGame((prev) => ({ ...prev , contractAddress: tx.contractAddress }));
            localStorage.setItem('game-contract-address', tx.contractAddress);
            break;
          }
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSearching(false)
    }
  }


  const handleFirstPlayerAddress = (potentialAddress: string) => {
    const isAddressLegit = isAddress(potentialAddress.trim())
    if (isAddressLegit) {
      localStorage.setItem('first-player-address', potentialAddress)
      setFirstPlayerAddress(potentialAddress)
      setAddressNotValid(false)
    } else {
      setFirstPlayerAddress('')
      setAddressNotValid(true)
    }
  }


  return (
    <div className='border border-purple-500 w-full flex flex-col items-center rounded-lg p-4'>
      <Heading>Want to play already created game with someone?</Heading>
      <label className='mt-4'>
        Enter Other Player Address:
        <Input 
        onChange={(e) => handleFirstPlayerAddress(e.target.value)}
        disabled={searching}
      />
      </label>
      {addressNotValid && <p className='text-red-500 mt-2'>Enter Valid EOA</p>}

      <Button 
        text="Start" 
        onClick={handleSearch} 
        disabled={!Boolean(firstPlayerAddress) || searching} 
        className='mt-4'
      />

      {searching && <p className='mt-6'>Looking for a Game...</p>}
    </div>
  );
}