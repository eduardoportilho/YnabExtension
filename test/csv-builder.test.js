import {expect} from 'chai'
import csvBuilder from '../src/scripts/ynab/csv-builder'

describe("csv-builder", () => {
  describe("buildCsv", () => {
    it("should build CSV with transactions", () => {
      let trxs = [
        {date: 'date1', payee: 'payee1', outflow: 'outflow1', inflow: 'inflow1'},
        {date: 'date2', payee: 'payee2', outflow: 'outflow2', inflow: 'inflow2'}
      ]
      expect(csvBuilder.buildCsv(trxs)).to.eql(
`Date,Payee,Category,Memo,Outflow,Inflow
date1,payee1,,,outflow1,inflow1
date2,payee2,,,outflow2,inflow2`)
    })
  })
})
