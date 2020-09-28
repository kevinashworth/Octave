import { registerComponent, Components, withAccess } from 'meteor/vulcan:core'
import React, { forwardRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Media from 'react-media'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import algoliasearch from 'algoliasearch/lite'
import { Configure, connectHits, connectPoweredBy, connectSearchBox, connectStateResults, Highlight, InstantSearch, Snippet } from 'react-instantsearch-dom'

// eslint-disable-next-line react/display-name
const CustomToggle = forwardRef(({ children }, ref) => (
  <span ref={ref}>
    {children} &nbsp;
  </span>
))

const popperConfig = {
  modifiers: [{
    name: 'offset',
    options: {
      offset: [0, 120]
    }
  }]
}

const algoliaindex = Meteor.settings.public.search.SearchIndex
const applicationid = Meteor.settings.public.search.ApplicationID
const searchonlyapikey = Meteor.settings.public.search.SearchOnlyAPIKey
const searchClient = algoliasearch(applicationid, searchonlyapikey)

const PoweredBy = ({ url }) => <a href={url} target='_blank' rel='noopener noreferrer'>Algolia</a>

const CustomPoweredBy = connectPoweredBy(PoweredBy)

const Hits = ({ hits }) => {
  const history = useHistory()
  return (
    <>
      <Dropdown.Toggle as={CustomToggle} id='algolia-dropdown' />
      <Dropdown.Menu popperConfig={popperConfig}>
        <Dropdown.Header>Search powered by <CustomPoweredBy /></Dropdown.Header>
        {hits.length === 0
          ? <Dropdown.Item disabled>No search results</Dropdown.Item>
          : hits.map((hit) => {
            const handleClick = (event) => {
              event.preventDefault()
              history.push(`${hit.url}`)
            }
            return (
              <Dropdown.Item key={hit.objectID} onClick={handleClick} href={hit.url}>
                <Components.ErrorBoundary>
                  <Highlight attribute='name' hit={hit} />{' '}
                  <small className='text-muted'><Snippet attribute='body' hit={hit} /></small>
                </Components.ErrorBoundary>
              </Dropdown.Item>
            )
          })}
      </Dropdown.Menu>
    </>
  )
}

const CustomHits = connectHits(Hits)

const CustomSearchResults = connectStateResults(
  ({ searchState }) =>
    searchState && searchState.query
      ? <CustomHits />
      : null
)

const SearchBox = ({ currentRefinement, refine }) => {
  return (
    <InputGroup>
      <FormControl
        onChange={event => refine(event.currentTarget.value)}
        placeholder='Search all of V8…'
        value={currentRefinement}
      />
      {currentRefinement &&
        <InputGroup.Append>
          <Button onClick={() => refine('')}><i className='fa fa-times' /></Button>
        </InputGroup.Append>}
    </InputGroup>
  )
}

const CustomSearchBox = connectSearchBox(SearchBox)

const Algolia = () => {
  const [show, setShow] = useState(false)
  const handleSearchStateChange = searchState => {
    if (searchState.query && searchState.query.length) {
      setShow(true)
    }
  }
  const toggle = () => setShow(!show)
  const breakpoints = [555, 720, 885, 1215]
  return (
    <InstantSearch
      indexName={algoliaindex}
      onSearchStateChange={handleSearchStateChange}
      searchClient={searchClient}
    >
      <Media
        queries={{
          xs: { maxHeight: breakpoints[0] },
          sm: { minHeight: breakpoints[0] + 1, maxHeight: breakpoints[1] },
          md: { minHeight: breakpoints[1] + 1, maxHeight: breakpoints[2] },
          lg: { minHeight: breakpoints[2] + 1, maxHeight: breakpoints[3] },
          xl: { minHeight: breakpoints[3] + 1 }
        }}
      >
        {matches => (
          <>
            {matches.xs && <Configure hitsPerPage={6} />}
            {matches.sm && <Configure hitsPerPage={9} />}
            {matches.md && <Configure hitsPerPage={12} />}
            {matches.lg && <Configure hitsPerPage={18} />}
            {matches.xl && <Configure hitsPerPage={24} />}
          </>
        )}
      </Media>
      <Dropdown show={show} drop='right' onToggle={toggle}>
        <CustomSearchBox />
        <CustomSearchResults />
      </Dropdown>
    </InstantSearch>
  )
}

const accessOptions = {
  groups: ['participants', 'admins']
}

registerComponent({
  name: 'Search',
  component: Algolia,
  hocs: [[withAccess, accessOptions]]
})
