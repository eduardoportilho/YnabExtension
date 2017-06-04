import {expect} from 'chai'
import proxyquire from 'proxyquire'
import transactionFactory from '../src/scripts/ynab/transaction-factory'
import td from 'testdouble'

describe('transaction-factory', () => {
  let transactionFactory
  let columnFinder

  beforeEach(() => {    
    // This is necessary to avoid caching './column-finder', which would break the integration tests
    proxyquire.noPreserveCache()
    columnFinder = td.object()
    transactionFactory  = proxyquire('../src/scripts/ynab/transaction-factory', {
      './column-finder': columnFinder
    })
  })

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
  
  describe('getDate', () => {
    it('should read date', () => {
      let rowValues = ['31/01/2017', '12.3']
      let columnInfo = {dateIndex: 0}
      expect(transactionFactory._getDate(rowValues, columnInfo)).to.equal('31/01/2017')
    })

    it('should throw on no date', () => {
      let rowValues = ['31/01/2017', '12.3']
      let columnInfo = {}
      expect(() => {
        transactionFactory._getDate(rowValues, columnInfo)
      }).to.throw('No date column')
    })

    it('should throw on invalid index', () => {
      let rowValues = ['31/01/2017', '12.3']
      let columnInfo = {dateIndex: 3}
      expect(() => {
        transactionFactory._getDate(rowValues, columnInfo)
      }).to.throw('No date column')
    })

    it('should throw on invalid date', () => {
      let rowValues = ['whatever', 'whatever']
      let columnInfo = {dateIndex: 0}
      expect(() => {
        transactionFactory._getDate(rowValues, columnInfo)
      }).to.throw('No date column')
    })
  })
  
  describe('createTransactions', () => {
    afterEach(() => {
      td.reset()
    })

    it('should create transaction from valid row', () => {
      let tabularData = {
        data: [['31/01/2017', 'Payee 1', '12.3']]
      }
      let columnInfo = {
        dateIndex: 0,
        payeeIndex: 1,
        inflowIndex: 2
      }
      expect(transactionFactory.createTransactions(tabularData, columnInfo)).to.eql([
        {
          date: '31/01/2017',
          payee: 'Payee 1',
          memo: '',
          inflow: '12.30',
          outflow: ''
        }
      ])
    })

    it('should ignore invalid rows', () => {
      let tabularData = {
        data: [['invalid date', 'Payee 1', '12.3']]
      }
      let columnInfo = {
        dateIndex: 0,
        payeeIndex: 1,
        inflowIndex: 2
      }
      td.replace(console, 'log')
      expect(transactionFactory.createTransactions(tabularData, columnInfo)).to.eql([])
      td.verify(console.log(td.matchers.contains('Invalid row')))
      td.verify(console.log(td.matchers.contains('2nd try failed')))
      td.reset()
    })
  })
})
