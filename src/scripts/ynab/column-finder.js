/**
 * @typedef {ColumnInfo} Description of the columns of tabular data.
 * @property {} name - description.
 */

/**
 * Map a [header type] to an [array of possible header labels].
 */
let POSSIBLE_HEADER_LABELS = {
  date: ['datum', 'date', 'data'],
  payee: ['mottagare', 'transaktion', 'payee', 'descrição', 'histórico', 'lançamento'],
  inflow: ['belopp', 'belopp sek', 'inflow', 'value', 'valor']
}

/**
 * Find information about the columns of tabular data.
 * @param  {TabularData} tabularData - Tabular data.
 * @return {ColumnInfo} Column information.
 */
function getColumnInfo(tabularData, domSelectionRange) {
  var headerTypeIndexes;
  //1: try using the table header
  if (tabularData.header) {
    headerTypeIndexes = findIndexesFromHeader(tabularData.header)
    // if (isValid(headerTypeIndexes)) { return headerTypeIndexes }
  }

  // 2: try using the table values
  headerTypeIndexes = findIndexesFromValues(tabularData.data)
  // if (isValid(headerTypeIndexes)) { return headerTypeIndexes }
  // 
  throw Error('Could not find column information.')
}

/**
 * Find the index of each header type based on the header labels.
 * 
 * Tenta descobrir ordem das colunas a partir dos valores do header
 * @param headerLabels string array, valores do header
 * @returns {*} optional: object[headerType] = index
 */
function findIndexesFromHeader(headerLabels) {
  var columnOrder = {}

  for(var headerType in POSSIBLE_HEADER_LABELS) {
    var possibleHeaderLabels = POSSIBLE_HEADER_LABELS[headerType]
    var index = findHeaderIndexByLabel(headerLabels, possibleHeaderLabels)
    if(index >= 0) {
      columnOrder[headerType] = index
    }
  }

  return columnOrder
}

/**
 * Given all the table headers, find the index of the header with the label more similar to the provided labels.
 * If two 
 * @param {string[]} tableHeaderLabels - The labels of the headers of the table.
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

  for (var headerIdx = 0  headerIdx < tableHeaderLabels.length  headerIdx++) {
    var headerLabel = tableHeaderLabels[headerIdx]

    // Index of possibleLabelsForHeader is usead as priority (smaller index = higher priority)
    for (var prio = 0  prio < possibleLabelsForHeader.length  prio++) {
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
 * TODO: Move to jsturbo
 * Check if a string contains another string ignoring case.
 * @param  {string} str - String where the search should be executed.
 * @param  {string} searched - String that should be contained.
 * @return {Boolean}
 */
function containsIgnoringCase(str, searched) {
  return str.toLowerCase().indexOf(searched.toLowerCase()) >= 0
}

module.exports = {
  getColumnInfo: getColumnInfo
}
