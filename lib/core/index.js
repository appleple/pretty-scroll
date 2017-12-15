'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../lib/util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assign = require('es6-object-assign').assign;

var defaults = {
  container: 'body',
  condition: function condition() {
    return true;
  },
  offsetTop: 0
};

var ShadowScroll = function () {
  function ShadowScroll(ele, option) {
    _classCallCheck(this, ShadowScroll);

    this.opt = assign({}, defaults, option);
    this.scrollAmount = -this.opt.offsetTop;
    this.scrollOld = 0;
    this.containerElement = document.querySelector(this.opt.container);
    this.targetElement = document.querySelector(ele);
    (0, _util.before)(this.targetElement, '<div class="js-shadowscroll-before"></div>');
    this.beforeElement = this.targetElement.previousElementSibling;
    this.targetElement.parentElement.style.position = 'relative';
    window.addEventListener('scroll', this.onScroll.bind(this));
    window.addEventListener('resize', this.onScroll.bind(this));
  }

  _createClass(ShadowScroll, [{
    key: 'applyStyle',
    value: function applyStyle(style) {
      var target = this.targetElement;
      for (var key in style) {
        target.style[key] = style[key];
      }
    }
  }, {
    key: 'onScroll',
    value: function onScroll() {
      var scroll = (0, _util.getScrollTop)();
      var beforeElement = this.beforeElement,
          containerElement = this.containerElement,
          targetElement = this.targetElement;
      var _opt = this.opt,
          offsetTop = _opt.offsetTop,
          condition = _opt.condition;

      var windowHeight = window.innerHeight;
      var thisHeight = (0, _util.outerHeight)(targetElement);
      var beforeBottom = (0, _util.getOffset)(beforeElement).top;
      var containerHeight = (0, _util.outerHeight)(containerElement);
      var containerOffset = (0, _util.getOffset)(containerElement).top;
      var containerBottom = containerHeight + containerOffset;
      var style = {};
      if (!condition()) {
        this.applyStyle({
          position: 'static'
        });
        return true;
      }
      if (beforeBottom + thisHeight > containerBottom) {
        this.applyStyle({
          position: 'static'
        });
        return;
      }

      if (scroll < beforeBottom - offsetTop) {
        this.applyStyle({
          position: 'static'
        });
        this.scrollOld = scroll;
        return;
      }
      style.width = beforeElement.offsetWidth + 'px';
      if (scroll + windowHeight <= containerBottom) {
        this.scrollAmount += scroll - this.scrollOld;
        this.scrollOld = scroll;
        if (this.scrollAmount > thisHeight - windowHeight) {
          this.scrollAmount = thisHeight - windowHeight;
        } else if (this.scrollAmount < -offsetTop) {
          this.scrollAmount = -offsetTop;
        }
        if (this.scrollAmount === thisHeight - windowHeight || this.scrollAmount === -offsetTop) {
          style.position = 'fixed';
          if (this.scrollAmount === -offsetTop) {
            style.top = offsetTop + 'px';
          } else {
            style.top = windowHeight - thisHeight + 'px';
          }
          style.left = (0, _util.getOffset)(beforeElement).left + 'px';
        } else {
          style.position = 'absolute';
          if (scroll - this.scrollAmount < beforeBottom) {
            style.top = beforeElement.offsetTop + 'px';
          } else {
            style.top = scroll - this.scrollAmount - beforeBottom + 'px';
          }
          style.left = '0px';
        }
      } else {
        style.position = 'absolute';
        style.top = containerHeight - thisHeight + 'px';
        style.left = '0px';
      }
      this.applyStyle(style);
    }
  }]);

  return ShadowScroll;
}();

exports.default = ShadowScroll;
module.exports = exports['default'];