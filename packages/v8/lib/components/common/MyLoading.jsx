import React from 'react'

const MyLoading = ({ height }) => {
  const h1 = height || 14
  const h2 = Math.floor((h1 * 11) / 14)
  const w = Math.floor(Math.random() * 20) + 60
  return (
    <svg width='100%' height={h1}>
      <rect width={`${w}%`} height={h2} style={{ fill: 'gainsboro' }} />
    </svg>
  )
}

export default MyLoading
