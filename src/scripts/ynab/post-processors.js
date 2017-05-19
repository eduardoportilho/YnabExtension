import transactionStats from './transaction-stats'
import {obj} from 'jsturbo'

/**
 * List of post-processors
 * @type {Object}
 */
const POST_PROCESSORS = {
  /**
   * If more than X% of the transactions are inflows, probably they are from a credit card account.
   * In this case we want to invert the signal of the inflow.
   * @param {YnabTx[]} transactions - Transactions before processing.
   * @param {YnabTxStats} stats     - Transactions statistics.
   * @return {YnabTx[]} Processed YNAB transaction
   */
  'invert inflow signal of credit card transactions': (transactions, stats) => {
    if (stats.inflowPercentage > 0.6) {
      return transactions.map(invertTxAmountSignal)
    } else {
      return transactions 
    }
  }
}

/**
 * Invert the signal of a transaction amount
 * @param  {YnabTx} transaction - Transaction.
 * @return {YnabTx} Transaction with the inverted amount.
 */
function invertTxAmountSignal(ynabTx) {
  if (!obj.isEmpty(ynabTx.inflow)) {
    ynabTx.inflow = invertNumberStringSignal(ynabTx.inflow)
  }
  else if (!obj.isEmpty(ynabTx.outflow)) {
    ynabTx.outflow = invertNumberStringSignal(ynabTx.outflow)
  }
  return ynabTx
}

/**
 * Invert the signal of the number in the provided string
 * @param  {string} numberString - Number as string
 * @return {string} Number with the inverted signal as string
 */
function invertNumberStringSignal(numberString) {
  if (numberString.charAt(0) === '-') {
    return numberString.replace(/\-/g, '')
  } else {
    return '-' + numberString
  }
}

/**
 * Execute all post-processors on the original transactions.
 * @param  {YnabTx[]} transactions - Original transactions.
 * @return {YnabTx[]} Processed YNAB transaction
 */
function processTransactions(transactions) {
  let stats = transactionStats.generateStatistics(transactions)
  var processedTransactions = transactions
  for (let key in POST_PROCESSORS) {
    processedTransactions = POST_PROCESSORS[key](processedTransactions, stats)
  }
  return processedTransactions
}

module.exports = {
  processTransactions: processTransactions
}
