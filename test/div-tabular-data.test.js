// https://github.com/rstacruz/jsdom-global: inject document, window and other DOM API into your Node.js environment.
import 'jsdom-global/register'
import {expect} from 'chai'
import tabular from '../src/scripts/utils/div-tabular-data'
import $ from 'jquery'

describe("div-tabular-data", function() {
  describe("with vanilla HTML", function() {
    before(function () {
      document.body.innerHTML = `<div id="container">
    <div class="row" id="th">
      <div class="col">Col A</div>
      <div class="col">Col B</div>
      <div class="col">Col C</div>
    </div>
    <div class="row" id="tr1">
      <div class="col" id="td1a">1A</div>
      <div class="col" id="td1b"><span id="span1b">1B</span></div>
      <div class="col" id="td1c">1C</div>
    </div>
    <div class="row" id="tr2">
      <div class="col" id="td2a">2A</div>
      <div class="col" id="td2b">2B</div>
      <div class="col" id="td2c">2C</div>
    </div>
    <div class="row" id="tr3">
      <div class="col" id="td3a">3A</div>
      <div class="col" id="td3b">3B</div>
      <div class="col" id="td3c">3C</div>
    </div>
  </div>` 
    })

    describe("getClosestCommonAncestor", () => {
      it("should get closest common ancestor", () => {
        let nodeA = $('#td2c')
        let nodeB = $('#td3a')
        let closestCommonAncestor = tabular._getClosestCommonAncestor(nodeA, nodeB)
        expect(closestCommonAncestor.attr('id')).to.equal('container')
      })
      it("should get closest common ancestor on same row", () => {
        let nodeA = $('#td2c')
        let nodeB = $('#td2a')
        let closestCommonAncestor = tabular._getClosestCommonAncestor(nodeA, nodeB)
        expect(closestCommonAncestor.attr('id')).to.equal('tr2')
      })
    })

    describe("getFirstChildThatContains", () => {
      it("should get first child that contains element", () => {
        let parent = $('#container')
        let containedDescendant = $('#span1b')
        let firstChild = tabular._getFirstChildThatContains(parent, containedDescendant)
        expect(firstChild.attr('id')).to.equal('tr1')
      })

      it("should return undefined if not found", () => {
        let parent = $('#tr2')
        let containedDescendant = $('#span1b')
        let firstChild = tabular._getFirstChildThatContains(parent, containedDescendant)
        expect(firstChild.attr('id')).to.be.undefined
      })
    })

    describe("getChildrenTextAsArray", () => {
      it("should get children text as array", () => {
        expect(tabular._getChildrenTextAsArray($('#tr1'))).to.deep.equal(['1A', '1B', '1C'])
      })
    })

    describe("getTabularDataFromSelection", () => {
      it("should get tabular data", () => {
        var domSelectionRange = {
          start: $('#td1a').get(0),
          end: $('#td3c').get(0)
        }
        expect(tabular.getTabularDataFromSelection(domSelectionRange))
          .to.deep.equal({
            'data': [['1A','1B','1C'],['2A','2B','2C'],['3A','3B','3C']]
          })
      })

      it("should get tabular data from a single row", () => {
        var domSelectionRange = {
          start: $('#td1a').get(0),
          end: $('#td1c').get(0)
        }
        expect(tabular.getTabularDataFromSelection(domSelectionRange))
          .to.deep.equal({
            'data': [['1A','1B','1C']]
          })
      })
    })
  })

  describe("with Amex HTML", function() {

    before(function () {
      document.body.innerHTML = `
        <div id="transaction-xxx" class="index__transaction___2xwam">
           <div role="button" class="index__transactionSummary___yd27P card-block-center
              border-t margin-0 row table-row-link pad-1-tb
              pad-1-lr dls-accent-white-01-bg" aria-expanded="false" tabindex="0">
              <div class="txn-col col-xs-12 col-md-2">
                 <p class="body-1 margin-0-b transaction-date"><span class="pad-1-r icon-md dls-glyph-right"></span><span id="selectionStart0">29 apr</span></p>
              </div>
              <div class="txn-col col-xs-9 col-md-7">
                 <p class="a text-uppercase margin-0-b text-truncate" title="ICA KVANTUM FLEN 020350 FLEN">ICA KVANTUM FLEN 020350 FLEN</p>
              </div>
              <div class="txn-col col-xs-1 col-md-1"></div>
              <div class="text-md-right text-xs-left txn-col col-md-2"><strong class=""><span>805,62&nbsp;kr</span></strong></div>
           </div>
           <span></span>
        </div>` 
    })


    describe("getChildrenTextAsArray", () => {
      it("should get children text as array", () => {
        expect(tabular._getChildrenTextAsArray($('#transaction-xxx'))).to.deep.equal([
          '',
          '29 apr',
          'ICA KVANTUM FLEN 020350 FLEN',
          '',
          '805,62 kr',
          ''
        ])
      })
    })
  })
})
