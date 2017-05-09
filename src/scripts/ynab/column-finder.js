import JsTurbo from 'jsturbo'

/**
 * @typedef {ColumnInfo} Description of the columns of tabular data.
 * @property {number} dateIndex - Date index.
 * @property {number} payeeIndex - Payee index.
 * @property {number} inflowIndex - Inflow index.
 */

/**
 * Map a [header type] to an [array of possible header labels].
 */
let POSSIBLE_HEADER_LABELS = {
  dateIndex: ['datum', 'date', 'data'],
  payeeIndex: ['mottagare', 'transaktion', 'payee', 'descrição', 'histórico', 'lançamento'],
  inflowIndex: ['belopp', 'belopp sek', 'inflow', 'value', 'valor']
}

/**
 * Find information about the columns of tabular data.
 * @param  {TabularData} tabularData - Tabular data.
 * @return {ColumnInfo} Column information.
 */
function getColumnInfo(tabularData) {
  var columnInfo;
  //1: try using the table header
  if (tabularData.header) {
    columnInfo = findIndexesFromHeader(tabularData.header)
    if (isValid(columnInfo)) {
      return columnInfo
    }
  }

  // 2: try using the table values
  if (tabularData.data) {
    columnInfo = findIndexesFromValues(tabularData.data)
    if (isValid(columnInfo)) {
      return columnInfo
    }
  }
  throw Error('Could not find column information.')
}

/**
 * Find the index of each header type based on the header labels.
 * @param {string[]} tableHeaderLabels - Labels on the table headers.
 * @return {ColumnInfo} Column information.
 */
function findIndexesFromHeader(tableHeaderLabels) {
  var columnInfo = {}
  for(var headerType in POSSIBLE_HEADER_LABELS) {
    var possibleHeaderLabels = POSSIBLE_HEADER_LABELS[headerType]
    var index = findHeaderIndexByLabel(tableHeaderLabels, possibleHeaderLabels)
    if(index >= 0) {
      columnInfo[headerType] = index
    }
  }
  return columnInfo
}

/**
 * Find the index of each header type based on the table values.
 * @param {string[]} tableValues - Table values.
 * @return {ColumnInfo} Column information.
 */
function findIndexesFromValues(tableValues) {
  var row = tableValues[0]
  var columnInfo = {}

  for (var i = 0; i < row.length; i++) {
    if (JsTurbo.date.isDate(row[i])) {
      columnInfo.dateIndex = i
      break
    }
  }

  for (i = 0; i < row.length; i++) {
    if (i === columnInfo.dateIndex) {
      continue
    }

    if (JsTurbo.str.isNumber(row[i])) {
      columnInfo.inflowIndex = i
      break
    }
  }

  for (i = 0; i < row.length; i++) {
    if (i === columnInfo.dateIndex ||
      i === columnInfo.inflowIndex) {
      continue
    }

    // Payee: at least 3 letters
    if (JsTurbo.str.containsAlpha(row[i], 3)) {
      columnInfo.payeeIndex = i
      break
    }
  }
  return columnInfo
}

/**
 * Given all the table headers, find the index of the header with the label more similar to the provided labels. 
 * @param {string[]} tableHeaderLabels - Labels on the table headers.
 * @param {string[]} possibleLabelsForHeader - Possible labels for the searched header (in decrescent order of priority).
 * @return {number|undefined} Index of the header or undefined, if not found.
 * 
 * Example: find the 'inflow' header index
 * - tableHeaderLabels = ['date', 'Amount', 'Balance $']
 * - possibleLabelsForHeader = ['total', 'amount', 'value', '$']
 * Returns 1, since there were 2 matches ('Amount' ~ 'amount' and 'Balance $' ~ '$'), but the first had greater priority.
 */
function findHeaderIndexByLabel(tableHeaderLabels, possibleLabelsForHeader) {
  var bestMatch = undefined

  for (var headerIdx = 0; headerIdx < tableHeaderLabels.length; headerIdx++) {
    var headerLabel = tableHeaderLabels[headerIdx]

    // Index of possibleLabelsForHeader is usead as priority (smaller index = higher priority)
    for (var prio = 0; prio < possibleLabelsForHeader.length; prio++) {
      var possibleHeader = possibleLabelsForHeader[prio]

      if(containsIgnoringCase(headerLabel, possibleHeader)) {
        //match!
        if (bestMatch === undefined || prio < bestMatch.prio) {
          bestMatch = {
            prio: prio,
            index: headerIdx
          }
        }
      }
    }
  }
  if (bestMatch === undefined) {
    return undefined
  }
  return bestMatch.index
}

/**
 * Check if the column info is valid.
 * @param  {ColumnInfo} Column information.
 * @return {Boolean}
 */
function isValid (columnInfo) {
  // Required indexes
  if (!(columnInfo.dateIndex >= 0) ||
    !(columnInfo.inflowIndex >= 0)) {
    return false
  }

  // Indexes should be unique
  if(columnInfo.inflowIndex === columnInfo.dateIndex ||
    columnInfo.inflowIndex === columnInfo.payeeIndex ||
    columnInfo.dateIndex === columnInfo.payeeIndex) {
    return false
  }
  return true
}

/**
 * Check if a string contains another string ignoring case.
 * @param  {string} str - String where the search should be executed.
 * @param  {string} searched - String that should be contained.
 * @return {Boolean}
 */
function containsIgnoringCase(str, searched) {
  return str.toLowerCase().indexOf(searched.toLowerCase()) >= 0
}

module.exports = {
  getColumnInfo: getColumnInfo,
  //private methods exposed for testing only
  _containsIgnoringCase: containsIgnoringCase,
  _isValid: isValid,
  _findHeaderIndexByLabel: findHeaderIndexByLabel,
  _findIndexesFromValues: findIndexesFromValues,
  _findIndexesFromHeader: findIndexesFromHeader
}
