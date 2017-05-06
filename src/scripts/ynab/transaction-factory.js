/**
 * @typedef {YnabTx} YNAB transaction
 * @property {string} date - Date in DD/MM/YYYY format.
 * @property {string} payee - Payee.
 * @property {string} inflow - Inflow with 2 decimal places (could be negative).
 * @property {string} outflow - Outflow with 2 decimal places (could be negative).
 */

import {date, num} from 'jsturbo'

  /**
   * Build YNAB transactions from the tabular data based on the column info.
   * @param  {TabularData} tabularData - Tabular data.
   * @param  {ColumnInfo} columnInfo - Column information.
   * @return {Transaction[]} YNAB transactions.
   */
function createTransactions(tabularData, columnInfo) {
  var ynabTxs = []
  for(var row = 0; row < tabularData.data.length; row++) {
    var rowValues = tabularData.data[row]
    try {
      var ynabTx = {}
      ynabTx.date = getDate(rowValues, columnInfo)
      ynabTx.payee = getPayee(rowValues, columnInfo)
      ynabTx.inflow = getInflow(rowValues, columnInfo)
      ynabTx.outflow = '' // Ignore outflow, using negative inflow instead
      ynabTxs.push(ynabTx)
    } catch (any) {
      console.log("Ignoring invalid row: (" + rowValues + ")(" + any.message + ")")
    }
  }
  return ynabTxs
}

function getDate (rowValues, columnInfo) {
  var txDate = date.fromString(rowValues[columnInfo.dateIndex])
  return date.toStringDMY(txDate)
}

function getPayee (rowValues, columnInfo) {
  return columnInfo.payeeIndex >= 0 ? rowValues[columnInfo.payeeIndex] : ''
}

function getInflow (rowValues, columnInfo) {
  var inflow = 0
  if (columnInfo.inflowIndex >= 0) {
    inflow = num.toNumber(rowValues[columnInfo.inflowIndex])
  }
  return num.format(inflow, {'decimalPlaces': 2})
}

module.exports = {
  createTransactions: createTransactions
}
