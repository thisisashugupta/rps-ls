"use client"

import RPS from '@/contracts/RPS.json'
import { useReadContracts } from 'wagmi'
import { Move } from '@/app/store/types/move'

export type GameDetails = {
  contractAddress: `0x${string}`;
  j1: `0x${string}`;
  j2: `0x${string}`;
  c1Hash: string;
  c2: Move;
  stake: bigint;
  TIMEOUT: number;
  lastAction: number;
}

export function useGameDetails(contractAddress: `0x${string}`) {

  const gameContract = {
    address: contractAddress as `0x${string}`,
    abi: RPS.abi,
  } as const

  const { data: gameData } = useReadContracts({
    contracts: [
      {
        ...gameContract,
        functionName: 'j1',
      },
      {
        ...gameContract,
        functionName: 'j2',
      },
      {
        ...gameContract,
        functionName: 'c1Hash',
      },
      {
        ...gameContract,
        functionName: 'c2',
      },
      {
        ...gameContract,
        functionName: 'stake',
      },
      {
        ...gameContract,
        functionName: 'TIMEOUT',
      },
      {
        ...gameContract,
        functionName: 'lastAction',
      },
    ],
    allowFailure: false,
  })

  const gameDetails : GameDetails = {
    contractAddress: contractAddress as `0x${string}`,
    j1: gameData?.[0] as `0x${string}`,
    j2: gameData?.[1] as `0x${string}`,
    c1Hash: gameData?.[2] as string,
    c2: gameData?.[3] as Move,
    stake: gameData?.[4] as bigint,
    TIMEOUT: gameData?.[5] as number,
    lastAction: gameData?.[6] as number,
  }

  return gameDetails as GameDetails;
}