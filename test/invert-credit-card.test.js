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

  describe("invertNumberStringSignal", () => {
    it("should invert positive numbers ", () => {
      expect(invertCreditCard.invertNumberStringSignal('12.34')).to.equal('-12.34')
      expect(invertCreditCard.invertNumberStringSignal('10')).to.equal('-10')
    })
    it("should invert negative numbers", () => {
      expect(invertCreditCard.invertNumberStringSignal('-12.34')).to.equal('12.34')
      expect(invertCreditCard.invertNumberStringSignal('-10')).to.equal('10')
    })
    it("should not invert zero", () => {
      expect(invertCreditCard.invertNumberStringSignal('0.00')).to.equal('0.00')
      expect(invertCreditCard.invertNumberStringSignal('0')).to.equal('0')
    })
  })
  
  describe("invertTxAmountSignal", () => {
    it("should invert inflow ", () => {
      expect(invertCreditCard.invertTxAmountSignal({inflow: '12.34'})).to.eql({inflow: '-12.34'})
      expect(invertCreditCard.invertTxAmountSignal({inflow: '-12.34'})).to.eql({inflow: '12.34'})
    })
    it("should invert outflow ", () => {
      expect(invertCreditCard.invertTxAmountSignal({outflow: '12.34'})).to.eql({outflow: '-12.34'})
      expect(invertCreditCard.invertTxAmountSignal({outflow: '-12.34'})).to.eql({outflow: '12.34'})
    })
    it("should not invert empty tx ", () => {
      expect(invertCreditCard.invertTxAmountSignal({date: '10/10/2017'})).to.eql({date: '10/10/2017'})
    })
  })
  
  describe("processTransactions", () => {
    it("should invert transactions ", () => {
      expect(invertCreditCard.processTransactions(
        [
          {inflow: '12.34'},
          {inflow: '-43.21'},
          {outflow: '-43.21'},
          {inflow: '0.00'}
        ]
      )).to.eql([
          {inflow: '-12.34'},
          {inflow: '43.21'},
          {outflow: '43.21'},
          {inflow: '0.00'}
        ]
      )
    })
  })
})
