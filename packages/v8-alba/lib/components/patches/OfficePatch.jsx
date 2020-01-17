import { Components,  registerComponent } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Collapse } from 'reactstrap'
import * as jsonpatch from 'fast-json-patch'
import _ from 'lodash'
import moment from 'moment'
var omitDeep = require('omit-deep')
import { DATE_FORMAT_LONG } from '../../modules/constants.js'
import OfficeDisplay from './OfficeDisplay.jsx'

class OfficePatchDisplay extends PureComponent {
  constructor(props) {
    super(props)
  }

  render () {
    const { collapseIsOpen, office, patch } = this.props
    if (!collapseIsOpen) {
      return null
    }
    if (!office) {
      return <FormattedMessage id='patches.missing_document' />
    }
    var clonedOffice = _.cloneDeep(omitDeep(office, ['__typename']))
    // console.log('[OfficePatchDisplay] clonedOffice:', clonedOffice)

    var patchedOffice = office
    try {
      patchedOffice= jsonpatch.applyPatch(clonedOffice, patch.patch).newDocument
    }
    catch (e) {
      console.log('[OfficePatch] error:', e)
    }
    // console.log('[OfficePatchDisplay] patch:', patch.patch)
    // console.log('[OfficePatchDisplay] patchedOffice:', patchedOffice)

    return <OfficeDisplay office={patchedOffice} />
  }
}

OfficePatchDisplay.propTypes = {
  office: PropTypes.object.isRequired,
}

const OfficePatch = ({ office, patch }) => {
  if (!office) {
    return <div>No History (OfficePatch)</div>
  } else {
    const [collapseIsOpen, toggleCollapse] = useState(false)
    const toggle = () => toggleCollapse(!collapseIsOpen)

    return (
      <div>
      <Button onClick={toggle}>Toggle {moment(patch.date).format(DATE_FORMAT_LONG)} Version</Button>
      <Collapse isOpen={collapseIsOpen}>
        <OfficePatchDisplay office={office} patch={patch} collapseIsOpen={collapseIsOpen} />
      </Collapse>
      </div>
    )
  }
}

OfficePatch.propTypes = {
  office: PropTypes.object.isRequired,
}

registerComponent({
  name: 'OfficePatch',
  component: OfficePatch
})
