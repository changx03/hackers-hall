import TimelineApi from '../api/TimelineApi'
import actionTypes from './actionTypes'

class TimelineItems {
  static requested() {
    return {
      type: actionTypes.timeline.REQUEST,
      isRequested: true
    }
  }

  static received(timelineItems) {
    return {
      type: actionTypes.timeline.RECEIVED,
      isRequested: false,
      timelineItems
    }
  }

  static failure(error) {
    return {
      type: actionTypes.timeline.FAILURE,
      isRequested: false,
      error
    }
  }

  static updateFilterCriteria(filterCriteria) {
    return {
      type: actionTypes.timeline.UPDATE_FILTER,
      filterCriteria
    }
  }
}

export function getTimelineItems() {
  return async dispatch => {
    dispatch(TimelineItems.requested())
    try {
      const items = await TimelineApi.getAllTimeLineItems()
      dispatch(TimelineItems.received(items))
    } catch (e) {
      dispatch(TimelineItems.failure(e))
    }
  }
}

export function filterTimelineItemsByDates(startDate, endDate) {
  return async dispatch => {
    dispatch(TimelineItems.requested())
    try {
      const items = await TimelineApi.filterTimelineItemsByDates(startDate, endDate)
      dispatch(TimelineItems.received(items))
    } catch (e) {
      dispatch(TimelineItems.failure(e))
    }
  }
}

export function updateFilterCriteria(filterCriteria) {
  return dispatch => {
    dispatch(TimelineItems.updateFilterCriteria(filterCriteria))
  }
}
