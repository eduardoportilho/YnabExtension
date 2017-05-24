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
  try {
    return table.getTabularDataFromSelection(domSelectionRange)
  } catch(any) {}

  try {
    return div.getTabularDataFromSelection(domSelectionRange)
  } catch(any) {}
  
  throw Error('Could not find tabular data.')
}

module.exports = {
  getTabularDataFromSelection: getTabularDataFromSelection
}
