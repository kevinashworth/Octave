import { Components, registerComponent, withDocument } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import {Line} from 'react-chartjs-2';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  ButtonGroup,
} from 'reactstrap';
import moment from 'moment';
import Statistics from '../../../modules/statistics/collection.js';

const brandInfo = '#67c2ef';

class LineChart2 extends PureComponent {
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

    const cardChartData2 = {
      labels: this.props.document.episodics.map(stat => moment(stat.date).format('MMM D')),
      datasets: [
        {
          label: 'Episodics',
          backgroundColor: brandInfo,
          borderColor: 'rgba(255,255,255,.55)',
          data: this.props.document.episodics.map(stat => stat.quantity)
        }
      ],
    };

    // Card Chart 2
    const cardChartOpts2 = {
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
            fontColor: 'transparent',
          }

        }],
        yAxes: [{
          display: false,
          ticks: {
            display: false,
            min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
            max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
          }
        }],
      },
      elements: {
        line: {
          tension: 0.00001,
          borderWidth: 1
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 4,
        },
      }
    }

    return (
      <Card className="text-white bg-info">
        <CardBody className="pb-0">
          <ButtonGroup className="float-right">
            <Dropdown id='card2' isOpen={this.state.dropdownOpen}
                      toggle={() => { this.setState({ dropdownOpen: !this.state.dropdownOpen }); }}>
              <DropdownToggle className="p-0" color="transparent">
                <i className="icon-location-pin"></i>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
          <h4 className="mb-0">LineChart2</h4>
          <p>Episodics</p>
        </CardBody>
        <div className="chart-wrapper px-3" style={{height:'70px'}}>
          <Line data={cardChartData2} options={cardChartOpts2} height={70}/>
        </div>
      </Card>
    )
  }
}

const options = {
  collection: Statistics,
  fragmentName: 'StatisticsDefaultFragment',
};

registerComponent('LineChart2', LineChart2, [withDocument, options]);
