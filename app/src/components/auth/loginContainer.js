import React from 'react'
import { connect } from 'react-redux'
import { login } from '../../actions/authenticationActions'
import LoginForm from './loginForm'

class Login extends React.Component {
  _login = formData => {
    const { login } = this.props
    const params = new URLSearchParams(this.props.location.search)
    const returnUrl = params.get('returnUrl')
    login(formData, returnUrl)
  }

  render() {
    return <LoginForm onSubmit={this._login} />
  }
}

const mapDispatchToProps = dispatch => ({
  login: (formData, returnUrl) => dispatch(login(formData, returnUrl))
})

export default connect(
  null,
  mapDispatchToProps
)(Login)
