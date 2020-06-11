import React from 'react'

const MyLoading = ({ height, variant }) => {
  var style
  switch (variant) {
    case 'primary':
      style = {
        fill: '#20a8d8',
        opacity: 0.2
      }
      break
    default:
      style = {
        fill: 'gainsboro'
      }
  }

  const h1 = height || 14
  const h2 = Math.floor((h1 * 11) / 14)
  const w = Math.floor(Math.random() * 20) + 60

  return (
    <svg width='100%' height={h1}>
      <rect width={`${w}%`} height={h2} style={style} />
    </svg>
  )
}

export default MyLoading
