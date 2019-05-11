import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'
import InputField from './inputField'

function validate(values) {
  const errors = {}

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.password) {
    errors.password = 'Required'
  }

  return errors
}

function LoginFormContainer({ handleSubmit, error, submitting }) {
  const renderError = () => {
    return error ? (
      <div className="error">
        <span>{error}</span>
      </div>
    ) : null
  }

  const onSubmit = e => {
    console.log(e)
    e.preventDefault()
    handleSubmit()
  }

  return (
    <div className="login">
      <div className="login-form">
        <div className="login-heading">
          <i className="fa fa-sign-in fa-4x" aria-hidden="true" />
          <h1>Login</h1>
        </div>
        <form onSubmit={onSubmit}>
          <Field
            name="email"
            component={InputField}
            type="text"
            placeholder="Email"
            className="form-control"
            label="Email"
            tabIndex="1"
            focusField="email"
          />
          <Field
            name="password"
            component={InputField}
            type="password"
            placeholder="Password"
            className="form-control"
            label="Password"
            tabIndex="4"
          />
          {renderError()}
          <button className="btn btn-primary" disabled={submitting}>
            Login
          </button>
        </form>
        <div className="login_register-link">
          <Link to="/register">Don't have any account? Sign up</Link>
        </div>
      </div>
    </div>
  )
}

LoginFormContainer.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  errors: PropTypes.object
}

export default reduxForm({
  form: 'loginForm',
  validate
})(LoginFormContainer)
