'use client'

import { atom } from "recoil";
import { Move } from "@/app/store/types/move";

type GameAtomState = {
    contractAddress: string | null;
    j1: string | null;
    j2: string | null;
    c1Hash: string | null;
    c1: Move;
    c2: Move;
    stake: bigint | null;
    TIMEOUT: number | null;
    lastAction: number | null;
}

export const deployGameAtom = atom({
    key: "deploy-game-atom",
    default: {
        move: Move.Null,
        secondPlayerAddress: localStorage.getItem('second-player-address') || "",
        stakeAmount: localStorage.getItem('stake-amount') as string || "",
        salt: BigInt(""),
        moveHash: localStorage.getItem('move-hash') || null,
    },
});

export const gameAtom = atom<GameAtomState>({
    key: "game-atom",
    default: {
        contractAddress: localStorage.getItem('game-contract-address') || null,
        j1: localStorage.getItem('j1') || null,
        j2: localStorage.getItem('j2') || null,
        c1Hash: localStorage.getItem('c1hash') || null,
        c1: localStorage.getItem('c1')===null ? Move.Null : Number(localStorage.getItem('c1')!) as Move,
        c2: localStorage.getItem('c1')===null ? Move.Null : Number(localStorage.getItem('c2')!) as Move,
        stake: localStorage.getItem('stake')===null ? null : BigInt(localStorage.getItem('stake')!),
        TIMEOUT: localStorage.getItem('TIMEOUT')===null ? null : Number(localStorage.getItem('TIMEOUT')!),
        lastAction: localStorage.getItem('lastAction')===null ? null : Number(localStorage.getItem('lastAction')!),
    }
});

export const gamePlayAtom = atom({
    key: "game-play-atom",
    default: {
        hasPlayer1Played: Boolean(localStorage.getItem('hasPlayer1Played')) || true,
        hasPlayer2Played: Boolean(localStorage.getItem('hasPlayer2Played')) || false,
        hasPlayer1Revealed: Boolean(localStorage.getItem('hasPlayer1Revealed')) || false,
        isPlayer1TimedOut: Boolean(localStorage.getItem('isPlayer1TimedOut')) || false,
        isPlayer2TimedOut: Boolean(localStorage.getItem('isPlayer2TimedOut')) || false,
    },
});