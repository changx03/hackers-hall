import React from 'react'
import { Link } from 'react-router-dom'
import { Field, Form, reduxForm } from 'redux-form'
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

function LoginFormContainer({ handleSubmit, submitting, errors }) {
  console.log(errors)
  return (
    <div className="login">
      <div className="login-form">
        <div className="login-heading">
          <i className="fa fa-sign-in fa-4x" aria-hidden="true" />
          <h1>Login</h1>
        </div>
        {errors && <div className="error"><span>{errors.message}</span></div>}
        <Form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            Login
          </button>
        </Form>
        <div className="login_register-link">
          <Link to="/register">Don't have any account? Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default reduxForm({
  form: 'loginForm',
  validate
})(LoginFormContainer)
