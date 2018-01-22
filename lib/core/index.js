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
  offsetTop: 0,
  offsetBottom: 0,
  breakpoint: 767
};

var PrettyScroll = function () {
  function PrettyScroll(ele, option) {
    var _this = this;

    _classCallCheck(this, PrettyScroll);

    this.opt = assign({}, defaults, option);
    this.scrollAmount = -this.opt.offsetTop;
    this.scrollOld = 0;
    this.containerElement = typeof this.opt.container === 'string' ? document.querySelector(this.opt.container) : this.opt.container;
    this.targetElement = typeof ele === 'string' ? document.querySelector(ele) : ele;
    this.targetWidth = this.targetElement.style.width;
    this.targetBoxSizing = this.targetElement.style.boxSizing;
    (0, _util.before)(this.targetElement, '<div class="js-pretty-scroll-before"></div>');
    this.beforeElement = this.targetElement.previousElementSibling;
    this.parentElement = this.targetElement.parentElement;
    this.parentElement.style.position = 'relative';
    window.addEventListener('scroll', function () {
      _this.onScroll();
    });
    window.addEventListener('resize', function () {
      _this.onScroll();
    });
  }

  _createClass(PrettyScroll, [{
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
          targetElement = this.targetElement,
          targetWidth = this.targetWidth,
          targetBoxSizing = this.targetBoxSizing;
      var _opt = this.opt,
          offsetTop = _opt.offsetTop,
          offsetBottom = _opt.offsetBottom,
          condition = _opt.condition,
          breakpoint = _opt.breakpoint;

      var windowHeight = window.innerHeight;
      var windowWidth = window.innerWidth;
      var thisHeight = (0, _util.outerHeight)(targetElement);
      var beforeBottom = (0, _util.getOffset)(beforeElement).top;
      var containerHeight = (0, _util.outerHeight)(containerElement);
      var containerDiffBottom = parseInt(getComputedStyle(containerElement).paddingBottom, 10);
      var containerOffset = (0, _util.getOffset)(containerElement).top;
      var containerBottom = containerHeight + containerOffset;
      var limitHeight = windowHeight > thisHeight ? thisHeight + offsetTop : windowHeight - offsetBottom;
      var offsetHeight = thisHeight - windowHeight;
      var beforeOffsetTop = beforeElement.offsetTop;
      var beforeOffsetLeft = beforeElement.offsetLeft;
      var beforeDiffTop = beforeBottom - containerOffset;

      var style = {
        position: 'static',
        width: targetWidth,
        boxSizing: targetBoxSizing
      };

      if (!condition()) {
        beforeElement.style.height = '0px';
        this.applyStyle(style);
        return;
      }

      if (breakpoint >= windowWidth) {
        beforeElement.style.height = '0px';
        this.applyStyle(style);
        return;
      }

      if (scroll < beforeBottom - offsetTop) {
        beforeElement.style.height = '0px';
        this.applyStyle(style);
        this.scrollOld = scroll;
        return;
      }
      style.width = beforeElement.offsetWidth + 'px';
      style.boxSizing = 'border-box';
      if (scroll + limitHeight + containerDiffBottom <= containerBottom) {
        this.scrollAmount += scroll - this.scrollOld;
        this.scrollOld = scroll;
        if (this.scrollAmount > offsetHeight + offsetBottom) {
          this.scrollAmount = offsetHeight + offsetBottom;
        } else if (this.scrollAmount < -offsetTop) {
          this.scrollAmount = -offsetTop;
        }
        if (this.scrollAmount === offsetHeight + offsetBottom || this.scrollAmount + offsetTop === 0) {
          style.position = 'fixed';
          if (this.scrollAmount + offsetTop === 0 || thisHeight < windowHeight) {
            style.top = offsetTop + 'px';
          } else {
            style.top = windowHeight - thisHeight - offsetBottom + 'px';
          }
          style.left = (0, _util.getOffset)(beforeElement).left + 'px';
        } else {
          style.position = 'absolute';
          if (scroll - this.scrollAmount < beforeBottom) {
            style.top = beforeOffsetTop + 'px';
          } else {
            style.top = scroll - this.scrollAmount - beforeBottom + 'px';
          }
          style.left = beforeOffsetLeft + 'px';
        }
      } else {
        style.position = 'absolute';
        style.top = containerHeight - thisHeight - beforeDiffTop - containerDiffBottom + 'px';
        style.left = beforeOffsetLeft + 'px';
      }
      if (style.position === 'absolute' || style.position === 'fixed') {
        beforeElement.style.height = thisHeight + 'px';
      }
      this.applyStyle(style);
    }
  }]);

  return PrettyScroll;
}();

exports.default = PrettyScroll;
module.exports = exports['default'];