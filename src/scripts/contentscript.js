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
import browserHelper from './utils/browser-helper'

/**
 * Grab the selected elements, extract a YNAB csv out of it and put 
 * it in file for download.
 * @param  {Object} selectionInfo - Info about the user selection
 * @param  {string} [selectionInfo.selectionText] - Text selection
 */
var ynabExportSelection = (selectionInfo) => {
  var selectedElements = selection.getSelectedElements(window)
  var url = browserHelper.getUrl()
  try {
    var ynabCsvString = ynabExporter.generateCsv(selectedElements, url)
    download.createTextFileForDownload(window, ynabCsvString, 'text/csv')
  } catch (error) {
    displayMessage('Export error', error.message)
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
function onRuntimeMessage(message, sender, sendResponse) {
  console.log('ynabExport.contentscript.onMessage')
  if (message.action === 'ynabExportSelection') {
    ynabExportSelection(message.data)
  }
}

/**
 * Display a message to the user.
 * @param  {string} title - Message title.
 * @param  {string} message - Message body.
 */
function displayMessage(title, message) {
  ext.runtime.sendMessage({
    action: 'displayMessage',
    data: {
      'title': title,
      message: message
    }
  })
}

// Listen for messages
ext.runtime.onMessage.addListener(onRuntimeMessage)

// Export function for testing purposes
module.exports = {
  ynabExportSelection: ynabExportSelection,
  onRuntimeMessage: onRuntimeMessage
}
