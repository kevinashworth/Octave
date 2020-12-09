/**
 * @summary Display transformed markdown in my specific format with optional heading or i18n id for a heading.
 *
 * @param {heading} heading (optional) takes priority over
 * @param {id} i18n id (optional)
 * @param {markdown} the markdown
 */

import { getString, Utils } from 'meteor/vulcan:core'
import React from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import { myRenderers } from '../../modules/helpers.js'

const MyMarkdown = ({ heading, id, markdown }) => {
  if (!markdown) {
    return null
  }
  let myHeading
  if (heading) {
    myHeading = heading
  } else if (id && getString({ id })) {
    myHeading = getString({ id })
  }
  const myMarkdown = myHeading ? Utils.sanitize(`**${myHeading}:** ${markdown}`) : Utils.sanitize(markdown)
  return (
    <ReactMarkdown renderers={myRenderers}>
      {myMarkdown}
    </ReactMarkdown>
  )
}

MyMarkdown.propTypes = {
  heading: PropTypes.string,
  id: PropTypes.string,
  markdown: PropTypes.string.isRequired
}

export default MyMarkdown
