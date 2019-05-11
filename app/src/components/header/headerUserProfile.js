import React from 'react'
import PropTypes from 'prop-types'

const HeaderUserProfile = ({ identity, logout }) => (
  <ul>
    <li>
      <span className="profile-identity">Welcome </span>
      <span>{identity}</span>
    </li>
    <li>
      <a href="/" onClick={logout}>
        <i className="fa fa-sign-out" />
        logout
      </a>
    </li>
  </ul>
)

HeaderUserProfile.propTypes = {
  identity: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired
}

export default HeaderUserProfile
