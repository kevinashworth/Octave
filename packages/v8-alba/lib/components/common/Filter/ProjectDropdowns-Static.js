import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap'

class ProjectDropdowns extends PureComponent {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      dropdownOpen: new Array(3).fill(false)
    }
  }

  toggle (i) {
    const newArray = this.state.dropdownOpen.map((element, index) => { return (index === i ? !element : false) })
    this.setState({
      dropdownOpen: newArray
    })
  }

  render () {
    return (
      <div className='float-right'>
        <ButtonDropdown className='ml-2' isOpen={this.state.dropdownOpen[0]} toggle={() => { this.toggle(0) }}>
          <DropdownToggle caret>
            Type
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter by type</DropdownItem>
            <DropdownItem><i className='fa fa-check' /> Feature Film</DropdownItem>
            <DropdownItem><i className='fa fa-check' /> Feature Film (LB)</DropdownItem>
            <DropdownItem><i className='fa fa-check' /> Feature Film (MLB)</DropdownItem>
            <DropdownItem><i className='fa fa-fw' /> Feature Film (ULB)</DropdownItem>
            <DropdownItem><i className='fa fa-check' /> Pilot One Hour </DropdownItem>
            <DropdownItem><i className='fa fa-check' /> Pilot 1/2 Hour </DropdownItem>
            <DropdownItem><i className='fa fa-check' /> TV One Hour </DropdownItem>
            <DropdownItem><i className='fa fa-check' /> TV Daytime </DropdownItem>
            <DropdownItem><i className='fa fa-check' /> TV 1/2 Hour </DropdownItem>
            <DropdownItem><i className='fa fa-check' /> TV Mini-Series </DropdownItem>
            <DropdownItem><i className='fa fa-check' /> TV Movie </DropdownItem>
            <DropdownItem><i className='fa fa-check' /> New Media (SVOD) </DropdownItem>
            <DropdownItem><i className='fa fa-check' /> New Media (AVOD) </DropdownItem>
            <DropdownItem><i className='fa fa-fw' /> New Media (&lt; $50k)</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown className='ml-2' isOpen={this.state.dropdownOpen[1]} toggle={() => { this.toggle(1) }}>
          <DropdownToggle caret>
            Last updated
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter by last updated</DropdownItem>
            <DropdownItem><i className='fa fa-fw' />One Day</DropdownItem>
            <DropdownItem><i className='fa fa-fw' />One Week</DropdownItem>
            <DropdownItem><i className='fa fa-check' />Two Weeks</DropdownItem>
            <DropdownItem><i className='fa fa-fw' />One Month</DropdownItem>
            <DropdownItem><i className='fa fa-fw' />Two Months</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown className='ml-2' isOpen={this.state.dropdownOpen[2]} toggle={() => { this.toggle(2) }}>
          <DropdownToggle caret>
            Status
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter by status</DropdownItem>
            <DropdownItem><i className='fa fa-check' />Casting</DropdownItem>
            <DropdownItem><i className='fa fa-check' />On Hold</DropdownItem>
            <DropdownItem><i className='fa fa-fw' />Shooting</DropdownItem>
            <DropdownItem><i className='fa fa-check' />On Hiatus</DropdownItem>
            <DropdownItem><i className='fa fa-check' />See Notes</DropdownItem>
            <DropdownItem><i className='fa fa-check' />Unknown</DropdownItem>
            <DropdownItem header>Inactive</DropdownItem>
            <DropdownItem><i className='fa fa-fw' />Wrapped</DropdownItem>
            <DropdownItem><i className='fa fa-fw' />Canceled</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    )
  }
}

registerComponent('ProjectDropdowns', ProjectDropdowns)
