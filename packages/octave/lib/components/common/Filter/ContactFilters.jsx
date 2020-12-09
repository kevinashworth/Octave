import { registerComponent } from 'meteor/vulcan:core'
import { getActions } from 'meteor/vulcan:redux'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import FormCheck from 'react-bootstrap/FormCheck'
import DropdownItem from './DropdownItem'
import ToggleButtons from './ToggleButtons'
import { getCheckboxVariant, getRadioVariant, handleAllNoneToggle } from './utils'

const ContactFilters = () => {
  const getLocationFilters = (state) => state.contactLocationFilters
  const locationFilters = useSelector(getLocationFilters)
  const locationVariant = useSelector(createSelector(getLocationFilters, getCheckboxVariant))

  const getTitleFilters = (state) => state.contactTitleFilters
  const titleFilters = useSelector(getTitleFilters)
  const titleVariant = useSelector(createSelector(getTitleFilters, getCheckboxVariant))

  const getUpdatedFilters = (state) => state.contactUpdatedFilters
  const updatedFilters = useSelector(getUpdatedFilters)
  const updatedVariant = useSelector(createSelector(getUpdatedFilters, getRadioVariant))

  const dispatch = useDispatch()
  const actions = getActions()

  const handleChange = (event) => {
    const i = parseInt(event.target.id, 10)
    switch (event.target.name) {
      case 'contact-location':
        dispatch(actions.toggleContactLocationFilter(i))
        break
      case 'contact-title':
        dispatch(actions.toggleContactTitleFilter(i))
        break
      case 'contact-updated':
        dispatch(actions.toggleContactUpdatedFilter(i))
        break
    }
  }

  const handleClickContactLocation = (event) => {
    handleAllNoneToggle(event, locationFilters, dispatch, actions.toggleContactLocationFilter)
  }

  const handleClickContactTitle = (event) => {
    handleAllNoneToggle(event, titleFilters, dispatch, actions.toggleContactTitleFilter)
  }

  return (
    <div className='float-right'>
      <ButtonGroup>
        <Dropdown as={ButtonGroup} className='ml-2'>
          <Dropdown.Toggle id='dropdown-title' variant={titleVariant}>
            Title
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>Filter contacts by title</Dropdown.Header>
            <DropdownItem>
              {titleFilters.map((contact, index) =>
                <FormCheck
                  checked={contact.value}
                  custom
                  id={`${index}-title`}
                  key={`${contact.contactTitle}`}
                  label={`${contact.contactTitle}`}
                  name='contact-title'
                  onChange={handleChange}
                />
              )}
              <ToggleButtons onClickHandler={handleClickContactTitle} />
            </DropdownItem>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown as={ButtonGroup} className='ml-2'>
          <Dropdown.Toggle id='dropdown-updated' variant={updatedVariant}>
            Last updated
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>Filter contacts by last updated</Dropdown.Header>
            <DropdownItem>
              {updatedFilters.map((filter, index) =>
                <FormCheck
                  checked={filter.value}
                  custom
                  id={`${index}-updated`}
                  key={`${filter.updated}`}
                  label={`${filter.updated}`}
                  name='contact-updated'
                  onChange={handleChange}
                  type='radio'
                />
              )}
            </DropdownItem>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown as={ButtonGroup} className='ml-2'>
          <Dropdown.Toggle id='dropdown-location' variant={locationVariant}>
            Location
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>Filter contacts by location</Dropdown.Header>
            <DropdownItem>
              {locationFilters.map((contact, index) =>
                <FormCheck
                  checked={contact.value}
                  custom
                  id={`${index}-location`}
                  key={`${contact.contactLocation}`}
                  label={`${contact.contactLocation}`}
                  name='contact-location'
                  onChange={handleChange}
                />
              )}
              <ToggleButtons onClickHandler={handleClickContactLocation} />
            </DropdownItem>
          </Dropdown.Menu>
        </Dropdown>
      </ButtonGroup>
    </div>
  )
}

registerComponent('ContactFilters', React.memo(ContactFilters))
