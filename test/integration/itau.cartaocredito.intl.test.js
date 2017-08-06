import fs from 'fs'
import path from 'path'
import { expect } from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'

describe('[Integration] Itaú cartão de crédito (internacional)', () => {
  var downloadMock
  var displayErrorMessageMock
  var contentScript
  var browserHelper

  beforeEach(() => {
    let htmlPath = path.join(__dirname, 'fixtures', 'itau.cartaocredito.intl.html')
    let html = fs.readFileSync(htmlPath, 'utf8')
    document.body.innerHTML = html
    downloadMock = td.object(['createTextFileForDownload'])
    browserHelper = td.object(['getUrl'])
    displayErrorMessageMock = td.function('Display error')

    // subject:
    contentScript = proxyquire('../../src/scripts/contentscript', {
      './utils/ext': {
        runtime: {
          onMessage: { addListener: td.function() },
          sendMessage: displayErrorMessageMock
        }
      },
      './utils/download': downloadMock,
      './utils/browser-helper': browserHelper
    })
  })

  afterEach(() => {
    td.reset()
  })

  it('should read content and generate CSV', () => {
    // given:
    td.replace(window, 'getSelection', () => {
      return {
        anchorNode: {parentElement: document.querySelector('#selection-start')},
        focusNode: {parentElement: document.querySelector('#selection-end')}
      }
    })
    td.when(browserHelper.getUrl()).thenReturn('https://itaubankline.itau.com.br/GRIPNET/bklcom.dll')

    // when:
    contentScript.ynabExportSelection()

    // then:
    let expectedCSV = `Date,Payee,Category,Memo,Outflow,Inflow
06/06/2017,PAYPAL *VANESSAGAZE,,,,-684.04
07/06/2017,IOF COMPRA INTERNACIONA,,,,-43.63
18/06/2017,GOOGLE *SERVICES,,,,-34.90
19/06/2017,IOF COMPRA INTERNACIONA,,,,-2.23`

    td.verify(displayErrorMessageMock(), {times: 0, ignoreExtraArgs: true})
    td.verify(downloadMock.createTextFileForDownload(global.window, expectedCSV, 'text/csv'))
  })
})
