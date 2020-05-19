import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { useEffect, useState } from 'react'
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
import moment from 'moment'
import takeRightWhile from 'lodash/takeRightWhile'
import { brandColors } from './brandColors.js'
import useWindowDimensions from './helpers.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  timeframe: 3
}

const xy = (stat) => {
  return {
    x: stat.date,
    y: stat.quantity
  }
}

const getRecent = (data, timeframe) => {
  return timeframe === 3
    ? data
    : takeRightWhile(data, function (stat) {
      return moment(stat.x).isSameOrAfter(moment().subtract(1, timeframe === 2 ? 'years' : 'months'))
    })
}

// function onResize () {
//   console.log('onResize')
//   console.log('window.screen.availHeight:', window.screen.availHeight)
//   console.log('aspectRatio:', arguments[0].aspectRatio)
//   console.log('h & w:', arguments[1])
//   console.dir(arguments)
// }

function LineChartLarge (props) {
  const [timeframe, setTimeframe] = useState(keptState.timeframe)
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
  const unitProp = timeframe === 1 ? { time: { unit: 'day' } } : { time: { unit: 'month' } }
  const mainChartOpts = {
    // onResize,
    maintainAspectRatio: false,
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
      }, {
        id: 'x-axis-features',
        ...xProps
      }, {
        id: 'x-axis-pilots',
        ...xProps
      }, {
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

  const { height } = useWindowDimensions()
  const chartHeight = Math.max(200, Math.floor(height * 0.4))
  // I think 40% looks good, with a minimum height of 200. But it's subjective!
  // console.log('window height:', height, 'chart height:', chartHeight)

  // Remember state for the next mount
  useEffect(() => {
    return () => {
      keptState = {
        timeframe
      }
    }
  })

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
            <ButtonToolbar className='mb-1 float-right'>
              <ButtonGroup>
                <Button outline color='secondary' onClick={() => setTimeframe(1)} active={timeframe === 1}>Month</Button>
                <Button outline color='secondary' onClick={() => setTimeframe(2)} active={timeframe === 2}>Year</Button>
                <Button outline color='secondary' onClick={() => setTimeframe(3)} active={timeframe === 3}>All</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
        </Row>
        <div className='chart-wrapper' style={{ height: `${chartHeight}px` }}>
          <Line data={mainChart} options={mainChartOpts} />
        </div>
      </CardBody>
      <CardFooter>
        <Row>
          <Col xs='12' sm='6' md='3' className='mb-2'>
            <strong>Episodics</strong>
            <div className='text-muted'>{theStats.episodics[theStats.episodics.length - 1].quantity} Currently Casting</div>
            <Progress className='progress-xs mt-1' color='success' value='100' />
          </Col>
          <Col xs='12' sm='6' md='3' className='mb-2'>
            <strong>Features</strong>
            <div className='text-muted'>{theStats.features[theStats.features.length - 1].quantity} Currently Casting</div>
            <Progress className='progress-xs mt-1' color='info' value='100' />
          </Col>
          <Col xs='12' sm='6' md='3' className='mb-2'>
            <strong>Pilots</strong>
            <div className='text-muted'>{theStats.pilots[theStats.pilots.length - 1].quantity} Currently Casting</div>
            <Progress className='progress-xs mt-1' color='warning' value='100' />
          </Col>
          <Col xs='12' sm='6' md='3' className='mb-2'>
            <strong>Others</strong>
            <div className='text-muted'>{theStats.others[theStats.others.length - 1].quantity} Currently Casting</div>
            <Progress className='progress-xs mt-1' color='danger' value='100' />
          </Col>
        </Row>
      </CardFooter>
    </Card>
  )
}

registerComponent('LineChartLarge', LineChartLarge)
