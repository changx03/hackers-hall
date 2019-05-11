import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

const ReadMore = ({ text, url }) => (
  <span>
    <span>{text}</span>
    <Link to={url}>...read more</Link>
  </span>
)

ReadMore.propTypes = {
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
}

export default ReadMore
