import actionTypes from '../actions/actionTypes'
import { userState } from './initialState'

export default function userDataReducer(state = userState, action) {
  switch (action.type) {
    case actionTypes.userData.UPDATED:
      return { ...state, user: action.user }
    case actionTypes.vote.SENT:
      return { ...state, isRequested: true }
    case actionTypes.vote.CASTED:
      return { ...state, isRequested: false, votes: [...state.votes, action.vote] }
    case actionTypes.vote.FAILURE:
      return { ...state, isRequested: false, error: action.error }
    default:
      return state
  }
}
