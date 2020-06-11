import React from 'react'

const MyLoading = () => {
  const width = Math.floor(Math.random() * 20) + 60
  return (
    <svg width='100%' height='14'>
      <rect width={`${width}%`} height='11' style={{ fill: 'lightgrey' }} />
    </svg>
  )
}

export default MyLoading
