import React from 'react'
import { connect } from 'react-redux'
import { register } from '../../actions/authenticationActions'
import RegistrationForm from './registrationForm'

class Registration extends React.Component {
  _register = formData => {
    const { register } = this.props
    register(formData)
  }

  render() {
    const { registration, error } = this.props
    return (
      <RegistrationForm
        registration={registration}
        error={error}
        onSubmit={this._register}
      />
    )
  }
}

const mapStateToProps = state => {
  const { registration, error, isRequested } = state.registrationState
  return {
    registration,
    error,
    isRequested
  }
}

const mapDispatchToProps = dispatch => ({
  register: user => dispatch(register(user))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration)
