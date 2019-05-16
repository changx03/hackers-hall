import React from 'react'
import PropTypes from 'prop-types'
import { inHTMLData } from 'xss-filters'

const TimelineSearchResult = ({ searchTerms, events }) => (
  <div>
    <div className="timeline-event_banner">
      <div className="timeline-event_details-title">
        <h2 id="search-title">
          <span>Search Results for:</span>{' '}
          {inHTMLData(searchTerms)}
        </h2>
      </div>
    </div>
    <div className="search-results">
      {events.map((e, i) => {
        return (
          <a key={i} href={`timeline/${e._id}`}>
            <div className="search-results_details">
              <h2>{e.name}</h2>
            </div>
          </a>
        )
      })}
    </div>
  </div>
)

TimelineSearchResult.propTypes = {
  searchTerms: PropTypes.string,
  events: PropTypes.array.isRequired
}

export default TimelineSearchResult
