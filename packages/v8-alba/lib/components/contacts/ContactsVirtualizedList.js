import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import _ from 'lodash'
import Contacts from '../../modules/contacts/collection.js'

// const Row = ({ index, style, items }) => {
//   const contact = items[index]
//   const item = this.props.data[this.props.index];
//   const parsedName = _.split(contact.displayName, contact.lastName)
//   return (
//     <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
//       <Link to={`/contacts/${contact._id}/${contact.slug}`}>
//         {parsedName[0]} <strong>{contact.lastName}</strong>
//       </Link>
//     </div>
//   )
// }

class ItemRenderer extends PureComponent {
  render() {
    // Access the items array using the "data" prop:
    const contact = this.props.data[this.props.index];
   const parsedName = _.split(contact.displayName, contact.lastName)
    return (
      <div className={this.props.index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={this.props.style}>
        <Link to={`/contacts/${contact._id}/${contact.slug}`}>
          {parsedName[0]} <strong>{contact.lastName}</strong>
        </Link>
      </div>
    );
  }
}


// class ItemRenderer extends PureComponent {
//   render() {
//     return (
//       <div style={this.props.style}>
//         Item {this.props.index}
//       </div>
//     );
//   }
// }

// const Example = () => (
//   <List
//     className="List"
//     height={150}
//     itemCount={1000}
//     itemSize={35}
//     width={300}
//   >
//     {Row}
//   </List>
// )

const ContactsVirtualizedList = ({ loading, results = [], totalCount, count, refetch, loadMore }) => {
  if (results && results.length) {
    // const hasMore = totalCount > count
    // const rowCount = hasMore
    //   ? results.length + 1
    //   : results.length
    // const loadMoreRows = loading
    //   ? () => {}
    //   : loadMore
    // const isRowLoaded = ({ index }) => !hasMore || index < results.length
    // const rowRenderer = ({ index, key, style, item = results[index] }) => {
    //   let content
    //   if (!isRowLoaded({ index })) {
    //     content = 'Loading...'
    //   } else {
    //     const contact = results[index]
    //     const parsedName = _.split(contact.displayName, contact.lastName)
    //     content = <Link to={`/contacts/${contact._id}/${contact.slug}`}>
    //       {parsedName[0]} <strong>{contact.lastName}</strong>
    //     </Link>
    //   }
    //   return (
    //     <div
    //       className={'Vrow'}
    //       key={key}
    //       style={style}
    //     >
    //       {content}
    //     </div>
    //   )
    // }

    return (
      <div className='animated fadeIn'>
        <AutoSizer>
        {({ height, width }) => (
          <List
          itemData={results}
          className="List"
          height={height}
          itemCount={count}
          itemSize={35}
          width={300}
        >
          {ItemRenderer}
        </List>)}
        </AutoSizer>
      </div>
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
  terms: { view: 'contactsByLastName' }
}

registerComponent({
  name: 'ContactsVirtualizedList',
  component: ContactsVirtualizedList,
  hocs: [
    [withMulti, options]
  ]
})
