import transactionStats from '../transaction-stats'
import invertCreditCard from './invert-credit-card'

/**
 * List of post-processors
 * @type {Object}
 */
const POST_PROCESSORS = [
  invertCreditCard
]

/**
 * Execute all post-processors on the original transactions.
 * @param  {YnabTx[]} transactions - Original transactions.
 * @return {YnabTx[]} Processed YNAB transaction
 */
function processTransactions(transactions) {
  let stats = transactionStats.generateStatistics(transactions)
  var processedTransactions = transactions
  for (var i = 0 ; i < POST_PROCESSORS.length ; i++) {
    var processor = POST_PROCESSORS[i]
    if (processor.shouldApply(processedTransactions, stats)) {
      processedTransactions = processor.processTransactions(processedTransactions, stats)
    }
  }
  return processedTransactions
}

module.exports = {
  processTransactions: processTransactions
}
