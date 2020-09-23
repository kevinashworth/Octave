import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
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

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  typeVariant: 'secondary',
  updatedVariant: 'secondary',
  statusVariant: 'secondary',
  platformVariant: 'secondary'
}

class ProjectFilters extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      ...keptState
    }
  }

  componentWillUnmount () {
    // Remember state for the next mount
    keptState = {
      typeVariant: this.state.typeVariant,
      updatedVariant: this.state.updatedVariant,
      statusVariant: this.state.statusVariant,
      platformVariant: this.state.platformVariant
    }
  }

  handleChange = (event) => {
    const i = parseInt(event.target.id, 10)
    if (event.target.name === 'project-type') {
      this.props.actions.toggleProjectTypeFilter(i)
      this.setState({ typeVariant: 'danger' })
    }
    if (event.target.name === 'project-updated') {
      const all = event.target.labels[0].innerHTML.indexOf('All') !== -1
      this.props.actions.toggleProjectUpdatedFilter(i)
      if (all) {
        this.setState({ updatedVariant: 'secondary' })
      } else {
        this.setState({ updatedVariant: 'danger' })
      }
    }
    if (event.target.name === 'project-status') {
      this.props.actions.toggleProjectStatusFilter(i)
      this.setState({ statusVariant: 'danger' })
    }
    if (event.target.name === 'project-platform') {
      this.props.actions.toggleProjectPlatformFilter(i)
      this.setState({ platformVariant: 'danger' })
    }
  }

  // TODO: DRY these handlers below this line

  handleClickProjectType = (event) => {
    const all = event.target.innerHTML.indexOf('All') !== -1
    const film = event.target.innerHTML.indexOf('Film') !== -1
    const none = event.target.innerHTML.indexOf('None') !== -1
    const toggle = event.target.innerHTML.indexOf('Toggle') !== -1
    const tv = event.target.innerHTML.indexOf('TV') !== -1
    const length = this.props.projectTypeFilters.length
    if (toggle) {
      for (let i = 0; i < length; i++) {
        this.props.actions.toggleProjectTypeFilter(i)
      }
    } else if (all || none) {
      for (let i = 0; i < length; i++) {
        if ((this.props.projectTypeFilters[i].value && none) || (!this.props.projectTypeFilters[i].value && !none)) {
          this.props.actions.toggleProjectTypeFilter(i)
        }
      }
    } else if (film) {
      for (let i = 0; i < length; i++) {
        if (this.props.projectTypeFilters[i].projectType.indexOf('Film') !== -1) {
          this.props.actions.setProjectTypeFilter(i)
        } else {
          this.props.actions.clearProjectTypeFilter(i)
        }
      }
      this.setState({ typeVariant: 'danger' })
    } else if (tv) {
      for (let i = 0; i < length; i++) {
        if (this.props.projectTypeFilters[i].projectType.indexOf('TV') !== -1) {
          this.props.actions.setProjectTypeFilter(i)
        } else {
          this.props.actions.clearProjectTypeFilter(i)
        }
      }
      this.setState({ typeVariant: 'danger' })
    }
    if (all) {
      this.setState({ typeVariant: 'secondary' })
    }
    if (none) {
      this.setState({ typeVariant: 'danger' })
    }
  }

  handleClickProjectPlatform = (event) => {
    const all = event.target.innerHTML.indexOf('All') !== -1
    const none = event.target.innerHTML.indexOf('None') !== -1
    const toggle = event.target.innerHTML.indexOf('Toggle') !== -1
    const length = this.props.projectPlatformFilters.length
    if (toggle) {
      for (let i = 0; i < length; i++) {
        this.props.actions.toggleProjectPlatformFilter(i)
      }
    } else if (all || none) {
      for (let i = 0; i < length; i++) {
        if ((this.props.projectPlatformFilters[i].value && none) || (!this.props.projectPlatformFilters[i].value && !none)) {
          this.props.actions.toggleProjectPlatformFilter(i)
        }
      }
    }
    if (all) {
      this.setState({ platformVariant: 'secondary' })
    }
    if (none) {
      this.setState({ platformVariant: 'danger' })
    }
  }

  handleClickProjectStatus = (event) => {
    const all = event.target.innerHTML.indexOf('All') !== -1
    const none = event.target.innerHTML.indexOf('None') !== -1
    const active = event.target.innerHTML.indexOf('Active') !== -1
    const toggle = event.target.innerHTML.indexOf('Toggle') !== -1
    const length = this.props.projectStatusFilters.length
    if (toggle) {
      for (let i = 0; i < length; i++) {
        this.props.actions.toggleProjectStatusFilter(i)
      }
    } else if (active) {
      let i
      for (i = 0; i < 3; i++) { // Casting, Shooting, See Notes, the 3 that are actively Active
        this.props.actions.setProjectStatusFilter(i)
      }
      for (; i < length; i++) {
        this.props.actions.clearProjectStatusFilter(i)
      }
      this.setState({ statusVariant: 'danger' })
    } else if (all || none) {
      for (let i = 0; i < length; i++) {
        if ((this.props.projectStatusFilters[i].value && none) || (!this.props.projectStatusFilters[i].value && !none)) {
          this.props.actions.toggleProjectStatusFilter(i)
        }
      }
    }
    if (all) {
      this.setState({ statusVariant: 'secondary' })
    }
    if (none) {
      this.setState({ statusVariant: 'danger' })
    }
  }

  render () {
    return (
      <div className='float-right'>
        <ButtonGroup>
          <Dropdown as={ButtonGroup} className='ml-2'>
            <Dropdown.Toggle id='dropdown-type' variant={this.state.typeVariant}>
            Type
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Filter projects by type</Dropdown.Header>
              <DropdownItemStatic>
                {this.props.projectTypeFilters.map((project, index) =>
                  <FormCheck
                    checked={project.value}
                    custom
                    id={`${index}-type`}
                    key={`${project.projectType}`}
                    label={`${project.projectType}`}
                    name='project-type'
                    onChange={this.handleChange}
                  />
                )}
                <ButtonGroup className='mt-2'>
                  {['Film', 'TV', 'All', 'None', 'Toggle'].map(
                    (label) => (
                      <Button
                        className='mr-1'
                        key={label}
                        onClick={this.handleClickProjectType}
                        variant='outline-secondary'
                        size='sm'
                      >
                        {label}
                      </Button>
                    )
                  )}
                </ButtonGroup>
              </DropdownItemStatic>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown as={ButtonGroup} className='ml-2'>
            <Dropdown.Toggle id='dropdown-updated' variant={this.state.updatedVariant}>
            Last updated
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Filter projects by last updated</Dropdown.Header>
              <DropdownItemStatic>
                {this.props.projectUpdatedFilters.map((filter, index) =>
                  <FormCheck
                    checked={filter.value}
                    custom
                    id={`${index}-updated`}
                    key={`${filter.projectUpdated}`}
                    label={`${filter.projectUpdated}`}
                    name='project-updated'
                    onChange={this.handleChange}
                    type='radio'
                  />
                )}
              </DropdownItemStatic>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown as={ButtonGroup} className='ml-2'>
            <Dropdown.Toggle id='dropdown-status' variant={this.state.statusVariant}>
              Status
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Filter projects by status</Dropdown.Header>
              <DropdownItemStatic>
                {this.props.projectStatusFilters.map((project, index) =>
                  <FormCheck
                    checked={project.value}
                    custom
                    id={`${index}-status`}
                    key={`${project.projectStatus}`}
                    label={`${project.projectStatus}`}
                    name='project-status'
                    onChange={this.handleChange}
                  />
                )}
                <ButtonGroup className='mt-2'>
                  {['All', 'Active', 'None', 'Toggle'].map(
                    (label) => (
                      <Button
                        className='mr-1'
                        key={label}
                        onClick={this.handleClickProjectStatus}
                        variant='outline-secondary'
                        size='sm'
                      >
                        {label}
                      </Button>
                    )
                  )}
                </ButtonGroup>
              </DropdownItemStatic>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown as={ButtonGroup} className='ml-2'>
            <Dropdown.Toggle id='dropdown-platform' variant={this.state.platformVariant}>
              Platform
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Filter projects by platform</Dropdown.Header>
              <DropdownItemStatic>
                {this.props.projectPlatformFilters.map((project, index) =>
                  <FormCheck
                    checked={project.value}
                    custom
                    id={`${index}-platform`}
                    key={`${project.projectPlatform}`}
                    label={`${project.projectPlatform}`}
                    name='project-platform'
                    onChange={this.handleChange}
                  />
                )}
                <ButtonGroup className='mt-2'>
                  {['All', 'None', 'Toggle'].map(
                    (label) => (
                      <Button
                        className='mr-1'
                        key={label}
                        onClick={this.handleClickProjectPlatform}
                        variant='outline-secondary'
                        size='sm'
                      >
                        {label}
                      </Button>
                    )
                  )}
                </ButtonGroup>
              </DropdownItemStatic>
            </Dropdown.Menu>
          </Dropdown>
        </ButtonGroup>
      </div>
    )
  }
}

registerComponent('ProjectFilters', ProjectFilters, withFilters)
