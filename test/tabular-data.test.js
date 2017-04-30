import 'jsdom-global/register'
import {expect} from 'chai'
import tabular from '../src/scripts/utils/tabular-data'
import $ from 'jquery'

describe("tabular-data", function() {

  before(function () {
    document.body.innerHTML = '<table>' +
      '<tr>' +
        '<th>Col A</th>' +
        '<th>Col B</th>' +
        '<th>Col C</th>' +
      '</tr>' +
      '<tr id="tr1">' +
        '<td id="td1a">1A</td>' +
        '<td id="td1b">1B</td>' +
        '<td id="td1c">1C</td>' +
      '</tr>' +
      '<tr id="tr2">' +
        '<td id="td2a">2A</td>' +
        '<td id="td2b">2B</td>' +
        '<td id="td2c">2C</td>' +
      '</tr>' +
      '<tr id="tr3">' +
        '<td id="td3a">3A</td>' +
        '<td id="td3b">3B</td>' +
        '<td id="td3c">3C</td>' +
      '</tr>' +
    '</table>' + 
    '<div>' + 
      '<div id="d1">Div 1</div>' + 
      '<div id="d2">Div 2</div>' + 
      '<div id="d3">Div 3</div>' + 
    '</div>' 
  })

  describe("isSelectionInsideTable", function() {
    it("selection should be inside the table", function() {
      var domSelectionRange = {
        start: $('#td1a').get(),
        end: $('#td1b').get()
      }
      expect(tabular._isSelectionInsideTable(domSelectionRange)).to.be.true
    })

    it("row selection should be inside the table", function() {
      var domSelectionRange = {
        start: $('#tr2').get(),
        end: $('#tr3').get()
      }
      expect(tabular._isSelectionInsideTable(domSelectionRange)).to.be.true
    })

    it("selection should be outside the table", function() {
      var domSelectionRange = {
        start: $('#d1').get(),
        end: $('#d3').get()
      }
      expect(tabular._isSelectionInsideTable(domSelectionRange)).to.be.false
    })

    it("partial selection should be outside the table", function() {
      var domSelectionRange = {
        start: $('#td3b').get(),
        end: $('#d3').get()
      }
      expect(tabular._isSelectionInsideTable(domSelectionRange)).to.be.false
    })
  })

  describe("getTableDataFromSelection", function() {
    it("should get data from parent rows", function() {
      var domSelectionRange = {
        start: $('#td1c').get(),
        end: $('#td2b').get()
      }
      expect(tabular._getTableDataFromSelection(domSelectionRange))
        .to.deep.equal([['1A','1B','1C'],['2A','2B','2C']])
    })

    it("should get data from row selection", function() {
      var domSelectionRange = {
        start: $('#tr2').get(),
        end: $('#tr3').get()
      }
      expect(tabular._getTableDataFromSelection(domSelectionRange))
        .to.deep.equal([['2A','2B','2C'],['3A','3B','3C']])
    })

    it("should get data from inverted selection", function() {
      var domSelectionRange = {
        start: $('#td2b').get(),
        end: $('#td1c').get()
      }
      expect(tabular._getTableDataFromSelection(domSelectionRange))
        .to.deep.equal([['1A','1B','1C'],['2A','2B','2C']])
    })

    it("should get data from partial selection", function() {
      var domSelectionRange = {
        start: $('#td2b').get(),
        end: $('#d3').get()
      }
      expect(tabular._getTableDataFromSelection(domSelectionRange))
        .to.deep.equal([['2A','2B','2C'],['3A','3B','3C']])
    })
  })
})
