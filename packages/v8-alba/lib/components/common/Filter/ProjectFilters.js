import { registerComponent, withCurrentUser, withEdit } from "meteor/vulcan:core";
import Users from 'meteor/vulcan:users';
import React, { PureComponent } from 'react';
import {
  ButtonDropdown,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import projectFiltersArray from '../../../modules/filters/custom_fields.js';

// DropdownItemStatic: I simply copied pertinent-seeming styles generated by a DropdownItem, but there is no "flash" when you click
const DropdownItemStatic = styled.div`
  border-bottom: 1px solid #c2cfd6;
  padding: 10px 20px;
  white-space: nowrap;
`;

class ProjectFilters extends PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    const user = this.props.currentUser;
    this.state = {
      dropdownOpen: new Array(3).fill(false),
      filterProjectsByTypeFeatureFilm: user.filterProjectsByTypeFeatureFilm,
      filterProjectsByTypeFeatureFilmLb: user.filterProjectsByTypeFeatureFilmLb,
      filterProjectsByTypeFeatureFilmMlb: user.filterProjectsByTypeFeatureFilmMlb,
      filterProjectsByTypeFeatureFilmUlb: user.filterProjectsByTypeFeatureFilmUlb,
      filterProjectsByTypePilotOneHour: user.filterProjectsByTypePilotOneHour,
      filterProjectsByTypePilot12Hour: user.filterProjectsByTypePilot12Hour,
      filterProjectsByTypeTvOneHour: user.filterProjectsByTypeTvOneHour,
      filterProjectsByTypeTv12Hour: user.filterProjectsByTypeTv12Hour,
      filterProjectsByTypeTvDaytime: user.filterProjectsByTypeTvDaytime,
      filterProjectsByTypeTvMiniSeries: user.filterProjectsByTypeTvMiniSeries,
      filterProjectsByTypeTvMovie: user.filterProjectsByTypeTvMovie,
      filterProjectsByTypeNewMediaSvod: user.filterProjectsByTypeNewMediaSvod,
      filterProjectsByTypeNewMediaAvod: user.filterProjectsByTypeNewMediaAvod,
      filterProjectsByTypeNewMedia50K: user.filterProjectsByTypeNewMedia50K,
      filterProjectsByStatusCasting: user.filterProjectsByStatusCasting,
      filterProjectsByStatusOnHold: user.filterProjectsByStatusOnHold,
      filterProjectsByStatusShooting: user.filterProjectsByStatusShooting,
      filterProjectsByStatusOnHiatus: user.filterProjectsByStatusOnHiatus,
      filterProjectsByStatusSeeNotes: user.filterProjectsByStatusSeeNotes,
      filterProjectsByStatusUnknown: user.filterProjectsByStatusUnknown,
      filterProjectsByStatusWrapped: user.filterProjectsByStatusWrapped,
      filterProjectsByStatusCanceled: user.filterProjectsByStatusCanceled,
      filterProjectsByLastUpdated: 'filterProjectsByLastUpdatedTwoWeeks'
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

    this.props.editMutation({
      documentId: this.props.currentUser._id,
      set: {
        [name]: value
      },
      unset: {}
    })
    .then(({data}) => {
      // eslint-disable-next-line no-console
      console.info('success:', data);
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error('failure:', error);
    });

  }

  // this happens to handle the Do Not Filter link as empty string, which should work
  handleOptionChange(event) {
    // eslint-disable-next-line no-console
    console.log('handleOptionChange:', event.target.id);
    this.setState({
      filterProjectsByLastUpdated: event.target.id
    });
    // this.context.updateCurrentValues({ filterProjectsByLastUpdated: event.target.id });
  }

  handleClick(event) {
    // eslint-disable-next-line no-console
    console.info('handleClick: An event was triggered: ', event.target);
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
        <ButtonDropdown className="ml-2" isOpen={this.state.dropdownOpen[0]} toggle={() => {this.toggle(0)}}>
          <DropdownToggle caret>
            Type
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter projects by type</DropdownItem>
            <DropdownItemStatic>
              <CustomInput type="checkbox" id="filterProjectsByTypeFeatureFilm" label="Feature Film"
                checked={this.state.filterProjectsByTypeFeatureFilm} onChange={this.handleInputChange} onClick={this.handleClick} />
              <CustomInput type="checkbox" id="filterProjectsByTypeFeatureFilmLb" label="Feature Film (LB)"
                checked={this.state.filterProjectsByTypeFeatureFilmLb} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeFeatureFilmMlb" label="Feature Film (MLB)"
                checked={this.state.filterProjectsByTypeFeatureFilmMlb} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeFeatureFilmUlb" label="Feature Film (ULB)"
                checked={this.state.filterProjectsByTypeFeatureFilmUlb} onChange={this.handleInputChange} />
            </DropdownItemStatic>
            <DropdownItemStatic>
              <CustomInput type="checkbox" id="filterProjectsByTypePilotOneHour" label="Pilot One Hour"
                checked={this.state.filterProjectsByTypePilotOneHour} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypePilot12Hour" label="Pilot 1/2 Hour"
                checked={this.state.filterProjectsByTypePilot12Hour} onChange={this.handleInputChange} />
            </DropdownItemStatic>
            <DropdownItemStatic>
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
            </DropdownItemStatic>
            <DropdownItemStatic>
              <CustomInput type="checkbox" id="filterProjectsByTypeNewMediaSvod" label="New Media (SVOD)"
                checked={this.state.filterProjectsByTypeNewMediaSvod} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeNewMediaAvod" label="New Media (AVOD)"
                checked={this.state.filterProjectsByTypeNewMediaAvod} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByTypeNewMedia50K" label="New Media (<$50k)"
                checked={this.state.filterProjectsByTypeNewMedia50K} onChange={this.handleInputChange} />
            </DropdownItemStatic>
            <DropdownItem toggle={false}><a href="#" size="sm" color="primary">Show All</a></DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown className="ml-2" isOpen={this.state.dropdownOpen[1]} toggle={() => {this.toggle(1)}}>
          <DropdownToggle caret>
            Last updated
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter projects by last updated</DropdownItem>
            <DropdownItemStatic>
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneDay" label="One Day"
                checked={this.state.filterProjectsByLastUpdated === 'filterProjectsByLastUpdatedOneDay'} onChange={this.handleOptionChange} />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneWeek" label="One Week"
                checked={this.state.filterProjectsByLastUpdated === 'filterProjectsByLastUpdatedOneWeek'} onChange={this.handleOptionChange} />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedTwoWeeks" label="Two Weeks"
                checked={this.state.filterProjectsByLastUpdated === 'filterProjectsByLastUpdatedTwoWeeks'} onChange={this.handleOptionChange} />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneMonth" label="One Month"
                checked={this.state.filterProjectsByLastUpdated === 'filterProjectsByLastUpdatedOneMonth'} onChange={this.handleOptionChange} />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedTwoMonths" label="Two Months"
                checked={this.state.filterProjectsByLastUpdated === 'filterProjectsByLastUpdatedTwoMonths'} onChange={this.handleOptionChange} />
              <CustomInput type="radio" name="lastupdated" id="filterProjectsByLastUpdatedOneYear" label="One Year"
                checked={this.state.filterProjectsByLastUpdated === 'filterProjectsByLastUpdatedOneYear'} onChange={this.handleOptionChange} />
            </DropdownItemStatic>
            <DropdownItem toggle={false}><a onClick={this.handleOptionChange}>Do Not Filter by Last Updated</a></DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown className="ml-2" isOpen={this.state.dropdownOpen[2]} toggle={() => {this.toggle(2)}}>
          <DropdownToggle caret>
            Status
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Filter projects by status</DropdownItem>
            <DropdownItemStatic>
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
            </DropdownItemStatic>
            <DropdownItem header>Inactive</DropdownItem>
            <DropdownItemStatic>
              <CustomInput type="checkbox" id="filterProjectsByStatusWrapped" label="Wrapped"
                checked={this.state.filterProjectsByStatusWrapped} onChange={this.handleInputChange} />
              <CustomInput type="checkbox" id="filterProjectsByStatusCanceled" label="Canceled"
                checked={this.state.filterProjectsByStatusCanceled} onChange={this.handleInputChange} />
            </DropdownItemStatic>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }
}

ProjectFilters.contextTypes = {
  updateCurrentValues: PropTypes.func,
};

const withEditOptions = {
  collection: Users,
  fragmentName: 'UsersCurrent'
}

registerComponent('ProjectFilters', ProjectFilters, withCurrentUser, [withEdit, withEditOptions]);
