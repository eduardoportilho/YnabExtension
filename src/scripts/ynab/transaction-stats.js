/**
 * @typedef {YnabTxStats} Statistics on a list of YNAB transactions.
 * @property {number} inflowPercentage - Percentage of inflow transactions.
 */

import {obj} from 'jsturbo'

/**
 * Generate statistics for a group of transactions.
 * @param  {YnabTx[]} transactions - List of transactions.
 * @return {YnabTxStats} Transactions statistics.
 */
function generateStatistics(transactions) {
  var incomeCount = 0;
  var outcomeCount = 0;

  for(var txIndex = 0 ; txIndex < transactions.length ; txIndex++) {
      var ynabTx = transactions[txIndex];
      if(isIncome(ynabTx)) {
        incomeCount++;
      } else {
        outcomeCount++;
      }
  }
  var inflowPercentage = incomeCount / (transactions.length);
  return {
    inflowPercentage: inflowPercentage
  }
}

/**
 * Check if an transaction is income (positive amount).
 * @param {YnabTx} ynabTx - YNAB transaction
 * @return {Boolean} true if the transaction amount is positive.
 */
function isIncome(ynabTx) {
  if (!obj.isEmpty(ynabTx.inflow)) {
    return ynabTx.inflow.charAt(0) !== '-'
  } 
  else if (!obj.isEmpty(ynabTx.outflow)) {
    return ynabTx.outflow.charAt(0) === '-'
  }
  return true
}

module.exports = {
  generateStatistics: generateStatistics,
  isIncome: isIncome
}
