import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import { InfiniteLoader, List } from 'react-virtualized'
import _ from 'lodash'
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
        const contact = results[index]
        const parsedName = _.split(contact.displayName, contact.lastName)
        content = <Link to={`/contacts/${contact._id}/${contact.slug}`}>
          {parsedName[0]} <strong>{contact.lastName}</strong>
        </Link>
      }
      return (
        <div
          className={'Vrow'}
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
            className={'VList'}
            onRowsRendered={onRowsRendered}
            rowRenderer={rowRenderer}
            rowCount={rowCount}
            height={800}
            rowHeight={40}
            width={300}
          />
        )}
      </InfiniteLoader>
    )
  } else if (loading) {
    return (<Components.Loading />)
  } else {
    return (<FormattedMessage id='app.404' />)
  }
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment',
  limit: 50,
  terms: { view: 'contactsByLastName' }
}

registerComponent({
  name: 'ContactsVirtualizedList',
  component: ContactsVirtualizedList,
  hocs: [
    [withMulti, options]
  ]
})
