/**
 * @typedef {YnabTx} YNAB transaction
 * @property {string} date - Date in DD/MM/YYYY format.
 * @property {string} payee - Payee.
 * @property {string} inflow - Inflow with 2 decimal places (could be negative).
 * @property {string} outflow - Outflow with 2 decimal places (could be negative).
 */

module.exports = {
  /**
   * Build YNAB transactions from the tabular data based on the column info.
   * @param  {TabularData} tabularData - Tabular data.
   * @param  {ColumnInfo} columnInfo - Column information.
   * @return {Transaction[]} YNAB transactions.
   */
  createTransactions: (tabularData, columnInfo) => {
    var ynabTxs = []
    for(var row = 0; row < tabularData.data.length; row++) {
      var rowValues = tabularData.data[row]
      try {
        var ynabTx = {}
        //TODO formatDate(date); //Date in DD/MM/YYYY format
        ynabTx.date = rowValues[columnInfo.dateIndex]
        //TODO clearCsvString(payee);
        ynabTx.payee = columnInfo.payeeIndex >= 0 ? rowValues[columnInfo.payeeIndex] : ''
        // TODO formatMoney(inflow);
        ynabTx.inflow = columnInfo.inflowIndex >= 0 ? rowValues[columnInfo.inflowIndex] : ''
        ynabTx.outflow = '' // Ignore outflow, using negative inflow instead
        ynabTxs.push(ynabTx)
      } catch (any) {
        console.log("Ignoring invalid row: (" + rowValues + ")(" + any.message + ")")
      }
    }
    return ynabTxs
  }
}
