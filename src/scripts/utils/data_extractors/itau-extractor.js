
function canHandleUrl(url) {
  return url.includes('itaubankline.itau.com.br')
}

function getTabularDataFromSelection(domSelectionRange) {
  // TODO: implement me
  throw new Error('TODO: implement me')
}

module.exports = {
  canHandleUrl: canHandleUrl,
  getTabularDataFromSelection: getTabularDataFromSelection
}
