import React from 'react'

function Heading({children}: {children: string}) {
  return (
    <div className='text-purple-500 font-semibold text-lg'>
        {children}
    </div>
  )
}

export default Heading