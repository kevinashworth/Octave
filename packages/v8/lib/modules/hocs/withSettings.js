import { getStore } from 'meteor/vulcan:redux'
import { connect } from 'react-redux'

const mapStateToProps = () => {
  return {
    mongoProvider: getStore().getState().mongoProvider
  }
}

const withSettings = (component) => connect(mapStateToProps)(component)

export default withSettings
