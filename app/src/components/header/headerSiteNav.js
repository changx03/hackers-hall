import React from 'react'
import { NavLink } from 'react-router-dom'

const HeaderSiteNav = () => (
  <ul>
    <li className="header-brand">
      <NavLink to="timeline">HH</NavLink>
    </li>
    <li className="header-nav_item">
      <NavLink to="timeline" activeClassName="header-active-link">
        Timeline
      </NavLink>
    </li>
    <li className="header-nav_item">
      <NavLink to="results" activeClassName="header-active-link">
        Voting Results
      </NavLink>
    </li>
    <li className="header-nav_item">
      <NavLink to="about" activeClassName="header-active-link">
        About
      </NavLink>
    </li>
  </ul>
)

export default HeaderSiteNav
