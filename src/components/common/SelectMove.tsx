'use client'

import React from 'react';
import { useRecoilState, type RecoilState } from 'recoil';
import { Move } from '@/app/store/types/move';

type MoveSelectorProps = {
  className?: string;
  moveState: RecoilState<Move>;
  keyTag?: string;
};

const movesArray = [
  Move.Rock,
  Move.Paper,
  Move.Scissor,
  Move.Spock,
  Move.Lizard
];

function SelectMove({ className, moveState, keyTag }: MoveSelectorProps) {

  const [move, setMove] = useRecoilState(moveState) // this component just manages the move, so it subscribe only to the move selector
  
  function handleMoveSelection(selectedMove: Move) {
    keyTag && localStorage.setItem(keyTag, String(selectedMove));
    setMove(selectedMove);
  }

  return (
    <div className={`${className} space-x-2`}>
      {movesArray.map((moveOption) => (
        <button
          key={moveOption}
          onClick={() => handleMoveSelection(moveOption)}
          disabled={move === moveOption}
          className={`p-4 border rounded-lg hover:border-purple-500 ${move === moveOption ? 'bg-purple-500/50 border-purple-500' : ''}`}
        >
          {Move[moveOption]}
        </button>
          
        
      ))}
    </div>
  );
}

export default SelectMove;
