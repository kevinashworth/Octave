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
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

const renderers = {
  link: ({ href, children }) => {
    if (href.indexOf('/') === 0) {
      return <Link to={href}>{children}</Link>
    } else if (href.indexOf('http') === 0) {
      return <a href={href} target='notelinks'>{children}</a>
    } else if (href.indexOf('mailto') === 0) {
      return <a href={href}>{children}</a>
    }
  }
}

const MyMarkdown = ({ heading, id, markdown }) => {
  if (!markdown) {
    return null
  }

  let head
  if (heading) {
    head = heading
  } else if (id && getString({ id })) {
    head = getString({ id })
  }
  const md = head ? Utils.sanitize(`**${head}:** ${markdown}`) : Utils.sanitize(markdown)

  return (
    <ReactMarkdown plugins={[gfm]} renderers={renderers}>
      {md}
    </ReactMarkdown>
  )
}

MyMarkdown.propTypes = {
  heading: PropTypes.string,
  id: PropTypes.string,
  markdown: PropTypes.string.isRequired
}

export default MyMarkdown
