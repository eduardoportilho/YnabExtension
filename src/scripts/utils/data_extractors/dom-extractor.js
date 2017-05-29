import $ from "jquery"

function getTabularDataFromSelection(domSelectionRange) {
  try {
    let start = $(domSelectionRange.start)
    let end = $(domSelectionRange.end)

    let ancestor = getClosestCommonAncestor(start, end)

    var firstRow = getFirstChildThatContains(ancestor, start)
    if (firstRow.length < 1) {
      firstRow = ancestor
    }
    var lastRow = getFirstChildThatContains(ancestor, end)
    if (lastRow.length < 1) {
      lastRow = firstRow
    }

    if(lastRow.index() < firstRow.index()) {
      let temp = lastRow
      lastRow = firstRow
      firstRow = temp
    }

    let lastRowEl = lastRow.get(0)
    var tabularData = []
    var row = firstRow
    while(row && row.get(0)) {
      tabularData.push(getChildrenTextAsArray(row))
      if(row.get(0) === lastRowEl) {
        break
      }
      row = row.next()
    }
    return {data: tabularData}
  } catch (any) {
    throw Error('Could not find tabular data.')
  }
}

/**
 * Flatten the element children and return it's text content in an array;
 * @param  {jQuery} jqElement - Parent jQuery element.
 * @return {string[]} Text content of the children.
 */
function getChildrenTextAsArray(jqElement) {
  let leafNodes = jqElement.find('*').filter(function() {
        return $(this).children().length === 0
     }
  )
  return leafNodes.toArray().map((el) => $(el).text())
}

/**
 * Find the direct children of parentJqElement that contains descendantJqElement in it's descendants.
 * @param  {jQuery} parentJqElement - Parent jQuery element.
 * @param  {jQuery} descendantJqElement - JQuery element contained in the parent's descendants.
 * @return {jQuery|undefined} JQuery element or undefined if not a descendant.
 */
function getFirstChildThatContains(parentJqElement, descendantJqElement) {
  return parentJqElement.children().has(descendantJqElement).first()
}

/**
 * Find the closest element that is a parent of both provided elements.
 * @param  {jQuery} jqElement1 - JQuery element.
 * @param  {jQuery} jqElement2 - JQuery element.
 * @return {jQuery}
 */
function getClosestCommonAncestor(jqElement1, jqElement2) {
  // https://stackoverflow.com/questions/3960843/how-to-find-the-nearest-common-ancestors-of-two-or-more-nodes#answer-7648323
  // node1 parents that contain node2 in it's children
  let commonAncestors = jqElement1.parents().has(jqElement2)
  // The list is sorted by distance from node1
  return commonAncestors.first()
}

module.exports = {
  getTabularDataFromSelection: getTabularDataFromSelection,
  //private methods exposed for testing only
  _getClosestCommonAncestor: getClosestCommonAncestor,
  _getFirstChildThatContains: getFirstChildThatContains,
  _getChildrenTextAsArray: getChildrenTextAsArray
}
