import { replaceComponent, Components } from 'meteor/vulcan:core'
import React from 'react'
import { Container } from 'reactstrap'

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

const searchClient = algoliasearch('14RUP1OK0B', '2cd70a6b9a01c10aeaee6f6f11105f46');

const Hit = ({ hit }) => <p>{hit.name}</p>

const Algolia = () => (
  <InstantSearch searchClient={searchClient} indexName='dev_v8-alba-mlab'>
    <SearchBox />
    <Hits hitComponent={Hit} />
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
