import {expect} from 'chai'
import td from 'testdouble'
import selection from '../src/scripts/utils/selection'

describe("selection", () => {
  describe("getSelectedElements", () => {
    it("should get selection using anchor and focus nodes", () => {
      let aWindow = {
        getSelection() {
          return {
            anchorNode: {parentElement: 'anchorParent'},
            focusNode: {parentElement: 'focusParent'}
          } 
        }
      }
      expect(selection.getSelectedElements(aWindow)).to.eql({
        start: 'anchorParent',
        end: 'focusParent'
      })
    })

    it("should get selection using extent and base nodes", () => {
      let aWindow = {
        getSelection() {
          return {
            extentNode: {parentElement: 'extentParent'},
            baseNode: {parentElement: 'baseParent'}
          } 
        }
      }
      expect(selection.getSelectedElements(aWindow)).to.eql({
        start: 'extentParent',
        end: 'baseParent'
      })
    })
  })
})
