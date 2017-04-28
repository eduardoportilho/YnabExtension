/**
 * @typedef {Transaction} YNAB transaction
 * @property {} name - description.
 */

module.exports = {
  /**
   * Build YNAB transactions from the tabular data based on the column info.
   * @param  {array[]} tabularData - Tabular data.
   * @param  {ColumnInfo} columnInfo - Column information.
   * @return {Transaction[]} YNAB transactions.
   */
  createTransactions: (tabularData, columnInfo) => {
    //TODO
    return []
  }
}
