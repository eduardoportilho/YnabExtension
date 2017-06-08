import $ from "jquery"
import JsTurbo from 'jsturbo'

/**
 * TODO: repeated, extract to common module
 * Check if this extractor should be used based on the page URL and selection.
 * @param  {string} url.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {boolean}
 */
function canHandleUrl(url, domSelectionRange) {
  try {
    let firstRow = getContainingRow(domSelectionRange.start)
    let lastRow = getContainingRow(domSelectionRange.end)
    let firstRowColCount = firstRow.find('td').length
    let lastRowColCount = lastRow.find('td').length
    return url.includes('itaubankline.itau.com.br') && 
      (firstRowColCount === 9 || lastRowColCount === 9)
  } catch (any) {
    return false
  }
}

/**
 * TODO: repeated, extract to common module
 * Extract tabular (rows and columns) from the selection.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {TabularData} Tabular data.
 * @throws {Error} If no tabular data was found in the selection.
 */
function getTabularDataFromSelection(domSelectionRange) {
  try {
    let firstRow = getContainingRow(domSelectionRange.start)
    let lastRow = getContainingRow(domSelectionRange.end)

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

/**
 * TODO: repeated, extract to common module
 * Get the row that contains the element or throw.
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
function getContainingRow(el) {
    let row = $(el).closest('tr')
    if (row.length <= 0) {
      throw new Error('No containing row')
    }
    return row
}

module.exports = {
  canHandleUrl: canHandleUrl,
  getTabularDataFromSelection: getTabularDataFromSelection
}
