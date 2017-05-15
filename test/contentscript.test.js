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

  describe("component initialization", () => {
    it("should add message listener", () => {
      // when: the component is initialized, then:
      td.verify(
        runtime_onMessage_addListener(contentscript.onRuntimeMessage)
      )
    })
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
      
      // no need to verify, since stubbing does the job
      //td.verify(selection.getSelectedElements(window))
      //td.verify(ynabExporter.generateCsv('test-selection'))
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

  describe("onRuntimeMessage", () => {
    it("should handle 'ynabExportSelection' action", () => {
      // given
      contentscript.ynabExportSelection = td.function()

      // when
      contentscript.onRuntimeMessage({
        action: 'ynabExportSelection',
        data: 'test-data'
      })

      // then
      td.verify(selection.getSelectedElements(td.matchers.anything()))
      td.verify(ynabExporter.generateCsv(td.matchers.anything()))
      td.verify(download.createTextFileForDownload(td.matchers.anything(), td.matchers.anything(), 'text/csv'))
    })
    
    it("should ignore other actions", () => {
      // when
      contentscript.onRuntimeMessage({action: 'otherMessage'})

      // then
      td.verify(selection.getSelectedElements(), {times: 0, ignoreExtraArgs: true})
      td.verify(ynabExporter.generateCsv(), {times: 0, ignoreExtraArgs: true})
      td.verify(download.createTextFileForDownload(), {times: 0, ignoreExtraArgs: true})
    })
  })
})
