import {expect} from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'

describe("background", () => {
  var contextMenus_create
  var notifications_create
  var runtime_getURL
  var runtime_onMessage_addListener
  var tab_sendMessage
  var background

  beforeEach(() => {
    contextMenus_create = td.function()
    notifications_create = td.function()
    runtime_getURL = td.function()
    runtime_onMessage_addListener = td.function()
    tab_sendMessage = td.function()
    background = proxyquire('../src/scripts/background', {
      './utils/ext': {
        contextMenus: { create: contextMenus_create },
        notifications: { create: notifications_create },
        tabs: { sendMessage: tab_sendMessage },
        runtime: {
          onMessage: { addListener: runtime_onMessage_addListener },
          getURL: runtime_getURL
        }
      }
    })
  })

  afterEach(() => {
    td.reset()
  })


  describe("component initialization", () => {
    it("should create context menu and add listener", () => {
      // when: the component is initialized, then:
      td.verify(contextMenus_create({
        "title": "Export to YNAB",
        "contexts":["selection"],
        "onclick": background.ynabExportSelection
      }))
      td.verify(
        runtime_onMessage_addListener(background.onRuntimeMessage)
      )
    })
  })

  describe("ynabExportSelection", () => {
    it("should send message to the clicked tab", () => {
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

  describe("onRuntimeMessage", () => {
    it("should handle 'displayMessage' action", () => {
      // given
      td.when(runtime_getURL('icons/icon-48.png')).thenReturn('test-icon')

      // when
      background.onRuntimeMessage({
        action: 'displayMessage',
        data: {
          title: 'test-title',
          message: 'test-message'
        }
      })

      // then
      td.verify(
        notifications_create('ynab.export.error', {
          type: 'basic',
          title: 'test-title',
          message: 'test-message',
          iconUrl: 'test-icon'
        })
      )
    })
    it("should ignore other actions", () => {
      // when
      background.onRuntimeMessage({action: 'otherMessage'})

      // then
      td.verify(notifications_create(), {times: 0, ignoreExtraArgs: true})
      td.verify(runtime_getURL(), {times: 0, ignoreExtraArgs: true})
      td.verify(tab_sendMessage(), {times: 0, ignoreExtraArgs: true})
    })
  })

})