import { createBrowserHistory, createMemoryHistory } from 'history'

const history = typeof window !== 'undefined' && window.document ? createBrowserHistory() : createMemoryHistory()

export default history
