import baseExtractor from '../utils/data_extractors/base-extractor'
import columnFinder from './column-finder'
import transactionFactory from './transaction-factory'
import csvBuilder from './csv-builder'
import postProcessors from './processors/post-processors'

/**
 * Extract YNAB data from the selection and put it on a CSV string.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @param  {String} currentUrl - Current tab url.
 * @return {string} CSV string with YNAB data.
 * @throws {Error} If no YNAB data was found in the selection.
 */
function generateCsv(domSelectionRange, currentUrl) {
  let tabularData = baseExtractor.getTabularDataFromSelection(domSelectionRange, currentUrl)
  let columnInfo = columnFinder.getColumnInfo(tabularData, domSelectionRange)
  var transactions = transactionFactory.createTransactions(tabularData, columnInfo)
  transactions = postProcessors.processTransactions(transactions)
  let csv = csvBuilder.buildCsv(transactions)
  return csv
}

module.exports = {
  generateCsv: generateCsv
}
