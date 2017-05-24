import tabular from '../utils/tabular-data'
import columnFinder from './column-finder'
import transactionFactory from './transaction-factory'
import csvBuilder from './csv-builder'
import postProcessors from './processors/post-processors.js'

/**
 * Extract YNAB data from the selection and put it on a CSV string.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {string} CSV string with YNAB data.
 * @throws {Error} If no YNAB data was found in the selection.
 */
function generateCsv(domSelectionRange) {
  let tabularData = tabular.getTabularDataFromSelection(domSelectionRange)
  let columnInfo = columnFinder.getColumnInfo(tabularData, domSelectionRange)
  var transactions = transactionFactory.createTransactions(tabularData, columnInfo)
  transactions = postProcessors.processTransactions(transactions)
  let csv = csvBuilder.buildCsv(transactions)
  return csv
}

module.exports = {
  generateCsv: generateCsv
}
