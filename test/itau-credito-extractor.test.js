import {expect} from 'chai'
import itauExtractor from '../src/scripts/utils/data_extractors/itau-credito-extractor'

describe("itau-credito-extractor", () => {
    before(() => {
      document.body.innerHTML = `
        <table>
          <tr>
            <td id="first-row-single-col">ignore</td>
          </tr>
          <tr>
            <td id="start">15/01/2017</td>
            <td>test-payee-1</td>
            <td>2.345,67</td>
          </tr>
          <tr>
            <td id="end">16/01/2017</td>
            <td>test-payee-2</td>
            <td>-0,05</td>
          </tr>
          <tr>
            <td id="last-row-single-col">ignore</td>
          </tr>
        </table>
        <div id="outside"></div>
      `
    })

  describe("getTabularDataFromSelection", () => {

    it("should get tabular data", () => {
      let domSelectionRange = {
        start: document.querySelector('#start'),
        end: document.querySelector('#end')
      }
      expect(itauExtractor.getTabularDataFromSelection(domSelectionRange)).to.deep.equal(
        {
          header: ['date', 'payee', 'value'],
          data: [
            ['15/01/2017', 'test-payee-1', '2.345,67'],
            ['16/01/2017', 'test-payee-2', '-0,05']
          ]
        }
      )
    })

    it("should get tabular data from inverted selection", () => {
      let domSelectionRange = {
        start: document.querySelector('#end'),
        end: document.querySelector('#start')
      }
      expect(itauExtractor.getTabularDataFromSelection(domSelectionRange)).to.deep.equal(
        {
          header: ['date', 'payee', 'value'],
          data: [
            ['15/01/2017', 'test-payee-1', '2.345,67'],
            ['16/01/2017', 'test-payee-2', '-0,05']
          ]
        }
      )
    })

    it("should throw on invalid selection", () => {
      expect(() => {
        itauExtractor.getTabularDataFromSelection(null)
      }).to.throw('Could not find tabular data')
    })
  })

  describe("canHandleUrl", () => {
    it("should handle itau-like url", () => {
      let domSelectionRange = {
        start: document.querySelector('#end'),
        end: document.querySelector('#start')
      }
      expect(itauExtractor.canHandleUrl('https://itaubankline.itau.com.br/GRIPNET/bklcom.dll', domSelectionRange)).to.be.true
    })

    it("should handle itau-like url if start row has 3 cols", () => {
      let domSelectionRange = {
        start: document.querySelector('#end'),
        end: document.querySelector('#last-row-single-col')
      }
      expect(itauExtractor.canHandleUrl('https://itaubankline.itau.com.br/GRIPNET/bklcom.dll', domSelectionRange)).to.be.true
    })

    it("should handle itau-like url if end row has 3 cols", () => {
      let domSelectionRange = {
        start: document.querySelector('#first-row-single-col'),
        end: document.querySelector('#start')
      }
      expect(itauExtractor.canHandleUrl('https://itaubankline.itau.com.br/GRIPNET/bklcom.dll', domSelectionRange)).to.be.true
    })

    it("should reject invalid selection", () => {
      expect(itauExtractor.canHandleUrl('https://itaubankline.itau.com.br/GRIPNET/bklcom.dll', null)).to.be.false
    })

    it("should reject invalid selection", () => {
      let domSelectionRange = {
        start: document.querySelector('#outside'),
        end: document.querySelector('#outside')
      }
      expect(itauExtractor.canHandleUrl('https://itaubankline.itau.com.br/GRIPNET/bklcom.dll', domSelectionRange)).to.be.false
    })

    it("should reject non itau-like url", () => {
      let domSelectionRange = {
        start: document.querySelector('#end'),
        end: document.querySelector('#start')
      }
      expect(itauExtractor.canHandleUrl('https://www.itau.com.br/personnalite/', domSelectionRange)).to.be.false
    })
  })
})
