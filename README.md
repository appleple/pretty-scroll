# Pretty Scroll


## Features

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
new PrettyScroll('.js-pretty-scroll',{
  container: '.js-container',
});
```
