'use strict';

const ScrollShadow = require('../index');

const applyJQuery = (jQuery) => {
  jQuery.fn.ScrollShadow = function(settings) {
    if (typeof settings === 'strings'){
    } else {
      new ScrollShadow(this, settings);
    }
    return this;
  }
}

if (typeof define === 'function' && define.amd) {
  define(['jquery'], applyJQuery);
} else {
  const jq = window.jQuery ? window.jQuery : window.$;
  if (typeof jq !== 'undefined') {
    applyJQuery(jq);
  }
}

module.exports = applyJQuery;