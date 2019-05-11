import React from 'react'
import PropTypes from 'prop-types'
import AssociatedEvents from './associatedEvents'

const TimelineEventDetails = ({
  timelineEvent,
  userEventVotes,
  voteForEvent
}) => {
  const { event, associatedEvents } = timelineEvent

  const renderCategory = `//${event.group
    .charAt(0)
    .toUpperCase()}${event.group.substr(1)}`

  const userHasCastedVoteType = voteType =>
    userEventVotes && userEventVotes.some(e => e.voteType === voteType)

  const renderVoteButton = !userHasCastedVoteType('popular') ? (
    <div className="timeline-event_vote">
      <button
        className="button button-default button-dark"
        onClick={() => voteForEvent(event)}
      >
        VOTE
      </button>
    </div>
  ) : null

  const renderDetails = event.details.map((d, i) => <p key={i}>{d}</p>)

  const renderSources =
    event.sources && event.sources.length > 0 ? (
      <div className="timeline-event_sources">
        <ul>
          <div>
            <span>sources:&nbsp;</span>
          </div>

          {event.sources.map((source, i) => {
            return (
              <div key={i}>
                <li>
                  <a href={source.link}>{source.name}</a>
                </li>
              </div>
            )
          })}
        </ul>
      </div>
    ) : null

  return (
    <div className="timeline-event-container">
      <div className="timeline-event_details">
        <div className="timeline-event_banner">
          <div className="timeline-event_details-title">
            <h2>
              {renderCategory}
              <span> {event.name}</span>
            </h2>
          </div>
          {renderVoteButton}
        </div>
        <div className="timeline-event_details-text">{renderDetails}</div>
        {renderSources}
      </div>
      {associatedEvents && associatedEvents.length > 0 && (
        <AssociatedEvents associatedEvents={associatedEvents} />
      )}
    </div>
  )
}

TimelineEventDetails.propTypes = {
  timelineEvent: PropTypes.object.isRequired,
  userEventVotes: PropTypes.array.isRequired,
  voteForEvent: PropTypes.func.isRequired
}

export default TimelineEventDetails
