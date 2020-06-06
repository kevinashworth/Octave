import { Components } from 'meteor/vulcan:core'
import React, { Suspense } from 'react'

const MyCode = React.lazy(() => import('./MyCode'))

function MyCodeLazy (props) {
  return (
    <>
      <Components.ErrorBoundary>
        <Suspense fallback={<Components.Loading />}>
          <MyCode {...props} />
        </Suspense>
      </Components.ErrorBoundary>
    </>
  )
}

export default MyCodeLazy
