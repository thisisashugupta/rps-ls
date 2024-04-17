'use client'

import React from 'react'
import Link from 'next/link'
import { ConnectKitButton } from "connectkit"

function NavBar() {
  return (
    <div className='z-10 px-4 backdrop-blur-sm backdrop-brightness-150 fixed top-0 left-0 right-0 h-16 flex items-center justify-between border-b border-gray-500'>
      <Link href={'/'} className='text-xl font-mono font-semibold'>
        RPS-LS
      </Link>
      <ConnectKitButton />
    </div>
  )
}

export default NavBar
