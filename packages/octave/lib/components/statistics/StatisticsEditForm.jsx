import { Components } from 'meteor/vulcan:core'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Statistics from '../../modules/statistics/collection.js'

const StatisticsEditForm = (props) => {
  const { loading, toggle } = props
  const history = useHistory()

  if (loading) {
    return <Components.Loading />
  }

  const handleCallback = () => {
    if (toggle) {
      toggle()
    } else {
      history.push('/statistics/list')
    }
  }

  return (
    <div className='animated fadeIn'>
      <Card>
        <Card.Header>
          <i className='icon-briefcase' />Edit Statistics
        </Card.Header>
        <Card.Body>
          <Components.SmartForm
            collection={Statistics}
            documentId='HSEC7MWC9RFCJLEMP'
            showDelete={false}
            cancelCallback={handleCallback}
            successCallback={handleCallback}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

export default StatisticsEditForm
