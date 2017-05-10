import {expect} from 'chai'
import columnFinder from '../src/scripts/ynab/column-finder'

describe("column-finder", () => {
  describe("containsIgnoringCase", () => {
    it("should contain sting", () => {
      expect(columnFinder._containsIgnoringCase('Amount $', 'amount')).to.be.true
    })

    it("should not contain sting", () => {
      expect(columnFinder._containsIgnoringCase('Amount $', 'mmo')).to.be.false
    })
  })

  describe("isValid", () => {
    it("should validate date+inflow", () => {
      expect(columnFinder._isValid({
        dateIndex: 0,
        inflowIndex: 1
      })).to.be.true
      expect(columnFinder._isValid({
        dateIndex: 0,
        inflowIndex: 1,
        payeeIndex: 2
      })).to.be.true
    })

    it("should not validate missing date or inflow", () => {
      expect(columnFinder._isValid({
        inflowIndex: 1,
        payeeIndex: 2
      })).to.be.false
      expect(columnFinder._isValid({
        dateIndex: 1,
        payeeIndex: 2
      })).to.be.false
    })

    it("should not validate duplicated indexes", () => {
      expect(columnFinder._isValid({
        dateIndex: 0,
        inflowIndex: 0
      })).to.be.false
      expect(columnFinder._isValid({
        dateIndex: 0,
        inflowIndex: 1,
        payeeIndex: 1
      })).to.be.false
    })
  })

  describe("findHeaderIndexByLabel", () => {
    it("should match amount (1)", () => {
      expect(columnFinder._findHeaderIndexByLabel(
        ['Date', 'Amount', 'Balance $'],
        ['total', 'amount', 'value', '$']
      )).to.equal(1)
      expect(columnFinder._findHeaderIndexByLabel(
        ['Date', 'Balance $', 'Amount'],
        ['total', 'amount', 'value', '$']
      )).to.equal(2)
    })

    it("should match Balace (2)", () => {
      expect(columnFinder._findHeaderIndexByLabel(
        ['date', 'Amount', 'Balance $'],
        ['total', 'sum', 'value', '$']
      )).to.equal(2)
    })

    it("should find no match", () => {
      expect(columnFinder._findHeaderIndexByLabel(
        ['date', 'Amount', 'Balance $'],
        ['total', 'sum', 'value']
      )).to.be.undefined
    })
  })

  describe("findIndexesFromValues", () => {
    it("should find indexes from values", () => {
      expect(columnFinder._findIndexesFromValues(
        [['10/01/2017', 'Restaurant', '100.00']]
      )).to.eql({
        dateIndex: 0,
        inflowIndex: 2,
        payeeIndex: 1
      })
    })

    it("should use the first match", () => {
      expect(columnFinder._findIndexesFromValues([[
          '10/01/2017',
          '10/02/2017',
          '100.00',
          '200.00',
          'Restaurant',
          'Shopping'
        ]])
      ).to.eql({
        dateIndex: 0,
        inflowIndex: 2,
        payeeIndex: 4
      })
    })
  })

  describe("findIndexesFromHeader", () => {
    it("should find indexes from headers", () => {
      expect(columnFinder._findIndexesFromHeader(
        ['date', 'payee', 'value']
      )).to.eql({
        dateIndex: 0,
        inflowIndex: 2,
        payeeIndex: 1
      })
    })

    it("should find indexes from part of the headers", () => {
      expect(columnFinder._findIndexesFromHeader(
        ['Date of transaction', 'Transacton payee', 'Inflow amount']
      )).to.eql({
        dateIndex: 0,
        inflowIndex: 2,
        payeeIndex: 1
      })
    })
  })

  describe("getColumnInfo", () => {

    it("should use header to find indexes", () => {
      let tabularData = {
        header: ['date', 'payee', 'value'],
        data: [
          ['100.00', '10/01/2017', 'Restaurant']
        ]
      }
      expect(columnFinder.getColumnInfo(tabularData)).to.eql({
        dateIndex: 0,
        inflowIndex: 2,
        payeeIndex: 1
      })
    })

    it("should use data to find indexes", () => {
      let tabularData = {
        data: [
          ['100.00', '10/01/2017', 'Restaurant']
        ]
      }
      expect(columnFinder.getColumnInfo(tabularData)).to.eql({
        dateIndex: 1,
        inflowIndex: 0,
        payeeIndex: 2
      })
    })

    it("should throw on invalid header", () => {
      let tabularData = {
        header: ['date', 'payee']
      }
      expect(() => {
        columnFinder.getColumnInfo(tabularData)
      }).to.throw('Could not find column information.')
    })

    it("should throw on invalid data", () => {
      let tabularData = {
        data: [
          ['100.00',  'Restaurant']
        ]
      }
      expect(() => {
        columnFinder.getColumnInfo(tabularData)
      }).to.throw('Could not find column information.')
    })
  })
})
