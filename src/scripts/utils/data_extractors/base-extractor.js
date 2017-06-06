import tableExtractor from './table-extractor'
import domExtractor from './dom-extractor'
import itauExtractor from './itau-extractor'

/**
 * @typedef {TabularData} Table data.
 * @property {string[][]} data - Table data.
 * @property {string[]} [header] - Header labels.
 */

/**
 * Extract tabular (rows and columns) from the selection.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @param  {String} currentUrl - Current tab url.
 * @return {TabularData} Tabular data.
 * @throws {Error} If no tabular data was found in the selection.
 */
function getTabularDataFromSelection(domSelectionRange, currentUrl) {
  var tabularData = extractData(domSelectionRange, currentUrl)
  if (tabularData === undefined) {
    throw Error('Could not find tabular data.')
  }

  return normalizeTabularData(tabularData)
}

/**
 * Try to extract data from the selection.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @param  {String} currentUrl - Current tab url.
 * @return {TabularData|undefined} Tabular data.
 */
function extractData(domSelectionRange, currentUrl) {
  var tabularData

  if (itauExtractor.canHandleUrl(currentUrl)) {
    return itauExtractor.getTabularDataFromSelection(domSelectionRange)
  }

  try {
    return tableExtractor.getTabularDataFromSelection(domSelectionRange)
  } catch(any) {
    console.log('Could not get tabular data with table extractor', any)
  }

  try {
    return domExtractor.getTabularDataFromSelection(domSelectionRange)
  } catch(any) {
    console.log('Could not get tabular data with DOM extractor', any)
  }
  return undefined
}

/**
 * Make all the rows of the tabular data have the same number of columns, adding empty cells if necessary.
 * @param  {TabularData} tabularData - Tabular data.
 * @return {TabularData} Normalized tabular data.
 */
function normalizeTabularData(tabularData) {
  var colCountMin, colCountMax, row
  for (var i = 0; i < tabularData.data.length; i++) {
    row = tabularData.data[i]
    if (colCountMin === undefined || colCountMin > row.length) {
      colCountMin = row.length
    }
    if (colCountMax === undefined || colCountMax < row.length) {
      colCountMax = row.length
    }
  }
  if (colCountMin === colCountMax) {
    return tabularData
  }

  let columnInfo = getColumnInfo(tabularData, colCountMax)

  for (var i = 0; i < tabularData.data.length; i++) {
    row = tabularData.data[i]
    if (row.length < colCountMax) {
      tabularData.data[i] = padRow(row, colCountMax, columnInfo)
    }
  }
  return tabularData
}

function getColumnInfo(tabularData, colCount) {
  // initialize with {empty: true}
  let columnInfo = Array.apply(null, {length: colCount}).map(() => { return {empty: true}})

  for (var i = 0; i < tabularData.data.length; i++) {
    var row = tabularData.data[i]
    // ignore rows that need padding
    if (row.length < colCount) {
      continue
    }
    for (var col = 0; col < colCount ; col++) {
      if (!isEmpty(row[col])) {
        columnInfo[col] = {empty: false}
      }
    }
  }
  return columnInfo
}

function padRow(row, size, columnInfo) {
  for (var col = 0; col < size ; col++) {
    // pad completed
    if (row.length === size) {
      break
    }

    // reached end of row and still need to pad
    if (row.length < (col + 1)) {
      row.push('')
      continue
    }

    // reached a cell that should be empty but is not and still need to pad
    let shouldBeEmptyCell = columnInfo[col].empty
    let isEmptyCell = isEmpty(row[col])

    if (shouldBeEmptyCell && !isEmptyCell) {
      row.splice(col, 0, '')
    }
  }
  return row
}

function isEmpty(cell) {
  return cell.replace(/\s/g, '').length <= 0
}

module.exports = {
  getTabularDataFromSelection: getTabularDataFromSelection,
  //private methods exposed for testing only
  _normalizeTabularData: normalizeTabularData,
  _padRow: padRow
}
