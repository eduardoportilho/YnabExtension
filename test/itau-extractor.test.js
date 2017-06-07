import {expect} from 'chai'
import itauExtractor from '../src/scripts/utils/data_extractors/itau-extractor'

describe("itau-extractor", () => {
  describe("getTabularDataFromSelection", () => {
    before(() => {
      document.body.innerHTML = `
        <table>
          <tr>
            <td>15/01/2017</td>
            <td id="start">ignore</td>
            <td>ignore</td>
            <td>test-payee-1</td>
            <td>ignore</td>
            <td>2.345,67</td>
            <td> </td>
            <td>ignore</td>
          </tr>
          <tr>
            <td>16/01/2017</td>
            <td>ignore</td>
            <td id="end">ignore</td>
            <td>test-payee-2</td>
            <td>ignore</td>
            <td>0,05</td>
            <td>-</td>
            <td>ignore</td>
          </tr>
        </table>
      `
    })

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
      expect(itauExtractor.canHandleUrl('https://itaubankline.itau.com.br/GRIPNET/bklcom.dll')).to.be.true
    })
    it("should reject non itau-like url", () => {
      expect(itauExtractor.canHandleUrl('https://www.itau.com.br/personnalite/')).to.be.false
    })
  })
})
