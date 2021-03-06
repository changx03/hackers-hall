import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import DatePicker from 'react-datepicker'

const Interactions = ({
  filterCriteria,
  onStartDateChange,
  onEndDateChange,
  onStackOrientationChange,
  onSearchCriteriaChange,
  search,
  submitSearch
}) => {
  return (
    <div className="timeline-info-bar_filter-criteria">
      <div className="search-criteria">
        <input
          type="text"
          name="searchTerms"
          onChange={onSearchCriteriaChange}
          value={search}
          placeholder="Search"
        />
        <button onClick={submitSearch} className="btn btn-primary" tabIndex="6">
          Search
        </button>
      </div>
      <div className="filter-criteria">
        <label htmlFor="stackedOrientation">Stack Events?</label>
        <input
          type="checkbox"
          name="stackedOrientation"
          checked={filterCriteria.stackOrientation}
          onChange={onStackOrientationChange}
        />
      </div>
      <div className="filter-criteria">
        <label htmlFor="startDate">From</label>
        <DatePicker
          selected={moment(filterCriteria.startDate).toDate()}
          onChange={onStartDateChange}
          name="startDate"
        />
      </div>
      <div className="filter-criteria">
        <label htmlFor="endDate">To</label>
        <DatePicker
          selected={moment(filterCriteria.endDate).toDate()}
          onChange={onEndDateChange}
          name="endDate"
        />
      </div>
    </div>
  )
}

Interactions.propTypes = {
  filterCriteria: PropTypes.object.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onStackOrientationChange: PropTypes.func.isRequired,
  onSearchCriteriaChange: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  submitSearch: PropTypes.func.isRequired,
}

export default Interactions
