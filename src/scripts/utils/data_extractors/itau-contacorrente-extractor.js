import $ from "jquery"
import JsTurbo from 'jsturbo'
import domHelper from "../dom-helper"

/**
 * Check if this extractor should be used based on the page URL and selection.
 * @param  {string} url.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {boolean}
 */
function canHandleUrl(url, domSelectionRange) {
  try {
    let firstRowColCount = domHelper.getColumnCount(domSelectionRange.start)
    let lastRowColCount = domHelper.getColumnCount(domSelectionRange.end)
    return url.includes('itaubankline.itau.com.br') && 
      (firstRowColCount === 9 || lastRowColCount === 9)
  } catch (any) {
    return false
  }
}

/**
 * Extract tabular (rows and columns) from the selection.
 * @param  {DomSelectionRange} domSelectionRange - selection range.
 * @return {TabularData} Tabular data.
 * @throws {Error} If no tabular data was found in the selection.
 */
function getTabularDataFromSelection(domSelectionRange) {
  try {
    let firstRow = domHelper.getContainerElement(domSelectionRange.start, 'tr')
    let lastRow = domHelper.getContainerElement(domSelectionRange.end, 'tr')
    let rowRange = domHelper.getSiblingsRange(firstRow, lastRow)
    let tabularData = rowRange.map(getTabularDataFromRow)

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
