import { Components } from 'meteor/vulcan:core'
import React, { lazy, Suspense } from 'react'

const MyCode = lazy(() => import('./MyCode'))

const MyCodeLazy = (props) => {
  return (
    <Components.ErrorBoundary>
      <Suspense fallback={<Components.Loading />}>
        <MyCode {...props} />
      </Suspense>
    </Components.ErrorBoundary>
  )
}

export default MyCodeLazy
