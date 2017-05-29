import fs from 'fs'
import path from 'path'
import { expect } from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'
import jsdom from 'jsdom'

describe('[Integration] Nordea creditcard', () => {
  var document
  var downloadMock
  var displayErrorMessageMock
  var contentScript

  beforeEach(() => {
    let htmlPath = path.join(__dirname, 'fixtures', 'nordea.creditcard.html')
    let html = fs.readFileSync(htmlPath, 'utf8')
    document = jsdom.jsdom(html)
    global.window = document.defaultView
    downloadMock = td.object(['createTextFileForDownload'])
    displayErrorMessageMock = td.function('Display error')
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

  it('should read content and generate CSV', () => {
    // given:
    global.window.getSelection = () => {
      return {
        anchorNode: {parentElement: document.querySelector('#selectionStart0')},
        focusNode: {parentElement: document.querySelector('#selectionEnd0')}
      }
    }

    // when:
    contentScript.ynabExportSelection()

    // then:
    let expectedCSV = `Date,Payee,Category,Memo,Outflow,Inflow
24/05/2017,Reservation kortköp,,KÖP,,-23.00
24/05/2017,Reservation kortköp,,KÖP,,-17.00
23/05/2017,KÖP,,KÖP,,-45.00
22/05/2017,ESPRESSO HOUSE 306,,KÖP,,-31.00
22/05/2017,KÖP,,KÖP,,-32.00
17/05/2017,RESTAURANG VESTAN,,KÖP,,-18.00
04/05/2017,RESTAURANG VESTAN,,KÖP,,-23.00`

    td.verify(displayErrorMessageMock(), {times: 0, ignoreExtraArgs: true})
    td.verify(downloadMock.createTextFileForDownload(global.window, expectedCSV, 'text/csv'))
  })
})
