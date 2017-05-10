import tabular from '../utils/tabular-data'
import columnFinder from './column-finder'
import transactionFactory from './transaction-factory'
import csvBuilder from './csv-builder'


module.exports = {
  /**
   * Extract YNAB data from the selection and put it on a CSV string.
   * @param  {DomSelectionRange} domSelectionRange - selection range.
   * @return {string} CSV string with YNAB data.
   * @throws {Error} If no YNAB data was found in the selection.
   */
  generateCsv: (domSelectionRange) => {
    var tabularData = tabular.getTabularDataFromSelection(domSelectionRange)

    var columnInfo = columnFinder.getColumnInfo(tabularData, domSelectionRange)

    var transactions = transactionFactory.createTransactions(tabularData, columnInfo)

    //ynabPostExtractProcessing.processInplace(ynabTxs)
    
    var csv = csvBuilder.buildCsv(transactions)

    return csv
  }
}
