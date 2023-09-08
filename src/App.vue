<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>

export default {
  name: 'App',
  components: {
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;700&display=swap');
*{
  font-family: 'Noto Sans KR', Helvetica, Arial, sans-serif;
}
#app {
  font-family: 'Noto Sans KR', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

pre {
  font-family: 'Noto Sans KR', Helvetica, Arial, sans-serif !important;
}

/*
=====================================
CSS RESET
=====================================
*/
html, body, div, span, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
abbr, address, cite, code,
del, dfn, em, img, ins, kbd, q, samp,
small, strong, sub, sup, var,
b, i,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, figcaption, figure,
footer, header, hgroup, menu, nav, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
  vertical-align: baseline;
}

body {
  line-height: 1;
}

article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}

ul li {
  list-style: none;
}

a {
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
  background: transparent;
  text-decoration: none;
  color: inherit;
  display: inline-block;
}

img {
  vertical-align: bottom;
}

button {
  border: 0;
  cursor: pointer;
}

/*
=====================================
CUSTOM
=====================================
*/

.clearfix:after {
  content: "";
  display: block;
  clear: both;
}

.container-main {
  box-sizing: border-box;
  padding: 25px;
  position: relative;
  padding-top: 68px;
}

.header {
  position: absolute;
  left: 0;
  top: 0;
}

input {
  border: 1px solid #ddd;
}

</style>
