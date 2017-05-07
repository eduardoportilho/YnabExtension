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
})
