import {expect} from 'chai'
import proxyquire from 'proxyquire'
import td from 'testdouble'

describe('base-extractor', function() {
  let baseExtractor
  let tableExtractor
  let domExtractor

  beforeEach(() => {
    // This is necessary to avoid caching './table-extractor' and './dom-extractor', which would break the integration tests
    proxyquire.noPreserveCache()
    tableExtractor = td.object(['getTabularDataFromSelection'])
    domExtractor = td.object(['getTabularDataFromSelection'])
    baseExtractor = proxyquire('../src/scripts/utils/data_extractors/base-extractor', {
      './table-extractor': tableExtractor,
      './dom-extractor': domExtractor
    })
  })

  afterEach(() => {
    td.reset()
  })

  describe('getTabularDataFromSelection', function() {
    it('should use tabular extractor if possible', function() {
      // // given
      let tableData = { data: [['table-data']] }
      td.when(tableExtractor.getTabularDataFromSelection(td.matchers.anything()))
        .thenReturn(tableData)

      // when
      let data = baseExtractor.getTabularDataFromSelection('test-selection', 'test-url')

      // then
      expect(data).to.deep.equal(tableData)
    })

    it('should use DOM extractor if table extractor throws', function() {
      // given 
      let domData = { data: [['dom-data']] }
      td.when(tableExtractor.getTabularDataFromSelection(td.matchers.anything()))
        .thenThrow(new Error('table extractor throws'))

      td.when(domExtractor.getTabularDataFromSelection(td.matchers.anything()))
        .thenReturn(domData)

      // when
      let data = baseExtractor.getTabularDataFromSelection('test-selection', 'test-url')

      // then
      expect(data).to.deep.equal(domData)
    })

    it('should throw if both table and dom extractors thow', function() {
      // given 
      td.when(tableExtractor.getTabularDataFromSelection(td.matchers.anything()))
        .thenThrow(new Error('table extractor throws'))
      td.when(domExtractor.getTabularDataFromSelection(td.matchers.anything()))
        .thenThrow(new Error('DOM extractor throws'))

      // then
      expect (() => {
        baseExtractor.getTabularDataFromSelection('test-selection', 'test-url')
      }).to.throw('Could not find tabular data')
    })
  })

  describe('normalizeTabularData', function() {
    it('should normalize tabular data with no empty cells', function() {
      let data = {
        data:  [
          ['A', 'B', 'C'],
          ['A', 'B', 'C', 'D'],
          ['A', 'B']
        ]
      }
      expect(baseExtractor._normalizeTabularData(data))
        .to.deep.equal({
          data:  [
            ['A', 'B', 'C', ''],
            ['A', 'B', 'C', 'D'],
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
      expect(baseExtractor._normalizeTabularData(data))
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

      expect(baseExtractor._padRow(row, 4, columnInfo))
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

      expect(baseExtractor._padRow(row, 4, columnInfo))
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

      expect(baseExtractor._padRow(row, 4, columnInfo))
        .to.deep.equal(['A', '', '', 'B'])
    })

  })
})
