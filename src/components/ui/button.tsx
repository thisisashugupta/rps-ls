import React from 'react'

type ButtonProps = {
    text: string
    onClick?: () => void
    disabled?: boolean
    className?: string
}

const Button = ({ text, onClick, disabled, className}: ButtonProps) => {

  return (
    <button 
      onClick={onClick} 
      className={`${className} px-4 py-1 rounded border border-purple-500 bg-purple-500/40 hover:bg-purple-500/50 disabled:opacity-50`}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button
