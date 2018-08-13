/*

UI state for Project (and Contact) filters

*/

import { getActions, addAction, addReducer } from 'meteor/vulcan:lib';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const initialState = {
  projectTypeFilters: [
    {projectType: "Feature Film", value: true},
    {projectType: "Feature Film (LB)", value: true},
    {projectType: "Low Budget Film", value: true},
    {projectType: "Feature Film (MLB)", value: true},
    {projectType: "Mod. Low Budget Film", value: true},
    {projectType: "Feature Film (ULB)", value: true},
    {projectType: "Pilot - One Hour", value: true},
    {projectType: "Pilot - 1/2 Hour", value: true},
    {projectType: "One Hour", value: true},
    {projectType: "1/2 Hour", value: true},
    {projectType: "TV One Hour", value: true},
    {projectType: "TV 1/2 Hour", value: true},
    {projectType: "TV Daytime", value: true},
    {projectType: "TV Mini-Series", value: true},
    {projectType: "TV Movie", value: true},
    {projectType: "Movie for Television", value: true},
    {projectType: "New Media (SVOD)", value: true},
    {projectType: "New Media (AVOD)", value: true},
    {projectType: "New Media (<$50k)", value: true},
    {projectType: "New Media", value: true}
  ],
  projectStatusFilters: [
    {projectStatus: "Casting", value: true},
    {projectStatus: "On Hold", value: true},
    {projectStatus: "Shooting", value: true},
    {projectStatus: "On Hiatus", value: true},
    {projectStatus: "See Notes", value: true},
    {projectStatus: "Unknown", value: true},
    {projectStatus: "Wrapped", value: true},
    {projectStatus: "Canceled", value: true}
  ],
  projectUpdatedFilter: "One Month"
}

addAction({
  projectTypeFilters: {
    toggleProjectTypeFilter(i) {
      return {
        type: 'TOGGLE_PROJECT_TYPE_FILTER',
        i
      }
    }
  },
  projectStatusFilters: {
    toggleProjectStatusFilter(i) {
      return {
        type: 'TOGGLE_PROJECT_STATUS_FILTER',
        i
      }
    }
  },
  messages: {
    flash(content) {
      return {
        type: 'FLASH',
        content,
      };
    },
    clear(i) {
      return {
        type: 'CLEAR',
        i,
      };
    },
    markAsSeen(i) {
      return {
        type: 'MARK_AS_SEEN',
        i,
      };
    },
    clearSeen() {
      return {
        type: 'CLEAR_SEEN'
      };
    },
  },
  ui: {
    toggleSidebar() {
      return {
        type: 'TOGGLESIDEBAR',
      };
    },
  }
});

addReducer({
  projectTypeFilters: (state = initialState.projectTypeFilters, action) => {
    switch(action.type) {
      case 'TOGGLE_PROJECT_TYPE_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: !filter.value }
          }
          return filter
        });
      default:
        return state;
    }
  },
  projectStatusFilters: (state = initialState.projectStatusFilters, action) => {
    switch(action.type) {
      case 'TOGGLE_PROJECT_STATUS_FILTER':
        return state.map((filter, index) => {
          if (index === Number(action.i)) {
            return { ...filter, value: !filter.value }
          }
          return filter
        });
      default:
        return state;
    }
  },
  messages: (state = [], action) => {
    // default values
    const flashType = action.content && typeof action.content.type !== 'undefined' ? action.content.type : 'error';
    const currentMsg = typeof action.i === 'undefined' ? {} : state[action.i];

    switch(action.type) {
      case 'FLASH':
        return [
          ...state,
          {
            _id: state.length,
            ...action.content,
            type: flashType,
            seen: false,
            show: true,
          },
        ];
      case 'MARK_AS_SEEN':
        return [
          ...state.slice(0, action.i),
          { ...currentMsg, seen: true },
          ...state.slice(action.i + 1),
        ];
      case 'CLEAR':
        return [
          ...state.slice(0, action.i),
          { ...currentMsg, show: false },
          ...state.slice(action.i + 1),
        ];
      case 'CLEAR_SEEN':
        return state.map(message => message.seen ? { ...message, show: false } : message);
      default:
        return state;
    }
  },
  ui: (state = {showSidebar: false}, action) => {
    switch(action.type) {
      case 'TOGGLESIDEBAR':
        return {
          ...state,
          showSidebar: !state.showSidebar
        };
      default:
        return state;
    }
  }
});

const mapStateToProps = state => ({
  projectTypeFilters: state.projectTypeFilters,
  projectStatusFilters: state.projectStatusFilters,
});
const actions = getActions();
const mapDispatchToProps = dispatch => {
  return {
     actions: bindActionCreators(Object.assign({}, actions.projectTypeFilters, actions.projectStatusFilters), dispatch)
  };
}

const withFilters = component => connect(mapStateToProps, mapDispatchToProps)(component);

export default withFilters;
