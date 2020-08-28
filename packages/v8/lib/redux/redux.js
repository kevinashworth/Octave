import { addAction, addReducer, setupRedux } from 'meteor/vulcan:redux'

import {
  CASTING_TITLES_ENUM,
  ACTIVE_PROJECT_STATUSES_ENUM,
  PAST_PROJECT_STATUSES_ENUM,
  PROJECT_TYPES_ENUM
} from '../modules/constants.js'

var contactTitleListBuilder = CASTING_TITLES_ENUM.map((option) => {
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
    { contactUpdated: 'One Day', value: false, momentNumber: 1, momentPeriod: 'day' },
    { contactUpdated: 'Two Days', value: false, momentNumber: 2, momentPeriod: 'day' },
    { contactUpdated: 'One Week', value: false, momentNumber: 1, momentPeriod: 'week' },
    { contactUpdated: 'Two Weeks', value: false, momentNumber: 2, momentPeriod: 'week' },
    { contactUpdated: 'One Month', value: false, momentNumber: 1, momentPeriod: 'month' },
    { contactUpdated: 'Two Months', value: false, momentNumber: 2, momentPeriod: 'month' },
    { contactUpdated: 'One Quarter', value: false, momentNumber: 3, momentPeriod: 'month' },
    { contactUpdated: 'Two Quarters', value: false, momentNumber: 6, momentPeriod: 'month' },
    { contactUpdated: 'One Year', value: false, momentNumber: 1, momentPeriod: 'year' },
    { contactUpdated: 'Two Years', value: false, momentNumber: 2, momentPeriod: 'year' },
    { contactUpdated: 'All', value: true, momentNumber: 100, momentPeriod: 'year' }
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
    { projectUpdated: 'Two Days', value: false, momentNumber: 2, momentPeriod: 'day' },
    { projectUpdated: 'Two Weeks', value: false, momentNumber: 2, momentPeriod: 'week' },
    { projectUpdated: 'Two Months', value: false, momentNumber: 2, momentPeriod: 'month' },
    { projectUpdated: 'Two Quarters', value: false, momentNumber: 6, momentPeriod: 'month' },
    { projectUpdated: 'One Year', value: false, momentNumber: 1, momentPeriod: 'year' },
    { projectUpdated: 'Two Years', value: false, momentNumber: 2, momentPeriod: 'year' },
    { projectUpdated: 'All', value: true, momentNumber: 100, momentPeriod: 'year' }
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
    { projectUpdated: 'One Day', value: false, momentNumber: 1, momentPeriod: 'day' },
    { projectUpdated: 'Two Days', value: false, momentNumber: 2, momentPeriod: 'day' },
    { projectUpdated: 'One Week', value: false, momentNumber: 1, momentPeriod: 'week' },
    { projectUpdated: 'Two Weeks', value: false, momentNumber: 2, momentPeriod: 'week' },
    { projectUpdated: 'One Month', value: false, momentNumber: 1, momentPeriod: 'month' },
    { projectUpdated: 'Two Months', value: false, momentNumber: 2, momentPeriod: 'month' },
    { projectUpdated: 'One Quarter', value: false, momentNumber: 3, momentPeriod: 'month' },
    { projectUpdated: 'Two Quarters', value: false, momentNumber: 6, momentPeriod: 'month' },
    { projectUpdated: 'One Year', value: false, momentNumber: 1, momentPeriod: 'year' },
    { projectUpdated: 'Two Years', value: false, momentNumber: 2, momentPeriod: 'year' },
    { projectUpdated: 'All', value: true, momentNumber: 100, momentPeriod: 'year' }
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

setupRedux(initialState)
