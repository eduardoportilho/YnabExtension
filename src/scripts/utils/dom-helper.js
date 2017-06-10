import $ from "jquery"

/**
 * Get the parent that contains the element or throw.
 * @param  {Element} el - Contained element.
 * @param  {string} selector - Container selector.
 * @return {Element} Container.
 */
function getContainerElement(el, selector) {
    let row = $(el).closest(selector)
    if (row.length <= 0) {
      throw new Error('No container element matched the selector.')
    }
    return row
}

module.exports = {
  getContainerElement: getContainerElement
}
