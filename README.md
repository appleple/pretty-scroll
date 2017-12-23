# Pretty Scroll
A library to make an element follow you as you scroll

## Demos

- [https://codepen.io/appleple/pen/LeZWjm](https://codepen.io/appleple/pen/LeZWjm)
- [https://codepen.io/appleple/pen/jYrBKr](https://codepen.io/appleple/pen/jYrBKr)

## Installation
- [npm](https://www.npmjs.com/package/pretty-scroll)
- [standalone](https://raw.githubusercontent.com/appleple/pretty-scroll/master/js/pretty-scroll.js)

via npm
```shell
npm install pretty-scroll --save
```

or yarn

```shell
yarn add pretty-scroll
```

### Basic

```html
<div class="js-container">
  <div class="main">
  </div>
  <div class="sub">
    <div class="js-pretty-scroll">
      <!-- contents here -->
    </div>
  </div>
</div>
```

```js
new PrettyScroll('.js-sidebar', {
  container: '.js-container',
  breakpoint: 575, // stop running the js when the window size is smaller than 575px
  offsetTop: 20, // space between the sticky element and the top of the window
  offsetBottom: 20, // space between the sticky element and the bottom of the window
  condition: () => true // you can disable the sticky behavior by returning false, it will be executed when you scroll.
});
```
