import {expect} from 'chai'
import columnFinder from '../src/scripts/ynab/column-finder'

describe("column-finder", () => {

  describe("containsIgnoringCase", () => {
    expect(columnFinder._containsIgnoringCase('Amount $', 'amount')).to.be.true
  })

})
