import fs from 'fs'
import path from 'path'
import { expect } from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'

describe('[Integration] Itaú cartão de crédito', () => {
  var downloadMock
  var displayErrorMessageMock
  var contentScript
  var browserHelper

  beforeEach(() => {
    let htmlPath = path.join(__dirname, 'fixtures', 'itau.cartaocredito.html')
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
05/05/2017,EBANX 297286229,,,,-16.90
20/05/2017,DESCONTO ANUIDADE 06/12,,,,40.00
20/05/2017,PARCELA DE ANUIDADE,,,,-40.00`

    td.verify(displayErrorMessageMock(), {times: 0, ignoreExtraArgs: true})
    td.verify(downloadMock.createTextFileForDownload(global.window, expectedCSV, 'text/csv'))
  })
})
