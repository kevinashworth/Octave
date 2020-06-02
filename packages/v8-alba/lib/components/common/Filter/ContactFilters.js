import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
// import {
//   ButtonDropdown,
//   ButtonGroup,
//   CustomInput,
//   DropdownItem,
//   DropdownMenu,
//   DropdownToggle
// } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import FormCheck from 'react-bootstrap/FormCheck'
import styled from 'styled-components'
import withFilters from '../../../modules/hocs/withFilters.js'

// Like Dropdown.Item but no toggle functionality or flash of color on click
const DropdownItemStatic = styled.div`
  padding: 10px 20px;
  white-space: nowrap;
`

const FilterToggleButtons = ({ onClickHandler }) => {
  return (
    <ButtonGroup className='mt-2'>
      {['All', 'None', 'Toggle'].map(
        (label) => (
          <Button
            className='mr-1'
            key={label}
            onClick={onClickHandler}
            variant='outline-secondary'
            size='sm'
          >
            {label}
          </Button>
        )
      )}
    </ButtonGroup>
  )
}

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  titleVariant: 'secondary',
  updatedVariant: 'secondary',
  locationVariant: 'secondary'
}

class ContactFilters extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      ...keptState
    }
  }

  componentWillUnmount () {
    // Remember state for the next mount
    keptState = {
      titleVariant: this.state.titleVariant,
      updatedVariant: this.state.updatedVariant,
      locationVariant: this.state.locationVariant
    }
  }

  // TODO: These handlers don't set colors back to 'secondary' except when 'All' is clicked
  // TODO: DRY these various handlers
  handleChange = (event) => {
    const i = parseInt(event.target.id, 10)
    if (event.target.name === 'contactTitle') {
      this.props.actions.toggleContactTitleFilter(i)
      this.setState({ titleVariant: 'danger' })
    }

    if (event.target.name === 'contactUpdated') {
      const all = event.target.labels[0].innerHTML.indexOf('All') !== -1
      this.props.actions.toggleContactUpdatedFilter(i)
      if (all) {
        this.setState({ updatedVariant: 'secondary' })
      } else {
        this.setState({ updatedVariant: 'danger' })
      }
    }

    if (event.target.name === 'contactLocation') {
      this.props.actions.toggleContactLocationFilter(i)
      this.setState({ locationVariant: 'danger' })
    }
  }

  handleClickContactLocation = (event) => {
    const all = event.target.innerHTML.indexOf('All') !== -1
    const none = event.target.innerHTML.indexOf('None') !== -1
    const toggle = event.target.innerHTML.indexOf('Toggle') !== -1
    const length = this.props.contactLocationFilters.length
    if (toggle) {
      for (let i = 0; i < length; i++) {
        this.props.actions.toggleContactLocationFilter(i)
      }
    } else { // for All and for None
      for (let i = 0; i < length; i++) {
        if ((this.props.contactLocationFilters[i].value && none) || (!this.props.contactLocationFilters[i].value && !none)) {
          this.props.actions.toggleContactLocationFilter(i)
        }
      }
    }
    if (all) {
      this.setState({ locationVariant: 'secondary' })
    }
    if (none) {
      this.setState({ locationVariant: 'danger' })
    }
  }

  handleClickContactTitle = (event) => {
    const all = event.target.innerHTML.indexOf('All') !== -1
    const none = event.target.innerHTML.indexOf('None') !== -1
    const toggle = event.target.innerHTML.indexOf('Toggle') !== -1
    const length = this.props.contactTitleFilters.length
    if (toggle) {
      for (let i = 0; i < length; i++) {
        this.props.actions.toggleContactTitleFilter(i)
      }
    } else if (all || none) {
      for (let i = 0; i < length; i++) {
        if ((this.props.contactTitleFilters[i].value && none) || (!this.props.contactTitleFilters[i].value && !none)) {
          this.props.actions.toggleContactTitleFilter(i)
        }
      }
    }
    if (all) {
      this.setState({ titleVariant: 'secondary' })
    }
    if (none) {
      this.setState({ titleVariant: 'danger' })
    }
  }

  render () {
    return (
      <div className='float-right'>
        <ButtonGroup>
          <Dropdown as={ButtonGroup} className='ml-2'>
            <Dropdown.Toggle id='dropdown-title' variant={this.state.titleVariant}>
              Title
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Filter contacts by title</Dropdown.Header>
              <DropdownItemStatic>
                {this.props.contactTitleFilters.map((contact, index) =>
                  <FormCheck
                    checked={contact.value}
                    custom
                    id={`${index}-title`}
                    key={`${contact.contactTitle}`}
                    label={`${contact.contactTitle}`}
                    name='contactTitle'
                    onChange={this.handleChange}
                  />
                )}
                <FilterToggleButtons onClickHandler={this.handleClickContactTitle} />
              </DropdownItemStatic>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown as={ButtonGroup} className='ml-2'>
            <Dropdown.Toggle id='dropdown-updated' variant={this.state.updatedVariant}>
              Last updated
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Filter contacts by last updated</Dropdown.Header>
              <DropdownItemStatic>
                {this.props.contactUpdatedFilters.map((filter, index) =>
                  <FormCheck
                    checked={filter.value}
                    custom
                    id={`${index}-updated`}
                    key={`${filter.contactUpdated}`}
                    label={`${filter.contactUpdated}`}
                    name='contactUpdated'
                    onChange={this.handleChange}
                    type='radio'
                  />
                )}
              </DropdownItemStatic>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown as={ButtonGroup} className='ml-2'>
            <Dropdown.Toggle id='dropdown-location' variant={this.state.locationVariant}>
              Location
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Filter contacts by location</Dropdown.Header>
              <DropdownItemStatic>
                {this.props.contactLocationFilters.map((contact, index) =>
                  <FormCheck
                    checked={contact.value}
                    custom
                    id={`${index}-location`}
                    key={`${contact.contactLocation}`}
                    label={`${contact.contactLocation}`}
                    name='contactLocation'
                    onChange={this.handleChange}
                  />
                )}
                <FilterToggleButtons onClickHandler={this.handleClickContactLocation} />
              </DropdownItemStatic>
            </Dropdown.Menu>
          </Dropdown>
        </ButtonGroup>
      </div>
    )
  }
}

registerComponent('ContactFilters', ContactFilters, withFilters)
