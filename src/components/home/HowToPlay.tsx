function HowToPlay() {
  return (
    <div className='space-y-1 flex flex-col items-center rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
        <div className='text-xl font-semibold'>How to Play</div>
        <p>Player 1 commits a move, stakes some ETH</p>
        <p>Player 2 stakes same ETH and chooses a move</p>
        <p>Player 1 reveals its move</p>
        <p>Winner gets double the ETH than staked</p>
        <p>🎊Wohoo🎊</p>
  </div>
  )
}

export default HowToPlay
