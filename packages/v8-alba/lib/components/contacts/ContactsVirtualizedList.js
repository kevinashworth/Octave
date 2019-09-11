import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
// import { Link } from 'react-router-dom'
import { InfiniteLoader, List } from 'react-virtualized'
import Contacts from '../../modules/contacts/collection.js'

const ContactsVirtualizedList = ({ loading, results = [], totalCount, count, refetch, loadMore }) => {
  if (results && results.length) {
    const hasMore = totalCount > count
    const rowCount = hasMore
      ? results.length + 1
      : results.length
    const loadMoreRows = loading
      ? () => {}
      : loadMore
    const isRowLoaded = ({ index }) => !hasMore || index < results.length
    const rowRenderer = ({ index, key, style }) => {
      let content
      if (!isRowLoaded({ index })) {
        content = 'Loading...'
      } else {
        content = results[index].displayName
      }
      return (
        <div
          key={key}
          style={style}
        >
          {content}
        </div>
      )
    }

    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={rowCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <List
            ref={registerChild}
            onRowsRendered={onRowsRendered}
            rowRenderer={rowRenderer}
            rowCount={rowCount}
            height={500}
            rowHeight={50}
            width={200}
          />
        )}
      </InfiniteLoader>
    )
  } else if (loading) {
    return (<Components.Loading/>)

  } else {
    return (<FormattedMessage id='app.404'/>)
  }
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment'
}

registerComponent({
  name: 'ContactsVirtualizedList',
  component: ContactsVirtualizedList,
  hocs: [
    [withMulti, options]
  ]
})
