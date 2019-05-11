import React from 'react'
import { connect } from 'react-redux'
import { getVotingResult, voteForEvent } from '../../actions/voteActions'
import VotingResults from './votingResults'

class VotingResultsContainer extends React.Component {
  // TODO: How does this work?
  static fetchDate = [getVotingResult]

  componentDidMount() {
    const { votingResults, getVotingResult } = this.props
    if (!votingResults || votingResults.length === 0) {
      getVotingResult()
    }
  }

  render() {
    const { votingResults } = this.props

    return (
      <div className="voting-result-chart">
        <VotingResults votingResults={votingResults} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  votingResults: state.votingResultsState.votingResults
})

const mapDispatchToProps = dispatch => ({
  voteForEvent: (timelineItem, user) =>
    dispatch(voteForEvent(timelineItem, user)),
  getVotingResult: () => dispatch(getVotingResult())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VotingResultsContainer)
