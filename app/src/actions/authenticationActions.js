import { push } from 'connected-react-router'
import AuthenticationApi from '../api/AuthenticationApi'
import actionTypes from './actionTypes'

function userDataUpdate(user) {
  return {
    type: actionTypes.userData.UPDATED,
    user
  }
}

class UserAuthentication {
  static requested() {
    return {
      type: actionTypes.login.REQUEST,
      isAuthenticated: false,
      isRequested: true
    }
  }

  static success(user) {
    return {
      type: actionTypes.login.SUCCESS,
      isRequested: false,
      isAuthenticated: true,
      user
    }
  }

  static failure(error) {
    return {
      type: actionTypes.login.FAILURE,
      isAuthenticated: false,
      isRequested: false,
      error
    }
  }
}

class UserLogout {
  static requested() {
    return {
      type: actionTypes.logout.REQUEST,
      isRequested: true
    }
  }

  static successful() {
    return {
      type: actionTypes.logout.SUCCESS,
      isRequested: false
    }
  }

  static failure(error) {
    return {
      type: actionTypes.logout.FAILURE,
      isRequested: true,
      error
    }
  }
}

class UserRegistration {
  static requested() {
    return {
      type: actionTypes.registration.REQUEST,
      isRequested: true,
      isRegistered: false
    }
  }

  static success(message) {
    return {
      type: actionTypes.registration.SUCCESS,
      isRequested: false,
      isRegistered: true,
      message
    }
  }

  static failure(error) {
    return {
      type: actionTypes.registration.FAILURE,
      isRequested: false,
      isRegistered: false,
      error
    }
  }
}

export function login(credentials, returnUrl) {
  return async dispatch => {
    dispatch(UserAuthentication.requested())
    try {
      const user = await AuthenticationApi.login(credentials)
      dispatch(UserAuthentication.success(user))
      dispatch(userDataUpdate(user))
      dispatch(push(returnUrl || '/'))
    } catch (e) {
      dispatch(UserAuthentication.failure(e))
    }
  }
}

export function logout() {
  return async dispatch => {
    dispatch(UserLogout.requested())
    try {
      await AuthenticationApi.logout()
      dispatch(UserLogout.successful())
      dispatch(userDataUpdate({}))
      dispatch(push('/'))
    } catch (e) {
      dispatch(UserLogout.failure(e))
    }
  }
}

export function register(user) {
  return async dispatch => {
    dispatch(UserRegistration.requested())
    try {
      const message = await AuthenticationApi.register(user)
      dispatch(UserRegistration.success(message))
      dispatch(push('/login'))
    } catch (e) {
      dispatch(UserRegistration.failure(e))
    }
  }
}
