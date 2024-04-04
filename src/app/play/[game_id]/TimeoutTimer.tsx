import React, { useState, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { gameAtom, gamePlayAtom } from '@/app/store/atoms/game'

export default function TimeoutTimer() {

  const game = useRecoilValue(gameAtom)
  const [gamePlay, setGamePlay] = useRecoilState(gamePlayAtom)

  console.log('gamePlay', gamePlay.hasPlayer1Played, gamePlay.hasPlayer2Played, gamePlay.hasPlayer1Revealed)
  console.log('last Action', game.lastAction)

  const [timer, setTimer] = useState(0);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  useEffect(() => {

    if (gamePlay.hasPlayer2Played && gamePlay.hasPlayer1Revealed) {
      localStorage.setItem('isPlayer1TimedOut', 'false')
      localStorage.setItem('isPlayer2TimedOut', 'false')
      setGamePlay((prev) => ({ 
        ...prev, 
        isPlayer1TimedOut: false,
        isPlayer2TimedOut: false
      }));
      setTimer(0);
      return;
    }

    if (!game.lastAction) return;

    const diffInSeconds = Math.floor((new Date().getTime())/1000) - Number(game.lastAction);
    setTimer(Number(game.TIMEOUT) - diffInSeconds);
    console.log('diffInSeconds:', diffInSeconds);

    const intervalId = setInterval(() => {

      setTimer((prevTimer) => {

        if (prevTimer <= 1) {
          if (!gamePlay.hasPlayer2Played) {
            localStorage.setItem('isPlayer2TimedOut', 'true')
            setGamePlay((prev) => ({ 
              ...prev, 
              isPlayer2TimedOut: true 
            }));
          } 
          if (gamePlay.hasPlayer2Played && !gamePlay.hasPlayer1Revealed) {
            localStorage.setItem('isPlayer1TimedOut', 'true')
            localStorage.setItem('isPlayer2TimedOut', 'false')
            setGamePlay((prev) => ({ 
              ...prev, 
              isPlayer2TimedOut: true, 
              isPlayer1TimedOut: true 
            }));
          }

          clearInterval(intervalId);
          return 0;
        }

        return prevTimer - 1;
      });

    }, 1000);
    return () => clearInterval(intervalId);
  }, [setGamePlay, game.TIMEOUT, game.lastAction, gamePlay.hasPlayer2Played, gamePlay.hasPlayer1Revealed]);

  return (
    <>
      <div>{gamePlay.isPlayer1TimedOut && `Player 1 Timed Out`}</div>
      <div>{gamePlay.isPlayer2TimedOut && `Player 2 Timed Out`}</div>
      {
        !gamePlay.isPlayer1TimedOut &&
        !gamePlay.isPlayer2TimedOut &&
        <div>Timeout Timer: {minutes}:{seconds < 10 ? '0' + seconds : seconds}</div>
      }
    </>
  );
}