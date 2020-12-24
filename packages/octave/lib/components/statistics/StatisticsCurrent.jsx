import { Components, Utils, useCurrentUser, useMulti2, useSingle2, useUpdate2, withMessages } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import moment from 'moment'
import Projects from '../../modules/projects/collection.js'
import Statistics from '../../modules/statistics/collection.js'
import { DATE_FORMAT_LONG, PROJECT_TYPES_EPISODICS, PROJECT_TYPES_FEATURES, PROJECT_TYPES_PILOTS, PROJECT_TYPES_OTHERS } from '../../modules/constants.js'

function latestStatIsFromToday (theStatsArray) {
  const latestDate = theStatsArray[theStatsArray.length - 1].date
  const today = new Date()
  return moment(latestDate).isSame(today, 'day')
}

const StatisticsCurrent = ({ flash }) => {
  const { currentUser } = useCurrentUser()
  const defaultEnabled = Users.canUpdate({ collection: Statistics, user: currentUser })
  const [disabled, setDisabled] = useState(!defaultEnabled)

  const { loading: loadingE, error: errorE, totalCount: episodicsCasting } = useMulti2({
    collection: Projects,
    input: {
      enableCache: true,
      filter: {
        projectType: { _in: PROJECT_TYPES_EPISODICS },
        status: { _eq: 'Casting' }
      }
    }
  })

  const { loading: loadingF, error: errorF, totalCount: featuresCasting } = useMulti2({
    collection: Projects,
    input: {
      enableCache: true,
      filter: {
        projectType: { _in: PROJECT_TYPES_FEATURES },
        status: { _eq: 'Casting' }
      }
    }
  })

  const { loading: loadingP, error: errorP, totalCount: pilotsCasting } = useMulti2({
    collection: Projects,
    input: {
      enableCache: true,
      filter: {
        projectType: { _in: PROJECT_TYPES_PILOTS },
        status: { _eq: 'Casting' }
      }
    }
  })

  const { loading: loadingO, error: errorO, totalCount: othersCasting } = useMulti2({
    collection: Projects,
    input: {
      enableCache: true,
      filter: {
        projectType: { _in: PROJECT_TYPES_OTHERS },
        status: { _eq: 'Casting' }
      }
    }
  })

  const { document: theStats, error: errorS, loading: loadingS } = useSingle2({
    collection: Statistics,
    input: {
      id: 'HSEC7MWC9RFCJLEMP'
    }
  })

  const [updateStatistic] = useUpdate2({ collection: Statistics })

  if (loadingE || loadingF || loadingP || loadingO || loadingS) {
    return <Components.Loading />
  }

  if (errorE) console.log('errorE:', errorE)
  if (errorF) console.log('errorF:', errorF)
  if (errorP) console.log('errorP:', errorP)
  if (errorO) console.log('errorO:', errorO)
  if (errorS) console.log('errorS:', errorS)

  const writeStatistics = () => {
    const newStats = {
      episodics: theStats.episodics,
      features: theStats.features,
      pilots: theStats.pilots,
      others: theStats.others
    }
    Utils.removeProperty(newStats, '__typename')

    if (latestStatIsFromToday(newStats.episodics)) {
      newStats.episodics.pop()
    }
    newStats.episodics.push({ date: new Date(), quantity: episodicsCasting })

    if (latestStatIsFromToday(newStats.features)) {
      newStats.features.pop()
    }
    newStats.features.push({ date: new Date(), quantity: featuresCasting })

    if (latestStatIsFromToday(newStats.pilots)) {
      newStats.pilots.pop()
    }
    newStats.pilots.push({ date: new Date(), quantity: pilotsCasting })

    if (latestStatIsFromToday(newStats.others)) {
      newStats.others.pop()
    }
    newStats.others.push({ date: new Date(), quantity: othersCasting })

    updateStatistic({
      input: {
        id: 'HSEC7MWC9RFCJLEMP',
        data: newStats
      }
    }).then((results) => {
      const updatedAt = moment(results.data.updateStatistic.data.updatedAt).format(DATE_FORMAT_LONG)
      flash({
        message: `Statistics updated as of ${updatedAt}`,
        type: 'success'
      })
      setDisabled(true)
    }).catch((error) => {
      flash({
        message: error,
        type: 'error'
      })
    })
  }

  return (
    <Card className='card-accent-warning'>
      <Card.Header>Current Statistics</Card.Header>
      <Card.Body>
        <ListGroup className='statistics-lists'>
          <ListGroup.Item>Episodics Casting: {episodicsCasting}</ListGroup.Item>
          <ListGroup.Item>Features Casting: <span data-cy='features-casting'>{featuresCasting}</span></ListGroup.Item>
          <ListGroup.Item>Pilots Casting: {pilotsCasting}</ListGroup.Item>
          <ListGroup.Item>Others Casting: {othersCasting}</ListGroup.Item>
        </ListGroup>
        <Button
          className='mt-2'
          data-cy='write-statistics'
          disabled={disabled}
          onClick={() => writeStatistics()}
          variant={disabled ? 'light' : 'primary'}
        >
          Write These Statistics to Database
        </Button>
      </Card.Body>
    </Card>
  )
}

StatisticsCurrent.displayName = 'WithMessages(StatisticsCurrent)'

export default withMessages(StatisticsCurrent)
