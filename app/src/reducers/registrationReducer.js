import actionTypes from '../actions/actionTypes'
import { registrationState } from './initialState'

export default function registrationReducer(state = registrationState, action) {
  switch (action.type) {
    case actionTypes.registration.REQUEST:
      return { ...state, isRequested: true, isRegistered: false }
    case actionTypes.registration.SUCCESS:
      return { ...state, isRequested: false, isRegistered: true, message: action.message }
    case actionTypes.registration.FAILURE:
      return { ...state, isRequested: false, isRegistered: false, error: action.error }
    default:
      return state
  }
}
