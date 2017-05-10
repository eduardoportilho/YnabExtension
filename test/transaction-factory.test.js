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

    it('should throw on invalid index', () => {
      let rowValues = ['whatever', '12.3']
      let columnInfo = {inflowIndex: 3}
      expect(() => {
        transactionFactory._getInflow(rowValues, columnInfo)
      }).to.throw('No inflow column')
    })
  })
  
  describe('getPayee', () => {
    it('should read payee', () => {
      let rowValues = ['Payee 1', '12.3']
      let columnInfo = {payeeIndex: 0}
      expect(transactionFactory._getPayee(rowValues, columnInfo)).to.equal('Payee 1')
    })

    it('should throw on no payee', () => {
      let rowValues = ['whatever', '12.3']
      let columnInfo = {}
      expect(() => {
        transactionFactory._getPayee(rowValues, columnInfo)
      }).to.throw('No payee column')
    })

    it('should throw on invalid index', () => {
      let rowValues = ['whatever', '12.3']
      let columnInfo = {payeeIndex: 3}
      expect(() => {
        transactionFactory._getPayee(rowValues, columnInfo)
      }).to.throw('No payee column')
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
