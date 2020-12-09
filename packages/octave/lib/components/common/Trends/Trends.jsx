import { Components, withAccess, useMulti2 } from 'meteor/vulcan:core'
import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import LineChartLarge from './LineChartLarge.jsx'
import LineChartSmall from './LineChartSmall.jsx'

const Trends = () => {
  const multiOptions = {
    collectionName: 'Statistics',
    limit: 1
  }
  const { loading, results } = useMulti2(multiOptions)

  if (loading) {
    return <Components.Loading />
  }

  const theStats = results[0]
  return (
    <div className='animated fadeIn'>
      <Components.MyHeadTags title='Trends' />
      <Row className='mt-4'>
        <Col xs='12' sm='6' lg='3' className='order-2 order-md-1'>
          <LineChartSmall
            bgColor='success'
            singleStats={theStats.episodics}
            title='Episodics Casting'
            subtitle='Last 12 months'
          />
        </Col>

        <Col xs='12' sm='6' lg='3' className='order-3 order-md-2'>
          <LineChartSmall
            bgColor='info'
            singleStats={theStats.features}
            title='Features Casting'
            subtitle='Last 12 months'
          />
        </Col>

        <Col xs='12' sm='6' lg='3' className='order-4 order-md-3'>
          <LineChartSmall
            bgColor='warning'
            singleStats={theStats.pilots}
            title='Pilots Casting'
            subtitle='Last 12 months'
          />
        </Col>

        <Col xs='12' sm='6' lg='3' className='order-5 order-md-4'>
          <LineChartSmall
            bgColor='danger'
            singleStats={theStats.others}
            title='Others Casting'
            subtitle='Last 12 months'
          />
        </Col>

        <Col xs='12' className='order-1 order-md-5'>
          <LineChartLarge theStats={theStats} />
        </Col>
      </Row>

    </div>
  )
}

const accessOptions = {
  groups: ['members', 'admins'],
  redirect: '/login'
}

Trends.displayName = 'WithAccess(Trends)'

export default withAccess(accessOptions)(Trends)
