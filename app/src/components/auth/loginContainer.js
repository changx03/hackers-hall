import React from 'react'
import { connect } from 'react-redux'
import { login } from '../../actions/authenticationActions'
import LoginForm from './loginForm'

class Login extends React.Component {
  _login = formData => {
    const { login } = this.props
    console.log(formData)
    const params = new URLSearchParams(this.props.location.search)
    const returnUrl = params.get('returnUrl')
    login(formData, returnUrl)
  }

  render() {
    console.log(this.props)
    const { error, isRequested } = this.props
    return (
      <LoginForm
        handleSubmit={this._login}
        error={error}
        submitting={isRequested}
      />
    )
  }
}

const mapStateToProps = state => {
  const { creds, error, isRequested } = state.loginState
  return {
    creds,
    error,
    isRequested,
    router: state.router
  }
}

const mapDispatchToProps = dispatch => ({
  login: (formData, returnUrl) => dispatch(login(formData, returnUrl))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
