import React from 'react'
import { Link } from 'react-router-dom'

const NavLink = () => (
  <ul>
    <li>
      <Link to="timeline">Timeline</Link>
    </li>
    <li>
      <Link to="results">Results</Link>
    </li>
    <li>
      <Link to="about">About</Link>
    </li>
  </ul>
)

export default NavLink
