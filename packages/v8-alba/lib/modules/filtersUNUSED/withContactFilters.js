/*
UI state for Contact filters
*/

import { getActions, addAction, addReducer } from 'meteor/vulcan:redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { CASTING_TITLES_ENUM } from '../constants.js'

var contactTitleListBuilder = CASTING_TITLES_ENUM.map((option) => {
  return { contactTitle: option.label, value: true }
})
contactTitleListBuilder.push(
  { contactTitle: 'Other', value: true }
)

const initialState = {
  contactTitleFilters: contactTitleListBuilder,
  contactLocationFilters: [
    { contactLocation: 'CA', value: true },
    { contactLocation: 'NY', value: true },
    { contactLocation: 'Other', value: true }
  ],
  contactUpdatedFilters: [
    { contactUpdated: 'One Day', value: false, moment1: '1', moment2: 'day' },
    { contactUpdated: 'One Week', value: false, moment1: '1', moment2: 'week' },
    { contactUpdated: 'Two Weeks', value: false, moment1: '2', moment2: 'week' },
    { contactUpdated: 'One Month', value: false, moment1: '1', moment2: 'month' },
    { contactUpdated: 'Two Months', value: false, moment1: '2', moment2: 'month' },
    { contactUpdated: 'One Year', value: false, moment1: '1', moment2: 'year' },
    { contactUpdated: 'All', value: true, moment1: '100', moment2: 'year' }
  ]
}

addAction({
  contactTitleFilters: {
    toggleContactTitleFilter (i) {
      return {
        type: 'TOGGLE_CONTACT_TITLE_FILTER',
        i
      }
    }
  },
  contactLocationFilters: {
    toggleContactLocationFilter (i) {
      return {
        type: 'TOGGLE_CONTACT_LOCATION_FILTER',
        i
      }
    }
  },
  contactUpdatedFilters: {
    toggleContactUpdatedFilter (i) {
      return {
        type: 'TOGGLE_CONTACT_UPDATED_FILTER',
        i
      }
    }
  }
})

addReducer({
  contactTitleFilters: (state = initialState.contactTitleFilters, action) => {
    switch (action.type) {
      case 'TOGGLE_CONTACT_TITLE_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: !filter.value }
          }
          return filter
        })
      default:
        return state
    }
  },
  contactLocationFilters: (state = initialState.contactLocationFilters, action) => {
    switch (action.type) {
      case 'TOGGLE_CONTACT_LOCATION_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: !filter.value }
          }
          return filter
        })
      default:
        return state
    }
  },
  contactUpdatedFilters: (state = initialState.contactUpdatedFilters, action) => {
    switch (action.type) {
      case 'TOGGLE_CONTACT_UPDATED_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: true }
          } else {
            return { ...filter, value: false }
          }
        })
      default:
        return state
    }
  }
})

const mapStateToProps = (state = initialState) => ({
  contactTitleFilters: state.contactTitleFilters,
  contactLocationFilters: state.contactLocationFilters,
  contactUpdatedFilters: state.contactUpdatedFilters
})
const actions = getActions()
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Object.assign({}, actions.contactTitleFilters, actions.contactLocationFilters, actions.contactUpdatedFilters), dispatch)
  }
}

const withContactFilters = component => connect(mapStateToProps, mapDispatchToProps)(component)

export default withContactFilters