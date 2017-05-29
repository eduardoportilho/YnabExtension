import {expect} from 'chai'
import td from 'testdouble'
import proxyquire from 'proxyquire'

describe("post-processors.js", () => {
  var postProcessors
  var transactionStats
  var invertCreditCard
  var clearTextValues

  beforeEach(() => {
    transactionStats = td.object(['generateStatistics'])
    invertCreditCard = td.object(['shouldApply', 'processTransactions'])
    clearTextValues = td.object(['shouldApply', 'processTransactions'])
    postProcessors = proxyquire('../src/scripts/ynab/processors/post-processors.js', {
      '../transaction-stats': transactionStats,
      './invert-credit-card': invertCreditCard,
      './clear-text-values': clearTextValues
    })
  })

  afterEach(() => {
    td.reset()
  })

  describe("processTransactions", () => {
    it("should apply processors", () => {
      // given:
      let stats = 'test-stats'
      let transactions = 'test-transactions'

      // expect:
      td.when(transactionStats.generateStatistics(transactions))
        .thenReturn(stats)

      td.when(invertCreditCard.shouldApply(transactions, stats))
        .thenReturn(true)
      td.when(clearTextValues.shouldApply('processed-transactions', stats))
        .thenReturn(true)
      
      td.when(invertCreditCard.processTransactions(transactions, stats))
        .thenReturn('processed-transactions')
      td.when(clearTextValues.processTransactions('processed-transactions', stats))
        .thenReturn('processed-transactions-2')

      // when, then:
      expect(postProcessors.processTransactions(transactions)).to.equal('processed-transactions-2')
    })

    it("should not apply processors", () => {
      // given:
      let stats = 'test-stats'
      let transactions = 'test-transactions'

      // expect:
      td.when(transactionStats.generateStatistics(transactions))
        .thenReturn(stats)
      td.when(invertCreditCard.shouldApply(transactions, stats))
        .thenReturn(false)
      td.when(clearTextValues.shouldApply(transactions, stats))
        .thenReturn(false)
      td.when(invertCreditCard.processTransactions(transactions, stats))
        .thenReturn('processed-transactions')
      td.when(clearTextValues.processTransactions('processed-transactions', stats))
        .thenReturn('processed-transactions-2')

      // when, then:
      expect(postProcessors.processTransactions(transactions)).to.equal('test-transactions')
    })
  })
})
