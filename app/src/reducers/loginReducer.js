import actionTypes from '../actions/actionTypes'
import { loginState } from './initialState'

export default function loginReducer(state = loginState, action) {
  switch (action.type) {
    case actionTypes.login.REQUEST:
      return { ...state, isRequested: true, isAuthenticated: false }
    case actionTypes.login.SUCCESS:
      return { ...state, isRequested: false, isAuthenticated: true }
    case actionTypes.login.FAILURE:
      return { ...state, isRequested: false, isAuthenticated: false, error: action.error }
    default:
      return state
  }
}
