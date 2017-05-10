import {expect} from 'chai'
import transactionFactory from '../src/scripts/ynab/transaction-factory'

describe('transaction-factory', () => {
  describe('getInflow', () => {
    it('should read inflow', () => {
      let rowValues = ['whatever', '12.3']
      let columnInfo = {inflowIndex: 1}
      expect(transactionFactory._getInflow(rowValues, columnInfo)).to.equal('12.30')
    })

    it('should throw on no inflow', () => {
      let rowValues = ['whatever', '12.3']
      let columnInfo = {}
      expect(() => {
        transactionFactory._getInflow(rowValues, columnInfo)
      }).to.throw('No inflow column')
    })

    it('should throw on invalid inflow', () => {
      let rowValues = ['whatever', 'whatever']
      let columnInfo = {inflowIndex: 1}
      expect(() => {
        transactionFactory._getInflow(rowValues, columnInfo)
      }).to.throw('No inflow column')
    })
  })
  
  xdescribe('getPayee', () => {
    it('should ...', () => {
      expect().to.be.true
    })
  })
  
  xdescribe('getDate', () => {
    it('should ...', () => {
      expect().to.be.true
    })
  })
  
  xdescribe('createTransactions', () => {
    it('should ...', () => {
      expect().to.be.true
    })
  })
})
