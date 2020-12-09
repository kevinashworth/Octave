import { addAction, addReducer, setupRedux } from 'meteor/vulcan:redux'

import {
  CASTING_TITLES_ENUM,
  ACTIVE_PROJECT_STATUSES_ENUM,
  PAST_PROJECT_STATUSES_ENUM,
  PROJECT_TYPES_ENUM
} from '../modules/constants.js'

const contactTitleListBuilder = CASTING_TITLES_ENUM.map((option) => {
  return { contactTitle: option.label, value: true }
})
contactTitleListBuilder.push(
  { contactTitle: 'Other', value: true }
)

let initialState = {
  contactTitleFilters: contactTitleListBuilder,
  contactLocationFilters: [
    { contactLocation: 'Calif.', value: true },
    { contactLocation: 'NY', value: true },
    { contactLocation: 'Canada', value: true },
    { contactLocation: 'Europe', value: true },
    { contactLocation: 'Other', value: true },
    { contactLocation: 'Unknown', value: true }
  ],
  contactUpdatedFilters: [
    { updated: 'One Day', value: false, momentNumber: 1, momentPeriod: 'day' },
    { updated: 'Two Days', value: false, momentNumber: 2, momentPeriod: 'day' },
    { updated: 'One Week', value: false, momentNumber: 1, momentPeriod: 'week' },
    { updated: 'Two Weeks', value: false, momentNumber: 2, momentPeriod: 'week' },
    { updated: 'One Month', value: false, momentNumber: 1, momentPeriod: 'month' },
    { updated: 'Two Months', value: false, momentNumber: 2, momentPeriod: 'month' },
    { updated: 'One Quarter', value: false, momentNumber: 3, momentPeriod: 'month' },
    { updated: 'Two Quarters', value: false, momentNumber: 6, momentPeriod: 'month' },
    { updated: 'One Year', value: false, momentNumber: 1, momentPeriod: 'year' },
    { updated: 'Two Years', value: false, momentNumber: 2, momentPeriod: 'year' },
    { updated: 'All', value: true, momentNumber: 100, momentPeriod: 'year' }
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
    { updated: 'Two Days', value: false, momentNumber: 2, momentPeriod: 'day' },
    { updated: 'Two Weeks', value: false, momentNumber: 2, momentPeriod: 'week' },
    { updated: 'Two Months', value: false, momentNumber: 2, momentPeriod: 'month' },
    { updated: 'Two Quarters', value: false, momentNumber: 6, momentPeriod: 'month' },
    { updated: 'One Year', value: false, momentNumber: 1, momentPeriod: 'year' },
    { updated: 'Two Years', value: false, momentNumber: 2, momentPeriod: 'year' },
    { updated: 'All', value: true, momentNumber: 100, momentPeriod: 'year' }
  ],
  ...initialState
}

// const projectTypeListBuilder = PROJECT_TYPES_ENUM.map((option) => {
//   return { projectType: option.label, value: true }
// })

const projectStatusListBuilder = ACTIVE_PROJECT_STATUSES_ENUM.map((option) => {
  return { projectStatus: option.label, value: true }
})

initialState = {
  projectTypeFilters: projectTypeListBuilder,
  projectStatusFilters: projectStatusListBuilder,
  projectUpdatedFilters: [
    { updated: 'One Day', value: false, momentNumber: 1, momentPeriod: 'day' },
    { updated: 'Two Days', value: false, momentNumber: 2, momentPeriod: 'day' },
    { updated: 'One Week', value: false, momentNumber: 1, momentPeriod: 'week' },
    { updated: 'Two Weeks', value: false, momentNumber: 2, momentPeriod: 'week' },
    { updated: 'One Month', value: false, momentNumber: 1, momentPeriod: 'month' },
    { updated: 'Two Months', value: false, momentNumber: 2, momentPeriod: 'month' },
    { updated: 'One Quarter', value: false, momentNumber: 3, momentPeriod: 'month' },
    { updated: 'Two Quarters', value: false, momentNumber: 6, momentPeriod: 'month' },
    { updated: 'One Year', value: false, momentNumber: 1, momentPeriod: 'year' },
    { updated: 'Two Years', value: false, momentNumber: 2, momentPeriod: 'year' },
    { updated: 'All', value: true, momentNumber: 100, momentPeriod: 'year' }
  ],
  projectPlatformFilters: [
    { projectPlatform: 'Broadcast', value: true },
    { projectPlatform: 'Cable', value: true },
    { projectPlatform: 'Pay TV', value: true },
    { projectPlatform: 'SVOD', value: true },
    { projectPlatform: 'AVOD', value: true },
    { projectPlatform: 'Theatrical', value: true },
    { projectPlatform: 'Network Code', value: true },
    { projectPlatform: 'Other', value: true }
  ],
  ...initialState
}

initialState = {
  mongoProvider: 'Mongo provider not set yet',
  ...initialState
}

addAction({
  toggleContactTitleFilter (i) {
    return {
      type: 'TOGGLE_CONTACT_TITLE_FILTER',
      i
    }
  },
  toggleContactLocationFilter (i) {
    return {
      type: 'TOGGLE_CONTACT_LOCATION_FILTER',
      i
    }
  },
  toggleContactUpdatedFilter (i) {
    return {
      type: 'TOGGLE_CONTACT_UPDATED_FILTER',
      i
    }
  }
})

addAction({
  togglePastProjectTypeFilter (i) {
    return {
      type: 'TOGGLE_PAST_PROJECT_TYPE_FILTER',
      i
    }
  },
  setPastProjectTypeFilter (i) {
    return {
      type: 'SET_PAST_PROJECT_TYPE_FILTER',
      i
    }
  },
  clearPastProjectTypeFilter (i) {
    return {
      type: 'CLEAR_PAST_PROJECT_TYPE_FILTER',
      i
    }
  },
  togglePastProjectStatusFilter (i) {
    return {
      type: 'TOGGLE_PAST_PROJECT_STATUS_FILTER',
      i
    }
  },
  setPastProjectStatusFilter (i) {
    return {
      type: 'SET_PAST_PROJECT_STATUS_FILTER',
      i
    }
  },
  clearPastProjectStatusFilter (i) {
    return {
      type: 'CLEAR_PAST_PROJECT_STATUS_FILTER',
      i
    }
  },
  togglePastProjectUpdatedFilter (i) {
    return {
      type: 'TOGGLE_PAST_PROJECT_UPDATED_FILTER',
      i
    }
  }
})

addAction({
  toggleProjectTypeFilter (i) {
    return {
      type: 'TOGGLE_PROJECT_TYPE_FILTER',
      i
    }
  },
  setProjectTypeFilter (i) {
    return {
      type: 'SET_PROJECT_TYPE_FILTER',
      i
    }
  },
  clearProjectTypeFilter (i) {
    return {
      type: 'CLEAR_PROJECT_TYPE_FILTER',
      i
    }
  },
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
  },
  toggleProjectUpdatedFilter (i) {
    return {
      type: 'TOGGLE_PROJECT_UPDATED_FILTER',
      i
    }
  },
  toggleProjectPlatformFilter (i) {
    return {
      type: 'TOGGLE_PROJECT_PLATFORM_FILTER',
      i
    }
  },
  setProjectPlatformFilter (i) {
    return {
      type: 'SET_PROJECT_PLATFORM_FILTER',
      i
    }
  },
  clearProjectPlatformFilter (i) {
    return {
      type: 'CLEAR_PROJECT_PLATFORM_FILTER',
      i
    }
  }
})

addAction({
  setMongoProvider (provider) {
    return {
      type: 'SET_MONGO_PROVIDER',
      provider
    }
  }
})

/* eslint-disable default-param-last */
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
      case 'TOGGLE_PAST_PROJECT_TYPE_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: !filter.value }
          }
          return filter
        })
      case 'SET_PAST_PROJECT_TYPE_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: true }
          }
          return filter
        })
      case 'CLEAR_PAST_PROJECT_TYPE_FILTER':
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
  pastProjectStatusFilters: (state = initialState.pastProjectStatusFilters, action) => {
    switch (action.type) {
      case 'TOGGLE_PAST_PROJECT_STATUS_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: !filter.value }
          }
          return filter
        })
      case 'SET_PAST_PROJECT_STATUS_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: true }
          }
          return filter
        })
      case 'CLEAR_PAST_PROJECT_STATUS_FILTER':
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
      case 'TOGGLE_PAST_PROJECT_UPDATED_FILTER':
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
      case 'SET_PROJECT_TYPE_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: true }
          }
          return filter
        })
      case 'CLEAR_PROJECT_TYPE_FILTER':
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
  },
  projectPlatformFilters: (state = initialState.projectPlatformFilters, action) => {
    switch (action.type) {
      case 'TOGGLE_PROJECT_PLATFORM_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: !filter.value }
          }
          return filter
        })
      case 'SET_PROJECT_PLATFORM_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: true }
          }
          return filter
        })
      case 'CLEAR_PROJECT_PLATFORM_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: false }
          }
          return filter
        })
      default:
        return state
    }
  }
})

addReducer({
  mongoProvider: (state = initialState.mongoProvider, action) => {
    switch (action.type) {
      case 'SET_MONGO_PROVIDER':
        return action.provider
      default:
        return state
    }
  }
})
/* eslint-enable default-param-last */

setupRedux(initialState)
