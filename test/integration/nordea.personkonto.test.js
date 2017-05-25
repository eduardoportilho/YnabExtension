import fs from 'fs'
import path from 'path'
import { expect } from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'
import jsdom from 'jsdom'

describe('[Integration] Nordea personkonton', () => {
  var document
  var downloadMock
  var displayErrorMessageMock
  var contentScript

  beforeEach(() => {
    let htmlPath = path.join(__dirname, 'fixtures', 'nordea.personkonto.html')
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
24/05/2017,Lön,,,,34919.00
17/05/2017,Bankomat kl 16.32 170517,,,,-200.00
17/05/2017,Bankomat kl 16.31 170517,,,,-1000.00
17/05/2017,Betalning BG 5642-8568 UNIONENS ARBETS,,,,-224.00
15/05/2017,Kortköp 170512 BARNMORSKEGRUPPEN MA,,,,-350.00
15/05/2017,Kortköp 170513 BOSPHORUS MEZE STORE,,,,-107.28
15/05/2017,Betalning PG 4131300-8 Vattenfall,,,,-2531.10`

    td.verify(displayErrorMessageMock(), {times: 0, ignoreExtraArgs: true})
    td.verify(downloadMock.createTextFileForDownload(global.window, expectedCSV, 'text/csv'))
  })
})
