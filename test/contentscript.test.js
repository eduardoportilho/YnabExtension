import {expect} from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'

describe("contentscript", () => {
  var runtime_onMessage_addListener
  var runtime_sendMessage
  var selection
  var download
  var ynabExporter
  var contentscript

  beforeEach(() => {
    runtime_sendMessage = td.function()
    runtime_onMessage_addListener = td.function()
    selection = td.object(['getSelectedElements'])
    download = td.object(['createTextFileForDownload'])
    ynabExporter = td.object(['generateCsv'])
    contentscript = proxyquire('../src/scripts/contentscript', {
      './utils/ext': {
        runtime: {
          onMessage: { addListener: runtime_onMessage_addListener },
          sendMessage: runtime_sendMessage
        }
      },
      './utils/selection': selection,
      './utils/download': download,
      './ynab/exporter': ynabExporter
    })
  })

  afterEach(() => {
    td.reset()
  })

  describe("ynabExportSelection", () => {
    it("should generate csv with selection and download", () => {
      // given
      td.when(selection.getSelectedElements(td.matchers.anything()))
        .thenReturn('test-selection')
      td.when(ynabExporter.generateCsv('test-selection'))
        .thenReturn('test-csv')

      // when
      contentscript.ynabExportSelection()

      // then
      td.verify(selection.getSelectedElements(window))
      td.verify(ynabExporter.generateCsv('test-selection'))
      td.verify(download.createTextFileForDownload(window, 'test-csv', 'text/csv'))
    })

    it("should show error mesage on exception", () => {
      // given
      td.when(selection.getSelectedElements(td.matchers.anything()))
        .thenReturn('test-selection')
      td.when(ynabExporter.generateCsv('test-selection'))
        .thenThrow(new Error('Test error'))

      // when
      contentscript.ynabExportSelection()

      // then
      td.verify(runtime_sendMessage({
        action: 'displayMessage',
        data: {
          'title': 'Export error',
          message: 'Test error'
        }
      }))
    })
  })
})
