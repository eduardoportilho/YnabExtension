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

/**
 * Get an array of sibling elements from start to end.
 * @param  {jQuery} start - First element of the range.
 * @param  {jQuery} end - Last element of the range.
 * @return {jQuery[]} Array containing the siblings range.
 */
function getSiblingsRange(start, end) {
  if(end.index() < start.index()) {
      let temp = end
      end = start
      start = temp
    }
    let endEl = end.get(0)
    let range = []
    let current = start
    while(current && current.get(0)) {
      range.push(current)
      if(current.get(0) === endEl) {
        break
      }
      current = current.next()
    }
    return range
}

module.exports = {
  getContainerElement: getContainerElement,
  getSiblingsRange: getSiblingsRange
}
