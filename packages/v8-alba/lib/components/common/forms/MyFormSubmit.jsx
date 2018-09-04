import React from 'react';
import PropTypes from 'prop-types';
import { Components } from 'meteor/vulcan:core';
import { replaceComponent } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';

const MyFormSubmit = ({
  submitLabel,
  cancelLabel,
  cancelCallback,
  revertLabel,
  revertCallback,
  document,
  deleteDocument,
  collectionName,
  classes,
}, {
  isChanged,
  clearForm,
}) => (
  <div className="form-submit">
    <Components.Button type="submit" variant="primary">
      {submitLabel ? submitLabel : <FormattedMessage id="forms.submit" />}
    </Components.Button>

    {cancelCallback ? (
      <a
        className="form-cancel btn btn-secondary"
        onClick={e => {
          e.preventDefault();
          cancelCallback(document);
        }}
      >
        {cancelLabel ? cancelLabel : <FormattedMessage id="forms.cancel" />}
      </a>
    ) : null}

    {revertCallback ? (
      <a
        className="form-cancel"
        onClick={e => {
          e.preventDefault();
          clearForm({ clearErrors: true, clearCurrentValues: true, clearDeletedValues: true });
          revertCallback(document);
        }}
      >
      {revertLabel ? revertLabel : <FormattedMessage id="forms.revert"/>}
      </a>
    ) : null}

    {deleteDocument ? (
      <div>
        <hr />
        <a href="javascript:void(0)" onClick={deleteDocument} className={`delete-link ${collectionName}-delete-link btn btn-danger`}>
          <FormattedMessage id="forms.delete" />
        </a>
        <br />
      </div>
    ) : null}
  </div>
);

MyFormSubmit.propTypes = {
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  cancelCallback: PropTypes.func,
  revertLabel: PropTypes.string,
  revertCallback: PropTypes.func,
  document: PropTypes.object,
  deleteDocument: PropTypes.func,
  collectionName: PropTypes.string,
  classes: PropTypes.object,
};

MyFormSubmit.contextTypes = {
  isChanged: PropTypes.func,
  clearForm: PropTypes.func,
};


replaceComponent('FormSubmit', MyFormSubmit);
