import {expect} from 'chai'
import td from 'testdouble'
import download from '../src/scripts/utils/download'

describe("download", () => {
  describe("createTextFileForDownload", () => {
    it("should call window.open with mimetype and encoded content", () => {
      let aWindow = {open: td.function()}
      download.createTextFileForDownload(aWindow, 'test content', 'test/mimetype')
      td.verify(aWindow.open('data:test/mimetype;charset=utf-8,test%20content'))
    })

    it("should call window.open with default mimetype and encoded content", () => {
      let aWindow = {open: td.function()}
      download.createTextFileForDownload(aWindow, 'test content')
      td.verify(aWindow.open('data:text/plain;charset=utf-8,test%20content'))
    })
  })
})
