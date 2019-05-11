import React from 'react'
import { NavLink } from 'react-router-dom'

const HeaderUserAuth = () => (
  <ul>
    <li>
      <NavLink to="/login" activeClassName="header-active-link">
        <i className="fa fa-sign-in" />
        Login
      </NavLink>
    </li>
    <li>
      <NavLink to="/register" activeClassName="header-active-link">
        <i className="fa fa-user-plus" />
        Register
      </NavLink>
    </li>
  </ul>
)

export default HeaderUserAuth
