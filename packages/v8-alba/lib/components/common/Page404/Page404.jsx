import { replaceComponent } from 'meteor/vulcan:core'
import React from 'react'
// import { Container, Row, Col, Button, Input, InputGroup } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'

const Page404 = () => {
  return (
    <div className='animated fadeIn'>
      <Container>
        <Row className='justify-content-center'>
          <Col md='6'>
            <div className='clearfix'>
              <h1 className='float-left display-3 mr-4'>404</h1>
              <h4 className='pt-3'>Oops! You&apos;re lost.</h4>
              <p className='text-muted float-left'>The page you are looking for was not found.</p>
            </div>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <i className='fa fa-search' />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl size='16' type='text' placeholder='What are you looking for?' />
              <InputGroup.Append>
                <Button variant='info'>Search</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

replaceComponent('Error404', Page404)
