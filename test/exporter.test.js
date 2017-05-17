import {expect} from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'

describe("exporter", () => {
  var tabular
  var columnFinder
  var transactionFactory
  var csvBuilder
  var exporter

  beforeEach(() => {
    tabular = td.object(['getTabularDataFromSelection'])
    columnFinder = td.object(['getColumnInfo'])
    transactionFactory = td.object(['createTransactions'])
    csvBuilder = td.object(['buildCsv'])

    exporter = proxyquire('../src/scripts/ynab/exporter.js', {
      '../utils/tabular-data': tabular,
      './column-finder': columnFinder,
      './transaction-factory': transactionFactory,
      './csv-builder': csvBuilder
    })
  })

  afterEach(() => {
    td.reset()
  })

  describe("generateCsv", () => {
    it("should call components", () => {
      // given: 
      let domSelectionRange = 'test-domSelectionRange'
      let tabularData = 'test-tabularData'
      let columnInfo = 'test-columnInfo'
      let transactions = 'test-transactions'
      let csv = 'test-csv'

      td.when(tabular.getTabularDataFromSelection(domSelectionRange))
        .thenReturn(tabularData)
      td.when(columnFinder.getColumnInfo(tabularData, domSelectionRange))
        .thenReturn(columnInfo)
      td.when(transactionFactory.createTransactions(tabularData, columnInfo))
        .thenReturn(transactions)
      td.when(csvBuilder.buildCsv(transactions))
        .thenReturn(csv)

      // when, then:
      expect(exporter.generateCsv(domSelectionRange)).to.equal(csv)
    })
  })
})
