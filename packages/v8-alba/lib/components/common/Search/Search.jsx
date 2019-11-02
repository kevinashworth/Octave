import { registerComponent, Components } from 'meteor/vulcan:core'
import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Form, FormGroup } from 'reactstrap'
import algoliasearch from 'algoliasearch/lite'
import { connectHits, connectSearchBox, connectStateResults, InstantSearch } from 'react-instantsearch-dom'

const searchClient = algoliasearch('14RUP1OK0B', '2cd70a6b9a01c10aeaee6f6f11105f46')

const SearchBox = ({ currentRefinement, refine }) => (
  <Form noValidate action='' role='search' inline={true}>
    <FormGroup row>
      <Input placeholder='Search'
        type='search'
        value={currentRefinement}
        onChange={event => refine(event.currentTarget.value)}
      />
      </FormGroup>
  </Form>
);

const CustomSearchBox = connectSearchBox(SearchBox);

const Hits = ({ hits }) => {
  return (
    <Fragment>
      <DropdownToggle nav></DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Search Results</DropdownItem>
        {hits.map(hit => (
          <DropdownItem key={hit.objectID}><Link to={hit.url}>{hit.name}</Link></DropdownItem>
        ))}
      </DropdownMenu>
    </Fragment>
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
      <Dropdown nav isOpen={isDropdownOpen} direction='right' toggle={toggle}>
        <CustomSearchBox />
        <Content />
      </Dropdown>
    </InstantSearch>
  )
}

registerComponent('Search', Algolia)
