import { routerActions } from 'connected-react-router'
import VotingApi from '../api/VotingApi'
import actionTypes from './actionTypes'
import displayNotification from '../utils/displayNotification'

class EventVote {
  static sent() {
    return {
      type: actionTypes.vote.SENT,
      isRequested: true
    }
  }

  static casted(vote) {
    return {
      type: actionTypes.vote.CASTED,
      isRequested: false,
      vote
    }
  }

  static failure(error) {
    return {
      type: actionTypes.vote.FAILURE,
      error
    }
  }
}

class EventResults {
  static requested() {
    return {
      type: actionTypes.vote.RESULTS_REQUEST,
      isRequested: true
    }
  }

  static received(votingResults) {
    return {
      type: actionTypes.vote.RESULTS_SUCCESS,
      isRequested: true,
      votingResults
    }
  }

  static failure(error) {
    return {
      type: actionTypes.vote.RESULTS_FAILURE,
      isRequested: false,
      error
    }
  }
}

export function voteForEvent(timelineItem, user) {
  return async dispatch => {
    dispatch(EventVote.sent())
    try {
      const vote = await VotingApi.vote(timelineItem._id, 'popular')
      dispatch(EventVote.casted(vote))
      // prettier-ignore
      const message = `Thanks ${user.firstName} for voting! You successfully voted for ${timelineItem.name}`
      displayNotification(message)
    } catch (e) {
      dispatch(EventVote.failure(e))

      if (e.status === 409) {
        dispatch(routerActions.push(`/login?returnUrl=timeline/${timelineItem._id}`))
      }
    }
  }
}

export function getVotingResult() {
  return async dispatch => {
    dispatch(EventResults.requested())
    try {
      const votingResults = await VotingApi.getVotingResults()
      dispatch(EventResults.received(votingResults))
    } catch (e) {
      dispatch(EventResults.failure(e))
    }
  }
}
