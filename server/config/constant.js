export const collections = {
  TimelineItems: 'timeline_items',
  Users: 'users',
  EventVotes: 'event_votes',
  LoginAttempt: 'login_attempts'
}

/**
 * InternalServerError returns friendly message to client for any database error
 * We don't want to return actual database error back to client.
 */
export class InternalServerError extends Error {
  constructor(message) {
    super(message || 'Server is not available. Please try again later.')
  }
}
