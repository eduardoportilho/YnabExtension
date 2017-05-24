import table from './table-tabular-data'
import div from './div-tabular-data'
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
  var tabularData
  try {
    tabularData = table.getTabularDataFromSelection(domSelectionRange)
  } catch(any) {}

  try {
    if (tabularData === undefined) {
      tabularData = div.getTabularDataFromSelection(domSelectionRange)
    }
  } catch(any) {}

  if (tabularData === undefined) {
    throw Error('Could not find tabular data.')
  }

  return normalizeTabularData(tabularData)
}

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

  //TODO continuar normalizando...
}

module.exports = {
  getTabularDataFromSelection: getTabularDataFromSelection,
  //private methods exposed for testing only
  _normalizeTabularData: normalizeTabularData
}
