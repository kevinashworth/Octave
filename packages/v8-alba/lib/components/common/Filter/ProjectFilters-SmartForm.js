import { Components, getFragment, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { PureComponent } from 'react'
import projectFiltersArray from '../../../modules/filters/custom_fields.js'

const ProjectFilters = ({ currentUser }) => {
  return (
    <div className='animated fadeIn'>
      <Components.SmartForm
        collection={Users}
        fields={projectFiltersArray}
        documentId={currentUser._id}
        mutationFragment={getFragment('UserProjectFilterList')}
        queryFragmentName={'UserProjectFilterList'}
      />
    </div>
  )
}

registerComponent('ProjectFilters', ProjectFilters, withCurrentUser)
