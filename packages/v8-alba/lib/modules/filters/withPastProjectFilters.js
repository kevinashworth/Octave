/*
UI state for Project filters
*/

import { getActions, addAction, addReducer } from 'meteor/vulcan:redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PROJECT_TYPES_ENUM, PAST_PROJECT_STATUSES_ENUM } from '../constants.js'

const projectTypeListBuilder = PROJECT_TYPES_ENUM.map((option) => {
  return { projectType: option.label, value: true }
})

const pastProjectStatusListBuilder = PAST_PROJECT_STATUSES_ENUM.map((option) => {
  return { pastProjectStatus: option.label, value: true }
})

const initialState = {
  projectTypeFilters: projectTypeListBuilder,
  pastProjectStatusFilters: pastProjectStatusListBuilder,
  projectUpdatedFilters: [
    { projectUpdated: 'One Day', value: false, moment1: '1', moment2: 'day' },
    { projectUpdated: 'One Week', value: false, moment1: '1', moment2: 'week' },
    { projectUpdated: 'Two Weeks', value: false, moment1: '2', moment2: 'week' },
    { projectUpdated: 'One Month', value: false, moment1: '1', moment2: 'month' },
    { projectUpdated: 'Two Months', value: false, moment1: '2', moment2: 'month' },
    { projectUpdated: 'One Year', value: false, moment1: '1', moment2: 'year' },
    { projectUpdated: 'All', value: true, moment1: '100', moment2: 'year' }
  ]
}

addAction({
  projectTypeFilters: {
    toggleProjectTypeFilter (i) {
      return {
        type: 'TOGGLE_PROJECT_TYPE_FILTER',
        i
      }
    }
  },
  pastProjectStatusFilters: {
    togglepastProjectStatusFilter (i) {
      return {
        type: 'TOGGLE_PROJECT_STATUS_FILTER',
        i
      }
    },
    setpastProjectStatusFilter (i) {
      return {
        type: 'SET_PROJECT_STATUS_FILTER',
        i
      }
    },
    clearpastProjectStatusFilter (i) {
      return {
        type: 'CLEAR_PROJECT_STATUS_FILTER',
        i
      }
    }
  },
  projectUpdatedFilters: {
    toggleProjectUpdatedFilter (i) {
      return {
        type: 'TOGGLE_PROJECT_UPDATED_FILTER',
        i
      }
    }
  }
})

addReducer({
  projectTypeFilters: (state = initialState.projectTypeFilters, action) => {
    switch (action.type) {
      case 'TOGGLE_PROJECT_TYPE_FILTER':
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
  pastProjectStatusFilters: (state = initialState.pastProjectStatusFilters, action) => {
    switch (action.type) {
      case 'TOGGLE_PROJECT_STATUS_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: !filter.value }
          }
          return filter
        })
      case 'SET_PROJECT_STATUS_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: true }
          }
          return filter
        })
      case 'CLEAR_PROJECT_STATUS_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: false }
          }
          return filter
        })
      default:
        return state
    }
  },
  projectUpdatedFilters: (state = initialState.projectUpdatedFilters, action) => {
    switch (action.type) {
      case 'TOGGLE_PROJECT_UPDATED_FILTER':
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

const mapStateToProps = state => ({
  projectTypeFilters: state.projectTypeFilters,
  pastProjectStatusFilters: state.pastProjectStatusFilters,
  projectUpdatedFilters: state.projectUpdatedFilters
})
const actions = getActions()
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Object.assign({}, actions.projectTypeFilters, actions.pastProjectStatusFilters, actions.projectUpdatedFilters), dispatch)
  }
}

const withPastProjectFilters = component => connect(mapStateToProps, mapDispatchToProps)(component)

export default withPastProjectFilters
