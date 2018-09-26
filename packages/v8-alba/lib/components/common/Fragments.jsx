import React from 'react'
import {
  registerComponent,
  Components,
  Fragments
} from 'meteor/vulcan:lib'

const FragmentsDashboard = props => (
  <div className='fragments'>
    <Components.Datatable
      showSearch={false}
      showNew={false}
      showEdit={false}
      data={Object.values(Fragments)}
      columns={[
        // "fragmentObject",
        'fragmentText'
      ]}
    />
  </div>
)

registerComponent('Fragments', FragmentsDashboard)
