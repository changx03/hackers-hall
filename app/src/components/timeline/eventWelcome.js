import React from 'react'
import { Link } from 'react-router-dom'

const EventWelcome = () => (
  <div className="timeline-event-container">
    <div className="timeline-event_details">
      <div className="timeline-event_banner">
        <div className="timeline-event_details-title">
          <h2>//Hacker's Hall</h2>
        </div>
      </div>
      <div className="timeline-event_details-text">
        <section>
          <h3>Welcome</h3>
          <p>
            Welcome to Hacker's Hall. A site dedicated to capturing company data
            breaches and infamous hacker's and their nefarious actions.
          </p>
        </section>
        <section>
          <h3>Timeline</h3>
          <p>
            The timeline is grouped into "Breaches" and "Hackers". Interact with
            the timeline to navigate forward and back or zoom and out for a
            dynamic view of historical events. Options exists to filter the
            timeline's date range or orientation of the timeline events.
          </p>
        </section>
        <section>
          <h3>Don't Forget to Vote!</h3>
          <p>
            Cast your vote for most infamous hacker or catastrophic data branch
            while there's still time. Voting event's will change periodically so
            check back often. Don't forget to check the
            <Link to="results"> Voting Results</Link>
          </p>
        </section>
      </div>
    </div>
  </div>
)

export default EventWelcome
