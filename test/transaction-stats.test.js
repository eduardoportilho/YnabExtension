import {expect} from 'chai'
import transactionStats from '../src/scripts/ynab/transaction-stats'

describe("transaction-stats", () => {
  describe("isIncome", () => {
    it("should detect income transactions", () => {
      expect(transactionStats.isIncome({inflow: '10.00'})).to.be.true
      expect(transactionStats.isIncome({inflow: '0.00'})).to.be.true
      expect(transactionStats.isIncome({inflow: ''})).to.be.true
      expect(transactionStats.isIncome({outflow: '-10.00'})).to.be.true
      expect(transactionStats.isIncome({})).to.be.true
    })

    it("should detect outcome transactions", () => {
      expect(transactionStats.isIncome({outflow: '10.00'})).to.be.false
      expect(transactionStats.isIncome({outflow: '0.00'})).to.be.false
      expect(transactionStats.isIncome({inflow: '-10.00'})).to.be.false
    })
  })

  describe("genereateStatistics", () => {
    it("should calculate inflow percentage", () => {
      // given:
      let ynabTxs = [
        {date: '01/01/2017', inflow: '10.00'},
        {date: '01/01/2017', inflow: '10.00'},
        {date: '01/01/2017', inflow: '10.00'},
        {date: '01/01/2017', inflow: '-10.00'}
      ]

      // when:
      let stats = transactionStats.generateStatistics(ynabTxs)
      // then:
      expect(stats.inflowPercentage).to.equal(0.75)
    })
  })
})
