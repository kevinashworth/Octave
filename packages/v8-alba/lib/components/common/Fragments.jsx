import { Components, Fragments, registerComponent } from 'meteor/vulcan:lib'
import React from 'react'
import _ from 'lodash'

const FragmentsDashboard = props => {
  const fragmentsTrimmed = Object.values(Fragments).map(f => {
    return {
      fragmentText: f.fragmentText.trim()
    }
  })
  const fragmentsData = _.sortBy(fragmentsTrimmed, 'fragmentText')

  return (
    <div className='fragments'>
      <Components.HeadTags title={'Fragments Dashboard'} />
      <Components.Datatable
        showSearch={false}
        showNew={false}
        showEdit={false}
        data={fragmentsData}
      />
    </div>
  )
}

registerComponent('Fragments', FragmentsDashboard)
