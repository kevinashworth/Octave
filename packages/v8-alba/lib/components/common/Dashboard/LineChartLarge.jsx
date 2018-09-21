import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import {Line} from 'react-chartjs-2';
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
} from 'reactstrap';
import moment from 'moment';
import _ from 'lodash';
import { brandColors } from './brandColors.js';

class LineChartLarge extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      radioSelected: 3
    }
  }

  render() {
    const { theStats } = this.props;
    if (this.props.loading) {
      return (<div><Components.Loading/></div>);
    }

    var data1 = theStats.episodics.map(stat => {
      return {
      x: moment(stat.date).format('MMM D'),
      y: stat.quantity
    }});
    var data2 = theStats.features.map(stat => {
      return {
      x: moment(stat.date).format('MMM D'),
      y: stat.quantity
    }});
    var data3 = theStats.pilots.map(stat => {
      return {
      x: moment(stat.date).format('MMM D'),
      y: stat.quantity
    }});
    var data4 = theStats.others.map(stat => {
      return {
      x: moment(stat.date).format('MMM D'),
      y: stat.quantity
    }});

    const allData = theStats.episodics.concat(theStats.features, theStats.pilots, theStats.others);
    const sortedData = _.sortBy(allData, 'date');
    const allDates = sortedData.map(stat => moment(stat.date).format('MMM D'));
    const dateLabels = _.uniqBy(allDates); // TODO: Is there a sipmler way to get this?

    const mainChart = {
      labels: dateLabels,
      datasets: [
        {
          label: 'Episodics',
          backgroundColor: 'transparent',
          borderColor: brandColors['success'],
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: data1
        },
        {
          label: 'Features',
          backgroundColor: 'transparent',
          borderColor: brandColors['info'],
          pointHoverBackgroundColor: brandColors['success'],
          borderWidth: 2,
          data: data2
        },
        {
          label: 'Pilots',
          backgroundColor: 'transparent',
          borderColor: brandColors['warning'],
          pointHoverBackgroundColor: '#000',
          borderWidth: 2,
          data: data3
        },
        {
          label: 'Others',
          backgroundColor: 'transparent',
          borderColor: brandColors['danger'],
          pointHoverBackgroundColor: '#000',
          borderWidth: 2,
          data: data4
        }
      ]
    }

    const mainChartOpts = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            stepSize: Math.ceil(250 / 5),
            max: 250
          }
        }]
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        }
      }
    }

    return (
      <Card>
        <CardBody>
          <Row>
            <Col sm='5'>
              <CardTitle className='mb-0'>Number of TV &amp; Film Projects Casting</CardTitle>
              <div className='small text-muted'>{`${dateLabels[0]} &emdash; ${dateLabels[dateLabels.length - 1]}`}</div>
            </Col>
            <Col sm='7' className='d-none d-sm-inline-block'>
              <Button color='primary' className='float-right'><i className='icon-cloud-download'></i></Button>
              <ButtonToolbar className='float-right' aria-label='Toolbar with button groups'>
                <ButtonGroup className='mr-3' aria-label='First group'>
                  <Button color='outline-secondary' onClick={() => this.onRadioBtnClick(1)} active={this.state.radioSelected === 1}>Day</Button>
                  <Button color='outline-secondary' onClick={() => this.onRadioBtnClick(2)} active={this.state.radioSelected === 2}>Month</Button>
                  <Button color='outline-secondary' onClick={() => this.onRadioBtnClick(3)} active={this.state.radioSelected === 3}>Year</Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
          </Row>
          <div className='chart-wrapper' style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
            <Line data={mainChart} options={mainChartOpts} height={300}/>
          </div>
        </CardBody>
        <CardFooter>
          <ul>
            <li>
              <strong>Episodics</strong>
              <div className='text-muted'>{theStats.episodics[theStats.episodics.length - 1].quantity} Currently Casting</div>
              <Progress className='progress-xs mt-2' color='success' value='100'/>
            </li>
            <li>
              <strong>Features</strong>
              <div className='text-muted'>{theStats.features[theStats.features.length - 1].quantity} Currently Casting</div>
              <Progress className='progress-xs mt-2' color='info' value='100'/>
            </li>
            <li>
              <strong>Pilots</strong>
              <div className='text-muted'>{theStats.pilots[theStats.pilots.length - 1].quantity} Currently Casting</div>
              <Progress className='progress-xs mt-2' color='warning' value='100'/>
            </li>
            <li>
              <strong>Others</strong>
              <div className='text-muted'>{theStats.others[theStats.others.length - 1].quantity} Currently Casting</div>
              <Progress className='progress-xs mt-2' color='danger' value='100'/>
            </li>
          </ul>
        </CardFooter>
      </Card>
    )
  }
}

registerComponent('LineChartLarge', LineChartLarge);
