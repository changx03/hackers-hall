import { isArray } from 'lodash/lang'

export function getMinDate(dates) {
  if (!isArray(dates) || dates.length === 0) {
    return
  }

  return dates.reduce((a, b) => (a < b ? a : b))
}

export function getMaxDate(dates) {
  if (!isArray(dates) || dates.length === 0) {
    return
  }

  return dates.reduce((a, b) => (a > b ? a : b))
}

