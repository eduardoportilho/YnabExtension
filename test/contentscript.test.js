import {expect} from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'

describe("contentscript", () => {
  afterEach(() => {
    td.reset()
  })

  describe("ynabExportSelection", () => {
    it("should generate csv with selection and download", () => {
      // given
      let ext = {runtime: {onMessage: td.object(['addListener'])}}
      let selection = td.object(['getSelectedElements'])
      td.when(selection.getSelectedElements(td.matchers.anything()))
        .thenReturn('test-selection')
      let ynabExporter = td.object(['generateCsv'])
      td.when(ynabExporter.generateCsv('test-selection'))
        .thenReturn('test-csv')
      let download = td.object(['createTextFileForDownload'])
      let contentscript = proxyquire('../src/scripts/contentscript', {
        './utils/ext': ext,
        './utils/selection': selection,
        './utils/download': download,
        './ynab/exporter': ynabExporter
      })

      // when
      contentscript.ynabExportSelection()

      // then
      td.verify(selection.getSelectedElements(window))
      td.verify(ynabExporter.generateCsv('test-selection'))
      td.verify(download.createTextFileForDownload(window, 'test-csv', 'text/csv'))
    })

    xit("should show error mesage on exception", () => {
      // given
      let ext = {runtime: {onMessage: td.object(['addListener'])}}
      let selection = td.object(['getSelectedElements'])
      let ynabExporter = td.object(['generateCsv'])

      td.when(selection.getSelectedElements()).thenReturn('test-selection')
      td.when(ynabExporter.generateCsv('test-selection')).thenThrow(new Error('Test error'))

      // when
      contentscript.ynabExportSelection()
    })
  })
})
