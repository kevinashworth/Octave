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
      filterProjectsByTypeNewMediaSvod: true,
      filterProjectsByTypeNewMediaAvod: true,
      filterProjectsByTypeNewMedia50K: false,
      filterProjectsByStatusCasting: true,
      filterProjectsByStatusOnHold: false,
      filterProjectsByStatusShooting: false,
      filterProjectsByStatusOnHiatus: false,
      filterProjectsByStatusSeeNotes: true,
      filterProjectsByStatusUnknown: true,
      filterProjectsByStatusWrapped: false,
      filterProjectsByStatusCanceled: false,
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
    event.persist();
    // eslint-disable-next-line no-console
    console.info('An event was triggered: ', event);
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
              <CustomInput type="checkbox" id="filterProjectsByTypeTvOneHour" label="TV One Hour"
                checked={this.state.filterProjectsByTypeTvOneHour} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeTv12Hour" label="TV 1/2 Hour"
                checked={this.state.filterProjectsByTypeTv12Hour} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeTvDaytime" label="TV Daytime"
                checked={this.state.filterProjectsByTypeTvDaytime} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeTvMiniSeries" label="TV Mini-Series"
                checked={this.state.filterProjectsByTypeTvMiniSeries} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeTvMovie" label="TV Movie"
                checked={this.state.filterProjectsByTypeTvMovie} onChange={this.handleInputChange} />
            </DropdownItem>
            <DropdownItem toggle={false}>
              <CustomInput type="checkbox" id="filterProjectsByTypeNewMediaSvod" label="New Media (SVOD)"
                checked={this.state.filterProjectsByTypeNewMediaSvod} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeNewMediaAvod" label="New Media (AVOD)"
                checked={this.state.filterProjectsByTypeNewMediaAvod} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeNewMedia50K" label="New Media (<$50k)"
                checked={this.state.filterProjectsByTypeNewMedia50K} onChange={this.handleInputChange} />
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
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneDay" label="One Day"
                checked={this.state.selectedOption === 'filterProjectsByLastUpdatedOneDay'} onChange={this.handleOptionChange} />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneWeek" label="One Week"
                checked={this.state.selectedOption === 'filterProjectsByLastUpdatedOneWeek'} onChange={this.handleOptionChange} />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedTwoWeeks" label="Two Weeks"
                checked={this.state.selectedOption === 'filterProjectsByLastUpdatedTwoWeeks'} onChange={this.handleOptionChange} />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneMonth" label="One Month"
                checked={this.state.selectedOption === 'filterProjectsByLastUpdatedOneMonth'} onChange={this.handleOptionChange} />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedTwoMonths" label="Two Months"
                checked={this.state.selectedOption === 'filterProjectsByLastUpdatedTwoMonths'} onChange={this.handleOptionChange} />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneYear" label="One Year"
                checked={this.state.selectedOption === 'filterProjectsByLastUpdatedOneYear'} onChange={this.handleOptionChange} />
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
              <CustomInput type="checkbox" id="filterProjectsByStatusOnHold" label="On Hold"
                checked={this.state.filterProjectsByStatusOnHold} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByStatusShooting" label="Shooting"
                checked={this.state.filterProjectsByStatusShooting} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByStatusOnHiatus" label="On Hiatus"
                checked={this.state.filterProjectsByStatusOnHiatus} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByStatusSeeNotes" label="See Notes"
                checked={this.state.filterProjectsByStatusSeeNotes} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByStatusUnknown" label="Unknown"
                checked={this.state.filterProjectsByStatusUnknown} onChange={this.handleInputChange} />
            </DropdownItem>
            <DropdownItem header>Inactive</DropdownItem>
            <DropdownItem toggle={false}>
              <CustomInput type="checkbox" id="filterProjectsByStatusWrapped" label="Wrapped"
                checked={this.state.filterProjectsByStatusWrapped} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByStatusCanceled" label="Canceled"
                checked={this.state.filterProjectsByStatusCanceled} onChange={this.handleInputChange} />
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </Form>
      </div>
    );
  }
}

registerComponent('ProjectFilters', ProjectFilters);
