import { Components, Fragments, registerComponent } from 'meteor/vulcan:lib'
import React from 'react'

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
