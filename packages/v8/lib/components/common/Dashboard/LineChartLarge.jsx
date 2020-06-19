import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import moment from 'moment'
import last from 'lodash/last'
import takeRightWhile from 'lodash/takeRightWhile'
import { brandColors } from './brandColors.js'
import useWindowDimensions from './helpers.js'

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  period: 1
}

const PERIODS = [
  {
    moment: { days: 90 },
    label: 'Quarter',
    unit: 'week'
  },
  {
    moment: { years: 1 },
    label: 'Year',
    unit: 'month'
  },
  {
    moment: { years: 2 },
    label: '2 Years',
    unit: 'quarter'
  }
]

const xy = (stat) => {
  return {
    x: stat.date,
    y: stat.quantity
  }
}

// get one more to the left, and add one for now at the right
const getRecent = (data, period) => {
  let oneMore = true
  const returnValue = takeRightWhile(data, function (stat) {
    const shouldTake = moment(stat.x).isSameOrAfter(moment().subtract(PERIODS[period].moment))
    if (oneMore && shouldTake) {
      return true
    } else if (oneMore && !shouldTake) {
      oneMore = false
      return true
    } else {
      return false
    }
  })
  returnValue.push({
    x: moment(),
    y: last(returnValue).y
  })
  return returnValue
}

function LineChartLarge (props) {
  const [period, setPeriod] = useState(keptState.period)
  const { loading, theStats } = props

  const xyEpisodics = theStats.episodics.map(stat => xy(stat))
  const xyFeatures = theStats.features.map(stat => xy(stat))
  const xyPilots = theStats.pilots.map(stat => xy(stat))
  const xyOthers = theStats.others.map(stat => xy(stat))

  const theEpisodics = getRecent(xyEpisodics, period)
  const theFeatures = getRecent(xyFeatures, period)
  const thePilots = getRecent(xyPilots, period)
  const theOthers = getRecent(xyOthers, period)

  const datasetProps = {
    backgroundColor: 'transparent',
    borderWidth: 2,
    lineTension: 0.3,
    pointHoverBackgroundColor: '#fff'
  }
  const mainChart = {
    datasets: [
      {
        label: 'Episodics',
        xAxisID: 'x-axis-episodics',
        borderColor: brandColors.success,
        data: theEpisodics,
        ...datasetProps
      },
      {
        label: 'Features',
        xAxisID: 'x-axis-features',
        borderColor: brandColors.info,
        data: theFeatures,
        ...datasetProps
      },
      {
        label: 'Pilots',
        xAxisID: 'x-axis-pilots',
        borderColor: brandColors.warning,
        data: thePilots,
        ...datasetProps
      },
      {
        label: 'Others',
        xAxisID: 'x-axis-others',
        borderColor: brandColors.danger,
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
      display: false,
      max: moment(),
      min: moment().subtract(PERIODS[period].moment)
    }
  }
  const unitProp = { time: { unit: PERIODS[period].unit } }
  const mainChartOpts = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        id: 'x-axis-episodics',
        position: 'bottom',
        ticks: {
          maxRotation: 70,
          max: moment(),
          min: moment().subtract(PERIODS[period].moment)
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

  // Remember state for the next mount
  useEffect(() => {
    return () => {
      keptState = {
        period
      }
    }
  })

  if (loading) {
    return <Components.Loading />
  }

  return (
    <Card>
      <Card.Body>
        <Row className='align-items-center'>
          <Col xs={12} sm={8}>
            <Card.Title>Number of TV &amp; Film Projects Casting</Card.Title>
          </Col>
          <Col xs={12} sm={4}>
            <ButtonToolbar className='mb-1 float-right'>
              <ButtonGroup>
                <Button variant='outline-secondary' onClick={() => setPeriod(0)} active={period === 0}>{PERIODS[0].label}</Button>
                <Button variant='outline-secondary' onClick={() => setPeriod(1)} active={period === 1}>{PERIODS[1].label}</Button>
                <Button variant='outline-secondary' onClick={() => setPeriod(2)} active={period === 2}>{PERIODS[2].label}</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
        </Row>
        <div className='chart-wrapper' style={{ height: `${chartHeight}px` }}>
          <Line data={mainChart} options={mainChartOpts} />
        </div>
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col xs='12' sm='6' md='3' className='mb-2'>
            <strong>Episodics</strong>
            <div className='text-muted'>{theStats.episodics[theStats.episodics.length - 1].quantity} Currently Casting</div>
            <ProgressBar className='progress-xs mt-1' variant='success' now='100' />
          </Col>
          <Col xs='12' sm='6' md='3' className='mb-2'>
            <strong>Features</strong>
            <div className='text-muted'>{theStats.features[theStats.features.length - 1].quantity} Currently Casting</div>
            <ProgressBar className='progress-xs mt-1' variant='info' now='100' />
          </Col>
          <Col xs='12' sm='6' md='3' className='mb-2'>
            <strong>Pilots</strong>
            <div className='text-muted'>{theStats.pilots[theStats.pilots.length - 1].quantity} Currently Casting</div>
            <ProgressBar className='progress-xs mt-1' variant='warning' now='100' />
          </Col>
          <Col xs='12' sm='6' md='3' className='mb-2'>
            <strong>Others</strong>
            <div className='text-muted'>{theStats.others[theStats.others.length - 1].quantity} Currently Casting</div>
            <ProgressBar className='progress-xs mt-1' variant='danger' now='100' />
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  )
}

registerComponent('LineChartLarge', LineChartLarge)

export default LineChartLarge
