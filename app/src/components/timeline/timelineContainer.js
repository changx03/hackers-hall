import { push } from 'connected-react-router'
import $ from 'jquery'
import { isEmpty } from 'lodash/lang'
import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as timelineActions from '../../actions/timelineActions'
import * as voteActions from '../../actions/voteActions'
import history from '../../history'
import { getMaxDate, getMinDate } from '../../utils/dateHelper'
import TimelineEventDetails from './eventDetails'
import TimelineEventWelcome from './eventWelcome'
import TimelineInteractions from './interactions'
import Timeline from './timeline'
import TimelineSearchResult from './timelineSearchResult'

class TimelineContainer extends React.Component {
  pathname = null
  state = {
    searchTerms: ''
  }

  static fetchData = [timelineActions.getTimelineItems]

  componentDidMount() {
    const { timelineItems, timelineActions } = this.props
    if (!timelineItems || !timelineItems.length) {
      timelineActions.getTimelineItems()
    }
    this.routeClickHandler()
  }

  routeClickHandler = () => {
    $('#timeline').on('click', 'a', event => {
      event.preventDefault()
      history.push(this.pathname)
    })
  }

  voteForEvent = event => {
    const { user, votingActions, push } = this.props
    const { pathname } = this.props.location
    if (isEmpty(user)) {
      push(`login?returnUrl=${pathname}`)
    } else {
      votingActions.voteForEvent(event, user)
    }
  }

  onStartDateChange = date => {
    const { filterCriteria, timelineActions } = this.props
    timelineActions.updateFilterCriteria({
      ...filterCriteria,
      startDate: moment(date).toDate()
    })
    timelineActions.filterTimelineItemsByDates(filterCriteria.startDate, filterCriteria.endDate)
  }

  onEndDateChange = date => {
    const { filterCriteria, timelineActions } = this.props
    timelineActions.updateFilterCriteria({
      ...filterCriteria,
      endDate: moment(date).toDate()
    })
    timelineActions.filterTimelineItemsByDates(filterCriteria.startDate, filterCriteria.endDate)
  }

  onStackOrientationChange = () => {
    const { filterCriteria, timelineActions } = this.props
    const nextStackOrientation = !filterCriteria.stackOrientation
    timelineActions.updateFilterCriteria({
      ...filterCriteria,
      stackOrientation: nextStackOrientation
    })
  }

  transformTimelineEvents = items =>
    items.map(item => {
      const primaryDetails =
        item.group === 'breach'
          ? `# Records: ${item.records.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
          : `AF: ${item.affiliations ? item.affiliations : 'unknown'}`

      const secondaryDetails =
        item.group === 'breach' ? `Type: ${item.breachType}` : `Targets: ${item.targets}`

      item.className = 'timeline-event'
      item.title = `${item.details[0].substring(0, 35)}...`
      item.content = `
<a class="timeline-event_link" href="timeline/${item._id}">
  <div class="timeline-event_link-heading">
    <h5>${item.name}</h5>
  </div>
  <div class="timeline-event_link-info">
    <div class="timeline-event_link-info-detail">
      <span>${primaryDetails}</span>
    </div>
    <div class="timeline-event_link-info-detail">
      <span>${secondaryDetails}</span>
    </div>
  </div>
</a>`
      return item
    })

  getTimelineDateRange = (timelineEvent = {}, filterCriteria) => {
    const minDate = new Date(filterCriteria.startDate)
    const maxDate = new Date(filterCriteria.endDate)
    const startDate =
      timelineEvent.event && timelineEvent.event.start
        ? new Date(timelineEvent.event.start).subtractDays(180)
        : new Date(filterCriteria.startDate)
    const endDate =
      timelineEvent.event && timelineEvent.event.end
        ? new Date(timelineEvent.event.end).addDays(180)
        : new Date(filterCriteria.endDate)

    return {
      min: minDate,
      max: maxDate,
      start: startDate,
      end: endDate
    }
  }

  getTimelineEvent = (id, events) => {
    const eventDetails = { event: {}, associatedEvents: [] }
    const event = events.find(item => item._id === id)

    if (!event) {
      return eventDetails
    }

    const associatedEvents = event.timelineEvents.map(ae => {
      return events.find(event => event._id === ae)
    })

    return {
      ...eventDetails,
      event,
      associatedEvents: associatedEvents || []
    }
  }

  onSearchCriteriaChange = event => {
    const field = event.target.name
    let state = this.state
    state[field] = event.target.value
    return this.setState({ state })
  }
  submitSearch = () => {
    const { timelineActions } = this.props
    const { searchTerms } = this.state
    timelineActions.filterTimelineItemsBySearchCriteria(searchTerms)
    history.push(`timeline?search=${searchTerms}`)
  }

  render() {
    const { user, votes, filterCriteria, timelineItems = [], location } = this.props
    const params = new URLSearchParams(location.search)
    const search = params.get('search')
    const { event } = this.props.match.params
    const historyPoint = this.getTimelineEvent(event, timelineItems)
    const userEventVotes = votes.length ? votes.filter(vote => vote.voter === user.username) : []
    const augmentedTimelineItems = this.transformTimelineEvents(timelineItems)
    const timelineDates = this.getTimelineDateRange(historyPoint, filterCriteria)
    const options = { ...timelineDates, stack: filterCriteria.stackOrientation }

    return (
      <div className="timeline-container">
        <div className="timeline-events">
          {!event && !search && <TimelineEventWelcome />}
          {event && !search && (
            <TimelineEventDetails
              timelineEvent={historyPoint}
              voteForEvent={this.voteForEvent}
              userEventVotes={userEventVotes}
            />
          )}
          {search && <TimelineSearchResult searchTerms={search} events={timelineItems} />}
        </div>
        <div className="timeline">
          <div className="timeline-info-bar">
            <TimelineInteractions
              filterCriteria={filterCriteria}
              onStartDateChange={this.onStartDateChange}
              onEndDateChange={this.onEndDateChange}
              onStackOrientationChange={this.onStackOrientationChange}
              onSearchCriteriaChange={this.onSearchCriteriaChange}
              submitSearch={this.submitSearch}
              search={this.state.searchTerms}
            />
          </div>
          <Timeline
            timelineItems={augmentedTimelineItems}
            timelineEvent={historyPoint}
            timelineOptions={options}
            activeItemId={historyPoint.event._id}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { timelineItems, filterCriteria, search } = state.timelineState
  const { user, votes } = state.userDataState
  if (!filterCriteria.startDate && filterCriteria.endDate && timelineItems.length) {
    const startDates = timelineItems.map(i => new Date(i.start))
    const endDates = timelineItems.map(i => new Date(i.end))
    filterCriteria.startDate = getMinDate(startDates)
    filterCriteria.endDate = getMaxDate(endDates)
  }

  return {
    timelineItems,
    filterCriteria,
    user,
    votes,
    search
  }
}

const mapDispatchToProps = dispatch => ({
  votingActions: bindActionCreators(voteActions, dispatch),
  timelineActions: bindActionCreators(timelineActions, dispatch),
  push: url => dispatch(push(url))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineContainer)
