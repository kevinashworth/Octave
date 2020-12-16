import { BOOSTED } from '../../modules/constants'

const createIndexedObject = ({ collectionName, document, sourceDb }) => {
  const boosted = BOOSTED[collectionName]
  const objectID = document._id
  const source = document.source || sourceDb || 'no source'
  const updatedAt = document.updatedAt || document.createdAt
  const url = `/${collectionName}/${document._id}/${document.slug}`

  if (collectionName === 'contacts') {
    return {
      addressString: document.addressString,
      body: document.body,
      boosted,
      name: document.displayName,
      objectID,
      source,
      updatedAt,
      url
    }
  }

  if (collectionName === 'offices') {
    return {
      addressString: document.fullAddress,
      body: document.body,
      boosted,
      name: document.displayName,
      objectID,
      source,
      updatedAt,
      url
    }
  }

  if (collectionName === 'projects') {
    return {
      body: document.summary,
      boosted,
      name: document.projectTitle,
      network: document.network,
      notes: document.notes,
      objectID,
      source,
      updatedAt,
      url
    }
  }

  return {
    createIndexedObject: 'should not return this'
  }
}

export default createIndexedObject
