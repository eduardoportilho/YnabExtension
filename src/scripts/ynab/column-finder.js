/**
 * @typedef {ColumnInfo} Description of the columns of tabular data.
 * @property {} name - description.
 */

/**
 * Map a [header type] to an [array of possible header labels].
 */
let POSSIBLE_HEADER_LABELS = {
  date: ['datum', 'date', 'data'],
  payee: ['mottagare', 'transaktion', 'payee', 'descrição', 'histórico', 'lançamento'],
  inflow: ['belopp', 'belopp sek', 'inflow', 'value', 'valor']
};

/**
 * Find information about the columns of tabular data.
 * @param  {TabularData} tabularData - Tabular data.
 * @return {ColumnInfo} Column information.
 */
function getColumnInfo(tabularData, domSelectionRange) {
  //1: header
  if (tabularData.header) {
    var headerTypeIndexes = findHeaderTypeIndexesFromTableHeader(tabularData.header)
  }
  // return exports.findColumnOrderUsingSelectionText(tabularData);
};

/**
 * Find the index of each header type based on the header labels.
 * 
 * Tenta descobrir ordem das colunas a partir dos valores do header
 * @param headerLabels string array, valores do header
 * @returns {*} optional: object[headerType] = index
 */
function findHeaderTypeIndexesFromTableHeader(headerLabels) {
  var columnOrder = {};

  for(var headerType in POSSIBLE_HEADER_LABELS) {
    var possibleHeaderLabels = POSSIBLE_HEADER_LABELS[headerType];
    var index = findBetterMatch(headerLabels, possibleHeaderLabels);
    if(index >= 0) {
      columnOrder[headerType] = index;
    }
  }

  return columnOrder;
};

module.exports = {
  getColumnInfo: getColumnInfo
}
