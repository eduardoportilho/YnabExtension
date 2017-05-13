import {expect} from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'

describe("contentscript", () => {
  describe("ynabExportSelection", () => {
    it("should generate csv with selection and download", () => {
      // given
      let selection = td.object(['getSelectedElements'])
      let ynabExporter = td.object(['generateCsv'])
      let download = td.object(['createTextFileForDownload'])
      let ext = {runtime: {onMessage: td.object(['addListener'])}}

      let contentscript = proxyquire('../src/scripts/contentscript', {
        './utils/ext': ext,
        './utils/selection': selection,
        './utils/download': download,
        './ynab/exporter': ynabExporter
      })

      // when
      contentscript.ynabExportSelection()

      // then
      td.verify(
        selection.getSelectedElements(window)
      )
    })
  })
})
