import { replaceComponent, Components } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router-dom'
import { Container, ListGroup, ListGroupItem } from 'reactstrap'

import algoliasearch from 'algoliasearch/lite'
import { connectHits, connectStateResults, InstantSearch, SearchBox } from 'react-instantsearch-dom'

const searchClient = algoliasearch('14RUP1OK0B', '2cd70a6b9a01c10aeaee6f6f11105f46');

// const Hit = ({ hit }) => <p><Link to={hit.url}>{hit.name}</Link></p>

const MyHits = (stuff) => {
  const { hits } = stuff
  console.log('stuff:', stuff)
  return (
    <ListGroup>
      {hits.map(hit => (
        <ListGroupItem key={hit.objectID}><Link to={hit.url}>{hit.name}</Link></ListGroupItem>
      ))}
    </ListGroup>
  )
}

const TheHits = connectHits(MyHits)

const Content = connectStateResults(
  ({ searchResults, searchState }) =>
    searchState && searchState.query
      ? <TheHits />
      : <div>No query</div>
)

// const StateResults = () => {
//   // return the DOM output
// }

const Algolia = () => (
  <InstantSearch searchClient={searchClient} indexName='dev_v8-alba-mlab'>
    <SearchBox />
    <Content />
  </InstantSearch>
);

const LayoutFull = ({ children }) => (
  <div className='app'>
    <Components.Header />
    <div className='app-body'>
      <Components.Sidebar {...this.props} />
      <main className='main'>
        <Components.ErrorBoundary>
          <Components.FlashMessages />
          <Algolia />
          <Container fluid>
            {children}
          </Container>
        </Components.ErrorBoundary>
      </main>
    </div>
    <Components.Footer />
  </div>
)

replaceComponent('Layout', LayoutFull)
