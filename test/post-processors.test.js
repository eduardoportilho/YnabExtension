import {expect} from 'chai'
import td from 'testdouble'
import proxyquire from 'proxyquire'

import postProcessors from '../src/scripts/ynab/processors/post-processors.js'

describe("post-processors.js", () => {
  var postProcessors
  var transactionStats
  var invertCreditCard

  beforeEach(() => {
    transactionStats = td.object(['generateStatistics'])
    invertCreditCard = td.object(['shouldApply', 'processTransactions'])
    postProcessors = proxyquire('../src/scripts/ynab/processors/post-processors.js', {
      '../transaction-stats': transactionStats,
      './invert-credit-card': invertCreditCard
    })
  })

  afterEach(() => {
    td.reset()
  })

  describe("processTransactions", () => {
    it("should apply processors", () => {
      // given:
      let stats = 'test-stats'
      let transactions = [1, 2, 3]

      // expect:
      td.when(transactionStats.generateStatistics(transactions))
        .thenReturn(stats)
      td.when(invertCreditCard.shouldApply(transactions, stats))
        .thenReturn(true)
      td.when(invertCreditCard.processTransactions(transactions, stats))
        .thenReturn('processed-transactions')

      // when, then:
      expect(postProcessors.processTransactions(transactions)).to.equal('processed-transactions')
    })
  })
})