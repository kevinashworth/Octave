import { registerComponent } from "meteor/vulcan:core";
// import Users from 'meteor/vulcan:users';
import React, { PureComponent } from 'react';
import {
  ButtonDropdown,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form
} from 'reactstrap';
// import projectFiltersArray from '../../../modules/filters/custom_fields.js';

class ProjectFilters extends PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      dropdownOpen: new Array(3).fill(false),
      filterProjectsByTypeFeatureFilm: true,
      filterProjectsByTypeFeatureFilmLb: false,
      filterProjectsByTypeFeatureFilmMlb: false,
      filterProjectsByTypeFeatureFilmUlb: false,
      filterProjectsByTypePilotOneHour: true,
      filterProjectsByTypePilot12Hour: true,
      filterProjectsByTypeTvOneHour: false,
      filterProjectsByTypeTv12Hour: false,
      filterProjectsByTypeTvDaytime: false,
      filterProjectsByTypeTvMiniSeries: false,
      filterProjectsByTypeTvMovie: false,
      filterProjectsByStatusCasting: true,
      selectedOption: 'filterProjectsByLastUpdatedTwoWeeks'
    };
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => { return (index === i ? !element : false); });
    this.setState({
      dropdownOpen: newArray
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.id ? target.id : target.name;

    this.setState({
      [name]: value
    });
  }

  handleOptionChange(event) {
    this.setState({
      selectedOption: event.target.id
    });
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  // props.editMutation({
  //   documentId: this.props.currentUser._id,
  //   set: set,
  //   unset: {}
  // })
  // .then(/* success */)
  // .catch(/* error */);

  render() {
    return (
      <div className="float-right">
        <Form onSubmit={this.handleSubmit}>
        <ButtonDropdown className="ml-2" isOpen={this.state.dropdownOpen[0]} toggle={() => {this.toggle(0)}}>
          <DropdownToggle caret>
            Type
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter projects by type</DropdownItem>
            <DropdownItem toggle={false}>
              <CustomInput type="checkbox" id="filterProjectsByTypeFeatureFilm" label="Feature Film"
                checked={this.state.filterProjectsByTypeFeatureFilm} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeFeatureFilmLb" label="Feature Film (LB)"
                checked={this.state.filterProjectsByTypeFeatureFilmLb} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeFeatureFilmMlb" label="Feature Film (MLB)"
                checked={this.state.filterProjectsByTypeFeatureFilmMlb} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeFeatureFilmUlb" label="Feature Film (ULB)"
                checked={this.state.filterProjectsByTypeFeatureFilmUlb} onChange={this.handleInputChange} />
            </DropdownItem>
            <DropdownItem toggle={false}>
              <CustomInput type="checkbox" id="filterProjectsByTypePilotOneHour" label="Pilot One Hour"
                checked={this.state.filterProjectsByTypePilotOneHour} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypePilot12Hour" label="Pilot 1/2 Hour"
                checked={this.state.filterProjectsByTypePilot12Hour} onChange={this.handleInputChange} />
            </DropdownItem>
            <DropdownItem toggle={false}>
              <CustomInput type="checkbox" id="filterProjectsByTypeTvOneHour" label="TV One Hour" />
              <CustomInput type="checkbox" id="filterProjectsByTypeTv12Hour" label="TV 1/2 Hour" />
              <CustomInput type="checkbox" id="filterProjectsByTypeTvDaytime" label="TV Daytime" />
              <CustomInput type="checkbox" id="filterProjectsByTypeTvMiniSeries" label="TV Mini-Series" />
              <CustomInput type="checkbox" id="filterProjectsByTypeTvMovie" label="TV Movie" />
            </DropdownItem>
            <DropdownItem toggle={false}>
              <CustomInput type="checkbox" id="filterProjectsByTypeNewMediaSvod" label="New Media (SVOD)" />
              <CustomInput type="checkbox" id="filterProjectsByTypeNewMediaAvod" label="New Media (AVOD)" />
              <CustomInput type="checkbox" id="filterProjectsByTypeNewMedia50K" label="New Media (<$50k)" />
            </DropdownItem>
            <DropdownItem toggle={false}><a href="#" size="sm" color="primary">Show All</a></DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown className="ml-2" isOpen={this.state.dropdownOpen[1]} toggle={() => {this.toggle(1)}}>
          <DropdownToggle caret>
            Last updated
          </DropdownToggle>
          <DropdownMenu onChange={event => this.handleOptionChange(event)}>
            <DropdownItem header>Filter projects by last updated</DropdownItem>
            <DropdownItem toggle={false}>
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneDay" label="One Day" />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneWeek" label="One Week" />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedTwoWeeks" label="Two Weeks" />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneMonth" label="One Month" />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedTwoMonths" label="Two Months" />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneYear" label="One Year" />
            </DropdownItem>
            <DropdownItem toggle={false}><a href="#" size="sm" color="primary">Show All</a></DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown className="ml-2" isOpen={this.state.dropdownOpen[2]} toggle={() => {this.toggle(2)}}>
          <DropdownToggle caret>
            Status
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter projects by status</DropdownItem>
            <DropdownItem toggle={false}>
              <CustomInput type="checkbox" id="filterProjectsByStatusCasting" label="Casting"
                checked={this.state.filterProjectsByStatusCasting} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByStatusOnHold" label="On Hold" />
              <CustomInput type="checkbox" id="filterProjectsByStatusShooting" label="Shooting" />
              <CustomInput type="checkbox" id="filterProjectsByStatusOnHiatus" label="On Hiatus" />
              <CustomInput type="checkbox" id="filterProjectsByStatusSeeNotes" label="See Notes" />
              <CustomInput type="checkbox" id="filterProjectsByStatusUnknown" label="Unknown" />
            </DropdownItem>
            <DropdownItem header>Inactive</DropdownItem>
            <DropdownItem toggle={false}>
              <CustomInput type="checkbox" id="filterProjectsByStatusWrapped" label="Wrapped" />
              <CustomInput type="checkbox" id="filterProjectsByStatusCanceled" label="Canceled" />
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </Form>
      </div>
    );
  }
}

registerComponent('ProjectFilters', ProjectFilters);
