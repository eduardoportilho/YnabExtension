/**
 *  A content script is some JavaScript that executes in the context 
 *  of a page that's been loaded into the browser. Think of a content 
 *  script as part of that loaded page, not as part of the extension 
 *  it was packaged with (its parent extension).
 */

import ext from './utils/ext'
import selection from './utils/selection'
import download from './utils/download'
import ynabExporter from './ynab/exporter'

/**
 * Grab the selected elements, extract a YNAB csv out of it and put 
 * it in file for download.
 * @param  {Object} selectionInfo - Info about the user selection
 * @param  {string} [selectionInfo.selectionText] - Text selection
 */
var ynabExportSelection = (selectionInfo) => {
  var selectedElements = selection.getSelectedElements(window)
  try {
    var ynabCsvString = ynabExporter.generateCsv(selectedElements)
    download.createTextFileForDownload(window, ynabCsvString, 'text/csv')
  } catch (error) {
    //TODO Show message
  }
}

/**
 * Message listener
 * @param  {Object} message - Message
 * @param  {string} message.action - Action to be performed
 * @param  {Object} [message.data] - Action data
 * @param  {MessageSender} sender - Message sender
 * @param  {function} sendResponse - Function to call (at most once) 
 * when you have a response. The argument should be any JSON-ifiable object.
 *
 * @see  https://developer.chrome.com/extensions/runtime#event-onMessage
 */
function onMessage(message, sender, sendResponse) {
  if (message.action === 'ynabExportSelection') {
    ynabExportSelection(message.data)
  }
}

ext.runtime.onMessage.addListener(onMessage)

// Export function for testing purposes
module.exports = {
  ynabExportSelection: ynabExportSelection,
  onMessage: onMessage
}
