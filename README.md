# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.

## path路径
    '@':'src'
    '@styles': 'src/assets/styles'
    '@cmps': 'src/components'
    '@pages': 'src/views'
    '@store': 'src/store'
    '@layout': 'src/layout'

## 框架ElementPlus请注意与element的语法区别（https://element-plus.gitee.io/zh-CN/）

## 开始使用命令 Getting started

# 安装yarn
npm install -g yarn
# 查看版本
yarn --version
# 远程地址 clone the project  
# 安装依赖 install dependency
yarn install
# 启动项目 develop
yarn dev
# 打包测试和线上 build for test or production environment
yarn build
