/**
 * @typedef {YnabTxStats} Statistics on a list of YNAB transactions.
 * @property {number} inflowPercentage - Percentage of inflow transactions.
 */

/**
 * List of post-processors
 * @type {Object}
 */
const POST_PROCESSORS = {
  /**
   * If more than X% of the transactions are inflows, probably they are from a credit card account.
   * In this case we want to invert the signal of the inflow.
   * @param  {YnabTx[]} transactions - Transactions before processing.
   * @param  {YnabTxStats} stats     - Transactions statistics.
   * @return {YnabTx[]} Processed YNAB transaction
   */
  'invert inflow signal of credit card transactions': (transactions, stats) => {
    return transactions
  }
}

/**
 * Execute all post-processors on the original transactions.
 * @param  {YnabTx[]} transactions - Original transactions.
 * @return {YnabTx[]} Processed YNAB transaction
 */
function processTransactions(transactions) {
  let stats = {}; // TODO create tx stats
  var processedTransactions = transactions
  for (let key in POST_PROCESSORS) {
    processedTransactions = POST_PROCESSORS[key](processedTransactions, stats)
  }
  return processedTransactions
}

module.exports = {
  processTransactions: processTransactions
}
