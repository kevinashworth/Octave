import { useCurrentUser, withMessages } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

const ErrorWithAlgoliaDelete = ({ documentId, flash, variant }) => {
  const { currentUser } = useCurrentUser()

  const deleteAlgoliaRecord = (documentId) => {
    if (typeof documentId === 'string') {
      Meteor.call(
        'deleteAlgoliaRecord',
        documentId,
        (error, result) => { // we expect result to be undefined
          if (error) {
            flash({
              message: `deleteAlgoliaRecord error: ${error}`,
              type: 'error'
            })
          } else {
            flash({
              message: `Delete command for ${documentId} sent to Algolia.`,
              type: 'info'
            })
          }
        })
    }
  }

  const IsThisLink = () => {
    if (variant === 'projects') {
      return (
        <Link to={`/past-projects/${documentId}`}>Is this _id for a Past Project?</Link>
      )
    } else if (variant === 'pastprojects') {
      return (
        <Link to={`/projects/${documentId}`}>Is this _id for a Project?</Link>
      )
    }
    return null
  }

  return (
    <Card>
      <Card.Body>
        <Card.Text>
          <FormattedMessage id='app.missing_document' />
        </Card.Text>
        {Users.isAdmin(currentUser) &&
          <Card.Text>
            <Button variant={variant} onClick={() => deleteAlgoliaRecord(documentId)}>Admin: Delete {documentId} from Algolia</Button>{' '}
            <IsThisLink />
          </Card.Text>}
      </Card.Body>
    </Card>
  )
}

export default withMessages(ErrorWithAlgoliaDelete)
