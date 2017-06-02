import fs from 'fs'
import path from 'path'
import { expect } from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'

xdescribe('[Integration] Itaú conta corrente', () => {
  var downloadMock
  var displayErrorMessageMock
  var contentScript

  beforeEach(() => {
    let htmlPath = path.join(__dirname, 'fixtures', 'itau.contacorrente.html')
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
17/05/2017,REND PAGO APLIC AUT MAIS,,,,1.30
18/05/2017,VENCIMENTO COMPROMISSADA,,,,87016.77
19/05/2017,INT PAG TIT BANCO 104,,,,-367.02
19/05/2017,REND PAGO APLIC AUT MAIS,,,,0.69
23/05/2017,TBI 8062.09114-8haithai,,,,-102.11
23/05/2017,INT APLICACAO EXCELLENCE,,,,-145000.00
23/05/2017,INT PERS VISA,,,,-16.90
23/05/2017,REND PAGO APLIC AUT MAIS,,,,101.84`

    td.verify(displayErrorMessageMock(), {times: 0, ignoreExtraArgs: true})
    td.verify(downloadMock.createTextFileForDownload(global.window, expectedCSV, 'text/csv'))
  })
})
