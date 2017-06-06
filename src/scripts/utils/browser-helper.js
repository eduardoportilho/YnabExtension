/**
 * Get the current URL.
 * @return {string} URL.
 */
function getUrl() {
  return window.location.toString()
}

module.exports = {
  getUrl: getUrl
}
