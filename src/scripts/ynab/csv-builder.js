/**
 * Build a CSV string containing the given transactions.
 * @param  {Transaction[]} transactions
 * @return {string} CSV string
 */
function buildCsv(transactions) {
  let rows = transactions.map((transaction) => {
      return [
        transaction.date,
        transaction.payee,
        '',
        transaction.memo,
        transaction.outflow,
        transaction.inflow
      ].join(',')
    })
  return 'Date,Payee,Category,Memo,Outflow,Inflow\n' + rows.join('\n')
}

module.exports = {
  buildCsv: buildCsv
}
