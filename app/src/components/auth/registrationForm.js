import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { Field, Form, reduxForm } from 'redux-form'
import InputField from './inputField'

const validate = values => {
  const errors = {}
  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.confirmPassword && values.confirmPassword !== values.password) {
    errors.password = errors.confirmPassword = 'Password mismatch'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Required'
  } else if (values.password && values.confirmPassword !== values.password) {
    errors.password = errors.confirmPassword = 'Password mismatch'
  }

  return errors
}

const RegistrationForm = ({ handleSubmit, submitting, errors}) => {
  return (
    <div className="register">
      <div className="register-form">
        <div className="register-heading">
          <i className="fa fa-user-plus fa-4x" aria-hidden="true" />
          <h1>Register</h1>
        </div>
        {errors && <div className="error"><span>{errors.message}</span></div>}
        <Form onSubmit={handleSubmit}>
          <Field
            name="firstName"
            component={InputField}
            type="text"
            placeholder="First Name (optional)"
            className="form-control"
            label="First Name"
            tabIndex="1"
            focusField="firstName"
          />
          <Field
            name="lastName"
            component={InputField}
            type="text"
            placeholder="Last Name (optional)"
            className="form-control"
            label="Last Name"
            tabIndex="2"
          />
          <Field
            name="email"
            component={InputField}
            type="email"
            placeholder="Email (required)"
            className="form-control"
            label="Email"
            tabIndex="3"
          />
          <Field
            name="password"
            component={InputField}
            type="password"
            placeholder="Password (required)"
            className="form-control"
            label="Password"
            tabIndex="4"
          />
          <Field
            name="confirmPassword"
            component={InputField}
            type="password"
            placeholder="Confirm Password (required)"
            className="form-control"
            label="Confirm Password"
            tabIndex="5"
          />
          <button className="btn btn-primary" tabIndex="6" disabled={submitting} type="submit">
            Register
          </button>
        </Form>
        <div className="register_sign-in">
          <Link to="/login">Need an Account?</Link>
        </div>
      </div>
    </div>
  )
}

RegistrationForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  errors: PropTypes.object
}

export default reduxForm({
  form: 'registrationForm',
  validate
})(RegistrationForm)
