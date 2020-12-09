import { Components } from 'meteor/vulcan:core'
import React from 'react'
import PropTypes from 'prop-types'
import { Line } from 'react-chartjs-2'
import Card from 'react-bootstrap/Card'
import takeRightWhile from 'lodash/takeRightWhile'
import moment from 'moment'
import { brandColors } from './brandColors.js'

const LineChartSmall = (props) => {
  const { bgColor, loading, singleStats, subtitle, title } = props
  if (loading) {
    return (<div><Components.Loading /></div>)
  }

  const displayStats = takeRightWhile(singleStats, function (stat) {
    return moment(stat.date).isSameOrAfter(moment().subtract(1, 'years'))
  })

  const cardChartData = {
    labels: displayStats.map(stat => moment(stat.date).format('D MMM YY')),
    datasets: [
      {
        label: title,
        backgroundColor: brandColors[bgColor],
        borderColor: 'rgba(255,255,255,.55)',
        data: displayStats.map(stat => stat.quantity)
      }
    ]
  }

  const yMin = Math.min.apply(Math, cardChartData.datasets[0].data)
  const yMax = Math.max.apply(Math, cardChartData.datasets[0].data)

  const cardChartOpts = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent'
        }
      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: Math.max(0, yMin - (yMax - yMin)),
          max: yMax + 4
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3
      }
    }
  }

  return (
    <Card className={`text-white bg-${bgColor}`}>
      <Card.Body className='pb-0 pt-1'>
        <h5 className='mb-0 text-truncate'>{title}</h5>
        <p>{subtitle}</p>
      </Card.Body>
      <div className='chart-wrapper px-3'>
        <Line data={cardChartData} options={cardChartOpts} height={150} />
      </div>
    </Card>
  )
}

LineChartSmall.propTypes = {
  bgColor: PropTypes.string,
  loading: PropTypes.bool,
  singleStats: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired
  })),
  subtitle: PropTypes.string,
  title: PropTypes.string
}

export default LineChartSmall
