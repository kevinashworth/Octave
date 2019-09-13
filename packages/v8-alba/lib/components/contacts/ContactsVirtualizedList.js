import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { FixedSizeList } from 'react-window'
// import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
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

// class ItemRenderer extends PureComponent {
//   render() {
//     // Access the items array using the "data" prop:
//     const contact = this.props.data[this.props.index];
//    const parsedName = _.split(contact.displayName, contact.lastName)
//     return (
//       <div className={this.props.index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={this.props.style}>
//         <Link to={`/contacts/${contact._id}/${contact.slug}`}>
//           {parsedName[0]} <strong>{contact.lastName}</strong>
//         </Link>
//       </div>
//     );
//   }
// }
//
//
// // class ItemRenderer extends PureComponent {
// //   render() {
// //     return (
// //       <div style={this.props.style}>
// //         Item {this.props.index}
// //       </div>
// //     );
// //   }
// // }
//
// // const Example = () => (
// //   <List
// //     className="List"
// //     height={150}
// //     itemCount={1000}
// //     itemSize={35}
// //     width={300}
// //   >
// //     {Row}
// //   </List>
// // )
//
// const ContactsVirtualizedList = ({ loading, results = [], totalCount, count, refetch, loadMore }) => {
//   if (results && results.length) {
//     // const hasMore = totalCount > count
//     // const rowCount = hasMore
//     //   ? results.length + 1
//     //   : results.length
//     // const loadMoreRows = loading
//     //   ? () => {}
//     //   : loadMore
//     // const isRowLoaded = ({ index }) => !hasMore || index < results.length
//     // const rowRenderer = ({ index, key, style, item = results[index] }) => {
//     //   let content
//     //   if (!isRowLoaded({ index })) {
//     //     content = 'Loading...'
//     //   } else {
//     //     const contact = results[index]
//     //     const parsedName = _.split(contact.displayName, contact.lastName)
//     //     content = <Link to={`/contacts/${contact._id}/${contact.slug}`}>
//     //       {parsedName[0]} <strong>{contact.lastName}</strong>
//     //     </Link>
//     //   }
//     //   return (
//     //     <div
//     //       className={'Vrow'}
//     //       key={key}
//     //       style={style}
//     //     >
//     //       {content}
//     //     </div>
//     //   )
//     // }
//
//     return (
//       <div className='animated fadeIn'>
//         <AutoSizer>
//         {({ height, width }) => (
//           <List
//           itemData={results}
//           className="List"
//           height={height}
//           itemCount={count}
//           itemSize={35}
//           width={300}
//         >
//           {ItemRenderer}
//         </List>)}
//         </AutoSizer>
//       </div>
//     )
//   } else if (loading) {
//     return (<Components.Loading />)
//   } else {
//     return (<FormattedMessage id='app.404' />)
//   }
// }

class ContactsVirtualizedList extends PureComponent {
  constructor(props) {
    super(props);
    // this.state = {
    //   items: [], // instantiate initial list here
    //   moreItemsLoading: false,
    //   hasNextPage: true
    // };

    // this.loadMore = this.loadMore.bind(this);
  }

  // loadMore() {
  //  // method to fetch newer entries for the list
  // }

  render() {
    const { loading, results, totalCount, count, loadMore } = this.props
    const hasMore = totalCount > count
    // const { items, moreItemsLoading, hasNextPage } = this.state;

    return (
      <ListComponent
        items={results}
        moreItemsLoading={loading}
        loadMore={loadMore}
        hasNextPage={hasMore}
      />
    );
  }
}

const ListComponent = ({ items, moreItemsLoading, loadMore, hasNextPage }) => {
  const Row = ({ index, style }) => {
    if (moreItemsLoading) {
      return (<Components.Loading />)
    } else if (items && items.length) {
      const isRowLoaded = ({ index }) => !hasNextPage || index < items.length
      if (!isRowLoaded({ index })) {
        return (<div className={'Vrow'} style={style}>Loading...</div>)
      }
      const contact = items[index]
      const parsedName = _.split(contact.displayName, contact.lastName)
      return (
        <div className={'Vrow'} style={style}>
          <Link to={`/contacts/${contact._id}/${contact.slug}`}>
            {parsedName[0]} <strong>{contact.lastName}</strong>
          </Link>
        </div>
      )
    } else {
      return (<FormattedMessage id='app.404' />)
    }
  }

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  return (
    <InfiniteLoader
      isItemLoaded={index => index < items.length}
      itemCount={itemCount}
      loadMoreItems={loadMore}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          height={750}
          width={220}
          itemCount={itemCount}
          itemSize={35}
          onItemsRendered={onItemsRendered}
          ref={ref}
          className="VList"
        >
          {Row}
        </FixedSizeList>
      )}
  </InfiniteLoader>
  )
};

export default ListComponent;

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
