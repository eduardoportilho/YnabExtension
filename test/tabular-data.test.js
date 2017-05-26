import {expect} from 'chai'
import tabular from '../src/scripts/utils/tabular-data'

describe('base-tabular-data', function() {

  describe('normalizeTabularData', function() {
    it('should normalize tabular data with no empty cells', function() {
      let data = {
        data:  [
          ['A', 'B', 'C', 'D'],
          ['A', 'B', 'C'],
          ['A', 'B']
        ]
      }
      expect(tabular._normalizeTabularData(data))
        .to.deep.equal({
          data:  [
            ['A', 'B', 'C', 'D'],
            ['A', 'B', 'C', ''],
            ['A', 'B', '', '']
          ]})
    })

    it('should normalize tabular data with empty cells', function() {
      let data = {
        data:  [
          ['A', '', 'B', '', 'C'],
          ['A', 'B', 'C'],
          ['A', 'B']
        ]
      }
      expect(tabular._normalizeTabularData(data))
        .to.deep.equal({
          data:  [
            ['A', '', 'B', '', 'C'],
            ['A', '', 'B', '', 'C'],
            ['A', '', 'B', '', '']
          ]})
    })
  })
  describe('padRow', function() {
    it('should pad row in the end', function() {
      let row = ['A', 'B']
      let columnInfo = [
        {empty: false},
        {empty: false},
        {empty: false},
        {empty: false}
      ]

      expect(tabular._padRow(row, 4, columnInfo))
        .to.deep.equal(['A', 'B', '', ''])
    })

    it('should pad row in the begining', function() {
      let row = ['A', 'B']
      let columnInfo = [
        {empty: true},
        {empty: false},
        {empty: false},
        {empty: true}
      ]

      expect(tabular._padRow(row, 4, columnInfo))
        .to.deep.equal(['', 'A', 'B', ''])
    })

    it('should pad row in the middle', function() {
      let row = ['A', 'B']
      let columnInfo = [
        {empty: false},
        {empty: true},
        {empty: true},
        {empty: false}
      ]

      expect(tabular._padRow(row, 4, columnInfo))
        .to.deep.equal(['A', '', '', 'B'])
    })

  })
})
