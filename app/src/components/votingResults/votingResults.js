import React from 'react'
import PropTypes from 'prop-types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const VotingResults = ({ votingResults }) => (
  <ResponsiveContainer minHeight={95}>
    <BarChart
      data={votingResults}
      margin={{ top: 20, right: 30, left: 210, bottom: 5 }}
      layout="vertical"
    >
      <XAxis type="number" />
      <YAxis type="category" dataKey="name" />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#CB0C6C" />
    </BarChart>
  </ResponsiveContainer>
)

VotingResults.propTypes = {
  votingResults: PropTypes.array.isRequired
}

export default VotingResults
