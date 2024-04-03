function GameRules() {
  return (
    <div className='space-y-1 flex flex-col items-center rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
        <div className='text-xl font-semibold'>Rules</div>
        <p>Rock crushes Scissors</p>
        <p>Scissors cuts Paper</p>
        <p>Paper covers Rock</p>
        <p>Rock crushes Lizard</p>
        <p>Lizard poisons Spock</p>
        <p>Spock smashes Scissors</p>
        <p>Scissors decapitates Lizard</p>
        <p>Lizard eats Paper</p>
        <p>Paper disproves Spock</p>
        <p>Spock vaporizes Rock</p>
    </div>
  )
}

export default GameRules