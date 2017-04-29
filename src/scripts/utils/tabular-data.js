import $ from "jquery"

/**
 * Extract tabular (rows and columns) from the selection.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {string[][]} Tabular data.
 * @throws {Error} If no tabular data was found in the selection.
 */
function getTabularDataFromSelection(domSelectionRange) {
    if (isSelectionInsideTable(domSelectionRange)) {
      return getTabularDataFromTable(domSelectionRange)
    }
    throw Error('Could not find tabular data.')
}

/**
 * Check if the selection is inside of a <table>.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {Boolean} true if the selection is inside of a <table>.
 */
function isSelectionInsideTable(domSelectionRange) {
  var elStart = $(domSelectionRange.start)
  var elEnd = $(domSelectionRange.end)
  return (elStart.is('tr') || elStart.closest('tr').length > 0) &&
         (elEnd.is('tr') || elEnd.closest('tr').length > 0)
}

/**
 * Extract tabular (rows and columns) from a selection inside a <table>.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {string[][]} Tabular data.
 */
function getTabularDataFromTable(domSelectionRange) {
    var rowA = $(domSelectionRange.start).closest('tr')
    var rowB = $(domSelectionRange.end).closest('tr')

    var indexA = rowA.index()
    var indexB = rowB.index()

    var row = (indexA <= indexB) ? rowA : rowB
    var lastRowIndex = (indexB > indexA) ? indexB : indexA

    var rows = [], rowContent
    while(row.length > 0 && row.index() <= lastRowIndex) {
        rowContent = []

        row.find('td').each(function(idx, el) {
            rowContent.push($(el).text().trim())
        })
        rows.push(rowContent)
        row = row.next()
    }
    return rows
}

module.exports = {
  getTabularDataFromSelection: getTabularDataFromSelection
}