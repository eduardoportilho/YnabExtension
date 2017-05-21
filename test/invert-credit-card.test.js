import {expect} from 'chai'
import td from 'testdouble'
import invertCreditCard from '../src/scripts/ynab/processors/invert-credit-card.js'

describe("invert-credit-card.js", () => {
  describe("shouldApply", () => {
    it("should apply invert-credit-card when more than 60% of the transactions are inflow ", () => {
      expect(invertCreditCard.shouldApply(undefined, {inflowPercentage: 0.61})).to.be.true
      expect(invertCreditCard.shouldApply(undefined, {inflowPercentage: 1})).to.be.true
    })

    it("should not apply invert-credit-card when 60% or less of the transactions are inflow ", () => {
      expect(invertCreditCard.shouldApply(undefined, {inflowPercentage: 0.6})).to.be.false
      expect(invertCreditCard.shouldApply(undefined, {inflowPercentage: 0})).to.be.false
    })
  })
})
