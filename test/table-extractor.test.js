// https://github.com/rstacruz/jsdom-global: inject document, window and other DOM API into your Node.js environment.
import 'jsdom-global/register'
import {expect} from 'chai'
import tabular from '../src/scripts/utils/data_extractors/table-extractor'

describe("table-extractor", function() {

  before(function () {
    document.body.innerHTML = '<div>' + 
      '<div id="da1">Div A1</div>' + 
      '<div id="da2">Div A2</div>' + 
      '<div id="da3">Div A3</div>' + 
    '</div>'+
    '<table>' +
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
      '<div id="db1">Div B1</div>' + 
      '<div id="db2">Div B2</div>' + 
      '<div id="db3">Div B3</div>' + 
    '</div>' 
  })

  describe("getTabularDataFromSelection", function() {
    it("should get tabular data", function() {
      var domSelectionRange = {
        start: document.querySelector('#td1a'),
        end: document.querySelector('#td3c')
      }
      expect(tabular.getTabularDataFromSelection(domSelectionRange))
        .to.deep.equal({
          'data': [['1A','1B','1C'],['2A','2B','2C'],['3A','3B','3C']],
          'header': ['Col A','Col B','Col C']
        })
    })

    it("should throw when data not found", function() {
      var domSelectionRange = {
        start: document.querySelector('#db1'),
        end: document.querySelector('#db1')
      }
      expect(() => {
        tabular.getTabularDataFromSelection(domSelectionRange)
      }).to.throw('Could not find tabular data.')
    })
  })

  describe("isSelectionInsideTable", function() {
    it("selection should be inside the table", function() {
      var domSelectionRange = {
        start: document.querySelector('#td1a'),
        end: document.querySelector('#td1b')
      }
      expect(tabular.isSelectionInsideTable(domSelectionRange)).to.be.true
    })

    it("row selection should be inside the table", function() {
      var domSelectionRange = {
        start: document.querySelector('#tr2'),
        end: document.querySelector('#tr3')
      }
      expect(tabular.isSelectionInsideTable(domSelectionRange)).to.be.true
    })

    it("selection should be outside the table", function() {
      var domSelectionRange = {
        start: document.querySelector('#db1'),
        end: document.querySelector('#db3')
      }
      expect(tabular.isSelectionInsideTable(domSelectionRange)).to.be.false
    })

    it("partial selection should be outside the table", function() {
      var domSelectionRange = {
        start: document.querySelector('#td3b'),
        end: document.querySelector('#db3')
      }
      expect(tabular.isSelectionInsideTable(domSelectionRange)).to.be.false
    })
  })

  describe("getTableDataFromSelection", function() {
    it("should get data from parent rows", function() {
      var domSelectionRange = {
        start: document.querySelector('#td1c'),
        end: document.querySelector('#td2b')
      }
      expect(tabular._getTableDataFromSelection(domSelectionRange))
        .to.deep.equal([['1A','1B','1C'],['2A','2B','2C']])
    })

    it("should get data from row selection", function() {
      var domSelectionRange = {
        start: document.querySelector('#tr2'),
        end: document.querySelector('#tr3')
      }
      expect(tabular._getTableDataFromSelection(domSelectionRange))
        .to.deep.equal([['2A','2B','2C'],['3A','3B','3C']])
    })

    it("should get data from inverted selection", function() {
      var domSelectionRange = {
        start: document.querySelector('#td2b'),
        end: document.querySelector('#td1c')
      }
      expect(tabular._getTableDataFromSelection(domSelectionRange))
        .to.deep.equal([['1A','1B','1C'],['2A','2B','2C']])
    })

    it("should get data from partial selection (end outside table)", function() {
      var domSelectionRange = {
        start: document.querySelector('#td2b'),
        end: document.querySelector('#db3')
      }
      expect(tabular._getTableDataFromSelection(domSelectionRange))
        .to.deep.equal([['2A','2B','2C'],['3A','3B','3C']])
    })

    it("should get data from partial selection (start outside table)", function() {
      var domSelectionRange = {
        start: document.querySelector('#da1'),
        end: document.querySelector('#td2b')
      }
      expect(tabular._getTableDataFromSelection(domSelectionRange))
        .to.deep.equal([['1A','1B','1C'],['2A','2B','2C']])
    })

    it("should throw when table not found", function() {
      var domSelectionRange = {
        start: document.querySelector('#db1'),
        end: document.querySelector('#db1')
      }
      expect(() => {
        tabular._getTableDataFromSelection(domSelectionRange)
      }).to.throw('Could not find tabular data.')
    })
  })

  describe("getHeaderDataFromSelection", function() {
    it("should find th headers", function() {
      var domSelectionRange = {
        start: document.querySelector('#td1c'),
        end: document.querySelector('#td2b')
      }
      expect(tabular._getHeaderDataFromSelection(domSelectionRange))
        .to.deep.equal(['Col A','Col B','Col C'])
    })

    it("if there are no ths, should find td headers", function() {
      document.body.innerHTML = '<table>' +
      '<tr>' +
        '<td>Col XA</td>' +
        '<td>Col XB</td>' +
        '<td>Col XC</td>' +
      '</tr>' +
      '<tr id="tr1">' +
        '<td id="td1a">1A</td>' +
        '<td id="td1b">1B</td>' +
        '<td id="td1c">1C</td>' +
      '</tr>' +
    '</table>'
      var domSelectionRange = {
        start: document.querySelector('#td1a'),
        end: document.querySelector('#td1a')
      }
      expect(tabular._getHeaderDataFromSelection(domSelectionRange))
        .to.deep.equal(['Col XA','Col XB','Col XC'])
    })

    it("should return undefined when table not found", function() {
      var domSelectionRange = {
        start: document.querySelector('#db1'),
        end: document.querySelector('#db1')
      }
      expect(tabular._getHeaderDataFromSelection(domSelectionRange)).to.be.undefined
    })


    it("should return undefined on empty table", function() {
      document.body.innerHTML = '<table>' +
        '<thead id="d1"></thead>' +
      '</table>'
      var domSelectionRange = {
        start: document.querySelector('#d1'),
        end: document.querySelector('#d1')
      }
      expect(tabular._getHeaderDataFromSelection(domSelectionRange)).to.be.undefined
    })
  })
})
