
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getActions, getStore } from 'meteor/vulcan:redux';

const mapStateToProps = state => (getStore().getState());

// const mapStateToProps = () => {
//   const state = getStore().getState()
//   return {
//     pastProjectTypeFilters: state.pastProjectTypeFilters,
//     pastProjectStatusFilters: state.pastProjectStatusFilters,
//     pastProjectUpdatedFilters: state.pastProjectUpdatedFilters
//   }
// }

const actions = getActions()
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Object.assign({}, actions), dispatch)
  }
}

const withFilters = (component) => connect(mapStateToProps, mapDispatchToProps)(component);

export default withFilters;
