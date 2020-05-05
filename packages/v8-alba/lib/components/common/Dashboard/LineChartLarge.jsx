import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { useState } from 'react'
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
import takeRightWhile from 'lodash/takeRightWhile'
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

const xy = (stat) => {
  return {
    x: stat.date,
    y: stat.quantity
  }
}

const getRecent = (data, timeframe) => {
  return timeframe === 3
    ? data
    : takeRightWhile(data, function(stat) {
      return moment(stat.x).isSameOrAfter(moment().subtract(1, timeframe === 2 ? 'years' : 'months'))
    })
}

function onResize () {
  console.log('onResize')
  console.log('window.screen.availHeight:', window.screen.availHeight)
  console.log('aspectRatio:', arguments[0].aspectRatio)
  console.log('h & w:', arguments[1])
  console.dir(arguments)
}

function LineChartLarge (props) {
  const [timeframe, setTimeframe] = useState(3)
  const { loading, theStats } = props

  const xyEpisodics = theStats.episodics.map(stat => xy(stat))
  const xyFeatures = theStats.features.map(stat => xy(stat))
  const xyPilots = theStats.pilots.map(stat => xy(stat))
  const xyOthers = theStats.others.map(stat => xy(stat))

  const theEpisodics = getRecent(xyEpisodics, timeframe)
  const theFeatures = getRecent(xyFeatures, timeframe)
  const thePilots = getRecent(xyPilots, timeframe)
  const theOthers = getRecent(xyOthers, timeframe)

  const datasetProps = {
    backgroundColor: 'transparent',
    pointHoverBackgroundColor: '#fff',
    borderWidth: 2
  }
  const mainChart = {
    datasets: [
      {
        label: 'Episodics',
        xAxisID: 'x-axis-episodics',
        borderColor: brandColors['success'],
        data: theEpisodics,
        ...datasetProps
      },
      {
        label: 'Features',
        xAxisID: 'x-axis-features',
        borderColor: brandColors['info'],
        data: theFeatures,
        ...datasetProps
      },
      {
        label: 'Pilots',
        xAxisID: 'x-axis-pilots',
        borderColor: brandColors['warning'],
        data: thePilots,
        ...datasetProps
      },
      {
        label: 'Others',
        xAxisID: 'x-axis-others',
        borderColor: brandColors['danger'],
        data: theOthers,
        ...datasetProps
      }
    ]
  }

  const xProps = {
    position: 'bottom',
    type: 'time',
    gridLines: {
      display: false
    },
    ticks: {
      display: false
    }
  }
  const unitProp = timeframe === 1 ? { time: { unit: 'day' }} : { time: { unit: 'month' }}
  const mainChartOpts = {
    onResize,
    aspectRatio: 2.5,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        id: 'x-axis-episodics',
        position: 'bottom',
        ticks: {
          maxRotation: 70
        },
        type: 'time',
        ...unitProp
      },{
        id: 'x-axis-features',
        ...xProps
      },{
        id: 'x-axis-pilots',
        ...xProps
      },{
        id: 'x-axis-others',
        ...xProps
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

  if (loading) {
    return <Components.Loading />
  }
  return (
    <Card>
      <CardBody>
        <Row className='align-items-center'>
          <Col xs='8'>
            <CardTitle>Number of TV &amp; Film Projects Casting</CardTitle>
          </Col>
          <Col xs='4'>
            <ButtonToolbar className='float-right'>
              <ButtonGroup>
                <Button outline color='secondary' onClick={() => setTimeframe(1)} active={timeframe === 1}>Month</Button>
                <Button outline color='secondary' onClick={() => setTimeframe(2)} active={timeframe === 2}>Year</Button>
                <Button outline color='secondary' onClick={() => setTimeframe(3)} active={timeframe === 3}>All</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
        </Row>
        <div className='chart-wrapper'>
          <Line data={mainChart} options={mainChartOpts} />
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

registerComponent('LineChartLarge', LineChartLarge)
