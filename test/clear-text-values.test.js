import {expect} from 'chai'
import clearTextValues from '../src/scripts/ynab/processors/clear-text-values'

describe('clear-text-values', () => {
  it('should always apply', () => {
    expect(clearTextValues.shouldApply([], {})).to.be.true
  })

  describe('processTransactions', () => {
    it('should remove spaces and commas from memo and payee', () => {
      let trxs = [{
        date: '31/01/2017',
        payee: 'Payee 1   ,,,',
        memo: 'aa     b, c',
        inflow: '12.30',
        outflow: ''
      },{
        date: '31/01/2017',
        payee: 'Payee    2,,',
        memo: '   e    ',
        inflow: '12.30',
        outflow: ''
      }]
      expect(clearTextValues.processTransactions(trxs, {})).to.deep.equal([{
        date: '31/01/2017',
        payee: 'Payee 1 ;;;',
        memo: 'aa b; c',
        inflow: '12.30',
        outflow: ''
      },{
        date: '31/01/2017',
        payee: 'Payee 2;;',
        memo: ' e ',
        inflow: '12.30',
        outflow: ''
      }])
    })
  })
})
