import {expect} from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'

describe("background", () => {
  describe("ynabExportSelection", () => {
    it("should create context menu", () => {
      // given
      var contextMenus_create = td.function()
      global.chrome = {
        contextMenus: { create: contextMenus_create }
      }

      // when
      var background = proxyquire('../src/scripts/background', {})

      // then
      td.verify(
        contextMenus_create({
          "title": "Export to YNAB",
          "contexts":["selection"],
          "onclick": background.ynabExportSelection
        })
      )
    })

    it("should send message to the clicked tab", () => {
      // given
      var tab_sendMessage = td.function()
      global.chrome = {
        contextMenus: {
          create() {}
        }
      }
      var background = proxyquire('../src/scripts/background', {
        './utils/ext': {
          tabs: {
            sendMessage: tab_sendMessage
          }
        }
      })
      
      // when
      background.ynabExportSelection(
        {selectionText: 'testSelectionText'},
        {id: 'testTabId'})

      // then
      td.verify(
        tab_sendMessage('testTabId', {
          'action': 'ynabExportSelection',
          'data': {
            'selectionText': 'testSelectionText'
          }
        })
      )
    })
  })
})