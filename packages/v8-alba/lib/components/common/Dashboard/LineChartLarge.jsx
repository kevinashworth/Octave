import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { useMemo, useState } from 'react'
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

const xy = (stat) => {
  return {
    x: moment(stat.date).format('D MMM YY'),
    y: stat.quantity
  }
}

const getRecent = (data, radio) => {
  return radio === 3
    ? data
    : _.takeRightWhile(data, function(stat) {
      const b = moment(stat.x).isSameOrAfter(moment().subtract(1, radio === 2 ? 'years' : 'months'))
      console.log(moment(stat.x), b)
      return b
    })
}

function LineChartLarge (props) {
  const [radio, setRadio] = useState(2)
  const { loading, theStats } = props

  const xyEpisodics = useMemo(
    () => theStats.episodics.map(stat => xy(stat)),
    [theStats]
  )
  const xyFeatures = useMemo(
    () => theStats.features.map(stat => xy(stat)),
    [theStats]
  )
  const xyPilots = useMemo(
    () => theStats.pilots.map(stat => xy(stat)),
    [theStats]
  )
  const xyOthers = useMemo(
    () => theStats.others.map(stat => xy(stat)),
    [theStats]
  )

  const theEpisodics = useMemo(
    () => getRecent(xyEpisodics, radio),
    [xyEpisodics, radio]
  )
  const theFeatures = useMemo(
    () => getRecent(xyFeatures, radio),
    [xyFeatures, radio]
  )
  const thePilots = useMemo(
    () => getRecent(xyPilots, radio),
    [xyPilots, radio]
  )
  const theOthers = useMemo(
    () => getRecent(xyOthers, radio),
    [xyOthers, radio]
  )

  const datasetProps = {
    backgroundColor: 'transparent',
    pointHoverBackgroundColor: '#fff',
    borderWidth: 2
  }
  const mainChart = useMemo(
    () => ({
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
    }),
    [theEpisodics, theFeatures, thePilots, theOthers, datasetProps]
  )

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
  const unitProp = radio === 1 ? { time: { unit: 'day' }} : { time: { unit: 'month' }}
  const mainChartOpts = {
    aspectRatio: 2.5,
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
          <Row>
            <Col sm='5'>
              <CardTitle className='mb-0'>Number of TV &amp; Film Projects Casting</CardTitle>
            </Col>
            <Col sm='7' className='d-none d-sm-inline-block'>
              <ButtonToolbar className='float-right' aria-label='Toolbar with button groups'>
                <ButtonGroup className='mr-3' aria-label='First group'>
                  <Button color='outline-secondary' onClick={() => setRadio(1)} active={radio === 1}>Month</Button>
                  <Button color='outline-secondary' onClick={() => setRadio(2)} active={radio === 2}>Year</Button>
                  <Button color='outline-secondary' onClick={() => setRadio(3)} active={radio === 3}>All</Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
          </Row>
          <div className='chart-wrapper'>
            <Line data={mainChart} height={400} options={mainChartOpts} />
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
