import actionTypes from '../actions/actionTypes'
import { timelineState } from './initialState'

export default function timelineReducer(state = timelineState, action) {
  switch (action.type) {
    case actionTypes.timeline.REQUEST:
      return { ...state, isRequested: true }
    case actionTypes.timeline.RECEIVED:
      return { ...state, isRequested: false, timelineItems: action.timelineItems }
    case actionTypes.timeline.FAILURE:
      return { ...state, isRequested: false, error: action.error }
    case actionTypes.timeline.UPDATE_FILTER:
      return { ...state, filterCriteria: action.filterCriteria }
    default:
      return state
  }
}
