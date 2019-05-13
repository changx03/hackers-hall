export default function delayResponse(response, timeout = 1000) {
  if (typeof response !== 'function') {
    throw Error(`Internal error: ${response} is not a function`)
  }
  setTimeout(response, timeout)
}
