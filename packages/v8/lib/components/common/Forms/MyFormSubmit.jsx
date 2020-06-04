import { Components, replaceComponent } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

const MyFormSubmit = ({
  submitLabel,
  cancelLabel,
  cancelCallback,
  revertLabel,
  revertCallback,
  document,
  deleteDocument,
  collectionName,
  classes
}, {
  isChanged,
  clearForm
}) => (
  <div className='form-submit'>
    <Components.Button type='submit' variant='primary'>
      {submitLabel || <FormattedMessage id='forms.submit' />}
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

MyFormSubmit.propTypes = {
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  cancelCallback: PropTypes.func,
  revertLabel: PropTypes.string,
  revertCallback: PropTypes.func,
  document: PropTypes.object,
  deleteDocument: PropTypes.func,
  collectionName: PropTypes.string,
  classes: PropTypes.object
}

MyFormSubmit.contextTypes = {
  isChanged: PropTypes.func,
  clearForm: PropTypes.func
}

replaceComponent('FormSubmit', MyFormSubmit)
