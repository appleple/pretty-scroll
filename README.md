# Shadow Scroll


## Features

## Installation
- [npm](https://www.npmjs.com/package/shadow-scroll)
- [standalone](https://raw.githubusercontent.com/appleple/shadow-scroll/master/js/shadow-scroll.js)

via npm
```shell
npm install shadow-scroll --save
```

or yarn

```shell
yarn add shadow-scroll
```

### Basic

```html
<div class="js-container">
  <div class="main">
  </div>
  <div class="sub">
    <div class="js-shadow-scroll">
      <!-- contents here -->
    </div>
  </div>
</div>
```

```js
new ShadowScroll('.js-shadow-scroll',{
	container: '.js-container',
});
```
