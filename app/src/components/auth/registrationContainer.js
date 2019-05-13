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
    return <RegistrationForm onSubmit={this._register} errors={this.props.error} />
  }
}

const mapStateToProps = state => ({
  error: state.registrationState.error
})

const mapDispatchToProps = dispatch => ({
  register: user => dispatch(register(user))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration)
