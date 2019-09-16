
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getActions, getStore } from 'meteor/vulcan:redux'

const mapStateToProps = state => (getStore().getState())

const actions = getActions()
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

const withFilters = (component) => connect(mapStateToProps, mapDispatchToProps)(component)

export default withFilters
