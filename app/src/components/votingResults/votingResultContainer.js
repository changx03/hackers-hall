import React from 'react'
import { connect } from 'react-redux'
import { getVotingResult } from '../../actions/voteActions'
import VotingResults from './votingResults'

class VotingResultsContainer extends React.Component {
  static fetchData = [getVotingResult]

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
  getVotingResult: () => dispatch(getVotingResult())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VotingResultsContainer)
