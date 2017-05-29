/**
 * @typedef {YnabTx} YNAB transaction
 * @property {string} date - Date in DD/MM/YYYY format.
 * @property {string} payee - Payee.
 * @property {string} memo - Memo.
 * @property {string} inflow - Inflow with 2 decimal places (could be negative).
 * @property {string} outflow - Outflow with 2 decimal places (could be negative).
 */

import {date, num, str} from 'jsturbo'
import columnFinder from './column-finder'

  /**
   * Build YNAB transactions from the tabular data based on the column info.
   * @param  {TabularData} tabularData - Tabular data.
   * @param  {ColumnInfo} columnInfo - Column information.
   * @return {YnabTx[]} YNAB transactions.
   */
function createTransactions(tabularData, columnInfo) {
  var ynabTxs = []
  for(var row = 0; row < tabularData.data.length; row++) {
    var rowValues = tabularData.data[row]
    var ynabTransaction
    try {
      ynabTransaction = buildTransaction(rowValues, columnInfo)
      ynabTxs.push(ynabTransaction)
    } catch (any) {
      try {
        console.log(`Invalid row, will try again: [${rowValues}] message=[${any.message}]`)
        let rowColumnInfo = columnFinder.getColumnInfoFromRow(rowValues)
        ynabTransaction = buildTransaction(rowValues, rowColumnInfo)
        ynabTxs.push(ynabTransaction)
      } catch (any) {
        console.log(`2nd try failed, ignoring row: message=[${any.message}]`)
      }
    }
  }
  return ynabTxs
}

function buildTransaction(rowValues, columnInfo) {
  let ynabTx = {}
  ynabTx.date = getDate(rowValues, columnInfo)
  ynabTx.payee = getPayee(rowValues, columnInfo)
  ynabTx.inflow = getInflow(rowValues, columnInfo)
  ynabTx.memo = getMemo(rowValues, columnInfo)
  ynabTx.outflow = '' // Ignore outflow, using negative inflow instead
  return ynabTx
}

function getDate (rowValues, columnInfo) {
  if (columnInfo.dateIndex >= 0 && columnInfo.dateIndex < rowValues.length) {
    try {
      var txDate = date.fromString(rowValues[columnInfo.dateIndex])
      return date.toStringDMY(txDate)
    } catch (any) {/* Let it pass and throw the error bellow */}
  }
  throw new Error('No date column.')
}

function getPayee (rowValues, columnInfo) {
  if (columnInfo.payeeIndex >= 0 && columnInfo.payeeIndex < rowValues.length) {
    return rowValues[columnInfo.payeeIndex]  
  }
  throw new Error('No payee column.')
}

function getInflow (rowValues, columnInfo) {
  if (columnInfo.inflowIndex >= 0) {
    let inflowValue = rowValues[columnInfo.inflowIndex]
    let inflow = num.toNumber(inflowValue)
    if (num.isNumber(inflow)) {
      return num.format(inflow, {'decimalPlaces': 2})
    }
  }
  throw new Error('No inflow column.')
}

function getMemo (rowValues, columnInfo) {
  let memo = []
  for (var i = 0; i < rowValues.length; i++) {
    if(columnInfo.inflowIndex !== i &&
      columnInfo.payeeIndex !== i &&
      columnInfo.dateIndex !== i &&
      str.containsAlpha(rowValues[i], 1)) {
      memo.push(rowValues[i])
    }
  }
  return memo.join(';')
}

module.exports = {
  createTransactions: createTransactions,
  //private methods exposed for testing only
  _getInflow: getInflow,
  _getPayee: getPayee,
  _getDate: getDate
}
