import { registerComponent, Components } from 'meteor/vulcan:core'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import algoliasearch from 'algoliasearch/lite'
import { connectHits, connectPoweredBy, connectStateResults, Highlight, InstantSearch, SearchBox, Snippet } from 'react-instantsearch-dom'

const searchClient = algoliasearch('14RUP1OK0B', '2cd70a6b9a01c10aeaee6f6f11105f46')

const PoweredBy = ({ url }) => <a href={url} target='_blank' rel='noopener noreferrer'>Algolia</a>

const CustomPoweredBy = connectPoweredBy(PoweredBy)

const Hits = ({ hits }) => {
  return (
    <>
      <DropdownToggle nav></DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Search powered by <CustomPoweredBy /></DropdownItem>
        {hits.length === 0
          ? <DropdownItem>No search results</DropdownItem>
          : hits.map((hit) => {
              let history = useHistory()
              return (
                <DropdownItem key={hit.objectID} onClick={() => history.push(`${hit.url}`)}>
                  <Components.ErrorBoundary>
                    <Link to={hit.url}><Highlight attribute='name' hit={hit} /></Link><br />
                    <small className='text-muted'><Snippet attribute='body' hit={hit} /></small>
                  </Components.ErrorBoundary>
                </DropdownItem>
              )
            }
          )}
        </DropdownMenu>
    </>
  )
}

const CustomHits = connectHits(Hits)

const Content = connectStateResults(
  ({ searchResults, searchState }) =>
    searchState && searchState.query
    ? <CustomHits />
    : null
)

const Algolia = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const onSearchStateChange = searchState => {
    if (searchState.query.length) {
      setDropdownOpen(true)
    }
  }
  const toggle = () => setDropdownOpen(!isDropdownOpen)

  return (
    <InstantSearch
      searchClient={searchClient} indexName='dev_v8-alba-mlab'
      onSearchStateChange={onSearchStateChange}>
      <Dropdown isOpen={isDropdownOpen} direction='right' toggle={toggle} inNavbar>
        <SearchBox translations={{ placeholder: 'Search all of V8…' }} reset={<img src='/img/white-times-11x11.gif'></img>} />
        <Content />
      </Dropdown>
    </InstantSearch>
  )
}

registerComponent('Search', Algolia)
