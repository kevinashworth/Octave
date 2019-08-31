import { Components, registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { Line } from 'react-chartjs-2'
import { Card, CardBody } from 'reactstrap'
import moment from 'moment'
import { brandColors } from './brandColors.js'

class LineChartSmall extends PureComponent {
  render () {
    const { bgColor, theSmallStats, subtitle, title } = this.props
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    const cardChartData = {
      labels: theSmallStats.map(stat => moment(stat.date).format('D MMM YY')),
      datasets: [
        {
          label: title,
          backgroundColor: brandColors[bgColor],
          borderColor: 'rgba(255,255,255,.55)',
          data: theSmallStats.map(stat => stat.quantity)
        }
      ]
    }

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
            min: Math.min.apply(Math, cardChartData.datasets[0].data) - 5,
            max: Math.max.apply(Math, cardChartData.datasets[0].data) + 5
          }
        }]
      },
      elements: {
        line: {
          borderWidth: 1
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 4
        }
      }
    }

    return (
      <Card className={`text-white bg-${bgColor}`}>
        <CardBody className='pb-0'>
          <h4 className='mb-0'>{title}</h4>
          <p>{subtitle}</p>
        </CardBody>
        <div className='chart-wrapper px-3' style={{ height: '70px' }}>
          <Line data={cardChartData} options={cardChartOpts} height={70} />
        </div>
      </Card>
    )
  }
}

registerComponent('LineChartSmall', LineChartSmall)
