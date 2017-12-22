import { before, getScrollTop, getOffset, outerHeight, selfHeight } from '../lib/util';

const assign = require('es6-object-assign').assign;

const defaults = {
  container: 'body',
  condition: () => true,
  offsetTop: 0,
  offsetBottom: 0,
  breakpoint: 767
};

export default class PrettyScroll {
  constructor(ele, option) {
    this.opt = assign({}, defaults, option);
    this.scrollAmount = -this.opt.offsetTop;
    this.scrollOld = 0;
    this.containerElement = document.querySelector(this.opt.container);
    this.targetElement = document.querySelector(ele);
    this.targetWidth = this.targetElement.style.width;
    this.targetBoxSizing = this.targetElement.style.boxSizing;
    before(this.targetElement, '<div class="js-pretty-scroll-before"></div>');
    this.beforeElement = this.targetElement.previousElementSibling;
    this.parentElement = this.targetElement.parentElement;
    this.parentElement.style.position = 'relative';
    window.addEventListener('scroll', () => {
      this.onScroll();
    });
    window.addEventListener('resize', () => {
      this.onScroll();
    });
  }

  applyStyle(style) {
    const target = this.targetElement;
    for (const key in style) {
      target.style[key] = style[key];
    }
  }

  onScroll() {
    const scroll = getScrollTop();
    const { beforeElement, containerElement, targetElement, targetWidth, targetBoxSizing } = this;
    const { offsetTop, offsetBottom, condition, breakpoint } = this.opt;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const thisHeight = outerHeight(targetElement);
    const beforeBottom = getOffset(beforeElement).top;
    const containerHeight = outerHeight(containerElement);
    const containerDiffBottom = parseInt(getComputedStyle(containerElement).paddingBottom, 10);
    const containerOffset = getOffset(containerElement).top;
    const containerBottom = containerHeight + containerOffset;
    const limitHeight = windowHeight > thisHeight ? thisHeight + offsetTop : windowHeight - offsetBottom;
    const offsetHeight = thisHeight - windowHeight;
    const beforeOffsetTop = beforeElement.offsetTop;
    const beforeOffsetLeft = beforeElement.offsetLeft;
    const beforeDiffTop = beforeBottom - containerOffset;

    const style = {
      position: 'static',
      width: targetWidth,
      boxSizing: targetBoxSizing
    };

    if (!condition()) {
      this.applyStyle(style);
      return;
    }

    if (breakpoint >= windowWidth) {
      this.applyStyle(style);
      return;
    }

    // when side column is larger than container
    if (beforeOffsetTop + thisHeight >= selfHeight(containerElement)) {
      this.applyStyle(style);
      return;
    }

    if (scroll < beforeBottom - offsetTop) {
      this.applyStyle(style);
      this.scrollOld = scroll;
      return;
    }
    style.width = `${beforeElement.offsetWidth}px`;
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
          style.top = `${offsetTop}px`;
        } else {
          style.top = `${windowHeight - thisHeight - offsetBottom}px`;
        }
        style.left = `${getOffset(beforeElement).left}px`;
      } else {
        style.position = 'absolute';
        if (scroll - this.scrollAmount < beforeBottom) {
          style.top = `${beforeOffsetTop}px`;
        } else {
          style.top = `${scroll - this.scrollAmount - beforeBottom}px`;
        }
        style.left = `${beforeOffsetLeft}px`;
      }
    } else {
      style.position = 'absolute';
      style.top = `${containerHeight - thisHeight - beforeDiffTop - containerDiffBottom}px`;
      style.left = `${beforeOffsetLeft}px`;
    }
    this.applyStyle(style);
  }
}
