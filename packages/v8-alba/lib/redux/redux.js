import { addAction, addReducer, setupRedux } from 'meteor/vulcan:redux';

import { CASTING_TITLES_ENUM, PAST_PROJECT_STATUSES_ENUM, PROJECT_TYPES_ENUM, PROJECT_STATUSES_ENUM } from '../modules/constants.js'

var contactTitleListBuilder = CASTING_TITLES_ENUM.map((option) => {
  return { contactTitle: option.label, value: true }
})
contactTitleListBuilder.push(
  { contactTitle: 'Other', value: true }
)

let initialState = {
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

const projectTypeListBuilder = PROJECT_TYPES_ENUM.map((option) => {
  return { projectType: option.label, value: true }
})

const pastProjectStatusListBuilder = PAST_PROJECT_STATUSES_ENUM.map((option) => {
  return { pastProjectStatus: option.label, value: true }
})

initialState = {
  pastProjectTypeFilters: projectTypeListBuilder,
  pastProjectStatusFilters: pastProjectStatusListBuilder,
  pastProjectUpdatedFilters: [
    { projectUpdated: 'One Day', value: false, moment1: '1', moment2: 'day' },
    { projectUpdated: 'One Week', value: false, moment1: '1', moment2: 'week' },
    { projectUpdated: 'Two Weeks', value: false, moment1: '2', moment2: 'week' },
    { projectUpdated: 'One Month', value: false, moment1: '1', moment2: 'month' },
    { projectUpdated: 'Two Months', value: false, moment1: '2', moment2: 'month' },
    { projectUpdated: 'One Year', value: false, moment1: '1', moment2: 'year' },
    { projectUpdated: 'All', value: true, moment1: '100', moment2: 'year' }
  ],
  ...initialState
}

// const projectTypeListBuilder = PROJECT_TYPES_ENUM.map((option) => {
//   return { projectType: option.label, value: true }
// })

const projectStatusListBuilder = PROJECT_STATUSES_ENUM.map((option) => {
  return { projectStatus: option.label, value: true }
})

initialState = {
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
  ],
  ...initialState
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

addAction({
  pastProjectTypeFilters: {
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
  pastProjectUpdatedFilters: {
    toggleProjectUpdatedFilter (i) {
      return {
        type: 'TOGGLE_PROJECT_UPDATED_FILTER',
        i
      }
    }
  }
})

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

addReducer({
  pastProjectTypeFilters: (state = initialState.pastProjectTypeFilters, action) => {
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
  pastProjectUpdatedFilters: (state = initialState.pastProjectUpdatedFilters, action) => {
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
  projectUpdatedFilters: (state = initialState.pastProjectUpdatedFilters, action) => {
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

setupRedux(initialState)
