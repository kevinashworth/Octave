import { updateMutator } from 'meteor/vulcan:core'
import Projects from '../../../modules/projects/collection.js'
import Statistics from '../../../modules/statistics/collection.js'
import moment from 'moment'
import { logger } from '../../logger'
import { PROJECT_TYPES_EPISODICS, PROJECT_TYPES_FEATURES, PROJECT_TYPES_PILOTS, PROJECT_TYPES_OTHERS } from '../../../modules/constants.js'

function latestStatIsFromToday (theStatsArray) {
  const latestDate = theStatsArray[theStatsArray.length - 1].date
  const today = new Date()
  return moment(latestDate).isSame(today, 'day')
}

// callbacks.create.after
export function createProjectUpdateStatistics (document, { currentUser }) {
  const project = document
  const theStats = Promise.await(Statistics.findOne())
  const newStats = { ...theStats } // TODO: do we need to work with a copy?

  if (PROJECT_TYPES_EPISODICS.indexOf(project.projectType) > -1) {
    const episodicsCasting = Projects.find({
      projectType: { $in: PROJECT_TYPES_EPISODICS },
      status: 'Casting'
    }).count()
    logger.info('There are ' + newStats.episodics.length + ' episodics, ' + episodicsCasting + ' casting.')
    logger.info('The most recent one is from ' + newStats.episodics[newStats.episodics.length - 1].date)
    if (latestStatIsFromToday(newStats.episodics)) { // this is the same day, replace the last stat with the new stat
      const popped = newStats.episodics.pop()
      logger.info('This is today, so replacing the following popped stat:' + popped)
    }
    newStats.episodics.push({ date: new Date(), quantity: episodicsCasting })
  }
  else if (PROJECT_TYPES_FEATURES.indexOf(project.projectType) > -1) {
    const featuresCasting = Projects.find({
      projectType: { $in: PROJECT_TYPES_FEATURES },
      status: 'Casting'
    }).count()
    logger.info('There are ' + newStats.features.length + ' features, ' + featuresCasting + ' casting.')
    logger.info('The most recent one is from ' + newStats.features[newStats.features.length - 1].date)
    if (latestStatIsFromToday(newStats.features)) { // this is the same day, replace the last stat with the new stat
      const popped = newStats.features.pop()
      logger.info('This is today, so replacing the following popped stat:' + popped)
    }
    newStats.features.push({ date: new Date(), quantity: featuresCasting })
  }
  else if (PROJECT_TYPES_PILOTS.indexOf(project.projectType) > -1) {
    const pilotsCasting = Projects.find({
      projectType: { $in: PROJECT_TYPES_PILOTS },
      status: 'Casting'
    }).count()
    logger.info('There are ' + newStats.pilots.length + ' pilots, ' + pilotsCasting + ' casting.')
    logger.info('The most recent one is from ' + newStats.pilots[newStats.pilots.length - 1].date)
    if (latestStatIsFromToday(newStats.pilots)) { // this is the same day, replace the last stat with the new stat
      const popped = newStats.pilots.pop()
      logger.info('This is today, so replacing the following popped stat:' + popped)
    }
    newStats.pilots.push({ date: new Date(), quantity: pilotsCasting })
  }
  else if (PROJECT_TYPES_OTHERS.indexOf(project.projectType) > -1) {
    const othersCasting = Projects.find({
      projectType: { $in: PROJECT_TYPES_OTHERS },
      status: 'Casting'
    }).count()
    logger.info('There are ' + newStats.others.length + ' others, ' + othersCasting + ' casting.')
    logger.info('The most recent one is from ' + newStats.others[newStats.others.length - 1].date)
    if (latestStatIsFromToday(newStats.others)) { // this is the same day, replace the last stat with the new stat
      const popped = newStats.others.pop()
      logger.info('This is today, so replacing the following popped stat:' + popped)
    }
    newStats.others.push({ date: new Date(), quantity: othersCasting })
  }
  else {
    logger.error('createProjectUpdateStatistics did not find project type', project.projectType)
  }

  // switch (project.projectType) {
  //   case 'TV One Hour':
  //   case 'TV 1/2 Hour':
  //   case 'TV Animation': {
  //     const episodicsCasting = Projects.find({
  //       projectType: { $in: PROJECT_TYPES_EPISODICS },
  //       status: 'Casting'
  //     }).count()
  //     logger.info('There are ' + newStats.episodics.length + ' episodics, ' + episodicsCasting + ' casting.')
  //     logger.info('The most recent one is from ' + newStats.episodics[newStats.episodics.length - 1].date)
  //     if (latestStatIsFromToday(newStats.episodics)) { // this is the same day, replace the last stat with the new stat
  //       logger.info('This is today, so replacing the following popped stat:', newStats.episodics.pop())
  //     }
  //     newStats.episodics.push({ date: new Date(), quantity: episodicsCasting })
  //     break
  //   }
  //   case 'Feature Film':
  //   case 'Feature Film (LB)':
  //   case 'Feature Film (MLB)':
  //   case 'Feature Film (MPA)':
  //   case 'Feature Film (ULB)':
  //   case 'Feature Film (UPA)': {
  //     const featuresCasting = Projects.find({
  //       projectType: { $in: PROJECT_TYPES_FEATURES },
  //       status: 'Casting'
  //     }).count()
  //     logger.info('There are ' + newStats.features.length + ' features, ' + featuresCasting + ' casting.')
  //     logger.info('The most recent one is from ' + newStats.features[newStats.features.length - 1].date)
  //     if (latestStatIsFromToday(newStats.features)) { // this is the same day, replace the last stat with the new stat
  //       logger.info('This is today, so replacing the following popped stat:', newStats.features.pop())
  //     }
  //     newStats.features.push({ date: new Date(), quantity: featuresCasting })
  //     break
  //   }
  //   case 'Pilot One Hour':
  //   case 'Pilot 1/2 Hour':
  //   case 'Pilot Presentation': {
  //     const pilotsCasting = Projects.find({
  //       projectType: { $in: PROJECT_TYPES_PILOTS },
  //       status: 'Casting'
  //     }).count()
  //     logger.info('There are ' + newStats.pilots.length + ' pilots, ' + pilotsCasting + ' casting.')
  //     logger.info('The most recent one is from ' + newStats.pilots[newStats.pilots.length - 1].date)
  //     if (latestStatIsFromToday(newStats.pilots)) { // this is the same day, replace the last stat with the new stat
  //       logger.info('This is today, so replacing the following popped stat:', newStats.pilots.pop())
  //     }
  //     newStats.pilots.push({ date: new Date(), quantity: pilotsCasting })
  //     break
  //   }
  //   case 'Short Film':
  //   case 'TV Daytime':
  //   case 'TV Mini-Series':
  //   case 'TV Movie':
  //   case 'TV Talk/Variety':
  //   case 'TV Sketch/Improv':
  //   case 'New Media':
  //   case 'Interactive':
  //   case 'Podcast': {
  //     const othersCasting = Projects.find({
  //       projectType: { $in: PROJECT_TYPES_OTHERS },
  //       status: 'Casting'
  //     }).count()
  //     logger.info('There are ' + newStats.others.length + ' others, ' + othersCasting + ' casting.')
  //     logger.info('The most recent one is from ' + newStats.others[newStats.others.length - 1].date)
  //     if (latestStatIsFromToday(newStats.others)) { // this is the same day, replace the last stat with the new stat
  //       logger.info('This is today, so replacing the following popped stat:', newStats.others.pop())
  //     }
  //     newStats.others.push({ date: new Date(), quantity: othersCasting })
  //     break
  //   }
  //   // default:
  // }

  Promise.await(updateMutator({
    action: 'statistic.update',
    documentId: theStats._id,
    collection: Statistics,
    set: newStats,
    currentUser,
    validate: false
  }))
}
