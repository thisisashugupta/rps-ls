'use client'

export function clearLocalStorage() {

    // search game
    localStorage.removeItem('first-player-address')

    // deploy game state
    localStorage.removeItem('game-contract-address')
    localStorage.removeItem('salt')
    localStorage.removeItem('move-hash')
    localStorage.removeItem('move')
    localStorage.removeItem('second-player-address')
    localStorage.removeItem('stake-amount')

    // game state
    localStorage.removeItem('game-contract-address')
    localStorage.removeItem('j1')
    localStorage.removeItem('j2')
    localStorage.removeItem('c1hash')
    localStorage.removeItem('c1')
    localStorage.removeItem('c2')
    localStorage.removeItem('stake')
    localStorage.removeItem('TIMEOUT')
    localStorage.removeItem('lastAction')

    // gamePlay state
    localStorage.removeItem('hasPlayer1Played')
    localStorage.removeItem('hasPlayer2Played')
    localStorage.removeItem('hasPlayer1Revealed')
    localStorage.removeItem('isPlayer1TimedOut')
    localStorage.removeItem('isPlayer2TimedOut')

    // salt encryption
    localStorage.removeItem('ciphertext')
    localStorage.removeItem('iv')
    localStorage.removeItem('c1-hash')

    // win or loss
    localStorage.removeItem('won')
}