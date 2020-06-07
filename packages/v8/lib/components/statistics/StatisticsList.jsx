import { Components, registerComponent, withCurrentUser, withMulti } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Fade from 'react-bootstrap/Fade'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import moment from 'moment'
import Statistics from '../../modules/statistics/collection.js'

const Item = ({ date, quantity}) => {
  return (
    <ListGroup.Item key={date}>
      {moment(date).format('DD MMM YYYY')}: <strong>{quantity}</strong>
    </ListGroup.Item>
  )
}

const StatisticsList = (props) => {
  const [open, setOpen] = useState(Array(4).fill(true))
  const { currentUser, loading, results = [] } = props
  if (loading) {
    return <Components.Loading />
  }
  const theStats = results[0]
  const toggle = (i) => {
    const newArray = open.map((element, index) => {
      return (index === i ? !element : element)
    })
    setOpen(newArray)
  }
  return (
    <div className='animated fadeIn'>
      <Card>
        <Card.Header>
          <i className='icon-briefcase' />Statistics (Collapsible Lists)
          {Users.canUpdate({ collection: Statistics, user: currentUser, document }) &&
            <div className='float-right'>
              <LinkContainer to='/statistics/edit'>
                <Button variant='secondary'>Edit</Button>
              </LinkContainer>
            </div>}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Button onClick={() => toggle(0)} variant='outline-success'>
                Open/Close Episodics
              </Button>
              <Fade appear in={open[0]} mountOnEnter timeout={50} unmountOnExit>
                <ListGroup className='statistics-lists'>
                  {theStats.episodics.map(stat => (<Item key={stat.date} {...stat} />))}
                </ListGroup>
              </Fade>
            </Col>
            <Col>
              <Button onClick={() => toggle(1)} variant='outline-primary'>
                Open/Close Features
              </Button>
              <Fade appear in={open[1]} mountOnEnter timeout={50} unmountOnExit>
                <ListGroup className='statistics-lists'>
                  {theStats.features.map(stat => (<Item key={stat.date} {...stat} />))}
                </ListGroup>
              </Fade>
            </Col>
            <Col>
              <Button onClick={() => toggle(2)} variant='outline-warning'>
                Open/Close Pilots
              </Button>
              <Fade appear in={open[2]} mountOnEnter timeout={50} unmountOnExit>
                <ListGroup className='statistics-lists'>
                  {theStats.pilots.map(stat => (<Item key={stat.date} {...stat} />))}
                </ListGroup>
              </Fade>
            </Col>
            <Col>
              <Button onClick={() => toggle(3)} variant='outline-danger'>
                Open/Close Others
              </Button>
              <Fade appear in={open[3]} mountOnEnter timeout={50} unmountOnExit>
                <ListGroup className='statistics-lists'>
                  {theStats.others.map(stat => (<Item key={stat.date} {...stat} />))}
                </ListGroup>
              </Fade>
            </Col>
          </Row>
          <Row className='mt-4'>
            <Col>
              <Button onClick={() => toggle(0)} variant='outline-success'>
                Open/Close Episodics
              </Button>
            </Col>
            <Col>
              <Button onClick={() => toggle(1)} variant='outline-primary'>
                Open/Close Features
              </Button>
            </Col>
            <Col>
              <Button onClick={() => toggle(2)} variant='outline-warning'>
                Open/Close Pilots
              </Button>
            </Col>
            <Col>
              <Button onClick={() => toggle(3)} variant='outline-danger'>
                Open/Close Others
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}

const options = {
  collection: Statistics
}

registerComponent({
  name: 'StatisticsList',
  component: StatisticsList,
  hocs: [
    withCurrentUser,
    [withMulti, options]
  ]
})
