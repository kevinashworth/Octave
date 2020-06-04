import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'

class Page500 extends Component {
  render () {
    return (
      <div className='app flex-row align-items-center'>
        <Container>
          <Row className='justify-content-center'>
            <Col md='6'>
              <span className='clearfix'>
                <h1 className='float-left display-3 mr-4'>500</h1>
                <h4 className='pt-3'>Houston, we have a problem!</h4>
                <p className='text-muted float-left'>The page you are looking for is temporarily unavailable.</p>
              </span>
              <InputGroup className='input-prepend'>
                <div className='input-group-prepend'>
                  <span className='input-group-text'>
                    <i className='fa fa-search' />
                  </span>
                </div>
                <FormControl size='16' type='text' placeholder='What are you looking for?' />
                <div className='input-group-append'>
                  <Button color='info'>Search</Button>
                </div>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Page500
