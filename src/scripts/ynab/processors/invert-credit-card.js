/**
 * Invert credit card transactions:
 * If most of the transactions are positive, they are likely to belong to a credit card statement.
 * Credit card transactions are outflows, so the signal should be negative.
 */

import {obj, str} from 'jsturbo'

/**
 * Check if the processor should be applied.
 * @param {YnabTx[]} transactions - Transactions before processing.
 * @param {YnabTxStats} stats     - Transactions statistics.
 * @return {Boolean}
 */
function shouldApply(transactions, stats) {
  return stats.inflowPercentage > 0.6
}

/**
 * Apply the processor.
 * @param {YnabTx[]} transactions - Transactions before processing.
 * @param {YnabTxStats} stats     - Transactions statistics.
 * @return {YnabTx[]} Processed YNAB transaction
 */
function processTransactions(transactions, stats) {
  return transactions.map(invertTxAmountSignal)
}

/**
 * Invert the signal of a transaction amount
 * @param  {YnabTx} ynabTx - Transaction.
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
  } else if(str.toNumber(numberString) === 0.0) {
    return numberString
  } else {
    return '-' + numberString
  }
}

module.exports = {
  shouldApply: shouldApply,
  processTransactions: processTransactions,
  //private methods exposed for testing only
  _invertTxAmountSignal: invertTxAmountSignal,
  _invertNumberStringSignal: invertNumberStringSignal
}
