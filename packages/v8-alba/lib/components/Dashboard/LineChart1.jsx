import { Components, registerComponent, withDocument } from 'meteor/vulcan:core';
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
import Statistics from '../../modules/statistics/collection.js';

const brandDanger = '#f86c6b';
const brandInfo = '#67c2ef';
const brandSuccess = '#4dbd74';
const brandWarning = '#f8cb00';

class LineChart1 extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    }
  }

  render() {
    if (this.props.loading) {
      return (<div><Components.Loading/></div>);
    }

    const theStats = this.props.document;

    // Main Chart
    var data1 = this.props.document.episodics.map(stat => stat.quantity);
    var data2 = this.props.document.features.map(stat => stat.quantity);
    var data3 = this.props.document.pilots.map(stat => stat.quantity);
    var data4 = this.props.document.others.map(stat => stat.quantity);

    const mainChart = {
      labels: this.props.document.episodics.map(stat => moment(stat.date).format('MMM D')),
      datasets: [
        {
          label: 'Episodics',
          backgroundColor: 'transparent', //convertHex(brandInfo, 10),
          borderColor: brandSuccess,
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: data1
        },
        {
          label: 'Features',
          backgroundColor: 'transparent',
          borderColor: brandInfo,
          pointHoverBackgroundColor: brandSuccess,
          borderWidth: 2,
          data: data2
        },
        {
          label: 'Pilots',
          backgroundColor: 'transparent',
          borderColor: brandWarning,
          pointHoverBackgroundColor: '#000',
          borderWidth: 2,
          data: data3
        },
        {
          label: 'Others',
          backgroundColor: 'transparent',
          borderColor: brandDanger,
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
            <Col sm="5">
              <CardTitle className="mb-0">Number of TV & Film Projects Casting</CardTitle>
              <div className="small text-muted">August 2018</div>
            </Col>
            <Col sm="7" className="d-none d-sm-inline-block">
              <Button color="primary" className="float-right"><i className="icon-cloud-download"></i></Button>
              <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                <ButtonGroup className="mr-3" aria-label="First group">
                  <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(1)} active={this.state.radioSelected === 1}>Day</Button>
                  <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(2)} active={this.state.radioSelected === 2}>Month</Button>
                  <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(3)} active={this.state.radioSelected === 3}>Year</Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
          </Row>
          <div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
            <Line data={mainChart} options={mainChartOpts} height={300}/>
          </div>
        </CardBody>
        <CardFooter>
          <ul>
            <li>
              <strong>Episodics</strong>
              <div className="text-muted">{theStats.episodics[theStats.episodics.length - 1].quantity} Currently Casting</div>
              <Progress className="progress-xs mt-2" color="success" value="100"/>
            </li>
            <li>
              <strong>Features</strong>
              <div className="text-muted">{theStats.features[theStats.features.length - 1].quantity} Currently Casting</div>
              <Progress className="progress-xs mt-2" color="info" value="100"/>
            </li>
            <li>
              <strong>Pilots</strong>
              <div className="text-muted">{theStats.pilots[theStats.pilots.length - 1].quantity} Currently Casting</div>
              <Progress className="progress-xs mt-2" color="warning" value="100"/>
            </li>
            <li>
              <strong>Others</strong>
              <div className="text-muted">{theStats.others[theStats.others.length - 1].quantity} Currently Casting</div>
              <Progress className="progress-xs mt-2" color="danger" value="100"/>
            </li>
          </ul>
        </CardFooter>
      </Card>
    )
  }
}

const options = {
  collection: Statistics,
  fragmentName: 'StatisticsDefaultFragment',
};

registerComponent('LineChart1', LineChart1, [withDocument, options]);
