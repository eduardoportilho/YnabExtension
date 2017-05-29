/**
 * Build a CSV string containing the given transactions.
 * @param  {Transaction[]} transactions
 * @return {string} CSV string
 */
function buildCsv(transactions) {
  let rows = transactions.map((transaction) => {
      return [
        transaction.date,
        clearCsvString(transaction.payee),
        '',
        transaction.memo,
        transaction.outflow,
        transaction.inflow
      ].join(',')
    })
  return 'Date,Payee,Category,Memo,Outflow,Inflow\n' + rows.join('\n')
}

/**
 * Remove invalid CSV characters.
 * @param  {string} string Original string.
 * @return {string} Clean string.
 */
function clearCsvString(string) {
  return string.replace(/,/g, ';')
}

module.exports = {
  buildCsv: buildCsv,
  //private methods exposed for testing only
  _clearCsvString: clearCsvString
}
