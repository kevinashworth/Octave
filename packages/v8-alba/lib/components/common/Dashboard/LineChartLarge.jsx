import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Progress,
  Row
} from 'reactstrap'
import styled from 'styled-components'
import moment from 'moment'
import _ from 'lodash'
import { brandColors } from './brandColors.js'

// styles copied from Alba 1.8.4 to 2.0.9
const List = styled.ul`
  display: table;
  width: 100%;
  padding: 0;
  margin: 0;
  table-layout: fixed;
`
const Item = styled.li`
  display: table-cell;
  padding: 0 1.25rem;
  text-align: center;
`

class LineChartLarge extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      radioSelected: 3
    }
  }

  render () {
    const { theStats } = this.props
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    var data1 = theStats.episodics.map(stat => {
      return {
        x: moment(stat.date).format('D MMM YY'),
        y: stat.quantity
      }
    })
    var data2 = theStats.features.map(stat => {
      return {
        x: moment(stat.date).format('D MMM YY'),
        y: stat.quantity
      }
    })
    var data3 = theStats.pilots.map(stat => {
      return {
        x: moment(stat.date).format('D MMM YY'),
        y: stat.quantity
      }
    })
    var data4 = theStats.others.map(stat => {
      return {
        x: moment(stat.date).format('D MMM YY'),
        y: stat.quantity
      }
    })

    const allData = theStats.episodics.concat(theStats.features, theStats.pilots, theStats.others)
    const sortedData = _.sortBy(allData, 'date')
    const allDates = sortedData.map(stat => moment(stat.date).format('D MMM YY'))
    const dateLabels = _.uniqBy(allDates) // TODO: Is there a simpler way to get this?

    const mainChart = {
      // labels: dateLabels,
      datasets: [
        {
          label: 'Episodics',
          xAxisID: 'x-axis-episodics',
          backgroundColor: 'transparent',
          borderColor: brandColors['success'],
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: data1
        },
        {
          label: 'Features',
          xAxisID: 'x-axis-features',
          backgroundColor: 'transparent',
          borderColor: brandColors['info'],
          pointHoverBackgroundColor: brandColors['success'],
          borderWidth: 2,
          data: data2
        },
        {
          label: 'Pilots',
          xAxisID: 'x-axis-pilots',
          backgroundColor: 'transparent',
          borderColor: brandColors['warning'],
          pointHoverBackgroundColor: '#000',
          borderWidth: 2,
          data: data3
        },
        {
          label: 'Others',
          xAxisID: 'x-axis-others',
          backgroundColor: 'transparent',
          borderColor: brandColors['danger'],
          pointHoverBackgroundColor: '#000',
          borderWidth: 2,
          data: data4
        }
      ]
    }

    const mainChartOpts = {
      aspectRatio: 2.5,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          position: 'bottom',
          type: 'time',
          id: 'x-axis-episodics'
        },{
          position: 'bottom',
          type: 'time',
          id: 'x-axis-features',
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        },{
          position: 'bottom',
          type: 'time',
          id: 'x-axis-pilots',
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        },{
          position: 'bottom',
          type: 'time',
          id: 'x-axis-others',
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5
          }
        }]
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    }

    return (
      <Card>
        <CardBody>
          <Row>
            <Col sm='5'>
              <CardTitle className='mb-0'>Number of TV &amp; Film Projects Casting</CardTitle>
              <div className='small text-muted'>{`${dateLabels[0]} – ${dateLabels[dateLabels.length - 1]}`}</div>
            </Col>
            <Col sm='7' className='d-none d-sm-inline-block'>
              <Button color='primary' className='float-right'><i className='icon-cloud-download' /></Button>
              <ButtonToolbar className='float-right' aria-label='Toolbar with button groups'>
                <ButtonGroup className='mr-3' aria-label='First group'>
                  <Button color='outline-secondary' onClick={() => this.onRadioBtnClick(1)} active={this.state.radioSelected === 1}>Month</Button>
                  <Button color='outline-secondary' onClick={() => this.onRadioBtnClick(2)} active={this.state.radioSelected === 2}>Year</Button>
                  <Button color='outline-secondary' onClick={() => this.onRadioBtnClick(3)} active={this.state.radioSelected === 3}>All</Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
          </Row>
          <div className='chart-wrapper'>
            <Line data={mainChart} height={null} width={null} redraw={true} options={mainChartOpts} />
          </div>
        </CardBody>
        <CardFooter>
          <List>
            <Item>
              <strong>Episodics</strong>
              <div className='text-muted'>{theStats.episodics[theStats.episodics.length - 1].quantity} Currently Casting</div>
              <Progress className='progress-xs mt-2' color='success' value='100' />
            </Item>
            <Item>
              <strong>Features</strong>
              <div className='text-muted'>{theStats.features[theStats.features.length - 1].quantity} Currently Casting</div>
              <Progress className='progress-xs mt-2' color='info' value='100' />
            </Item>
            <Item>
              <strong>Pilots</strong>
              <div className='text-muted'>{theStats.pilots[theStats.pilots.length - 1].quantity} Currently Casting</div>
              <Progress className='progress-xs mt-2' color='warning' value='100' />
            </Item>
            <Item>
              <strong>Others</strong>
              <div className='text-muted'>{theStats.others[theStats.others.length - 1].quantity} Currently Casting</div>
              <Progress className='progress-xs mt-2' color='danger' value='100' />
            </Item>
          </List>
        </CardFooter>
      </Card>
    )
  }
}

registerComponent('LineChartLarge', LineChartLarge)
