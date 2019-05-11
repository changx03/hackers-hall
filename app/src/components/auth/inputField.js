import React from 'react'

export default class InputField extends React.Component {
  ref = React.createRef()
  componentDidMount() {
    const node = this.ref.current
    const { focusField } = this.props
    if (node && focusField && node.focus) {
      node.focus()
    }
  }

  render() {
    const {
      input,
      label,
      type,
      className,
      meta: { touched, error }
    } = this.props
    let wrapperClass = 'form-group'
    if (touched && error) {
      wrapperClass = `${wrapperClass} error`
    }

    return (
      <div className={wrapperClass}>
        <label>{label}</label>
        <input
          {...input}
          placeholder={label}
          type={type}
          className={className}
          ref={this.ref}
        />
        {touched && error && <span>{error}</span>}
      </div>
    )
  }
}
