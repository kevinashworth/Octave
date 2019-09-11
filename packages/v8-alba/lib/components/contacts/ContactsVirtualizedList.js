import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import { InfiniteLoader, List } from 'react-virtualized'
import styled from 'styled-components'
import _ from 'lodash'
import Contacts from '../../modules/contacts/collection.js'

const ContactItem = styled.div`
  color: #333;
  padding-top: 2px;
  padding-bottom: 2px;
  white-space: nowrap;
`

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
    const rowRenderer = ({ index, key }) => {
      let content
      if (!isRowLoaded({ index })) {
        content = 'Loading...'
      } else {
        const contact = results[index]
        const parsedName = _.split(contact.displayName, contact.lastName)
        content = <Link to={`/contacts/${contact._id}/${contact.slug}`}>
          {parsedName[0]}  <strong>{contact.lastName}</strong>
        </Link>
      }
      return (
        <ContactItem
          key={key}
        >
          {content}
        </ContactItem>
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
            height={800}
            rowHeight={40}
            width={300}
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
  fragmentName: 'ContactsSingleFragment',
  terms: { view: 'contactsByLastName' }
}

registerComponent({
  name: 'ContactsVirtualizedList',
  component: ContactsVirtualizedList,
  hocs: [
    [withMulti, options]
  ]
})
