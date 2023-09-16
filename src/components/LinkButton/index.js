import React from 'react'
import './index.css'

export default function LinkButton(props) {
  const { children } = props
  return (
    <button className='linkBtn'{...props}>{children}</button>
  )
}
