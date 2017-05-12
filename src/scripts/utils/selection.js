/**
 * @typedef {DomSelectionRange} DOM elements of a selection range
 * @property {Element} start - Element on the beginning of the selection.
 * @property {Element} end - Element on the end of the selection.
 */

module.exports = {
  /**
   * Get the DOM elements contained in the user selection.
   * @param  {Window} aWindow - Window object.
   * @return {DomSelectionRange} Selection range.
   */
  getSelectedElements: (aWindow) => {
    // Selection object: https://developer.mozilla.org/en-US/docs/Web/API/Selection
    var selection = aWindow.getSelection()

    var startNode = selection.anchorNode || selection.extentNode
    var endNode = selection.focusNode  || selection.baseNode

    return {
      start: startNode.parentElement,
      end: endNode.parentElement
    }
  }
}
