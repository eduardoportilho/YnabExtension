/**
 * A common need for extensions is to have a single long-running
 * script to manage some task or state. Background pages to the rescue.
 */

import ext from './utils/ext'

/**
 * Handle context menu selection click.
 * 
 * @param  {Object} info - Information about the item clicked and the context where the click happened.
 * @param  {integer|string} info.menuItemId - The ID of the menu item that was clicked.
 * @param  {integer|string} [info.parentMenuItemId] - The parent ID, if any, for the item clicked.
 * @param  {string} [info.mediaType] - One of 'image', 'video', or 'audio' if the context menu was activated on one of these types of elements.
 * @param  {string} [info.linkUrl] - If the element is a link, the URL it points to.
 * @param  {string} [info.srcUrl] - Will be present for elements with a 'src' URL.
 * @param  {string} [info.pageUrl] - The URL of the page where the menu item was clicked. This property is not set if the click occured in a context where there is no current page, such as in a launcher context menu.
 * @param  {string} [info.frameUrl] - The URL of the frame of the element where the context menu was clicked, if it was in a frame.
 * @param  {integer} [info.frameId] - The ID of the frame of the element where the context menu was clicked, if it was in a frame.
 * @param  {string} [info.selectionText] - The text for the context selection, if any.
 * @param  {boolean} [info.editable] - A flag indicating whether the element is editable (text input, textarea, etc.).
 * @param  {boolean} [info.wasChecked] - A flag indicating the state of a checkbox or radio item before it was clicked.
 * @param  {boolean} [info.checked] - A flag indicating the state of a checkbox or radio item after it is clicked.
 * @param  {tabs.Tab} tab - The details of the tab where the click took place. Note: this parameter only present for extensions.
 * @param  {integer} [tab.id] - The ID of the tab. Tab IDs are unique within a browser session. Under some circumstances a Tab may not be assigned an ID, for example when querying foreign tabs using the sessions API, in which case a session ID may be present. Tab ID can also be set to chrome.tabs.TAB_ID_NONE for apps and devtools windows.
 * @param  {integer} tab.index - The zero-based index of the tab within its window.
 * @param  {boolean} tab.active - Whether the tab is active in its window. (Does not necessarily mean the window is focused.)
 * @param  {integer} tab.windowId - The ID of the window the tab is contained within.
 *
 * @see  https://developer.chrome.com/extensions/contextMenus#property-createProperties-onclick
 */
function ynabExportSelection(info, tab) {
  ext.tabs.sendMessage(tab.id, {
    'action': 'ynabExportSelection',
    'data': {
      'selectionText': info.selectionText
    }
  })
}

/**
 * Message listener
 * @param  {Object} message - Message
 * @param  {string} message.action - Action to be performed
 * @param  {Object} [message.data] - Action data
 * @param  {MessageSender} sender - Message sender
 *
 * @see  https://developer.chrome.com/extensions/runtime#event-onMessage
 */
function onRuntimeMessage(message, sender) {
  if (message.action === 'displayMessage') {
    displayMessage(message.data.title, message.data.message)
  }
}

/**
 * Display a message to the user.
 * @param  {string} title - Message title.
 * @param  {string} message - Message body.
 */
function displayMessage(title, message) {
  ext.notifications.create('ynab.export.error', {
    type: 'basic',
    title: title,
    message: message,
    iconUrl: ext.runtime.getURL('icons/icon-48.png')
  })
}

// Create the context menu entry
ext.contextMenus.create({
  "title": "Export to YNAB",
  "contexts":["selection"],
  "onclick": ynabExportSelection
})

// Listen for messages
ext.runtime.onMessage.addListener(onRuntimeMessage)

// Export functions for testing purposes
module.exports = {
  ynabExportSelection: ynabExportSelection,
  onRuntimeMessage: onRuntimeMessage,
  displayMessage: displayMessage
}
