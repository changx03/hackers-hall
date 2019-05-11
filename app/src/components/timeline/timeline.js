import $ from 'jquery'
import PropTypes from 'prop-types'
import React from 'react'
import vis from 'vis'

export default class Timeline extends React.Component {
  timeline = null

  componentDidMount() {
    const { timelineItems, timelineOptions, activeItemId = 0 } = this.props
    this.timeline = this.createTimeline()
    this.updateTimeline(timelineItems, timelineOptions)
    this.activeTimelineItem(activeItemId)
  }

  componentWillReceiveProps(nextProps) {
    const { timelineItems, timelineOptions, activeItemId } = nextProps
    this.updateTimeline(timelineItems, timelineOptions)
    this.activeTimelineItem(activeItemId)
  }

  activeTimelineItem = id => {
    const selector = `div[data-_id='${id}']`
    $('#timeline')
      .find(selector)
      .addClass('active-item')
  }

  itemSelected = props => {
    props.event.preventDefault()
    $('#timeline')
      .find("div[data-_id='2']")
      .addClass('active')
  }

  updateTimeline = (timelineItems, timelineOptions) => {
    const data = new vis.DataSet(timelineItems)
    const options = this.getTimelineOptions(timelineOptions)

    this.timeline.setOptions(options)
    this.timeline.setItems(data)
  }

  getTimelineOptions = options => {
    const timelineOptions = {
      width: '100%',
      editable: false,
      type: 'box',
      align: 'center',
      stack: false,
      maxHeight: 300,
      margin: {
        item: 25
      },
      dataAttributes: ['_id']
    }

    return Object.assign({}, timelineOptions, options)
  }

  createTimeline = () => {
    const container = document.getElementById('timeline')
    const timelineOptions = this.getTimelineOptions()
    const groupOptions = [
      {
        id: 'breach',
        content: 'Breaches',
        className: 'timeline-group'
      },
      {
        id: 'hacker',
        content: 'Hackers',
        className: 'timeline-group'
      }
    ]
    const timeline = new vis.Timeline(container, null, groupOptions, timelineOptions)
    timeline.on('select', this.itemSelected)
    return timeline
  }

  render() {
    return <div id="timeline" />
  }
}

Timeline.propTypes = {
  timelineItems: PropTypes.array.isRequired,
  timelineOptions: PropTypes.object.isRequired,
  activeItemId: PropTypes.number
}
