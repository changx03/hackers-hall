import moment from 'moment'

export const timelineState = {
  timelineItems: [],
  isRequested: false,
  error: null,
  filterCriteria: {
    startDate: moment(new Date()).subtract(90, 'd').toDate(),
    endDate: new Date(),
    stackOrientation: false
  }
}

export const registrationState = {
  isAuthenticated: false,
  isRequested: false,
  isRegistered: false,
  error: null,
  registration: {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }
}

export const loginState = {
  isAuthenticated: false,
  isRequested: false,
  error: null,
  creds: {
    username: '',
    password: ''
  }
}

export const userState = {
  user: {},
  votes: []
}

export const voteState = {
  isRequested: false,
  votingResults: [],
  error: null
}
