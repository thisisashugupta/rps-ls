import React from 'react'

type InputProps = {
  id?: string
  name?: string
  type?: string
  defaultValue?: string
  onChange?: (e: any) => void
  value?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

function Input({id, name, type = "text", defaultValue, onChange, value, required, disabled, className} : InputProps) {
  return (
    <div>
      <input
      id={id}
      name={name}
      type={type}
      defaultValue={defaultValue}
      onChange={onChange}
      value={value}
      required={required}
      disabled={disabled}
      className={`${className} bg-gray-300 text-purple-700 px-2 py-1 min-w-96 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-700 disabled:opacity-50`}
    />
    </div>
  )
}

export default Input;