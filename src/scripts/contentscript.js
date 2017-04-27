/**
 *  A content script is some JavaScript that executes in the context 
 *  of a page that's been loaded into the browser. Think of a content 
 *  script as part of that loaded page, not as part of the extension 
 *  it was packaged with (its parent extension).
 */

import ext from "./utils/ext";

var ynabExportSelection = (selectionInfo) => {
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'ynabExportSelection') {
    ynabExportSelection(request.data)
  }
}

ext.runtime.onMessage.addListener(onRequest);