'use client'

import { DefaultValue, selector } from 'recoil'
import { gameAtom, deployGameAtom } from '@/app/store/atoms/game'

export const c1State = selector({
    key: 'c1-state',
    get: ({ get }) => {
        const gameState = get(deployGameAtom)
        return gameState.move
    },
    set: ({ set }, move) => {
        set(deployGameAtom, move instanceof DefaultValue ? move : (prev) => ({
            ...prev,
            move
        }))
    }
})

export const c2State = selector({
    key: 'c2-state',
    get: ({ get }) => {
        const gameState = get(gameAtom)
        return gameState.c2
    },
    set: ({ set }, c2) => {
        set(gameAtom, c2 instanceof DefaultValue ? c2 : (prev) => ({
            ...prev,
            c2
        }))
    }
})