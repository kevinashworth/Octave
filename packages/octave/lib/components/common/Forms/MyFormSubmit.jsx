/* eslint-disable multiline-ternary */
import { Components, replaceComponent, useCurrentUser } from 'meteor/vulcan:core'
import Users from 'meteor/vulcan:users'
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n'
import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

const MyFormSubmit = (props, context) => {
  const getMongoProvider = (state) => state.mongoProvider
  const mongoProvider = useSelector(getMongoProvider)

  const {
    cancelLabel,
    cancelCallback,
    collectionName,
    deleteDocument,
    document,
    revertCallback,
    revertLabel,
    submitLabel
  } = props

  const { clearForm } = context

  const { currentUser } = useCurrentUser()
  const disabled = !Users.canDelete({ collectionName, document, user: currentUser })

  let mySubmitLabel = submitLabel || context.intl.formatMessage({ id: 'forms.submit' })
  if (mongoProvider) {
    mySubmitLabel += ` to ${mongoProvider}`
  }

  return (
    <div className='form-submit'>
      <Components.Button type='submit' variant='primary'>
        {mySubmitLabel}
      </Components.Button>

      {cancelCallback ? (
        <a
          className='form-cancel btn btn-secondary'
          onClick={e => {
            e.preventDefault()
            cancelCallback(document)
          }}
        >
          {cancelLabel || <FormattedMessage id='forms.cancel' />}
        </a>
      ) : null}

      {revertCallback ? (
        <a
          className='form-cancel'
          onClick={e => {
            e.preventDefault()
            clearForm({ clearErrors: true, clearCurrentValues: true, clearDeletedValues: true })
            revertCallback(document)
          }}
        >
          {revertLabel || <FormattedMessage id='forms.revert' />}
        </a>
      ) : null}

      {deleteDocument ? (
        <div>
          <hr />
          <Button data-cy='delete-document' disabled={disabled} onClick={deleteDocument} variant={disabled ? 'light' : 'danger'}>
            <FormattedMessage id='forms.delete' />
          </Button>
          <br />
        </div>
      ) : null}

    </div>
  )
}

MyFormSubmit.propTypes = {
  cancelLabel: PropTypes.string,
  cancelCallback: PropTypes.func,
  collectionName: PropTypes.string,
  deleteDocument: PropTypes.func,
  document: PropTypes.object,
  revertCallback: PropTypes.func,
  revertLabel: PropTypes.string,
  submitLabel: PropTypes.string
}

MyFormSubmit.contextTypes = {
  clearForm: PropTypes.func,
  intl: intlShape,
  isChanged: PropTypes.func
}

replaceComponent('FormSubmit', MyFormSubmit)
