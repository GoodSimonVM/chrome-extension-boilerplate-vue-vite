<div align="center">
<img src="src/assets/img/svg/vue-logo.svg" width="128" alt="logo"/>
<h1> Chrome Extension Boilerplate with<br/>Vue 3 + Vite + TypeScript</h1>

![](https://img.shields.io/badge/Vue.js-4fc08d?style=flat&logo=vuedotjs&logoColor=white)
![](https://img.shields.io/badge/-Typescript-3178C6?style=flat&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/-Bootstrap-7952B3?style=flat&logo=Bootstrap&logoColor=white&color=DDDDD)
![](https://badges.aleen42.com/src/vitejs.svg)

[//]: # "Comment ![GitHub action badge](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/actions/workflows/build.yml/badge.svg)"
[//]: # '<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/Jonghakseo/chrome-extension-boilerplate-react-viteFactions&count_bg=%23#222222&title_bg=%23#454545&title=😀&edge_flat=true" alt="hits"/>'
[//]: # "> This project is listed in the [Awesome Vite](https://github.com/vitejs/awesome-vite)"

</div>

## Table of Contents

- [Intro](#intro)
- [Features](#features)
- [Installation](#installation)
  - [Procedures](#procedures)
- [Documents](#documents)

## Intro <a name="intro"></a>

This boilerplate is made for creating chrome extensions using React and Typescript.

> The focus was on improving the build speed and development experience with Vite.

## Features <a name="features"></a>

- [Vue.js](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [SASS](https://sass-lang.com/)
- [Bootstrap](https://getbootstrap.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Chrome Extension Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)

## Installation <a name="installation"></a>

### Procedures <a name="procedures"></a>

1. Clone this repository.
2. Change `name` and `description` in package.json => **Auto synchronize with manifest**
3. Run `npm i` (check your node version >= 16)
4. Run `npm run dev`
5. Load Extension on Chrome
   1. Open - Chrome browser
   2. Access - chrome://extensions
   3. Check - Developer mode
   4. Find - Load unpacked extension
   5. Select - `dist` folder in this project (after dev or build)
6. If you want to build in production, Just run `npm run build`.

## Documents <a name="documents"></a>

- [Vite Plugin](https://vitejs.dev/guide/api-plugin.html)
- [ChromeExtension](https://developer.chrome.com/docs/extensions/mv3/)
- [Rollup](https://rollupjs.org/guide/en/)
- [Rollup-plugin-chrome-extension](https://www.extend-chrome.dev/rollup-plugin)

---
