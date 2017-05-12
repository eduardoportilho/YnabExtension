module.exports = {
  /**
   * Create a text file and prompt the user to download it.
   * @param  {Window} aWindow - Window object.
   * @param  {string} textContent - Text content of the file.
   * @param  {string} [mimeType='text/plain'] - Mime type of the download.
   */
  createTextFileForDownload: (aWindow, textContent, mimeType) => {
    mimeType = mimeType || 'text/plain'
    var encodedUri = encodeURI(`data:${mimeType};charset=utf-8,${textContent}`)
    aWindow.open(encodedUri);
  }
}
