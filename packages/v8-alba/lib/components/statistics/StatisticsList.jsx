import { Components, registerComponent, withCurrentUser, withList } from 'meteor/vulcan:core';
import React from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, ListGroup } from 'reactstrap';
import Statistics from '../../modules/statistics/collection.js';

const StatisticsList = ({loading, loadingMore, loadMore, results = [], currentUser, count, totalCount}) => {
  if (loading) {
    return (<div><Components.Loading/></div>);
  }
  const hasMore = results && (totalCount > results.length);
  return (
    <div className="animated fadeIn">
      <Card>
        <CardHeader>
          <i className="icon-briefcase"></i>Statistics as ListGroup
        </CardHeader>
        <CardBody>
          <ListGroup>
            {results.map(statistic => <Components.StatisticsEditForm key={statistic._id} documentId={statistic._id} currentUser={currentUser} />)}
          </ListGroup>
        </CardBody>
        {hasMore &&
        <CardFooter>
          {loadingMore ?
            <Components.Loading/> :
            <Button onClick={e => {e.preventDefault(); loadMore();}}>Load More ({count}/{totalCount})</Button>
          }
        </CardFooter>
        }
      </Card>
    </div>
  )
}

const options = {
  collection: Statistics
};

registerComponent('StatisticsList', StatisticsList, withCurrentUser, [withList, options]);
