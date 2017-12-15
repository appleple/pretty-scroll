import { before, getScrollTop, getOffset, outerHeight } from '../lib/util';

const assign = require('es6-object-assign').assign;

const defaults = {
  container: 'body',
  condition: () => true,
  offsetTop: 0
};

export default class ShadowScroll {
  constructor(ele, option) {
    this.opt = assign({}, defaults, option);
    this.scrollAmount = 0;
    this.scrollOld = 0;
    this.containerElement = document.querySelector(this.opt.container);
    this.targetElement = document.querySelector(ele);
    before(this.targetElement, '<div class="js-shadowscroll-before"></div>');
    this.beforeElement = this.targetElement.previousElementSibling;
    this.targetElement.parentElement.style.position = 'relative';
    window.addEventListener('scroll', this.onScroll.bind(this));
    window.addEventListener('resize', this.onScroll.bind(this));
  }

  applyStyle(style) {
    const target = this.targetElement;
    for (const key in style) {
      target.style[key] = style[key];
    }
  }

  onScroll() {
    const scroll = getScrollTop();
    const { beforeElement, containerElement, targetElement } = this;
    const { offsetTop, condition } = this.opt;
    const windowHeight = window.innerHeight;
    const thisHeight = outerHeight(targetElement);
    const beforeBottom = getOffset(beforeElement).top;
    const containerHeight = outerHeight(containerElement);
    const containerOffset = getOffset(containerElement).top;
    const containerBottom = containerHeight + containerOffset;
    const style = {};
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
      return;
    }
    style.width = `${beforeElement.offsetWidth}px`;
    if (scroll + windowHeight <= containerBottom) {
      this.scrollAmount += scroll - this.scrollOld;
      if (this.scrollAmount > thisHeight - windowHeight) {
        this.scrollAmount = thisHeight - windowHeight;
      } else if (this.scrollAmount < -offsetTop) {
        this.scrollAmount = -offsetTop;
      }
      this.scrollOld = scroll;
      if (this.scrollAmount === thisHeight - windowHeight || this.scrollAmount === -offsetTop) {
        style.position = 'fixed';
        if (this.scrollAmount === -offsetTop) {
          style.top = `${offsetTop}px`;
        } else {
          style.top = `${windowHeight - thisHeight}px`;
        }
        style.left = `${getOffset(beforeElement).left}px`;
      } else {
        style.position = 'absolute';
        if (scroll - this.scrollAmount < beforeBottom) {
          style.top = `${beforeBottom}px`;
        } else {
          style.top = `${scroll - this.scrollAmount - containerOffset}px`;
        }
        style.left = '0px';
      }
    } else {
      style.position = 'absolute';
      style.top = `${containerHeight - thisHeight}px`;
      style.left = '0px';
    }
    this.applyStyle(style);
  }
}
