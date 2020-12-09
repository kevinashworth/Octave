import { getCollection, useMulti2 } from 'meteor/vulcan:core'
import log from 'loglevel'

// Vulcan useMulti2 works in a component only
const Prefetch = ({ collectionName = 'Projects', limit = 600 }) => {
  const { error, loading } = useMulti2({
    collection: getCollection(collectionName),
    fragmentName: 'ProjectsDataTableFragment',
    input: {
      enableCache: true,
      limit,
      sort: {
        updatedAt: 'desc'
      }
    }
  })
  if (error) {
    log.error(`Error in Prefetch (${collectionName}, limit: ${limit}):`, error)
  }
  if (loading) {
    log.debug(`Prefetching ${collectionName} (limit: ${limit}).`)
  } else {
    log.debug(`${collectionName} prefetched.`)
  }
  return null
}

export default Prefetch
