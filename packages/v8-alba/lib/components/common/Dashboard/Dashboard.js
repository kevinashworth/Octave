import { Components, registerComponent, withAccess, withMulti } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Col, Row } from 'reactstrap'

class Dashboard extends PureComponent {
  render () {
    if (this.props.loading) {
      return <Components.Loading />
    }

    const theStats = this.props.results[0]
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Dashboard' />
        <Row className='mt-4'>
          <Col xs='12' sm='6' lg='3'>
            <Components.LineChartSmall
              bgColor='success'
              theSmallStats={theStats.episodics}
              title={'Episodics Casting'}
              subtitle={'Last 12 months'}
            />
          </Col>

          <Col xs='12' sm='6' lg='3'>
            <Components.LineChartSmall
              bgColor='info'
              theSmallStats={theStats.features}
              title={'Features Casting'}
              subtitle={'Last 12 months'}
            />
          </Col>

          <Col xs='12' sm='6' lg='3'>
            <Components.LineChartSmall
              bgColor='warning'
              theSmallStats={theStats.pilots}
              title={'Pilots Casting'}
              subtitle={'Last 12 months'}
            />
          </Col>

          <Col xs='12' sm='6' lg='3'>
            <Components.LineChartSmall
              bgColor='danger'
              theSmallStats={theStats.others}
              title={'Others Casting'}
              subtitle={'Last 12 months'}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Components.LineChartLarge theStats={theStats} />
          </Col>
        </Row>

      </div>
    )
  }
}

const accessOptions = {
  groups: ['members', 'admins'],
  redirect: '/login'
}

const multiOptions = {
  collectionName: 'Statistics',
  limit: 1
}

registerComponent( {
  name: 'Dashboard',
  component: Dashboard,
  hocs: [
    [withAccess, accessOptions],
    [withMulti, multiOptions]
  ]
})
