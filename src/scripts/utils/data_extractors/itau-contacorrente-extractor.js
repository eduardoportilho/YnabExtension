import $ from "jquery"

/**
 * Check if this extractor should be used based on the page URL.
 * @param  {string} url.
 * @return {boolean}
 */
function canHandleUrl(url) {
  return url.includes('itaubankline.itau.com.br')
}

/**
 * Extract tabular (rows and columns) from the selection.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {TabularData} Tabular data.
 * @throws {Error} If no tabular data was found in the selection.
 */
function getTabularDataFromSelection(domSelectionRange) {
  try {
    let start = $(domSelectionRange.start)
    let end = $(domSelectionRange.end)

    let firstRow = start.closest('tr')
    let lastRow = end.closest('tr')

    if(lastRow.index() < firstRow.index()) {
      let temp = lastRow
      lastRow = firstRow
      firstRow = temp
    }

    let lastRowEl = lastRow.get(0)
    let tabularData = []
    let row = firstRow
    while(row && row.get(0)) {
      tabularData.push(getTabularDataFromRow(row))
      if(row.get(0) === lastRowEl) {
        break
      }
      row = row.next()
    }

    return {
      header: ['date', 'payee', 'value'],
      data: tabularData
    }
  } catch (any) {
    throw Error('Could not find tabular data.')
  }
}
/**
 * Extract tabular from a table row.
 * @param {jQuery} row - Table row.
 * @return {string[]} Tabular data.
 */
function getTabularDataFromRow(row) {
  let date = row.find('td:first-child').text().trim()
  let payee = row.find('td:nth-child(4)').text().trim()
  let value = row.find('td:nth-child(6)').text().trim()
  let signal = row.find('td:nth-child(7)').text().trim()
  return [date, payee, `${signal}${value}`]
}

module.exports = {
  canHandleUrl: canHandleUrl,
  getTabularDataFromSelection: getTabularDataFromSelection
}
