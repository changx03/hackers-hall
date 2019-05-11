import { isEmpty } from 'lodash/lang'
import React from 'react'
import { connect } from 'react-redux'
import { logout } from '../../actions/authenticationActions'
import HeaderSiteNav from './headerSiteNav'
import HeaderUserAuthNav from './headerUserAuthNav'
import HeaderUserProfile from './headerUserProfile'

class Header extends React.Component {
  _logout = () => {
    const { logout } = this.props
    logout()
  }

  render() {
    const { user } = this.props
    const identity = []
    if (!isEmpty(user)) {
      const { firstName, lastName, username } = user
      firstName && identity.push(firstName)
      lastName && identity.push(lastName)
      username && identity.length === 0 && identity.push(username)
    }

    return (
      <nav className="header-nav-container">
        <HeaderSiteNav />
        {!isEmpty(user) ? (
          <HeaderUserProfile
            identity={identity.join(' ')}
            logout={this._logout}
          />
        ) : (
          <HeaderUserAuthNav />
        )}
      </nav>
    )
  }
}

const mapStateToProps = state => ({
  user: state.userDataState.user
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
