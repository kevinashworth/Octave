/* eslint-disable multiline-ternary */
import { Components, replaceComponent } from 'meteor/vulcan:core'
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n'
import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

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
          <NavLink to='#' onClick={deleteDocument} className={`delete-link ${collectionName}-delete-link btn btn-danger`}>
            <FormattedMessage id='forms.delete' />
          </NavLink>
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
