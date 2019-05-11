import actionTypes from '../actions/actionTypes'
import { voteState } from './initialState'

export default function voteReducer(state = voteState, action) {
  switch (action.type) {
    case actionTypes.vote.RESULTS_REQUEST:
      return { ...state, isRequested: true }
    case actionTypes.vote.RESULTS_SUCCESS:
      return { ...state, isRequested: false, votingResults: action.votingResults }
    case actionTypes.vote.RESULTS_FAILURE:
      return { ...state, isRequested: false, error: action.error }
    default:
      return state
  }
}
