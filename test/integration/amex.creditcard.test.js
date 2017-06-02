import fs from 'fs'
import path from 'path'
import { expect } from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'
import jsdom from 'jsdom'

describe('[Integration] Amex creditcard', () => {
  var downloadMock
  var displayErrorMessageMock
  var contentScript

  beforeEach(() => {
    let htmlPath = path.join(__dirname, 'fixtures', 'amex.creditcard.html')
    let html = fs.readFileSync(htmlPath, 'utf8')
    document.body.innerHTML = html
    downloadMock = td.object(['createTextFileForDownload'])
    displayErrorMessageMock = td.function('Display error')

    // subject:
    contentScript = proxyquire('../../src/scripts/contentscript', {
      './utils/ext': {
        runtime: {
          onMessage: { addListener: td.function() },
          sendMessage: displayErrorMessageMock
        }
      },
      './utils/download': downloadMock
    })
  })

  afterEach(() => {
    td.reset()
  })

  it('should read content and generate CSV', () => {
    // given:
    td.replace(window, 'getSelection', () => {
      return {
        anchorNode: {parentElement: document.querySelector('#selectionStart0')},
        focusNode: {parentElement: document.querySelector('#selectionEnd0')}
      }
    })

    // when:
    contentScript.ynabExportSelection()

    // then:
    let expectedCSV = `Date,Payee,Category,Memo,Outflow,Inflow
29/04/2017,ICA KVANTUM FLEN 020350 FLEN,,,,-805.62
23/04/2017,ICA KVANTUM FLEN 020350 FLEN,,RA;RENATA DE SOUZA AFFONSO,,-526.18
20/04/2017,CLAS OHLSON STOCKHOLM,,,,-394.00
18/04/2017,BETALNING MOTTAGEN; TACK,,,,25221.63
11/04/2017,AIRBNB * HM5BAX5KPW AIR SAN FRANCISCO,,,,-13653.37`

    td.verify(displayErrorMessageMock(), {times: 0, ignoreExtraArgs: true})
    td.verify(downloadMock.createTextFileForDownload(global.window, expectedCSV, 'text/csv'))
  })
})
