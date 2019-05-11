import { isArray } from 'lodash/lang'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

const AssociatedEvents = ({ associatedEvents }) => {
  const getAssociatedEventType = assoEvents => {
    if (assoEvents && isArray(assoEvents) && assoEvents.length > 0) {
      const isHackers = assoEvents.every(e => e.group === 'hacker')
      if (isHackers) {
        return 'Hackers'
      }
      const isBreaches = assoEvents.every(e => e.group === 'breach')
      if (isBreaches) {
        return 'Breaches'
      }
    }
    // empty events
    return 'Hackers and Breaches'
  }

  return (
    <div className="timeline-event_associated-events">
      <div className="timeline-event_associated-title">
        <h2>Associated {getAssociatedEventType(associatedEvents)}</h2>
      </div>
      <div className="timeline-event_associated-event-details">
        {associatedEvents.map(event => (
          <div key={event._id}>
            <Link to={`timeline/${event._id}`}>
              <div className="associated-events_details">
                <h3> {event.name} </h3>
                <div>
                  {event.details &&
                    event.details.map((detail, i) => <p key={i}>{detail}</p>)}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

AssociatedEvents.prototype = {
  associatedEvents: PropTypes.array.isRequired
}

export default AssociatedEvents
