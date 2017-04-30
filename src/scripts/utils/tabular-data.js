import $ from "jquery"

/**
 * @typedef {TabularData} Table data.
 * @property {string[][]} data - Table data.
 * @property {string[]} [header] - Header labels.
 */

/**
 * Extract tabular (rows and columns) from the selection.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {TabularData} Tabular data.
 * @throws {Error} If no tabular data was found in the selection.
 */
function getTabularDataFromSelection(domSelectionRange) {
    if (isSelectionInsideTable(domSelectionRange)) {
      var tableData = getTableDataFromSelection(domSelectionRange)
      var headerData = getHeaderDataFromSelection(domSelectionRange)
      return {
        'data': tableData,
        'header': headerData
      }
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
 * Extract data (rows and columns) from a selection inside a <table>.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {string[][]} Tabular data.
 */
function getTableDataFromSelection(domSelectionRange) {

  var table = $(domSelectionRange.start).closest('table')
  if (table.length <= 0) {
    table = $(domSelectionRange.end).closest('table')
  }
  if (table.length <= 0) {
    throw Error('Could not find tabular data.')
  }

  var startRow = $(domSelectionRange.start).closest('tr')
  if (startRow.length <= 0) {
    //ignore <tr><th>...
    startRow = table.find('tr td').first().parent()
  }

  var endRow = $(domSelectionRange.end).closest('tr')
  if (endRow.length <= 0) {
    endRow = table.find('tr').last()
  }

  if (startRow.index() > endRow.index()) {
    var temp = startRow
    startRow = endRow
    endRow = temp
  }

  var row = startRow
  var lastRowIndex = endRow.index()

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

/**
 * Extract data from the header of the <table>. This method consider 
 * header the first <th> or <tr> row.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {string[][]|undefined} Header data or undefined, if not found.
 */
function getHeaderDataFromSelection(domSelectionRange) {
    var table = $(domSelectionRange.start).closest('table')
    if (table.length === 0) {
      table = $(domSelectionRange.end).closest('table')
    }
    if (table.length === 0) {
      return undefined
    }

    // 1st try: first <th> row
    var th = table.find('th')
    if (th.length > 0) {
      // only 1st th row
      var headerCols = th.first().parent().find('th')
      var headerVals = headerCols.map(function(i, el){
          return jQuery(el).text()
      }).get()
      return headerVals
    }

    //2nd try: first <tr> row
    var firstRow = table.find('tr:first')
    if (firstRow.length > 0) {
      var headerCols = firstRow
        .find('td')
        .filter(function(i,td) {
          //ignore td with children
          return jQuery(td).children().length === 0
        })
      var headerVals = headerCols.map(function (i, el) {
          return jQuery(el).text()
      }).get()
      return headerVals
    }
    return undefined
}

module.exports = {
  getTabularDataFromSelection: getTabularDataFromSelection,
  //private methods exposed for testing only
  _isSelectionInsideTable: isSelectionInsideTable,
  _getTableDataFromSelection: getTableDataFromSelection,
}
