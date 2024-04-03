import React from 'react'
import Heading from '@/components/ui/heading'

function J1Rules() {
  return (
    <div className='p-6'>
      <Heading>Steps</Heading>
      <ol typeof='1' className='list-decimal'>
        <li>Choose your move</li>
        <li>Selects the other player</li>
        <li>Stake some ETH</li>
        <li>Create game</li>
      </ol>
    </div>
  )
}

export default J1Rules
