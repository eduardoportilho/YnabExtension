/**
 * Check if the processor should be applied.
 * @param {YnabTx[]} transactions - Transactions before processing.
 * @param {YnabTxStats} stats     - Transactions statistics.
 * @return {Boolean}
 */
function shouldApply(transactions, stats) {
  return true
}
/**
 * Apply the processor.
 * @param {YnabTx[]} transactions - Transactions before processing.
 * @param {YnabTxStats} stats     - Transactions statistics.
 * @return {YnabTx[]} Processed YNAB transaction
 */
function processTransactions(transactions, stats) {
  return transactions.map(clearTransactionTexts)
}

/**
 * Clear all texts on the transaction
 * @param  {YnabTx} ynabTx - Transaction.
 * @return {YnabTx} Transaction with cleared texts.
 */
function clearTransactionTexts(ynabTx) {
  ynabTx.memo = clearText(ynabTx.memo)
  ynabTx.payee = clearText(ynabTx.payee)
  return ynabTx
}

/**
 * Remove invalid CSV characters.
 * @param  {string} string Original string.
 * @return {string} Clean string.
 */
function clearText(string) {
  var processed = string.replace(/,/g, ';')
  processed = processed.replace(/\s+/g, ' ')
  return processed
}

module.exports = {
  shouldApply: shouldApply,
  processTransactions: processTransactions
}
