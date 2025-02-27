import {
  before, getScrollTop, getOffset, outerHeight
} from '../lib/util';

const defaults = {
  container: 'body',
  condition: () => true,
  offsetTop: 0,
  offsetBottom: 0,
  breakpoint: 0,
};

export default class PrettyScroll {
  constructor(ele, option) {
    this.opt = {
      ...defaults,
      ...option,
    };
    this.scrollAmount = -this.opt.offsetTop;
    this.scrollOld = 0;
    this.containerElement = typeof this.opt.container === 'string' ? document.querySelector(this.opt.container) : this.opt.container;
    this.targetElement = typeof ele === 'string' ? document.querySelector(ele) : ele;
    this.targetWidth = this.targetElement.style.width;
    this.targetBoxSizing = this.targetElement.style.boxSizing;
    before(this.targetElement, '<div class="js-pretty-scroll-before"></div>');
    this.beforeElement = this.targetElement.previousElementSibling;
    this.parentElement = this.targetElement.parentElement;
    this.parentElement.style.position = 'relative';
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
    this.updateFixedPosition();
  }

  destroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    if (this.beforeElement && this.beforeElement.parentElement) {
      this.beforeElement.parentElement.removeChild(this.beforeElement);
    }
    this.targetElement.style.removeProperty('position');
    this.targetElement.style.removeProperty('width');
    this.targetElement.style.removeProperty('box-sizing');
    this.targetElement.style.removeProperty('top');
    this.targetElement.style.removeProperty('left');
  }

  onScroll() {
    this.updateFixedPosition();
  }

  onResize() {
    this.updateFixedPosition();
  }

  applyStyle(style) {
    const target = this.targetElement;
    for (const key in style) {
      target.style[key] = style[key];
    }
  }

  updateFixedPosition() {
    const scroll = getScrollTop();
    const {
      beforeElement, containerElement, targetElement, targetWidth, targetBoxSizing
    } = this;
    const {
      offsetTop, offsetBottom, condition, breakpoint
    } = this.opt;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const thisHeight = outerHeight(targetElement);
    const beforeBottom = getOffset(beforeElement).top;
    const containerHeight = outerHeight(containerElement);
    const containerDiffBottom = parseInt(getComputedStyle(containerElement).paddingBottom, 10);
    const containerOffset = getOffset(containerElement).top;
    const containerBottom = containerHeight + containerOffset;
    const limitHeight = windowHeight > thisHeight ? thisHeight + offsetTop + offsetBottom : windowHeight;
    const offsetHeight = thisHeight - windowHeight;
    const beforeOffsetTop = beforeElement.offsetTop;
    const beforeOffsetLeft = beforeElement.offsetLeft;
    const beforeDiffTop = beforeBottom - containerOffset;

    const style = {
      position: 'static',
      width: targetWidth,
      boxSizing: targetBoxSizing,
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
      style.top = `${containerHeight - thisHeight - beforeDiffTop - containerDiffBottom - offsetBottom}px`;
      style.left = `${beforeOffsetLeft}px`;
    }
    if (style.position === 'absolute' || style.position === 'fixed') {
      beforeElement.style.height = `${thisHeight}px`;
    }
    this.applyStyle(style);
  }
}
