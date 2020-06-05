import React from 'react'
import loadable from '@loadable/component'

const MyCodeNondeferred = loadable(() => import('./MyCodeNondeferred'), { ssr: false })

function MyCode () {
  return (
    <div>
      <MyCodeNondeferred />
    </div>
  )
}

export default MyCode
