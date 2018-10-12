/*
UI state for Project filters
*/

import { getActions, addAction, addReducer } from 'meteor/vulcan:lib'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PROJECT_TYPES_ENUM, PROJECT_STATUSES_ENUM } from '../constants.js'

const projectTypeListBuilder = PROJECT_TYPES_ENUM.map((option) => {
  return { projectType: option.label, value: true }
})

const projectStatusListBuilder = PROJECT_STATUSES_ENUM.map((option) => {
  return { projectStatus: option.label, value: true }
})

const initialState = {
  projectTypeFilters: projectTypeListBuilder,
  projectStatusFilters: projectStatusListBuilder,
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
  projectStatusFilters: {
    toggleProjectStatusFilter (i) {
      return {
        type: 'TOGGLE_PROJECT_STATUS_FILTER',
        i
      }
    },
    setProjectStatusFilter (i) {
      return {
        type: 'SET_PROJECT_STATUS_FILTER',
        i
      }
    },
    clearProjectStatusFilter (i) {
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
  },
  messages: {
    flash (content) {
      return {
        type: 'FLASH',
        content
      }
    },
    clear (i) {
      return {
        type: 'CLEAR',
        i
      }
    },
    markAsSeen (i) {
      return {
        type: 'MARK_AS_SEEN',
        i
      }
    },
    clearSeen () {
      return {
        type: 'CLEAR_SEEN'
      }
    }
  },
  ui: {
    toggleSidebar () {
      return {
        type: 'TOGGLESIDEBAR'
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
  projectStatusFilters: (state = initialState.projectStatusFilters, action) => {
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
  },
  messages: (state = [], action) => {
    // default values
    const flashType = action.content && typeof action.content.type !== 'undefined' ? action.content.type : 'error'
    const currentMsg = typeof action.i === 'undefined' ? {} : state[action.i]

    switch (action.type) {
      case 'FLASH':
        return [
          ...state,
          {
            _id: state.length,
            ...action.content,
            type: flashType,
            seen: false,
            show: true
          }
        ]
      case 'MARK_AS_SEEN':
        return [
          ...state.slice(0, action.i),
          { ...currentMsg, seen: true },
          ...state.slice(action.i + 1)
        ]
      case 'CLEAR':
        return [
          ...state.slice(0, action.i),
          { ...currentMsg, show: false },
          ...state.slice(action.i + 1)
        ]
      case 'CLEAR_SEEN':
        return state.map(message => message.seen ? { ...message, show: false } : message)
      default:
        return state
    }
  },
  ui: (state = { showSidebar: false }, action) => {
    switch (action.type) {
      case 'TOGGLESIDEBAR':
        return {
          ...state,
          showSidebar: !state.showSidebar
        }
      default:
        return state
    }
  }
})

const mapStateToProps = state => ({
  projectTypeFilters: state.projectTypeFilters,
  projectStatusFilters: state.projectStatusFilters,
  projectUpdatedFilters: state.projectUpdatedFilters
})
const actions = getActions()
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Object.assign({}, actions.projectTypeFilters, actions.projectStatusFilters, actions.projectUpdatedFilters), dispatch)
  }
}

const withProjectFilters = component => connect(mapStateToProps, mapDispatchToProps)(component)

export default withProjectFilters
