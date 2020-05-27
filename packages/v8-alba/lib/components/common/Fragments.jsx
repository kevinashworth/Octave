import { Components, Fragments, getFragmentText, registerComponent } from 'meteor/vulcan:lib'
import React, { useState } from 'react'
// import { Button } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import _ from 'lodash'
import MyCode from './MyCode'

function fragmentOutput(props) {
  const { fragmentText } = props.document
  return (
    <MyCode code={fragmentText.replace(/\n$/, '')} language='graphql' />
  )
}

const FragmentsDashboard = () => {
  const [formatted, setFormatted] = useState(true)

  const fragmentsTrimmed = Object.values(Fragments).map(f => {
    return {
      fragmentText: getFragmentText(f.fragmentObject.definitions[0].name.value).trim()
    }
  })
  const fragmentsData = _.sortBy(fragmentsTrimmed, 'fragmentText')

  const columns = [{
    name: 'fragmentText',
    label: 'Fragments',
    sortable: true,
    filterable: true,
    component: formatted ? fragmentOutput : null
  }]

  return (
    <div className='fragments'>
      <Button onClick={() => setFormatted(!formatted)}>{formatted ? 'Plain' : 'Formatted'}</Button>
      <Components.HeadTags title={'V8: Fragments'} />
      <Components.Datatable
        showNew={false}
        showEdit={false}
        data={fragmentsData}
        columns={columns}
      />
      <Button onClick={() => setFormatted(!formatted)}>{formatted ? 'Plain' : 'Formatted'}</Button>
    </div>
  )
}

registerComponent('Fragments', FragmentsDashboard)
