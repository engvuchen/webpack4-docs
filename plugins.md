# AutomaticPrefetchPlugin

The `AutomaticPrefetchPlugin` discovers __all modules__ from the previous compilation upfront while watching for changes, trying to improve the incremental build times. Compared to [`PrefetchPlugin`](https://v4.webpack.docschina.org/plugins/prefetch-plugin/) which discovers a __single module__ upfront.

W> May or may not have a performance benefit since the incremental build times are pretty fast.

__webpack.config.js__

``` javascript
module.exports = {
  // ...
  plugins: [
    new webpack.AutomaticPrefetchPlugin()
  ]
};
```

# BabelMinifyWebpackPlugin

一个用于<a href="https://github.com/babel/minify">babel-minify</a>的 webpack 插件 - 基于 babel 的 minifier

## 安装

```bash
npm install babel-minify-webpack-plugin --save-dev
```

## 用法

```js
// webpack.config.js
const MinifyPlugin = require("babel-minify-webpack-plugin");
module.exports = {
  entry: //...,
  output: //...,
  plugins: [
    new MinifyPlugin(minifyOpts, pluginOpts)
  ]
}
```

## 选项

###

`minifyOpts` 被传递给 babel-preset-minify。 你可以在包目录中找到[所有可用的选项](https://github.com/babel/minify/tree/master/packages/babel-preset-minify#options)。

`Default: {}`

#### pluginOpts

+ `test`: JS文件扩展名正则表达式。 默认: `/\.js($|\?)/i`
+ `comments`: 保留注释。 默认: `/^\**!|@preserve|@license|@cc_on/`, `falsy` 值将移除所有注释。可以接受函数，带有测试属性的（正则）的对象和值。
+ `sourceMap`: 默认: 使用 [webpackConfig.devtool](https://webpack.docschina.org/configuration/devtool/)。 这里的设置会覆写`devtool`的设置。
+ `parserOpts`: 配置具有特殊解析器选项的babel。
+ `babel`: 传入一个自定义的 babel-core，代替原来的。 `require("babel-core")`
+ `minifyPreset`: 传入一个自定义的 minify preset，代替原来的。 - `require("babel-preset-minify")`.

## 为什么

你也可以在webpack中使用[babel-loader](https://github.com/babel/babel-loader)，引入 `minify` [作为一个预设](https://github.com/babel/minify#babel-preset)并且应该运行的更快 - 因为 `babel-minify` 将运行在更小的文件。但是，这个插件为什么还存在呢？

+ webpack loader 对单个文件进行操作，并且 minify preset 作为一个 webpack loader将会把每个文件视为在浏览器全局范围内直接执行（默认情况下），并且不会优化顶级作用域内的某些内容。要在文件的顶级作用域内进行优化，请在 minifyOptions 中设置 `mangle: { topLevel: true }`。
+ 当你排除 `node_modules` 不通过 babel-loader 运行时，babel-minify 优化不会应用于被排除的文件，因为它们不会通过 minifier。
+ 当你使用带有 webpack 的 babel-loader 时，由 webpack 为模块系统生成的代码不会通过 loader，并且不会通过 babel-minify 进行优化。
+ 一个 webpack 插件可以在整个 chunk/bundle 输出上运行，并且可以优化整个bundle，你可以看到一些细微的输出差异。但是，由于文件大小通常非常大，所以会慢很多。所以这里有[一个想法](https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/8) - 我们可以将一些优化作为 loader 的一部分，并在插件中进行一些优化。

## 维护人员

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars2.githubusercontent.com/u/294474?v=3&s=150">
        </br>
        <a href="https://github.com/boopathi">Boopathi Rajaa</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/166921?v=3&s=150">
        </br>
        <a href="https://github.com/bebraw">Juho Vepsäläinen</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars2.githubusercontent.com/u/8420490?v=3&s=150">
        </br>
        <a href="https://github.com/d3viant0ne">Joshua Wiens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/533616?v=3&s=150">
        </br>
        <a href="https://github.com/SpaceK33z">Kees Kluskens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/3408176?v=3&s=150">
        </br>
        <a href="https://github.com/TheLarkInn">Sean Larkin</a>
      </td>
    </tr>
  <tbody>
</table>

[npm]: https://img.shields.io/npm/v/babel-minify-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/babel-minify-webpack-plugin

[deps]: https://david-dm.org/webpack-contrib/babel-minify-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/babel-minify-webpack-plugin

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: https://travis-ci.org/webpack-contrib/babel-minify-webpack-plugin.svg?branch=master
[test-url]: https://travis-ci.org/webpack-contrib/babel-minify-webpack-plugin

[cover]: https://codecov.io/gh/webpack-contrib/babel-minify-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/babel-minify-webpack-plugin

[quality]: https://www.bithound.io/github/webpack-contrib/babel-minify-webpack-plugin/badges/score.svg
[quality-url]: https://www.bithound.io/github/webpack-contrib/babel-minify-webpack-plugin

# BannerPlugin

为每个 chunk 文件头部添加 banner。

```javascript
const webpack = require('webpack');

new webpack.BannerPlugin(banner);
// or
new webpack.BannerPlugin(options);
```


## 选项

<!-- eslint-skip -->

```js
{
  banner: string | function, // 其值为字符串或函数，将作为注释存在
  raw: boolean, // 如果值为 true，将直出，不会被作为注释
  entryOnly: boolean, // 如果值为 true，将只在入口 chunks 文件中添加
  test: string | RegExp | Array,
  include: string | RegExp | Array,
  exclude: string | RegExp | Array,
}
```

## Usage


```javascript
import webpack from 'webpack';

// string
new webpack.BannerPlugin({
  banner: 'hello world'
});

// function
new webpack.BannerPlugin({
  banner: (yourVariable) => { return `yourVariable: ${yourVariable}`; }
});
```


## 占位符(placeholder)

从 webpack 2.5.0 开始，会对 `banner` 字符串中的占位符取值：

```javascript
import webpack from 'webpack';

new webpack.BannerPlugin({
  banner: 'hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]'
});
```

# ClosureWebpackPlugin

[![npm version](https://badge.fury.io/js/closure-webpack-plugin.svg)](https://badge.fury.io/js/closure-webpack-plugin)

This plugin supports the use of Google's Closure Tools with webpack.

**Note: This is the webpack 4 branch.**

[Closure-Compiler](https://developers.google.com/closure/compiler/) is a full optimizing compiler and transpiler.
It offers unmatched optimizations, provides type checking and can easily target transpilation to different versions of ECMASCRIPT.

[Closure-Library](https://developers.google.com/closure/library/) is a utility library designed for full compatibility
with Closure-Compiler. 

## Older Versions

For webpack 3 support, see https://github.com/webpack-contrib/closure-webpack-plugin/tree/webpack-3

## Install

You must install both the google-closure-compiler package as well as the closure-webpack-plugin.

```
npm install --save-dev closure-webpack-plugin google-closure-compiler
```

## Usage example

```js
const ClosurePlugin = require('closure-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new ClosurePlugin({mode: 'STANDARD'}, {
        // compiler flags here
        //
        // for debuging help, try these:
        //
        // formatting: 'PRETTY_PRINT'
        // debug: true,
        // renaming: false
      })
    ]
  }
};
```

## Options

 * **platform** - `native`, `java` or `javascript`. Controls which version to use of closure-compiler.
     By default the plugin will attempt to automatically choose the fastest option available.
    - `JAVASCRIPT` does not require the JVM to be installed. Not all flags are supported. 
    - `JAVA` utilizes the jvm. Utilizes multiple threads for parsing and results in faster compilation for large builds.
    - `NATIVE` only available on linux or MacOS. Faster compilation times without requiring a JVM.
 * **mode** - `STANDARD` (default) or `AGGRESSIVE_BUNDLE`. Controls how the plugin utilizes the compiler.  
    - `STANDARD` mode, closure-compiler is used as a direct replacement for other minifiers as well as most Babel transformations.  
    - `AGGRESSIVE_BUNDLE` mode, the compiler performs additional optimizations of modules to produce a much smaller file
 * **childCompilations** - boolean or function. Defaults to `false`.
  In order to decrease build times, this plugin by default only operates on the main compilation.
  Plugins such as extract-text-plugin and html-webpack-plugin run as child compilations and
  usually do not need transpilation or minification. You can enable this for all child compilations
  by setting this option to `true`. For specific control, the option can be set to a function which
  will be passed a compilation object.  
  Example: `function(compilation) { return /html-webpack/.test(compilation.name); }`.
 * **output** - An object with either `filename` or `chunkfilename` properties. Used to override the
  output file naming for a particular compilation. See https://webpack.js.org/configuration/output/
  for details.
  
## Compiler Flags

The plugin controls several compiler flags. The following flags should not be used in any mode:

 * module_resolution
 * output_wrapper
 * dependency_mode
 * create_source_map
 * module
 * entry_point

## Aggressive Bundle Mode

In this mode, the compiler rewrites CommonJS modules and hoists require calls. Some modules are not compatible with this type of rewritting. In particular, hoisting will cause the following code to execute out of order:

```js
const foo = require('foo');
addPolyfillToFoo(foo);
const bar = require('bar');
```

Aggressive Bundle Mode utilizes a custom runtime in which modules within a chunk file are all included in the same scope.
This avoids [the cost of small modules](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/).

In Aggressive Bundle Mode, a file can only appear in a single output chunk. Use the [Commons Chunk Plugin](https://webpack.docschina.org/plugins/commons-chunk-plugin/) to split duplicated files into a single output chunk.

You can add the plugin multiple times. This easily allows you to target multiple output languages.
Use `ECMASCRIPT_2015` for modern browsers and `ECMASCRIPT5` for older browsers.

Use the `output` option to change the filenames of specific plugin instances.

Use `<script type="module" src="es6_out_path.js">` to target modern browsers and
`<script nomodule src="es5_out_path.js">` for older browsers.

See the [es5 and es6 output demo](https://github.com/webpack-contrib/closure-webpack-plugin/tree/master/demo/es5-and-es6)
for an example.

## Other tips for Use
 * Don't use babel at the same time - closure-compiler is also a transpiler.
   If you need [features not yet supported](https://github.com/google/closure-compiler/wiki/ECMAScript6) by closure-compiler, have babel
   only target those features. Closure Compiler can transpile async/await - you don't need babel for that functionality either.

# Closure Library Plugin
In order for webpack to recognize `goog.require`, `goog.provide`, `goog.module` and related primitives,
a separate plugin is shipped.

```js
const ClosurePlugin = require('closure-webpack-plugin');

module.exports = {
  plugins: [
    new ClosurePlugin.LibraryPlugin({
      closureLibraryBase: require.resolve(
        'google-closure-library/closure/goog/base'
      ),
      deps: [
        require.resolve('google-closure-library/closure/goog/deps'),
        './public/deps.js',
      ],
    })
  ]
};
```
The plugin adds extra functionality to support using Closure Library without Closure Compiler.
This is typically used during development mode. When the webpack mode is `production`,
only dependency information is provided to webpack as Closure Compiler will natively recognize
the Closure Library primitives.

The Closure Library Plugin is only compatible with the `AGGRESSIVE_BUNDLE` mode of the Closure-Compiler
webpack plugin.

## Options

 * **closureLibraryBase** - (optional) string. Path to the base.js file in Closure-Library.
 * **deps** - (optional) string or Array. Closures style dependency mappings. Typically generated by the
   [depswriter.py script](https://developers.google.com/closure/library/docs/depswriter) included with Closure-Library.
 * **extraDeps** - (optional) Object. Mapping of namespace to file path for closure-library provided namespaces.
   
   
## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/ChadKillingsworth">
          <img width="150" alt="" height="150" src="https://avatars.githubusercontent.com/u/1247639?v=3">
          </br>
          Chad Killingsworth
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/d3viant0ne">
          <img width="150" alt="" height="150" src="https://avatars.githubusercontent.com/u/8420490?v=3">
          </br>
          Joshua Wiens
        </a>
      </td>
    </tr>
  <tbody>
</table>

# CommonsChunkPlugin

`CommonsChunkPlugin` 插件，是一个可选的用于建立一个独立文件(又称作 chunk)的功能，这个文件包括多个入口 `chunk` 的公共模块。

W> The CommonsChunkPlugin 已经从 webpack v4 legato 中移除。想要了解在最新版本中如何处理 chunk，请查看 [SplitChunksPlugin](https://v4.webpack.docschina.org/plugins/split-chunks-plugin/)。

通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存到缓存中供后续使用。这个带来页面速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。

```javascript
new webpack.optimize.CommonsChunkPlugin(options);
```


## 配置

<!-- eslint-skip -->

```js
{
  name: string, // or
  names: string[],
  // 这是 common chunk 的名称。已经存在的 chunk 可以通过传入一个已存在的 chunk 名称而被选择。
  // 如果一个字符串数组被传入，这相当于插件针对每个 chunk 名被多次调用
  // 如果该选项被忽略，同时 `options.async` 或者 `options.children` 被设置，所有的 chunk 都会被使用，
  // 否则 `options.filename` 会用于作为 chunk 名。
  // When using `options.async` to create common chunks from other async chunks you must specify an entry-point
  // chunk name here instead of omitting the `option.name`.

  filename: string,
  // common chunk 的文件名模板。可以包含与 `output.filename` 相同的占位符。
  // 如果被忽略，原本的文件名不会被修改(通常是 `output.filename` 或者 `output.chunkFilename`)。
  // This option is not permitted if you're using `options.async` as well, see below for more details.

  minChunks: number|Infinity|function(module, count) => boolean,
  // 在传入  公共chunk(commons chunk) 之前所需要包含的最少数量的 chunks 。
  // 数量必须大于等于2，或者少于等于 chunks的数量
  // 传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
  // 你可以传入一个 `function` ，以添加定制的逻辑（默认是 chunk 的数量）

  chunks: string[],
  // 通过 chunk name 去选择 chunks 的来源。chunk 必须是  公共chunk 的子模块。
  // 如果被忽略，所有的，所有的 入口chunk (entry chunk) 都会被选择。

  children: boolean,
  // 如果设置为 `true`，所有公共 chunk 的子模块都会被选择

  deepChildren: boolean,
  // 如果设置为 `true`，所有公共 chunk 的后代模块都会被选择

  async: boolean|string,
  // 如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
  // 它会与 `options.chunks` 并行被加载。
  // Instead of using `option.filename`, it is possible to change the name of the output file by providing
  // the desired string here instead of `true`.

  minSize: number,
  // 在 公共chunk 被创建立之前，所有 公共模块 (common module) 的最少大小。
}
```

T> webpack1 构造函数 `new webpack.optimize.CommonsChunkPlugin(options, filenameTemplate, selectedChunks, minChunks)` 不再被支持。请使用相应的选项对象。


## 例子

### 公共chunk 用于 入口chunk (entry chunk)

生成一个额外的 chunk 包含入口chunk 的公共模块。

```javascript
new webpack.optimize.CommonsChunkPlugin({
  name: 'commons',
  // (公共 chunk(commnon chunk) 的名称)

  filename: 'commons.js',
  // (公共chunk 的文件名)

  // minChunks: 3,
  // (模块必须被3个 入口chunk 共享)

  // chunks: ["pageA", "pageB"],
  // (只使用这些 入口chunk)
});
```

你必须在 入口chunk 之前加载生成的这个 公共chunk:

```html
<script src="commons.js" charset="utf-8"></script>
<script src="entry.bundle.js" charset="utf-8"></script>
```


### 明确第三方库 chunk

将你的代码拆分成公共代码和应用代码。

```javascript
module.exports = {
  //...
  entry: {
    vendor: ['jquery', 'other-lib'],
    app: './entry'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // filename: "vendor.js"
      // (给 chunk 一个不同的名字)

      minChunks: Infinity,
      // (随着 entry chunk 越来越多，
      // 这个配置保证没其它的模块会打包进 vendor chunk)
    })
  ]
};
```

```html
<script src="vendor.js" charset="utf-8"></script>
<script src="app.js" charset="utf-8"></script>
```

T> 结合长期缓存，你可能需要使用这个[插件](https://github.com/soundcloud/chunk-manifest-webpack-plugin)去避免 公共chunk 改变。 你也需要使用 `records` 去保持稳定的模块 id，例如，使用 [`NamedModulesPlugin`](https://v4.webpack.docschina.org/plugins/named-modules-plugin) 或 [`HashedModuleIdsPlugin`](https://v4.webpack.docschina.org/plugins/hashed-module-ids-plugin)。


###  将公共模块打包进父 chunk

使用[代码拆分](https://v4.webpack.docschina.org/guides/code-splitting)功能，一个 chunk 的多个子 chunk 会有公共的依赖。为了防止重复，可以将这些公共模块移入父 chunk。这会减少总体的大小，但会对首次加载时间产生不良影响。如果预期到用户需要下载许多兄弟 chunks（例如，入口 trunk 的子 chunk），那这对改善加载时间将非常有用。

```javascript
new webpack.optimize.CommonsChunkPlugin({
  // names: ["app", "subPageA"]
  // (选择 chunks，或者忽略该项设置以选择全部 chunks)

  children: true,
  // (选择所有被选 chunks 的子 chunks)

  // minChunks: 3,
  // (在提取之前需要至少三个子 chunk 共享这个模块)
});
```


### 额外的异步 公共chunk

与上面的类似，但是并非将公共模块移动到父 chunk（增加初始加载时间），而是使用新的异步加载的额外公共chunk。当下载额外的 chunk 时，它将自动并行下载。

```javascript
new webpack.optimize.CommonsChunkPlugin({
  name: 'app',
  // or
  names: ['app', 'subPageA'],
  // the name or list of names must match the name or names
  // of the entry points that create the async chunks

  children: true,
  // (选择所有被选 chunks 的子 chunks)

  async: true,
  // (创建一个异步 公共chunk)

  minChunks: 3,
  // (在提取之前需要至少三个子 chunk 共享这个模块)
});
```


### 给 `minChunks` 配置传入函数

你也可以给 `minChunks` 传入一个函数。这个函数会被 `CommonsChunkPlugin` 插件回调，并且调用函数时会传入 `module` 和 `count` 参数。

`module` 参数代表每个 chunks 里的模块，这些 chunks 是你通过 `name`/`names` 参数传入的。
`module` has the shape of a [NormalModule](https://github.com/webpack/webpack/blob/master/lib/NormalModule.js), which has two particularly useful properties for this use case:

- `module.context`: The directory that stores the file. For example: `'/my_project/node_modules/example-dependency'`
- `module.resource`: The name of the file being processed. For example: `'/my_project/node_modules/example-dependency/index.js'`

`count` 参数表示 `module` 被使用的 chunk 数量。

当你想要对 `CommonsChunk` 如何决定模块被打包到哪里的算法有更为细致的控制， 这个配置就会非常有用。

```javascript
new webpack.optimize.CommonsChunkPlugin({
  name: 'my-single-lib-chunk',
  filename: 'my-single-lib-chunk.js',
  minChunks: function(module, count) {
    // 如果模块是一个路径，而且在路径中有 "somelib" 这个名字出现，
    // 而且它还被三个不同的 chunks/入口chunk 所使用，那请将它拆分到
    // 另一个分开的 chunk 中，chunk 的 keyname 是 "my-single-lib-chunk"，而文件名是 "my-single-lib-chunk.js"
    return module.resource && (/somelib/).test(module.resource) && count === 3;
  }
});
```

正如上面看到的，这个例子允许你只将其中一个库移到一个分开的文件当中，当而仅当函数中的所有条件都被满足了。

This concept may be used to obtain implicit common vendor chunks:

```javascript
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function (module) {
    // this assumes your vendor imports exist in the node_modules directory
    return module.context && module.context.includes('node_modules');
  }
});
```

In order to obtain a single CSS file containing your application and vendor CSS, use the following `minChunks` function together with [`ExtractTextPlugin`](https://v4.webpack.docschina.org/plugins/extract-text-webpack-plugin/):

```javascript
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function (module) {
    // This prevents stylesheet resources with the .css or .scss extension
    // from being moved from their original chunk to the vendor chunk
    if(module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
      return false;
    }
    return module.context && module.context.includes('node_modules');
  }
});
```

## Manifest file

To extract the webpack bootstrap logic into a separate file, use the `CommonsChunkPlugin` on a `name` which is not defined as `entry`. Commonly the name `manifest` is used. See the [caching guide](https://v4.webpack.docschina.org/guides/caching) for details.

```javascript
new webpack.optimize.CommonsChunkPlugin({
  name: 'manifest',
  minChunks: Infinity
});
```

## Combining implicit common vendor chunks and manifest file

Since the `vendor` and `manifest` chunk use a different definition for `minChunks`, you need to invoke the plugin twice:

```javascript
[
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function(module){
      return module.context && module.context.includes('node_modules');
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  }),
];
```

## More Examples

- [Common and Vendor Chunks](https://github.com/webpack/webpack/tree/master/examples/common-chunk-and-vendor-chunk)
- [Multiple Common Chunks](https://github.com/webpack/webpack/tree/8b888fedfaeaac6bd39168c0952cc19e6c34280a/examples/multiple-commons-chunks)
- [Multiple Entry Points with Commons Chunk](https://github.com/webpack/webpack/tree/8b888fedfaeaac6bd39168c0952cc19e6c34280a/examples/multiple-entry-points-commons-chunk-css-bundle)

# CompressionWebpackPlugin

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



预先提供带 Content-Encoding 编码的压缩版本的资源。

## 需求

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## 起步

To begin, you'll need to install `compression-webpack-plugin`:

```console
$ npm install compression-webpack-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    new CompressionPlugin()
  ]
}
```

And run `webpack` via your preferred method.

## 选项

### `test`

类型：`String|RegExp|Array<String|RegExp>`
Default: `undefined`

匹配所有对应的文件。

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  test: /\.js(\?.*)?$/i
})
```

### `include`

类型：`String|RegExp|Array<String|RegExp>`
默认：`undefined`

所有包含(include)的文件。

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  include: /\/includes/
})
```

### `exclude`

类型：`String|RegExp|Array<String|RegExp>`
默认：`undefined`

所有排除(exclude)的文件。

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  exclude: /\/excludes/
})
```

### `cache`

类型：`Boolean|String`
默认：`false`

Enable file caching.
The default path to cache directory: `node_modules/.cache/compression-webpack-plugin`.

#### `Boolean`

Enable/disable file caching.

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  cache: true
})
```

#### `String`

Enable file caching and set path to cache directory.

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  cache: 'path/to/cache'
})
```

### `filename`

类型：`String|Function`
默认：`[path].gz[query]`

目标资源文件名称。

#### `String`

`[file]` is replaced with the original asset filename.
`[path]` is replaced with the path of the original asset.
`[query]` is replaced with the query.

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  filename: '[path].gz[query]'
})
```

#### `Function`

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  filename(info) {
    // info.file is the original asset filename
    // info.path is the path of the original asset
    // info.query is the query
    return `${info.path}.gz${info.query}`
  }
})
```

### `algorithm`

类型：`String|Function`
默认：`gzip`

The compression algorithm/function.

#### `String`

The algorithm is taken from [zlib](https://nodejs.org/api/zlib.html).

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  algorithm: 'gzip'
})
```

#### `Function`

Allow to specify a custom compression function.

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  algorithm(input, compressionOptions, callback) {
    return compressionFunction(input, compressionOptions, callback);
  }
})
```

### `compressionOptions`

类型：`Object`
默认：`{ level: 9 }`

If you use custom function for the `algorithm` option, the default value is `{}`.

Compression options.
You can find all options here [zlib](https://nodejs.org/api/zlib.html#zlib_class_options).

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  compressionOptions: { level: 1 }
})
```

### `threshold`

类型：`Number`
默认：`0`

只处理比这个值大的资源。按字节计算。

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  threshold: 8192
})
```

### `minRatio`

类型：`Number`
默认：`0.8`

只有压缩率比这个值小的资源才会被处理（`minRatio = 压缩大小 / 原始大小`）。
Example: you have `image.png` file with 1024b size, compressed version of file has 768b size, so `minRatio` equal `0.75`.
In other words assets will be processed when the `Compressed Size / Original Size` value less `minRatio` value.
You can use `1` value to process all assets.

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  minRatio: 0.8
})
```

### `deleteOriginalAssets`

类型：`Boolean`
默认：`false`

是否删除原始资源。

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  deleteOriginalAssets: true
})
```

## 示例

### 使用 Zopfli

Prepare compressed versions of assets using `zopfli` library.

> ℹ️ `@gfx/zopfli` require minimum `8` version of `node`.

To begin, you'll need to install `@gfx/zopfli`:

```console
$ npm install @gfx/zopfli --save-dev
```

**webpack.config.js**

```js
const zopfli = require('@gfx/zopfli');

module.exports = {
  plugins: [
    new CompressionPlugin({
      compressionOptions: {
         numiterations: 15
      },
      algorithm(input, compressionOptions, callback) {
        return zopfli.gzip(input, compressionOptions, callback);
      }
    })
  ]
}
```

### 使用 Brotli

[Brotli](https://en.wikipedia.org/wiki/Brotli) is a compression algorithm originally developed by Google, and offers compression superior to gzip.

Node 11.7.0 and later has [native support](https://nodejs.org/api/zlib.html#zlib_zlib_createbrotlicompress_options) for Brotli compression in its zlib module.

We can take advantage of this built-in support for Brotli in Node 11.7.0 and later by just passing in the appropriate `algorithm` to the CompressionPlugin:

```js
// 在 webpack.config.js 中
module.exports = {
  plugins: [
    new CompressionPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    })
  ]
}
```

**N.B.:** The `level` option matches `BROTLI_PARAM_QUALITY` [for Brotli-based streams](https://nodejs.org/api/zlib.html#zlib_for_brotli_based_streams)

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](https://raw.githubusercontent.com/webpack-contrib/compression-webpack-plugin/master/.github/CONTRIBUTING.md)

## License

[MIT](https://raw.githubusercontent.com/webpack-contrib/compression-webpack-plugin/master/LICENSE)

[npm]: https://img.shields.io/npm/v/compression-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/compression-webpack-plugin

[node]: https://img.shields.io/node/v/compression-webpack-plugin.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/compression-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/compression-webpack-plugin

[tests]: https://img.shields.io/circleci/project/github/webpack-contrib/compression-webpack-plugin.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/compression-webpack-plugin

[cover]: https://codecov.io/gh/webpack-contrib/compression-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/compression-webpack-plugin

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[size]: https://packagephobia.now.sh/badge?p=compression-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=compression-webpack-plugin

# ContextReplacementPlugin

_上下文(context)_ 与一个 [含有表达式的 require 语句](https://v4.webpack.docschina.org/guides/dependency-management/#require-with-expression) 相关，例如 `require('./locale/' + name + '.json')`。遇见此类表达式时，webpack 查找目录 (`'./locale/'`) 下符合正则表达式 (`/^.*\.json$/`)的文件。由于 `name` 在编译时(compile time)还是未知的，webpack 会将每个文件都作为模块引入到 bundle 中。

`上下文替换插件(ContextReplacementPlugin)` 允许你覆盖查找规则，该插件有许多配置方式：


## 用法

<!-- eslint-skip -->

```javascript
new webpack.ContextReplacementPlugin(
  resourceRegExp: RegExp,
  newContentResource?: string,
  newContentRecursive?: boolean,
  newContentRegExp?: RegExp
)
```

如果资源（或目录）符合 `resourceRegExp` 正则表达式，插件会替换默认资源为 `newContentResource`，布尔值 `newContentRecursive` 表明是否使用递归查找，`newContextRegExp` 用于筛选新上下文里的资源。如果 `newContentResource` 为相对路径，会相对于前一匹配资源路径去解析。

这是一个限制模块使用的小例子：

```javascript
new webpack.ContextReplacementPlugin(
  /moment[/\\]locale$/,
  /de|fr|hu/
);
```

限定查找 `moment/locale` 上下文里符合 `/de|fr|hu/` 表达式的文件，因此也只会打包这几种本地化内容（更多详细信息，请查看[这个 issue](https://github.com/moment/moment/issues/2373)）。


## 内容回调函数

```javascript
new webpack.ContextReplacementPlugin(
  resourceRegExp: RegExp,
  newContentCallback: (data) => void
);
```

`newContentCallback` 函数的第一形参为[`上下文模块工厂(ContextModuleFactory)`的 `data` 对象](https://v4.webpack.docschina.org/api/plugins/module-factories/)，你需要覆写该对象的 `request` 属性。

使用这个回调函数，我们可以动态地将请求重定向到一个新的位置：

```javascript
new webpack.ContextReplacementPlugin(/^\.\/locale$/, (context) => {
  if ( !/\/moment\//.test(context.context) ) return;

  Object.assign(context, {
    regExp: /^\.\/\w+/,
    request: '../../locale' // 相对路径解析
  });
});
```


## 其他选项

`newContentResource` 和 `newContentCreateContextMap` 参数也可用：

```javascript
new webpack.ContextReplacementPlugin(
  resourceRegExp: RegExp,
  newContentResource: string,
  newContentCreateContextMap: object // 将运行时请求(runtime-request)映射到编译时请求(compile-time request)
);
```

这两个参数可以一起使用，来更加有针对性的重定向请求。 `newContentCreateContextMap` 允许你将运行时的请求，映射为形式为对象的编译请求：

```javascript
new ContextReplacementPlugin(/selector/, './folder', {
  './request': './request',
  './other-request': './new-request'
});
```

# CopyWebpackPlugin

复制单独文件或者整个文档到build目录下

## Install

```
npm install --save-dev copy-webpack-plugin
```

## Usage

`new CopyWebpackPlugin([patterns], options)`

A pattern looks like:
模式看起来像：
`{ from: 'source', to: 'dest' }`


或者，在只有带有默认目标的`from`的简单情况下，您可以使用字符串原语而不是对象：
`'source'`

###

| 名称 | 需求 | 默认     | 详情                                                 |
|------|----------|------------ |---------------------------------------------------------|
| `from` | Y        |             | _examples:_<br>'relative/file.txt'<br>'/absolute/file.txt'<br>'relative/dir'<br>'/absolute/dir'<br>'\*\*/\*'<br>{glob:'\*\*/\*', dot: true}<br><br>Globs 接受 [minimatch 选项](https://github.com/isaacs/minimatch) |
| `to`   | N        | output root if `from` is file or dir<br><br>resolved glob path if `from` is glob | _examples:_<br>'relative/file.txt'<br>'/absolute/file.txt'<br>'relative/dir'<br>'/absolute/dir'<br>'relative/[name].[ext]'<br>'/absolute/[name].[ext]'<br><br>模板是 [file-loader patterns](https://v4.webpack.docschina.org/loaders/file-loader/) |
| `toType` | N | **'file'** if `to` has extension or `from` is file<br><br>**'dir'** if `from` is directory, `to` has no extension or ends in '/'<br><br>**'template'** if `to` contains [a template pattern](https://v4.webpack.docschina.org/loaders/file-loader/) | |
| `context` | N | options.context \|\| compiler.options.context | 确定如何解释from路径的路径 |
| `flatten` | N | false | 删除所有目录引用并仅复制文件名<br> <br>如果文件具有相同的名称，则结果是不确定的 |
| `ignore` | N | [] | 额外的 globs 去忽视这个模式 |
| `transform` | N | function(content, path) {<br>&nbsp;&nbsp;return content;<br>} | 在写入webpack之前修改文件内容的函数 |
| `force` | N | false | 覆盖compilation.assets中已有的文件（通常由其他插件添加） |

#### Available options:

| Name | Default | Details |
| ---- | ------- | ------- |
| `context` | compiler.options.context | 确定如何解释所有模式共享的`from`路径的路径 |
| `ignore` | [] | 要忽略的数组（应用于`from`） |
| `copyUnmodified` | false | 使用watch或webpack-dev-server时，无论修改如何，都会复制文件。 无论此选项如何，所有文件都将在首次构建时复制。 |
| `debug` | **'warning'** | _options:_<br>**'warning'** - 只有警告<br>**'信息'** 或真 - 文件位置和浏览信息<br>**'调试'** - 非常详细的调试信息

### 例子

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    context: path.join(__dirname, 'app'),
    devServer: {
        // 对于旧版本的webpack-dev-server，这是必需的
        //如果你使用绝对路径'to'。 路径应该是
        //构建目标的绝对路径。
        outputPath: path.join(__dirname, 'build')
    },
    plugins: [
        new CopyWebpackPlugin([
            // {output}/file.txt
            { from: 'from/file.txt' },
            
            // 等价
            'from/file.txt',

            // {output}/to/file.txt
            { from: 'from/file.txt', to: 'to/file.txt' },
            
            // {output}/to/directory/file.txt
            { from: 'from/file.txt', to: 'to/directory' },

            // 复制目录内容到 {output}/
            { from: 'from/directory' },
            
            // 复制目录内容到 {output}/to/directory/
            { from: 'from/directory', to: 'to/directory' },
            
            // 复制glob结果到 /absolute/path/
            { from: 'from/directory/**/*', to: '/absolute/path' },

            // 复制glob结果到 (点文件) to /absolute/path/
            {
                from: {
                    glob:'from/directory/**/*',
                    dot: true
                },
                to: '/absolute/path'
            },

            // 复制glob结果到, 相关到内容中
            {
                context: 'from/directory',
                from: '**/*',
                to: '/absolute/path'
            },
            
            // {output}/file/without/extension
            {
                from: 'path/to/file.txt',
                to: 'file/without/extension',
                toType: 'file'
            },
            
            // {output}/directory/with/extension.ext/file.txt
            {
                from: 'path/to/file.txt',
                to: 'directory/with/extension.ext',
                toType: 'dir'
            }
        ], {
            ignore: [
                // 不复制任何带有txt扩展名的文件
                '*.txt',
                
                // 不复制任何文件，即使它们以点开头
                '**/*',

                // 不复制任何文件，除非它们以点开头
                { glob: '**/*', dot: false }
            ],

            // 默认情况下，我们只复制修改过的文件
            // a watch or webpack-dev-server build. Setting this
            // 当值为“真”翻译所有文件.
            copyUnmodified: true
        })
    ]
};
```

### 经常的问题与解答

#### “EMFILE：太多打开的文件”或“ENFILE：文件表溢出”

Globally patch fs with [graceful-fs](https://www.npmjs.com/package/graceful-fs)

`npm install graceful-fs --save-dev`

在webpack配置的顶部，插入此项

    const fs = require('fs');
    const gracefulFs = require('graceful-fs');
    gracefulFs.gracefulify(fs);

看[这个问题](https://github.com/kevlened/copy-webpack-plugin/issues/59#issuecomment-228563990)，获取更多结果

#### This doesn't copy my files with webpack-dev-server

从版本 [3.0.0](https://github.com/kevlened/copy-webpack-plugin/blob/master/CHANGELOG.md#300-may-14-2016), 我们停止使用fs将文件复制到文件系统并根据webpack启动 [in-memory filesystem](https://webpack.github.io/docs/webpack-dev-server.html#content-base):

>... webpack-dev-server将提供构建文件夹中的静态文件。 它会查看您的源文件以进行更改，并且在进行更改时，将重新编译该包。 **此修改的包在内存中以publicPath中指定的相对路径提供（请参阅API）**。 它不会写入配置的输出目录。

如果你必将使用webpack-dev-server写入输出目录，则可以使用[write-file-webpack-plugin](https://github.com/gajus/write-file-webpack-plugin).

## 维护者

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/bebraw">
          <img width="150" height="150" src="https://github.com/bebraw.png?v=3&s=150">
          </br>
          Juho Vepsäläinen
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/d3viant0ne">
          <img width="150" height="150" src="https://github.com/d3viant0ne.png?v=3&s=150">
          </br>
          Joshua Wiens
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/michael-ciniawsky">
          <img width="150" height="150" src="https://github.com/michael-ciniawsky.png?v=3&s=150">
          </br>
          Michael Ciniawsky
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/evilebottnawi">
          <img width="150" height="150" src="https://github.com/evilebottnawi.png?v=3&s=150">
          </br>
          Alexander Krasnoyarov
        </a>
      </td>
    </tr>
  <tbody>
</table>

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: 'src/**/*',
        to: 'dest/',
        ignore: ['*.js'],
      },
    ]),
  ],
};
```

#### `flatten`

Type: `Boolean`
Default: `false`

Removes all directory references and only copies file names.

> ⚠️ If files have the same name, the result is non-deterministic.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: 'src/**/*',
        to: 'dest/',
        flatten: true,
      },
    ]),
  ],
};
```

#### `transform`

Type: `Function|Promise`
Default: `undefined`

Allows to modify the file contents.

##### `{Function}`

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: 'src/*.png',
        to: 'dest/',
        transform(content, path) {
          return optimize(content);
        },
      },
    ]),
  ],
};
```

##### `{Promise}`

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: 'src/*.png',
        to: 'dest/',
        transform(content, path) {
          return Promise.resolve(optimize(content));
        },
      },
    ]),
  ],
};
```

#### `cache`

Type: `Boolean|Object`
Default: `false`

Enable/disable `transform` caching. You can use `{ cache: { key: 'my-cache-key' } }` to invalidate the cache.
Default path to cache directory: `node_modules/.cache/copy-webpack-plugin`.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: 'src/*.png',
        to: 'dest/',
        transform(content, path) {
          return optimize(content);
        },
        cache: true,
      },
    ]),
  ],
};
```

#### `transformPath`

Type: `Function|Promise`
Default: `undefined`

Allows to modify the writing path.

> ⚠️ Don't return directly `\\` in `transformPath` (i.e `path\to\newFile`) option because on UNIX the backslash is a valid character inside a path component, i.e., it's not a separator.
> On Windows, the forward slash and the backward slash are both separators.
> Instead please use `/` or `path` methods.

##### `{Function}`

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: 'src/*.png',
        to: 'dest/',
        transformPath(targetPath, absolutePath) {
          return 'newPath';
        },
      },
    ]),
  ],
};
```

##### `{Promise}`

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: 'src/*.png',
        to: 'dest/',
        transformPath(targePath, absolutePath) {
          return Promise.resolve('newPath');
        },
      },
    ]),
  ],
};
```

### Options

|                Name                 |    Type     |          Default           | Description                                                                                                                                       |
| :---------------------------------: | :---------: | :------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------ |
|       [`logLevel`](https://v4.webpack.docschina.org#logLevel)       | `{String}`  |        **`'warn'`**        | Level of messages that the module will log                                                                                                        |
|         [`ignore`](https://v4.webpack.docschina.org#ignore)         |  `{Array}`  |            `[]`            | Array of globs to ignore (applied to `from`)                                                                                                      |
|        [`context`](https://v4.webpack.docschina.org#context)        | `{String}`  | `compiler.options.context` | A path that determines how to interpret the `from` path, shared for all patterns                                                                  |
| [`copyUnmodified`](https://v4.webpack.docschina.org#copyUnmodified) | `{Boolean}` |          `false`           | Copies files, regardless of modification when using watch or `webpack-dev-server`. All files are copied on first build, regardless of this option |

#### `logLevel`

This property defines the level of messages that the module will log. Valid levels include:

- `trace`
- `debug`
- `info`
- `warn` (default)
- `error`
- `silent`

Setting a log level means that all other levels below it will be visible in the
console. Setting `logLevel: 'silent'` will hide all console output. The module
leverages [`webpack-log`](https://github.com/webpack-contrib/webpack-log#readme)
for logging management, and more information can be found on its page.

**webpack.config.js**

```js
module.exports = {
  plugins: [new CopyPlugin([...patterns], { logLevel: 'debug' })],
};
```

#### `ignore`

Array of globs to ignore (applied to `from`).

**webpack.config.js**

```js
module.exports = {
  plugins: [new CopyPlugin([...patterns], { ignore: ['*.js', '*.css'] })],
};
```

#### `context`

A path that determines how to interpret the `from` path, shared for all patterns.

**webpack.config.js**

```js
module.exports = {
  plugins: [new CopyPlugin([...patterns], { context: '/app' })],
};
```

#### `copyUnmodified`

Copies files, regardless of modification when using watch or `webpack-dev-server`. All files are copied on first build, regardless of this option.

> ℹ️ By default, we only copy **modified** files during a `webpack --watch` or `webpack-dev-server` build. Setting this option to `true` will copy all files.

**webpack.config.js**

```js
module.exports = {
  plugins: [new CopyPlugin([...patterns], { copyUnmodified: true })],
};
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](https://raw.githubusercontent.com/webpack-contrib/copy-webpack-plugin/master/.github/CONTRIBUTING.md)

## License

[MIT](https://raw.githubusercontent.com/webpack-contrib/copy-webpack-plugin/master/LICENSE)

[npm]: https://img.shields.io/npm/v/copy-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/copy-webpack-plugin
[node]: https://img.shields.io/node/v/copy-webpack-plugin.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/copy-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/copy-webpack-plugin
[tests]: https://secure.travis-ci.org/webpack-contrib/copy-webpack-plugin.svg
[tests-url]: http://travis-ci.org/webpack-contrib/copy-webpack-plugin
[cover]: https://codecov.io/gh/webpack-contrib/copy-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/copy-webpack-plugin
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=copy-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=copy-webpack-plugin

# CssWebpackPlugin

Nothing to see here .... yet

# DefinePlugin

`DefinePlugin` 允许创建一个在__编译__时可以配置的全局常量。这可能会对开发模式和生产模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 `DefinePlugin` 的用处，设置它，就可以忘记开发环境和生产环境构建的规则。

``` javascript
new webpack.DefinePlugin({
  // Definitions...
});
```


## 用法

每个传进 `DefinePlugin` 的键值都是一个标志符或者多个用 `.` 连接起来的标志符。

- 如果这个值是一个字符串，它会被当作一个代码片段来使用。
- 如果这个值不是字符串，它会被转化为字符串(包括函数)。
- 如果这个值是一个对象，它所有的 key 会被同样的方式定义。
- 如果在一个 key 前面加了 `typeof`,它会被定义为 typeof 调用。

这些值会被内联进那些允许传一个代码压缩参数的代码中，从而减少冗余的条件判断。

``` javascript
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify('5fa3b9'),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: '1+1',
  'typeof window': JSON.stringify('object'),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
});
```

``` javascript
console.log('Running App version ' + VERSION);
if(!BROWSER_SUPPORTS_HTML5) require('html5shiv');
```


W> When defining values for `process` prefer `'process.env.NODE_ENV': JSON.stringify('production')` over `process: { env: { NODE_ENV: JSON.stringify('production') } }`. Using the latter will overwrite the `process` object which can break compatibility with some modules that expect other values on the process object to be defined.

T> 注意，因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的__实际引号__。通常，有两种方式来达到这个效果，使用 `'"production"'`, 或者使用 `JSON.stringify('production')`。

__index.js__

``` javascript
if (!PRODUCTION) {
  console.log('Debug info');
}

if (PRODUCTION) {
  console.log('Production log');
}
```

通过没有使用压缩的 webpack 的结果：

``` javascript
if (!true) {
  console.log('Debug info');
}
if (true) {
  console.log('Production log');
}
```

通过使用压缩的 webpack 的结果:

``` javascript
console.log('Production log');
```


## 功能标记(Feature Flags)

使用[功能标记](https://en.wikipedia.org/wiki/Feature_toggle)来「启用/禁用」「生产/开发」构建中的功能。

```javascript
new webpack.DefinePlugin({
  'NICE_FEATURE': JSON.stringify(true),
  'EXPERIMENTAL_FEATURE': JSON.stringify(false)
});
```


## 服务 URL(Service URL)

在生产/开发构建中使用不同的服务 URL(Service URL)：

```javascript
new webpack.DefinePlugin({
  'SERVICE_URL': JSON.stringify('http://dev.example.com')
});
```

# DllPlugin

`DLLPlugin` 和 `DLLReferencePlugin` 用某种方法实现了拆分 bundles，同时还大大提升了构建的速度。


## `DllPlugin`

这个插件是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 bundle(dll-only-bundle)。 这个插件会生成一个名为 `manifest.json` 的文件，这个文件是用来让 [`DllReferencePlugin`](https://v4.webpack.docschina.org/plugins/dll-plugin#dllreferenceplugin) 映射到相关的依赖上去的。

- `context` (optional): manifest 文件中请求的上下文(context)(默认值为 webpack 的上下文(context))
- `name`: 暴露出的 DLL 的函数名 ([TemplatePaths](https://github.com/webpack/webpack/blob/master/lib/TemplatedPathPlugin.js): `[hash]` & `[name]` )
- `path`: manifest json 文件的__绝对路径__ (输出文件)

```javascript
new webpack.DllPlugin(options);
```

在给定的 `path` 路径下创建一个名为 `manifest.json` 的文件。 这个文件包含了从 `require` 和 `import` 的request到模块 id 的映射。 `DLLReferencePlugin` 也会用到这个文件。

这个插件与 [`output.library`](https://v4.webpack.docschina.org/configuration/output/#output-library) 的选项相结合可以暴露出 (也叫做放入全局域) dll 函数。


## `DllReferencePlugin`

这个插件是在 webpack 主配置文件中设置的， 这个插件把只有 dll 的 bundle(们)(dll-only-bundle(s)) 引用到需要的预编译的依赖。

* `context`: (**绝对路径**) 是内容属性(bundle 后的 dll 文件) 或者 manifest (打包内容和manifest在同路径下)中请求的上下文
* `manifest`: 包含 `content` 和 `name` 的对象，或者在编译时(compilation)的一个用于加载的 JSON manifest 绝对路径
* `content` (optional): 请求到模块 id 的映射 (默认值为 `manifest.content`)
* `name` (optional): dll 暴露的地方的名称 (默认值为 `manifest.name`) (可参考 [`externals`](https://v4.webpack.docschina.org/configuration/externals/))
* `scope` (optional): dll 中内容的前缀
* `sourceType` (optional): dll 是如何暴露的 ([libraryTarget](https://v4.webpack.docschina.org/configuration/output/#output-librarytarget))

```javascript
new webpack.DllReferencePlugin(options);
```

通过引用 dll 的 manifest 文件来把依赖的名称映射到模块的 id 上，之后再在需要的时候通过内置的 `__webpack_require__` 函数来 `require` 他们

W> 与 [`output.library`](https://v4.webpack.docschina.org/configuration/output/#output-library) 保持 `name` 的一致性。


### 模式(Modes)

这个插件支持两种模式，分别是_作用域(scoped)_和_映射(mapped)_。

#### 作用域模式(Scoped Mode)

dll 中的内容可以在模块前缀下才能被引用，举例来说，令`scope = "xyz" `的话，这个 dll 中的名为 `abc` 的文件可以通过 `require("xyz/abc")` 来获取

T> [作用域的用例](https://github.com/webpack/webpack/tree/master/examples/dll-user)

#### 映射模式(Mapped Mode)

dll 中的内容被映射到了当前目录下。如果一个被 `require` 的文件符合 dll 中的某个文件(解析之后)，那么这个dll中的这个文件就会被使用。

由于这是在解析了 dll 中每个文件之后才发生的，相同的路径必须能够确保这个 dll bundle 的使用者(不一定是人，可指某些代码)有权限访问。 举例来说， 假如一个 dll bundle 中含有 `loadash`库 以及 文件`abc`， 那么 `require("lodash")` 和 `require("./abc")` 都不会被编译进主要的 bundle文件，而是会被 dll 所使用。


## 用法(Usage)

W> `DllReferencePlugin` 和 `DLL插件DllPlugin` 都是在_另外_的 webpack 设置中使用的。

__webpack.vendor.config.js__

```javascript
new webpack.DllPlugin({
  context: __dirname,
  name: '[name]_[hash]',
  path: path.join(__dirname, 'manifest.json'),
});
```

__webpack.app.config.js__

```javascript
new webpack.DllReferencePlugin({
  context: __dirname,
  manifest: require('./manifest.json'),
  name: './my-dll.js',
  scope: 'xyz',
  sourceType: 'commonjs2'
});
```


## 示例(Examples)

[Vendor](https://github.com/webpack/webpack/tree/master/examples/dll) and [User](https://github.com/webpack/webpack/tree/master/examples/dll-user)

_两个单独的用例，用来分别演示作用域(scope)和上下文(context)。_

T> 多个 `DllPlugins` 和 `DllReferencePlugins`.


## 引用参考(References)

### Source

- [DllPlugin source](https://github.com/webpack/webpack/blob/master/lib/DllPlugin.js)
- [DllReferencePlugin source](https://github.com/webpack/webpack/blob/master/lib/DllReferencePlugin.js)
- [DllEntryPlugin source](https://github.com/webpack/webpack/blob/master/lib/DllEntryPlugin.js)
- [DllModuleFactory source](https://github.com/webpack/webpack/blob/master/lib/DllModuleFactory.js)
- [ManifestPlugin source](https://github.com/webpack/webpack/blob/master/lib/LibManifestPlugin.js)

### Tests

- [DllPlugin creation test](https://github.com/webpack/webpack/blob/master/test/configCases/dll-plugin/0-create-dll/webpack.config.js)
- [DllPlugin without scope test](https://github.com/webpack/webpack/blob/master/test/configCases/dll-plugin/2-use-dll-without-scope/webpack.config.js)
- [DllReferencePlugin use Dll test](https://github.com/webpack/webpack/tree/master/test/configCases/dll-plugin)

# EnvironmentPlugin

`EnvironmentPlugin` 是一个通过 [`DefinePlugin`](https://v4.webpack.docschina.org/plugins/define-plugin) 来设置 [`process.env`](https://nodejs.org/api/process.html#process_process_env) 环境变量的快捷方式。

## 用法

`EnvironmentPlugin` 可以接收键数组或将键映射到其默认值的对象。（译者注：键是指要设定的环境变量名）

```javascript
new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']);
```

上面的写法和下面这样使用 `DefinePlugin` 的效果相同：

```javascript
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
});
```

T> 使用不存在的环境变量会导致一个 "`EnvironmentPlugin` - `${key}` environment variable is undefined" 错误。

## 带默认值使用

或者，`EnvironmentPlugin` 也可以接收一个指定相应默认值的对象，如果在 `process.env` 中对应的环境变量不存在时将使用指定的默认值。

```js
new webpack.EnvironmentPlugin({
  NODE_ENV: 'development', // 除非有定义 process.env.NODE_ENV，否则就使用 'development'
  DEBUG: false
});
```

W> 从 `process.env` 中取到的值类型均为字符串。

T> 不同于 [`DefinePlugin`](https://v4.webpack.docschina.org/plugins/define-plugin)，默认值将被 `EnvironmentPlugin` 执行 `JSON.stringify`。

T> 如果要指定一个未设定的默认值，使用 `null` 来代替 `undefined`。

__示例：__

让我们看一下对下面这个用来试验的文件 `entry.js` 执行前面配置的 `EnvironmentPlugin` 的结果：

```javascript
if (process.env.NODE_ENV === 'production') {
  console.log('Welcome to production');
}
if (process.env.DEBUG) {
  console.log('Debugging output');
}
```

当在终端执行 `NODE_ENV=production webpack` 来构建时，`entry.js` 变成了这样：

```javascript
if ('production' === 'production') { // <-- NODE_ENV 的 'production' 被带过来了
  console.log('Welcome to production');
}
if (false) { // <-- 使用了默认值
  console.log('Debugging output');
}
```

执行 `DEBUG=false webpack` 则会生成：

```javascript
if ('development' === 'production') { // <-- 使用了默认值
  console.log('Welcome to production');
}
if ('false') { // <-- DEBUG 的 'false' 被带过来了
  console.log('Debugging output');
}
```

## `DotenvPlugin`

The third-party [`DotenvPlugin`](https://github.com/mrsteele/dotenv-webpack) (`dotenv-webpack`) allows you to expose (a subset of) [dotenv variables](https://www.npmjs.com/package/dotenv):

``` bash
// .env
DB_HOST=127.0.0.1
DB_PASS=foobar
S3_API=mysecretkey
```

```javascript
new Dotenv({
  path: './.env', // Path to .env file (this is the default)
  safe: true // load .env.example (defaults to "false" which does not use dotenv-safe)
});
```

# EvalSourceMapDevToolPlugin

This plugin enables more fine grained control of source map generation. It is also enabled automatically by certain settings of the [`devtool`](https://v4.webpack.docschina.org/configuration/devtool/) configuration option.

``` js
new webpack.EvalSourceMapDevToolPlugin(options);
```


## Options

The following options are supported:

- `test` (`string|regex|array`): Include source maps for modules based on their extension (defaults to `.js` and `.css`).
- `include` (`string|regex|array`): Include source maps for module paths that match the given value.
- `exclude` (`string|regex|array`): Exclude modules that match the given value from source map generation.
- `filename` (`string`): Defines the output filename of the SourceMap (will be inlined if no value is provided).
- `append` (`string`): Appends the given value to the original asset. Usually the `#sourceMappingURL` comment. `[url]` is replaced with a URL to the source map file. `false` disables the appending.
- `moduleFilenameTemplate` (`string`): See [`output.devtoolModuleFilenameTemplate`](https://v4.webpack.docschina.org/configuration/output/#output-devtoolmodulefilenametemplate).
- `sourceURLTemplate`: Define the sourceURL default: `webpack-internal:///${module.identifier}`
- `module` (`boolean`): Indicates whether loaders should generate source maps (defaults to `true`).
- `columns` (`boolean`): Indicates whether column mappings should be used (defaults to `true`).
- `protocol` (`string`): Allows user to override default protocol (`webpack-internal://`)

T> Setting `module` and/or `columns` to `false` will yield less accurate source maps but will also improve compilation performance significantly.

T> If you want to use a custom configuration for this plugin in [development mode](https://v4.webpack.docschina.org/concepts/mode/#mode-development), make sure to disable the default one. I.e. set `devtool: false`.

## Examples

The following examples demonstrate some common use cases for this plugin.

### Basic Use Case

You can use the following code to replace the configuration option `devtool: eval-source-map` with an equivalent custom plugin configuration:

```js
module.exports = {
  // ...
  devtool: false,
  plugins: [
    new webpack.EvalSourceMapDevToolPlugin({})
  ]
};
```

### Exclude Vendor Maps

The following code would exclude source maps for any modules in the `vendor.js` bundle:

``` js
new webpack.EvalSourceMapDevToolPlugin({
  filename: '[name].js.map',
  exclude: ['vendor.js']
});
```

### Setting sourceURL

Set a URL for source maps. Useful for avoiding cross-origin issues such as:

``` bash
A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://fb.me/react-crossorigin-error for more information.
```

The option can be set to a function:

``` js
new webpack.EvalSourceMapDevToolPlugin({
  sourceURLTemplate: module => `/${module.identifier}`
});
```

Or a substitution string:

``` js
new webpack.EvalSourceMapDevToolPlugin({
  sourceURLTemplate: '[all-loaders][resource]'
});
```

# ExtractTextWebpackPlugin

Extract text from a bundle, or bundles, into a separate file.

## 安装

```bash
# 对于 webpack 3
npm install --save-dev extract-text-webpack-plugin
# 对于 webpack 2
npm install --save-dev extract-text-webpack-plugin@2.1.2
# 对于 webpack 1
npm install --save-dev extract-text-webpack-plugin@1.0.1
```

## 用法

> :警告: 从webpack v4开始，`extract-text-webpack-plugin`不应该用于css。请改用[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)。

> :警告: 对于 webpack v1, 请看 [分支为 webpack-1 的 README 文档](https://github.com/webpack/extract-text-webpack-plugin/blob/webpack-1/README.md)。

```js
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
  ]
}
```

它会将所有的入口 chunk(entry chunks)中引用的 `*.css`，移动到独立分离的 CSS 文件。因此，你的样式将不再内嵌到 JS bundle 中，而是会放到一个单独的 CSS 文件（即 `styles.css`）当中。 如果你的样式文件大小较大，这会做更快提前加载，因为 CSS bundle 会跟 JS bundle 并行加载。

|优点|缺点|
|:---------|:------|
| 更少 style 标签 (旧版本的 IE 浏览器有限制) | 额外的 HTTP 请求 |
| CSS SourceMap (使用 `devtool: "source-map"` 和 `extract-text-webpack-plugin?sourceMap` 配置) | 更长的编译时间 |
| CSS 请求并行 | 没有运行时(runtime)的公共路径修改 |
| CSS 单独缓存 | 没有热替换 |
| 更快的浏览器运行时(runtime) (更少代码和 DOM 操作) | ... |

## 选项

```js
new ExtractTextPlugin(options: filename | object)
```

|名称|类型|描述|
|:--:|:--:|:----------|
|**`id`**|`{String}`|此插件实例的唯一 ident。（仅限高级用途，默认情况下自动生成）|
|**`filename`**|`{String\|Function}`|生成文件的文件名。可能包含 `[name]`, `[id]` and `[contenthash]`|
|**`allChunks`**|`{Boolean}`|从所有额外的 chunk(additional chunk) 提取（默认情况下，它仅从初始chunk(initial chunk) 中提取）<br />当使用 `CommonsChunkPlugin` 并且在公共 chunk 中有提取的 chunk（来自`ExtractTextPlugin.extract`）时，`allChunks` **必须设置为 `true`|
|**`disable`**|`{Boolean}`|禁用插件|
|**`ignoreOrder`**|`{Boolean}`|禁用顺序检查 (这对 CSS 模块很有用！)，默认 `false`|

* `[name]` chunk 的名称
* `[id]` chunk 的数量
* `[contenthash]` 根据提取文件的内容生成的 hash
* `[<hashType>:contenthash:<digestType>:<length>]` optionally you can configure
  * other `hashType`s, e.g. `sha1`, `md5`, `sha256`, `sha512`
  * other `digestType`s, e.g. `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`
  * and `length`, the length of the hash in chars

> :警告: `ExtractTextPlugin` 对 ** 每个入口 chunk** 都生成一个对应的文件，所以当你配置多个入口 chunk 的时候，你必须使用 `[name]`, `[id]` 或 `[contenthash]`，

#### `#extract`

```js
ExtractTextPlugin.extract(options: loader | object)
```

从一个已存在的 loader 中，创建一个提取(extract) loader。支持的 loader 类型 `{ loader: [name]-loader -> {String}, options: {} -> {Object} }`。

|名称|类型|描述|
|:--:|:--:|:----------|
|**`options.use`**|`{String}`/`{Array}`/`{Object}`|loader 被用于将资源转换成一个 CSS 导出模块 _(必填)_|
|**`options.fallback`**|`{String}`/`{Array}`/`{Object}`|loader（例如 `'style-loader'`）应用于当 CSS 没有被提取(也就是一个额外的 chunk，当 `allChunks: false`)|
|**`options.publicPath`**|`{String}`|重写此 loader 的 `publicPath` 配置|


#### 多个实例

如果有多于一个 `ExtractTextPlugin` 示例的情形，请使用此方法每个实例上的 `extract` 方法。

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 创建多个实例
const extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css');
const extractLESS = new ExtractTextPlugin('stylesheets/[name]-two.css');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
      },
      {
        test: /\.less$/i,
        use: extractLESS.extract([ 'css-loader', 'less-loader' ])
      },
    ]
  },
  plugins: [
    extractCSS,
    extractLESS
  ]
};
```

### 提取 Sass 或 LESS

配置和上面是相同的，需要时可以将 `sass-loader` 切换为 `less-loader`。

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css')
    //如果想要传入选项，你可以这样做：
    //new ExtractTextPlugin({
    //  filename: 'style.css'
    //})
  ]
}
```

### `url()`解析

如果您在运行webpack时发现url没有正确解析。您可以使用loader的选项扩展功能。 设置属性`url: false`允许您的路径无需任何更改即可解析。

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
                loader: 'css-loader',
                options: {
                    // 如果您在使用url解析时遇到问题而无法解决，请添加此设置。
                    // 查看 https://github.com/webpack-contrib/css-loader#url
                    url: false,
                    minimize: true,
                    sourceMap: true
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: true
                }
            }
          ]
        })
      }
    ]
  }
}
```

### 修改文件名

`filename` 参数可以是 `Function`。它通过 `getPath` 来处理格式，如 `css/[name].css`，并返回真实的文件名，你可以用 `css` 替换 `css/js`，你会得到新的路径 `css/a.css`。


```js
entry: {
  'js/a': "./a"
},
plugins: [
  new ExtractTextPlugin({
    filename:  (getPath) => {
      return getPath('css/[name].css').replace('css/js', 'css');
    },
    allChunks: true
  })
]
```

## 维护人员

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/166921?v=3&s=150">
        </br>
        <a href="https://github.com/bebraw">Juho Vepsäläinen</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars2.githubusercontent.com/u/8420490?v=3&s=150">
        </br>
        <a href="https://github.com/d3viant0ne">Joshua Wiens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/533616?v=3&s=150">
        </br>
        <a href="https://github.com/SpaceK33z">Kees Kluskens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/3408176?v=3&s=150">
        </br>
        <a href="https://github.com/TheLarkInn">Sean Larkin</a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/extract-text-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/extract-text-webpack-plugin

[node]: https://img.shields.io/node/v/extract-text-webpack-plugin.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/extract-text-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/extract-text-webpack-plugin

[tests]: http://img.shields.io/travis/webpack-contrib/extract-text-webpack-plugin.svg
[tests-url]: https://travis-ci.org/webpack-contrib/extract-text-webpack-plugin

[cover]: https://coveralls.io/repos/github/webpack-contrib/extract-text-webpack-plugin/badge.svg
[cover-url]: https://coveralls.io/github/webpack-contrib/extract-text-webpack-plugin

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack

# HashedModuleIdsPlugin

该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境。

``` js
new webpack.HashedModuleIdsPlugin({
  // 选项……
});
```


## 参数

该插件支持以下参数：

- `hashFunction`: 散列算法，默认为 'md4'。支持 Node.JS [`crypto.createHash`](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options) 的所有功能。
- `hashDigest`: 在生成 hash 时使用的编码方式，默认为 'base64'。支持 Node.js [`hash.digest`](https://nodejs.org/api/crypto.html#crypto_hash_digest_encoding) 的所有编码。
- `hashDigestLength`: 散列摘要的前缀长度，默认为 4。Note that some generated ids might be longer than specified here, to avoid module id collisions.


## 用法

下面是使用该插件的例子：

``` js
new webpack.HashedModuleIdsPlugin({
  hashFunction: 'sha256',
  hashDigest: 'hex',
  hashDigestLength: 20
});
```

# HotModuleReplacementPlugin

启用[热替换模块(Hot Module Replacement)](https://v4.webpack.docschina.org/concepts/hot-module-replacement)，也被称为 HMR。

W> __永远不要__在生产环境(production)下启用 HMR


## 基本用法(Basic Usage)

启用 HMR 非常简单，在大多数情况下也不需要设置选项。

``` javascript
new webpack.HotModuleReplacementPlugin({
  // Options...
});
```


## 选项(Options)

包含如下选项：

- `multiStep` (boolean)：设置为 `true` 时，插件会分成两步构建文件。首先编译热加载 chunks，之后再编译剩余的通常的资源。
- `fullBuildTimeout` (number)：当 `multiStep` 启用时，表示两步构建之间的延时。
- `requestTimeout` (number)：下载 manifest 的延时（webpack 3.0.0 后的版本支持）。

W> 这些选项属于实验性内容，因此以后可能会被弃用。就如同上文所说的那样，这些选项通常情况下都是没有必要设置的，仅仅是设置一下 `new webpack.HotModuleReplacementPlugin()` 在大部分情况下就足够了。

# HtmlWebpackPlugin

[`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin)简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。 你可以让插件为你生成一个HTML文件，使用[lodash模板](https://lodash.com/docs#template)提供你自己的模板，或使用你自己的[loader](https://v4.webpack.docschina.org/loaders)。


## 安装

``` bash
npm install --save-dev html-webpack-plugin
```


## 基本用法

该插件将为你生成一个 HTML5 文件，
其中包括使用 `script` 标签的 body 中的所有 webpack 包。
只需添加插件到你的 webpack 配置如下：

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin()]
};
```

这将会产生一个包含以下内容的文件 `dist/index.html`：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>webpack App</title>
  </head>
  <body>
    <script src="index_bundle.js"></script>
  </body>
</html>
```

如果你有多个 webpack 入口点，
他们都会在生成的HTML文件中的 `script` 标签内。

如果你有任何CSS assets 在webpack的输出中（例如，
利用 [MiniCssExtractPlugin](https://v4.webpack.docschina.org/plugins/mini-css-extract-plugin/) 提取CSS），
那么这些将被包含在HTML head中的`<link>`标签内。


## 配置

获取所有的配置选项，请浏览[插件文档](https://github.com/jantimon/html-webpack-plugin#options)。


## 第三方插件

这个插件支持第三方插件。详细列表参阅[文档](https://github.com/jantimon/html-webpack-plugin#plugins)。

# I18nWebpackPlugin

i18n (localization) plugin for Webpack.

## 安装

```bash
npm i -D i18n-webpack-plugin
```

## 用法

此插件会创建包含译文的 bundle。所以你可以将翻译后的 bundle 提供给客户端。

参考 [webpack/webpack/examples/i18n](https://github.com/webpack/webpack/tree/master/examples/i18n)。

## 配置

```
plugins: [
  ...
  new I18nPlugin(languageConfig, optionsObj)
],
```
 - `optionsObj.functionName`：默认值为 `__`, 你可以更改为其他函数名。
 - `optionsObj.failOnMissing`：默认值为 `false`，找不到映射文本(mapping text)时会给出一个警告信息，如果设置为 `true`，则会给出一个错误信息。
 - `optionsObj.hideMessage`：默认值为 `false`，将会显示警告/错误信息。如果设置为 `true`，警告/错误信息将会被隐藏。
 - `optionsObj.nested`: the default value is `false`. If set to `true`, the keys in `languageConfig` can be nested. This option is interpreted only if `languageConfig` isn't a function.

## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/166921?v=3&s=150">
        </br>
        <a href="https://github.com/bebraw">Juho Vepsäläinen</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars2.githubusercontent.com/u/8420490?v=3&s=150">
        </br>
        <a href="https://github.com/d3viant0ne">Joshua Wiens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/533616?v=3&s=150">
        </br>
        <a href="https://github.com/SpaceK33z">Kees Kluskens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/3408176?v=3&s=150">
        </br>
        <a href="https://github.com/TheLarkInn">Sean Larkin</a>
      </td>
    </tr>
  <tbody>
</table>

[npm]: https://img.shields.io/npm/v/i18n-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/i18n-webpack-plugin

[deps]: https://david-dm.org/webpack-contrib/i18n-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/i18n-webpack-plugin

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: http://img.shields.io/travis/webpack-contrib/i18n-webpack-plugin.svg
[test-url]: https://travis-ci.org/webpack-contrib/i18n-webpack-plugin

[cover]: https://codecov.io/gh/webpack-contrib/i18n-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/i18n-webpack-plugin

# IgnorePlugin

IgnorePlugin 防止在 `import` 或 `require` 调用时，生成以下正则表达式匹配的模块：

## Using regular expressions

- `resourceRegExp`：匹配(test)资源请求路径的正则表达式。
- `contextRegExp`：（可选）匹配(test)资源上下文（目录）的正则表达式。

```javascript
new webpack.IgnorePlugin({resourceRegExp, contextRegExp});
// old way, deprecated in webpack v5
new webpack.IgnorePlugin(resourceRegExp, [contextRegExp]);
```

## Using filter functions

- `checkContext(context)` A Filter function that receives context as the argument, must return boolean.
- `checkResource(resource)` A Filter function that receives resource as the argument, must return boolean.

```javascript
new webpack.IgnorePlugin({
  checkContext (context) {
    // do something with context
    return true|false;
  },
  checkResource (resource) {
    // do something with resource
    return true|false;
  }
});
```

## 忽略 moment 本地化内容的示例

[moment](https://momentjs.com/) 2.18 会将所有本地化内容和核心功能一起打包（见[该 GitHub issue](https://github.com/moment/moment/issues/2373)）。

The `resourceRegExp` parameter passed to `IgnorePlugin` is not tested against the resolved file names or absolute module names being imported or required, but rather against the _string_ passed to `require` or `import` _within the source code where the import is taking place_. For example, if you're trying to exclude `node_modules/moment/locale/*.js`, this won't work:

```diff
-new webpack.IgnorePlugin(/moment\/locale\//);
```

Rather, because `moment` imports with this code:

```js
require('./locale/' + name);
```

...your first regexp must match that `'./locale/'` string. The second `contextRegExp` parameter is then used to select specific directories from where the import took place. The following will cause those locale files to be ignored:

```javascript
new webpack.IgnorePlugin({
  resourceRegExp: /^\.\/locale$/,
  contextRegExp: /moment$/
});
```

...which means "any require statement matching `'./locale'` from any directories ending with `'moment'` will be ignored.

# plugin

webpack 有着丰富的插件接口(rich plugin interface)。webpack 自身的多数功能都使用这个插件接口。这个插件接口使 webpack 变得**极其灵活**。

Name                                                     | Description
-------------------------------------------------------- | -----------
[`BabelMinifyWebpackPlugin`](https://v4.webpack.docschina.org/plugins/babel-minify-webpack-plugin) | 使用 [babel-minify](https://github.com/babel/minify)进行压缩
[`BannerPlugin`](https://v4.webpack.docschina.org/plugins/banner-plugin)                 | 在每个生成的 chunk 顶部添加 banner
[`CommonsChunkPlugin`](https://v4.webpack.docschina.org/plugins/commons-chunk-plugin)    | 提取 chunks 之间共享的通用模块
[`CompressionWebpackPlugin`](https://v4.webpack.docschina.org/plugins/compression-webpack-plugin) | 预先准备的资源压缩版本，使用 Content-Encoding 提供访问服务
[`ContextReplacementPlugin`](https://v4.webpack.docschina.org/plugins/context-replacement-plugin) | 重写 `require` 表达式的推断上下文
[`CopyWebpackPlugin`](https://v4.webpack.docschina.org/plugins/copy-webpack-plugin) | 将单个文件或整个目录复制到构建目录
[`DefinePlugin`](https://v4.webpack.docschina.org/plugins/define-plugin)           | 允许在编译时(compile time)配置的全局常量
[`DllPlugin`](https://v4.webpack.docschina.org/plugins/dll-plugin)                 | 为了极大减少构建时间，进行分离打包
[`EnvironmentPlugin`](https://v4.webpack.docschina.org/plugins/environment-plugin) | [`DefinePlugin`](https://v4.webpack.docschina.org./define-plugin) 中 `process.env` 键的简写方式。
[`ExtractTextWebpackPlugin`](https://v4.webpack.docschina.org/plugins/extract-text-webpack-plugin) | 从 bundle 中提取文本（CSS）到单独的文件
[`HotModuleReplacementPlugin`](https://v4.webpack.docschina.org/plugins/hot-module-replacement-plugin) | 启用模块热替换(Enable Hot Module Replacement - HMR)
[`HtmlWebpackPlugin`](https://v4.webpack.docschina.org/plugins/html-webpack-plugin)          | 简单创建 HTML 文件来服务打包文件
[`I18nWebpackPlugin`](https://v4.webpack.docschina.org/plugins/i18n-webpack-plugin)          | 为 bundle 增加国际化支持
[`IgnorePlugin`](https://v4.webpack.docschina.org/plugins/ignore-plugin)  | 从 bundle 中排除某些模块
[`LimitChunkCountPlugin`](https://v4.webpack.docschina.org/plugins/limit-chunk-count-plugin) | 设置 chunk 的最小/最大限制，以微调和控制 chunk
[`LoaderOptionsPlugin`](https://v4.webpack.docschina.org/plugins/loader-options-plugin)      | 用于从 webpack 1 迁移到 webpack 2
[`MinChunkSizePlugin`](https://v4.webpack.docschina.org/plugins/min-chunk-size-plugin)       | 确保 chunk 大小超过指定限制
[`MiniCssExtractPlugin`](https://v4.webpack.docschina.org/plugins/mini-css-extract-plugin)       | 为每个引入 CSS 的 JS 文件创建一个 CSS 文件
[`NoEmitOnErrorsPlugin`](https://v4.webpack.docschina.org/configuration/optimization/#optimization-noemitonerrors)  | 在输出阶段时，遇到编译错误跳过
[`NormalModuleReplacementPlugin`](https://v4.webpack.docschina.org/plugins/normal-module-replacement-plugin) | 替换与正则表达式匹配的资源
[`NpmInstallWebpackPlugin`](https://v4.webpack.docschina.org/plugins/npm-install-webpack-plugin) | 在开发环境下自动安装缺少的依赖
[`ProgressPlugin`](https://v4.webpack.docschina.org/plugins/progress-plugin) | 报告编译进度
[`ProvidePlugin`](https://v4.webpack.docschina.org/plugins/provide-plugin) | 不必通过 import/require 使用模块
[`SourceMapDevToolPlugin`](https://v4.webpack.docschina.org/plugins/source-map-dev-tool-plugin)  | 对 source map 进行更细粒度的控制
[`EvalSourceMapDevToolPlugin`](https://v4.webpack.docschina.org/plugins/eval-source-map-dev-tool-plugin)  | 对 eval source map 进行更细粒度的控制
[`UglifyjsWebpackPlugin`](https://v4.webpack.docschina.org/plugins/uglifyjs-webpack-plugin)      | 可以控制项目中 UglifyJS 的版本
[`TerserPlugin`](https://v4.webpack.docschina.org/plugins/terser-webpack-plugin) | 允许控制项目中 Terser 的版本
[`ZopfliWebpackPlugin`](https://v4.webpack.docschina.org/plugins/zopfli-webpack-plugin) | 通过 node-zopfli 将资源预先压缩的版本

更多第三方插件，请查看 [awesome-webpack](https://github.com/webpack-contrib/awesome-webpack#webpack-plugins) 列表。

![Awesome](https://v4.webpack.docschina.org../assets/awesome-badge.svg)

# Internal webpack plugins

This is a list of plugins which are used by webpack internally.

W> You should only care about them if you are building your own compiler based on webpack, or introspect the internals.

Categories of internal plugins:

- [environment](https://v4.webpack.docschina.org#environment)
- [compiler](https://v4.webpack.docschina.org#compiler)
- [entry](https://v4.webpack.docschina.org#entry)
- [output](https://v4.webpack.docschina.org#output)
- [source](https://v4.webpack.docschina.org#source)
- [optimize](https://v4.webpack.docschina.org#optimize)

## environment

Plugins affecting the environment of the compiler.

### NodeEnvironmentPlugin

`node/NodeEnvironmentPlugin()`

Applies Node.js style filesystem to the compiler.

## compiler

Plugins affecting the compiler

### CachePlugin

`CachePlugin([cache])`

Adds a cache to the compiler, where modules are cached.

You can pass a `cache` object, where the modules are cached. Otherwise one is created per plugin instance.

### ProgressPlugin

`ProgressPlugin(handler)`

Hook into the compiler to extract progress information. The `handler` must have the signature `function(percentage, message)`. Percentage is called with a value between 0 and 1, where 0 indicates the start and 1 the end.

### RecordIdsPlugin

`RecordIdsPlugin()`

Saves and restores module and chunk ids from records.

## entry

Plugins, which add entry chunks to the compilation.

### SingleEntryPlugin

`SingleEntryPlugin(context, request, chunkName)`

Adds an entry chunk on compilation. The chunk is named `chunkName` and contains only one module (plus dependencies). The module is resolved from `request` in `context` (absolute path).

### MultiEntryPlugin

`MultiEntryPlugin(context, requests, chunkName)`

Adds an entry chunk on compilation. The chunk is named `chunkName` and contains a module for each item in the `requests` array (plus dependencies). Each item in `requests` is resolved in `context` (absolute path).

### PrefetchPlugin

`PrefetchPlugin(context, request)`

Prefetches `request` and dependencies to enable a more parallel compilation. It doesn't create any chunk. The module is resolved from `request` in `context` (absolute path).

## output

### FunctionModulePlugin

`FunctionModulePlugin(context, options)`

Each emitted module is wrapped in a function.

`options` are the output options.

If `options.pathinfo` is set, each module function is annotated with a comment containing the module identifier shortened to `context` (absolute path).

### JsonpTemplatePlugin

`JsonpTemplatePlugin(options)`

Chunks are wrapped into JSONP-calls. A loading algorithm is included in entry chunks. It loads chunks by adding a `<script>` tag.

`options` are the output options.

`options.jsonpFunction` is the JSONP function.

`options.publicPath` is used as path for loading the chunks.

`options.chunkFilename` is the filename under that chunks are expected.

### NodeTemplatePlugin

`node/NodeTemplatePlugin(options)`

Chunks are wrapped into Node.js modules exporting the bundled modules. The entry chunks loads chunks by requiring them.

`options` are the output options.

`options.chunkFilename` is the filename under that chunks are expected.

### LibraryTemplatePlugin

`LibraryTemplatePlugin(name, target)`

The entries chunks are decorated to form a library `name` of type `type`.

### WebWorkerTemplatePlugin

`webworker/WebWorkerTemplatePlugin(options)`

Chunks are loaded by `importScripts`. Else it's similar to [`JsonpTemplatePlugin`](https://v4.webpack.docschina.org#jsonptemplateplugin).

`options` are the output options.

### EvalDevToolModulePlugin

Decorates the module template by wrapping each module in a `eval` annotated with `// @sourceURL`.

### SourceMapDevToolPlugin

`SourceMapDevToolPlugin(sourceMapFilename, sourceMappingURLComment, moduleFilenameTemplate, fallbackModuleFilenameTemplate)`

Decorates the templates by generating a SourceMap for each chunk.

`sourceMapFilename` the filename template of the SourceMap. `[hash]`, `[name]`, `[id]`, `[file]` and `[filebase]` are replaced. If this argument is missing, the SourceMap will be inlined as DataUrl.

### NoHotModuleReplacementPlugin

`NoHotModuleReplacementPlugin()`

Defines `module.hot` as `false` to remove hot module replacement code.

### HotModuleReplacementPlugin

`HotModuleReplacementPlugin(options)`

Add support for hot module replacement. Decorates the templates to add runtime code. Adds `module.hot` API.

`options.hotUpdateChunkFilename` the filename for hot update chunks.

`options.hotUpdateMainFilename` the filename for the hot update manifest.

`options.hotUpdateFunction` JSON function name for the hot update.

## source

Plugins affecting the source code of modules.

### APIPlugin

Make webpack_public_path, webpack_require, webpack_modules and webpack_chunk_load accessible. Ensures that `require.valueOf` and `require.onError` are not processed by other plugins.

### CompatibilityPlugin

Currently useless. Ensures compatibility with other module loaders.

### ConsolePlugin

Offers a pseudo `console` if it is not available.

### ConstPlugin

Tries to evaluate expressions in `if (...)` statements and ternaries to replace them with `true`/`false` for further possible dead branch elimination using hooks fired by the parser.

There are multiple optimizations in production mode regarding dead branches:

- The ones performed by Terser
- The ones performed by webpack

webpack will try to evaluate conditional statements. If it succeeds then the dead branch is removed. webpack can't do constant folding unless the compiler knows it. For example:

```javascript
import { calculateTax } from './tax';

const FOO = 1;
if (FOO === 0) {
  // dead branch
  calculateTax();
}
```

In the above example, webpack is unable to prune the branch, but Terser does. However, if `FOO` is defined using [DefinePlugin](https://v4.webpack.docschina.org/plugins/define-plugin/), webpack will succeed.

It is important to mention that `import { calculateTax } from './tax';` will also get pruned because `calculateTax()` call was in the dead branch and got eliminated.

### ProvidePlugin

`ProvidePlugin(name, request)`

If `name` is used in a module it is filled by a module loaded by `require(<request>)`.

### NodeStuffPlugin

`NodeStuffPlugin(options, context)`

Provide stuff that is normally available in Node.js modules.

It also ensures that `module` is filled with some Node.js stuff if you use it.

### RequireJsStuffPlugin

Provide stuff that is normally available in require.js.

`require[js].config` is removed. `require.version` is `0.0.0`. `requirejs.onError` is mapped to `require.onError`.

### NodeSourcePlugin

`node/NodeSourcePlugin(options)`

This module adds stuff from Node.js that is not available in non Node.js environments.

It adds polyfills for `process`, `console`, `Buffer` and `global` if used. It also binds the built in Node.js replacement modules.

### NodeTargetPlugin

`node/NodeTargetPlugin()`

The plugins should be used if you run the bundle in a Node.js environment.

If ensures that native modules are loaded correctly even if bundled.

### AMDPlugin

`dependencies/AMDPlugin(options)`

Provides AMD-style `define` and `require` to modules. Also bind `require.amd`, `define.amd` and webpack_amd_options##  to the `options` passed as parameter.

### CommonJsPlugin

`dependencies/CommonJsPlugin`

Provides CommonJs-style `require` to modules.

### LabeledModulesPlugin

`dependencies/LabeledModulesPlugin()`

Provide labels `require:` and `exports:` to modules.

### RequireContextPlugin

`dependencies/RequireContextPlugin(modulesDirectories, extensions)`

Provides `require.context`. The parameter `modulesDirectories` and `extensions` are used to find alternative requests for files. It's useful to provide the same arrays as you provide to the resolver.

### RequireEnsurePlugin

`dependencies/RequireEnsurePlugin()`

Provides `require.ensure`.

### RequireIncludePlugin

`dependencies/RequireIncludePlugin()`

Provides `require.include`.

### DefinePlugin

`DefinePlugin(definitions)`

Define constants for identifier.

`definitions` is an object.

## optimize

### LimitChunkCountPlugin

`optimize/LimitChunkCountPlugin(options)`

Merge chunks limit chunk count is lower than `options.maxChunks`.

The overhead for each chunks is provided by `options.chunkOverhead` or defaults to 10000. Entry chunks sizes are multiplied by `options.entryChunkMultiplicator` (or 10).

Chunks that reduce the total size the most are merged first. If multiple combinations are equal the minimal merged size wins.

### MergeDuplicateChunksPlugin

`optimize/MergeDuplicateChunksPlugin()`

Chunks with the same modules are merged.

### RemoveEmptyChunksPlugin

`optimize/RemoveEmptyChunksPlugin()`

Modules that are included in every parent chunk are removed from the chunk.

### MinChunkSizePlugin

`optimize/MinChunkSizePlugin(minChunkSize)`

Merges chunks until each chunk has the minimum size of `minChunkSize`.

### FlagIncludedChunksPlugin

`optimize/FlagIncludedChunksPlugin()`

Adds chunk ids of chunks which are included in the chunk. This eliminates unnecessary chunk loads.

### OccurrenceOrderPlugin

`optimize/OccurrenceOrderPlugin(preferEntry)`

Order the modules and chunks by occurrence. This saves space, because often referenced modules and chunks get smaller ids.

`preferEntry` If true, references in entry chunks have higher priority

### DedupePlugin

`optimize/DedupePlugin()`

Deduplicates modules and adds runtime code.

# LimitChunkCountPlugin

当你在编写代码时，可能已经添加了许多代码分离点(code split point)来实现按需加载(load stuff on demand)。在编译完之后，你可能会注意到有一些很小的 chunk - 这产生了大量 HTTP 请求开销。`LimitChunkCountPlugin` 插件可以通过合并的方式，后处理你的 chunk，以减少请求数。

``` js
new webpack.optimize.LimitChunkCountPlugin({
  // 选项……
});
```


## 选项

可以支持以下选项：

### `maxChunks`

`number`

使用大于或等于 `1` 的值，来限制 chunk 的最大数量。使用 `1` 防止添加任何其他额外的 chunk，这是因为 entry/main chunk 也会包含在计数之中。

__webpack.config.js__

```javascript
const webpack = require('webpack');
module.exports = {
  // ...
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 5
    })
  ]
};
```

### `minChunkSize`

`number`

设置 chunk 的最小大小。

__webpack.config.js__

```javascript
const webpack = require('webpack');
module.exports = {
  // ...
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      minChunkSize: 1000
    })
  ]
};
```


## 命令行接口(CLI)用法

此插件和其选项还可以通过 [命令行接口(CLI)](https://v4.webpack.docschina.org/api/cli/) 执行：

```bash
webpack --optimize-max-chunks 15
```

或

```bash
webpack --optimize-min-chunk-size 10000
```

# LoaderOptionsPlugin

`loader-options-plugin` 和其他插件不同，它用于将 webpack 1 迁移至 webpack 2。在 webpack 2 中，对 `webpack.config.js` 的结构要求变得更加严格；不再开放扩展给其他的 loader/插件。webpack 2 推荐的使用方式是直接传递 `options` 给 loader/插件（换句话说，`配置选项`将**不是**全局/共享的）。

不过，在某个 loader 升级为依靠直接传递给它的配置选项运行之前，可以使用 `loader-options-plugin` 来抹平差异。你可以通过这个插件配置全局/共享的 loader 配置，使所有的 loader 都能收到这些配置。

``` js
new webpack.LoaderOptionsPlugin({
  // Options...
});
```

W> 将来这个插件可能会被移除，因为它只是用于迁移。


## 选项

此插件支持以下选项：

- `options.debug` (`boolean`)：loader 是否为 `debug` 模式。`debug` 在 webpack 3 中将被移除。
- `options.minimize` (`boolean`)：loader 是否要切换到优化模式。
- `options.options` (`object`)：一个配置对象，用来配置旧的 loader - 将使用和 `webpack.config.js` 相同的结构。
- `options.options.context` (`string`)：配置 loader 时使用的上下文。
- 任何其他选项和在 `webpack.config.js` 中一样……


## 用法

关于此插件可能的用法，这里有个示例：

```javascript
new webpack.LoaderOptionsPlugin({
  minimize: true,
  debug: false,
  options: {
    context: __dirname
  }
});
```

# MinChunkSizePlugin

通过合并小于 `minChunkSize` 大小的 chunk，将 chunk 体积保持在指定大小限制以上。

``` js
new webpack.optimize.MinChunkSizePlugin({
  minChunkSize: 10000 // Minimum number of characters
});
```

# MiniCssExtractPlugin

[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]

This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps.

It builds on top of a new webpack v4 feature (module types) and requires webpack 4 to work.

Compared to the extract-text-webpack-plugin:

* Async loading
* No duplicate compilation (performance)
* Easier to use
* Specific to CSS

TODO:

* HMR support

## Install

```bash
npm install --save-dev mini-css-extract-plugin
```

## Usage

##

#### Minimal example

**webpack.config.js**

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      }
    ]
  }
}
```

#### Advanced configuration example

This plugin should be used only on `production` builds without `style-loader` in the loaders chain, especially if you want to have HMR in `development`.

Here is an example to have both HMR in `development` and your styles extracted in a file for `production` builds.

(Loaders options left out for clarity, adapt accordingly to your needs.)


**webpack.config.js**

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }
    ]
  }
}
```

### Minimizing For Production

While webpack 5 is likely to come with a CSS minimizer built-in, with webpack 4 you need to bring your own. To minify the output, use a plugin like [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin). Setting `optimization.minimizer` overrides the defaults provided by webpack, so make sure to also specify a JS minimizer:

**webpack.config.js**

```js
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  }
}
```

### Features

#### Using preloaded or inlined CSS

The runtime code detects already added CSS via `<link>` or `<style>` tag.
This can be useful when injecting CSS on server-side for Server-Side-Rendering.
The `href` of the `<link>` tag has to match the URL that will be used for loading the CSS chunk.
The `data-href` attribute can be used for `<link>` and `<style>` too.
When inlining CSS `data-href` must be used.

#### Extracting all CSS in a single file

Similar to what [extract-text-webpack-plugin](https://v4.webpack.docschina.org/plugins/extract-text-webpack-plugin/) does, the CSS
can be extracted in one CSS file using `optimization.splitChunks.cacheGroups`.

**webpack.config.js**

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  }
}
```

#### Extracting CSS based on entry

You may also extract the CSS based on the webpack entry name. This is especially useful if you import routes dynamically
but want to keep your CSS bundled according to entry. This also prevents the CSS duplication issue one had with the
ExtractTextPlugin.

```javascript
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

module.exports = {
  entry: {
    foo: path.resolve(__dirname, 'src/foo'),
    bar: path.resolve(__dirname, 'src/bar')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        fooStyles: {
          name: 'foo',
          test: (m,c,entry = 'foo') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true
        },
        barStyles: {
          name: 'bar',
          test: (m,c,entry = 'bar') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  }
}
```

#### Long Term Caching

For long term caching use `filename: "[contenthash].css"`. Optionally add `[name]`.

### Media Query Plugin

If you'd like to extract the media queries from the extracted CSS (so mobile users don't need to load desktop or tablet specific CSS anymore) you should use one of the following plugins:

- [Media Query Plugin](https://github.com/SassNinja/media-query-plugin)
- [Media Query Splitting Plugin](https://github.com/mike-diamond/media-query-splitting-plugin)


## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/sokra">
          <img width="150" height="150" src="https://github.com/sokra.png?size=150">
          </br>
          Tobias Koppers
        </a>
      </td>
    </tr>
  <tbody>
</table>


## License

[MIT](https://raw.githubusercontent.com/webpack-contrib/mini-css-extract-plugin/master/LICENSE)

[npm]: https://img.shields.io/npm/v/mini-css-extract-plugin.svg
[npm-url]: https://npmjs.com/package/mini-css-extract-plugin

[node]: https://img.shields.io/node/v/mini-css-extract-plugin.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/mini-css-extract-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/mini-css-extract-plugin

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/mini-css-extract-plugin.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/mini-css-extract-plugin

[cover]: https://codecov.io/gh/webpack-contrib/mini-css-extract-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/mini-css-extract-plugin

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# ModuleConcatenationPlugin

过去 webpack 打包时的一个取舍是将 bundle 中各个模块单独打包成闭包。这些打包函数使你的 JavaScript 在浏览器中处理的更慢。相比之下，一些工具像 Closure Compiler 和 RollupJS 可以提升(hoist)或者预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度。

这个插件会在 webpack 中实现以上的预编译功能。这个插件仅在生产环境下默认启用。如果你需要在其它模式下开启，可以手动添加：

```js
new webpack.optimize.ModuleConcatenationPlugin();
```


> 这种连结行为被称为“作用域提升(scope hoisting)”。
>
> 由于实现 ECMAScript 模块语法，作用域提升(scope hoisting)这个特定于此语法的功能才成为可能。`webpack` 可能会根据你正在使用的模块类型和[其他的情况](https://medium.com/webpack/webpack-freelancing-log-book-week-5-7-4764be3266f5)，回退到普通打包。

W> 记住，此插件仅适用于由 webpack 直接处理的 [ES6 模块](https://v4.webpack.docschina.org/api/module-methods/#es6-recommended-)。在使用转译器(transpiler)时，你需要禁用对模块的处理（例如 Babel 中的 [`modules`](https://babel.docschina.org/docs/en/babel-preset-es2015/#optionsmodules) 选项）。


## 绑定失败的优化[Optimization Bailouts]

像文章中解释的，webpack 试图达到分批的作用域提升(scope hoisting)。它会将一些模块绑定到一个作用域内，但并不是任何情况下都会这么做。如果 webpack 不能绑定模块，将会有两个选择 Prevent 和 Root，Prevent 意思是模块必须在自己的作用域内。 Root 意味着将创建一个新的模块组。以下条件决定了输出结果：

Condition                                     | Outcome
--------------------------------------------- | --------
Non ES6 Module                                | Prevent
Imported By Non Import                        | Root
Imported From Other Chunk                     | Root
Imported By Multiple Other Module Groups      | Root
Imported With `import()`                      | Root
Affected By `ProvidePlugin` Or Using `module` | Prevent
HMR Accepted                                  | Root
Using `eval()`                                | Prevent
In Multiple Chunks                            | Prevent
`export * from "cjs-module"`                  | Prevent


### 模块分组算法[Module Grouping Algorithm]

以下 JavaScript 伪代码解释了算法：

```js
modules.forEach(module => {
  const group = new ModuleGroup({
    root: module
  });
  module.dependencies.forEach(dependency => {
    tryToAdd(group, dependency);
  });
  if (group.modules.length > 1) {
    orderedModules = topologicalSort(group.modules);
    concatenatedModule = new ConcatenatedModule(orderedModules);
    chunk.add(concatenatedModule);
    orderedModules.forEach(groupModule => {
      chunk.remove(groupModule);
    });
  }
});

function tryToAdd(group, module) {
  if (group.has(module)) {
    return true;
  }
  if (!hasPreconditions(module)) {
    return false;
  }
  const nextGroup = group;
  const result = module.dependents.reduce((check, dependent) => {
    return check && tryToAdd(nextGroup, dependent);
  }, true);
  if (!result) {
    return false;
  }
  module.dependencies.forEach(dependency => {
    tryToAdd(group, dependency);
  });
  group.merge(nextGroup);
  return true;
}
```


### 优化绑定失败的调试[Debugging Optimization Bailouts]

当我们使用 webpack CLI 时，加上参数 `--display-optimization-bailout` 将显示绑定失败的原因。在 webpack 配置里，只需将以下内容添加到 stats 对象中：

```js
module.exports = {
  //...
  stats: {
    // Examine all modules
    maxModules: Infinity,
    // Display bailout reasons
    optimizationBailout: true
  }
};
```

# NormalModuleReplacementPlugin

`NormalModuleReplacementPlugin` 允许你用 `newResource` 替换与 `resourceRegExp` 匹配的资源。如果 `newResource` 是相对路径，它会相对于先前的资源被解析。如果 `newResource` 是函数，它将会覆盖之前被提供资源的请求。

这对于允许在构建中的不同行为是有用的。

``` js
new webpack.NormalModuleReplacementPlugin(
  resourceRegExp,
  newResource
);
```


## 基本示例

在构建[开发环境](https://v4.webpack.docschina.org/guides/production)时替换特定的模块。

假设你有一个配置文件 `some/path/config.development.module.js` 并且在生产环境有一个特殊的版本 `some/path/config.production.module.js`

只需在生产构建时添加以下插件：

``` javascript
new webpack.NormalModuleReplacementPlugin(
  /some\/path\/config\.development\.js/,
  './config.production.js'
);
```


## 高级示例

根据[指定环境](https://v4.webpack.docschina.org/configuration/configuration-types)的条件构建。

假设你想要一个为了不同构建目标的特定值的配置。

``` javascript
module.exports = function(env) {
  var appTarget = env.APP_TARGET || 'VERSION_A';
  return {
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/(.*)-APP_TARGET(\.*)/, function(resource) {
        resource.request = resource.request.replace(/-APP_TARGET/, `-${appTarget}`);
      })
    ]
  };

};
```

创建两个配置文件：

__app/config-VERSION_A.js__

``` javascript
export default {
  title : 'I am version A'
};
```

__app/config-VERSION_B.js__

``` javascript
export default {
  title : 'I am version B'
};
```

然后使用在正则中查找的关键字来引入配置：

``` javascript
import config from 'app/config-APP_TARGET';
console.log(config.title);
```

根据你的构建目标，现在你引入了正确的配置。

``` shell
webpack --env.APP_TARGET VERSION_A
=> 'I am version A'

webpack --env.APP_TARGET VERSION_B
=> 'I am version B'
```

# NpmInstallWebpackPlugin

Speed up development by <b>automatically installing & saving dependencies</b> with Webpack.

It is inefficient to <kbd>Ctrl-C</kbd> your
build script & server just to install
a dependency you didn't know you needed until now.

Instead, use `require` or `import` how you normally would and `npm install`
will happen **automatically to install & save missing dependencies** while you work!

## 安装

```bash
$ npm install --save-dev npm-install-webpack-plugin
```

## 用法

在 `webpack.config.js` 中：

```js
plugins: [
  new NpmInstallPlugin()
],
```

**相当于**：

```js
plugins: [
  new NpmInstallPlugin({
    // 使用 --save 或者 --save-dev
    dev: false,
    // 安装缺少的 peerDependencies
    peerDependencies: true,
    // 减少控制台日志记录的数量
    quiet: false,
    // npm command used inside company, yarn is not supported yet
    npm: 'tnpm'
  });
],
```

可以提供一个 `Function` 来动态设置 `dev`：

```js
plugins: [
  new NpmInstallPlugin({
    dev: function(module, path) {
      return [
        "babel-preset-react-hmre",
        "webpack-dev-middleware",
        "webpack-hot-middleware",
      ].indexOf(module) !== -1;
    },
  }),
],
```

## Demo

![npm-install-webpack-plugin demo](https://cloud.githubusercontent.com/assets/15182/12540538/6a4e8f1a-c2d0-11e5-97ee-4ddaf6892645.gif)

## Features

- [x] Works with both Webpack `^v1.12.0` and `^2.1.0-beta.0`.
- [x] Auto-installs `.babelrc` plugins & presets.
- [x] Supports both ES5 & ES6 Modules.
  (e.g. `require`, `import`)
- [x] Supports Namespaced packages.
  (e.g. `@cycle/dom`)
- [x] Supports Dot-delimited packages.
  (e.g. `lodash.capitalize`)
- [x] Supports CSS imports.
  (e.g. `@import "~bootstrap"`)
- [x] Supports Webpack loaders.
  (e.g. `babel-loader`, `file-loader`, etc.)
- [x] Supports inline Webpack loaders.
  (e.g. `require("bundle?lazy!./App"`)
- [x] Auto-installs missing `peerDependencies`.
  (e.g. `@cycle/core` will automatically install `rx@*`)
- [x] Supports Webpack's `resolve.alias` & `resolve.root` configuration.
  (e.g. `require("react")` can alias to `react-lite`)

## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars2.githubusercontent.com/u/15182?v=3&s=150">
        </br>
        <a href="https://github.com/ericclemmons">Eric Clemmons</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/226692?v=3&s=150">
        </br>
        <a href="https://github.com/insin">Jonny Buchanan</a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/npm-install-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/npm-install-webpack-plugin

[deps]: https://david-dm.org/webpack-contrib/npm-install-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/npm-install-webpack-plugin

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: https://travis-ci.org/webpack-contrib/npm-install-webpack-plugin.svg?branch=master
[test-url]: https://travis-ci.org/webpack-contrib/npm-install-webpack-plugin

[cover]: https://codecov.io/gh/webpack-contrib/npm-install-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/npm-install-webpack-plugin

# PrefetchPlugin

预取出普通的模块请求(module request)，可以让这些模块在他们被 `import` 或者是 `require` 之前就解析并且编译。使用这个预取插件可以提升性能。可以多试试在编译前记录时间(profile)来决定最佳的预取的节点。

``` javascript
new webpack.PrefetchPlugin([context], request);
```


## 选项

- `context`：文件夹的绝对路径
- `request`：普通模块的 request 字符串

# ProfilingPlugin

Generate Chrome profile file which includes timings of plugins execution. Outputs `events.json` file by default. It is possible to provide custom file path using `outputPath` option.

## Options

- `outputPath`: A relative path to a custom output file (json)

## Usage: default

``` js
new webpack.debug.ProfilingPlugin();
```

## Usage: custom `outputPath`

``` js
new webpack.debug.ProfilingPlugin({
  outputPath: 'profiling/profileEvents.json'
});
```

In order to view the profile file:

1. Run webpack with `ProfilingPlugin`.
2. Go to Chrome, open DevTools, and go to the `Performance` tab (formerly `Timeline`).
3. Drag and drop generated file (`events.json` by default) into the profiler.

It will then display timeline stats and calls per plugin!

# ProgressPlugin

The `ProgressPlugin` provides a way to customize how progress is reported during a compilation.

## Usage

Create an instance of `ProgressPlugin` with a handler function which will be called when hooks report progress:

```js
const handler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  console.info(percentage, message, ...args);
};

new webpack.ProgressPlugin(handler);
```

- `handler` is a function which takes these arguments:
- `percentage`: a number between 0 and 1 indicating the completion percentage of the compilation.
- `message`: a short description of the currently-executing hook.
- `...args`: zero or more additional strings describing the current progress.

## Supported Hooks

The following hooks report progress information to `ProgressPlugin`.

T> _Hooks marked with * allow plugins to report progress information using `reportProgress`. For more, see [Plugin API: Reporting Progress](https://v4.webpack.docschina.org/api/plugins/#reporting-progress)_

__Compiler__

- compilation
- emit*
- afterEmit*
- done

__Compilation__

- buildModule
- failedModule
- succeedModule
- finishModules*
- seal*
- optimizeDependenciesBasic*
- optimizeDependencies*
- optimizeDependenciesAdvanced*
- afterOptimizeDependencies*
- optimize*
- optimizeModulesBasic*
- optimizeModules*
- optimizeModulesAdvanced*
- afterOptimizeModules*
- optimizeChunksBasic*
- optimizeChunks*
- optimizeChunksAdvanced*
- afterOptimizeChunks*
- optimizeTree*
- afterOptimizeTree*
- optimizeChunkModulesBasic*
- optimizeChunkModules*
- optimizeChunkModulesAdvanced*
- afterOptimizeChunkModules*
- reviveModules*
- optimizeModuleOrder*
- advancedOptimizeModuleOrder*
- beforeModuleIds*
- moduleIds*
- optimizeModuleIds*
- afterOptimizeModuleIds*
- reviveChunks*
- optimizeChunkOrder*
- beforeChunkIds*
- optimizeChunkIds*
- afterOptimizeChunkIds*
- recordModules*
- recordChunks*
- beforeHash*
- afterHash*
- recordHash*
- beforeModuleAssets*
- beforeChunkAssets*
- additionalChunkAssets*
- record*
- additionalAssets*
- optimizeChunkAssets*
- afterOptimizeChunkAssets*
- optimizeAssets*
- afterOptimizeAssets*
- afterSeal*

## Source

- [`ProgressPlugin` source](https://github.com/webpack/webpack/blob/master/lib/ProgressPlugin.js)

# ProvidePlugin

自动加载模块，而不必到处 `import` 或 `require` 。

``` js
new webpack.ProvidePlugin({
  identifier: 'module1',
  // ...
});
```

or

``` js
new webpack.ProvidePlugin({
  identifier: ['module1', 'property1'],
  // ...
});
```

任何时候，当 `identifier` 被当作未赋值的变量时，`module` 就会自动被加载，并且 `identifier` 会被这个 `module` 导出的内容所赋值。（或者被模块的 `property` 导出的内容所赋值，以支持命名导出(named export)）。

W> 对于 ES2015 模块的 default export，你必须指定模块的 default 属性。


## 使用：jQuery

要自动加载 `jquery`，我们可以将两个变量都指向对应的 node 模块：

```javascript
new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
});
```

然后在我们任意源码中：

```javascript
// in a module
$('#item'); // <= 起作用
jQuery('#item'); // <= 起作用
// $ 自动被设置为 "jquery" 输出的内容
```


## 使用：jQuery 和 Angular 1

Angular 会寻找 `window.jQuery` 来决定 jQuery 是否存在, 查看[源码](https://github.com/angular/angular.js/blob/v1.5.9/src/Angular.js#L1821-L1823)。

```javascript
new webpack.ProvidePlugin({
  'window.jQuery': 'jquery'
});
```


## 使用：Lodash Map

```javascript
new webpack.ProvidePlugin({
  _map: ['lodash', 'map']
});
```

### 使用：Vue.js

```javascript
new webpack.ProvidePlugin({
  Vue: ['vue/dist/vue.esm.js', 'default']
});
```

# SourceMapDevToolPlugin

本插件实现了对 source map 生成内容进行更细粒度的控制。它也可以通过 [`devtool`](https://v4.webpack.docschina.org/configuration/devtool/) 配置选项的某些设置自动启用。

```js
new webpack.SourceMapDevToolPlugin(options);
```


## 选项

支持以下选项：

- `test` (`string|regex|array`)：包含基于扩展名的模块的 source map（默认是 `.js`, `.mjs` 和 `.css`）。
- `include` (`string|regex|array`)：使路径与该值匹配的模块生成 source map。
- `exclude` (`string|regex|array`)：使匹配该值的模块不生成 source map。
- `filename` (`string`)：定义生成的 source map 的名称（如果没有值将会变成 inlined）。
- `append` (`string`)：在原始资源后追加给定值。通常是 `#sourceMappingURL` 注释。`[url]` 被替换成 source map 文件的 URL。`false` 将禁用追加。
- `moduleFilenameTemplate` (`string`): 查看 [`output.devtoolModuleFilenameTemplate`](https://v4.webpack.docschina.org/configuration/output/#output-devtoolmodulefilenametemplate).
- `fallbackModuleFilenameTemplate` (`string`)：同上。
- `module` (`boolean`)：表示 loader 是否生成 source map（默认为 `true`）。
- `columns` (`boolean`)：表示是否应该使用 column mapping（默认为 `true`）。
- `lineToLine` (`boolean` 或 `object`)：通过行到行源代码映射(line to line source mappings)简化和提升匹配模块的源代码映射速度。
- `noSources` (`boolean`)：防止源文件的内容被包含在 source map 里（默认为 `false`）。
- `publicPath` (`string`)：生成带 public path 前缀的绝对 URL，例如：`https://example.com/project/`。
- `fileContext` (`string`)：使得 `[file]` 参数作为本目录的相对路径。

`lineToLine` 对象允许的值和上面 `test`，`include`，`exclude` 选项一样。

`fileContext` 选项在你想要将 source maps 存储到上层目录，避免 `../../` 出现在绝对路径 `[url]` 里面时有用。

T> 设置 `module` 和/或 `columns` 为 `false` 将会生成不太精确的 source map，但同时会显著地提升编译性能。

T> If you want to use a custom configuration for this plugin in [development mode](https://v4.webpack.docschina.org/concepts/mode/#mode-development), make sure to disable the default one. I.e. set `devtool: false`.

W> 记得在使用 [`TerserPlugin`](https://v4.webpack.docschina.org/plugins/terser-webpack-plugin) 时，必须使用 `sourceMap` 选项。

## 用法

下面的示例展示了本插件的一些常见用例。

### Basic Use Case

You can use the following code to replace the configuration option `devtool: inline-source-map` with an equivalent custom plugin configuration:

```js
module.exports = {
  // ...
  devtool: false,
  plugins: [
    new webpack.SourceMapDevToolPlugin({})
  ]
};
```

### 排除 vendor 的 map

以下代码会排除 `vendor.js` 内模块的 source map。

```js
new webpack.SourceMapDevToolPlugin({
  filename: '[name].js.map',
  exclude: ['vendor.js']
});
```

### 在宿主环境外部化 source map

设置 source map 的 URL。在宿主环境需要授权的情况下很有用。

```js
new webpack.SourceMapDevToolPlugin({
  append: '\n//# sourceMappingURL=http://example.com/sourcemap/[url]',
  filename: '[name].map'
});
```

还有一种场景，source map 存储在上层目录中时：

```code
project
|- dist
  |- public
    |- bundle-[hash].js
  |- sourcemaps
    |- bundle-[hash].js.map
```

如下设置：

```js
new webpack.SourceMapDevToolPlugin({
  filename: 'sourcemaps/[file].map',
  publicPath: 'https://example.com/project/',
  fileContext: 'public'
});
```

将会生成以下 URL：

```code
https://example.com/project/sourcemaps/bundle-[hash].js.map
```

# SplitChunksPlugin

起初，chunk （以及被其引入的模块）是以父子关系的形式被包含在 webpack 的图结构中的。`CommonsChunkPlugin` 曾经被用来避免模块之间重复引用的问题，但是这个插件将不会继续维护了。

自从 webpack 的第 4 个版本开始，`CommonsChunkPlugin` 插件将会被移除，取而代之的是 `optimization.splitChunks` 和 `optimization.runtimeChunk` 两个配置项。以下内容讲解了这些新的工作流如何使用。

## 默认情况

开箱即用的 `SplitChunksPlugin` 应该可以满足大部分用户的需求。

默认情况下该插件只会影响按需加载的 chunks ，因为改变入口 chunks 将会影响到编译后 HTML 页面中 script 标签的插入。

webpack 将会根据以下几点情况自动的分割 chunks ：

* 被分割的新 chunk 可以被共享**或者** 模块是来自 `node_modules` 目录下的。
* 被分割的新 chunk 体积将会大于 30kb （在 min+gz 之前）。
* 在按需加载 chunks 时，并发请求数应小于等于 5 。
* 在首页加载 chunks 时，并发数应小于等于 3 。

当尝试满足后 2 条情况时，通常会优先选择体积更大的 chunks 。

我们来看几个例子。

### 默认情况：例子 1

W> The default configuration was chosen to fit web performance best practices, but the optimal strategy for your project might differ. If you're changing the configuration, you should measure the impact of your changes to ensure there's a real benefit.

// 动态引入 a.js
import("./a");
```

This configuration object represents the default behavior of the `SplitChunksPlugin`.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

**结果：** 一个包含 react 库和 a.js 的分割 chunk 将会被创建。import 的使用会让分离出去的 chunk 文件与原入口的 chunk 文件并行加载。

为什么：

* 情况 1：入口 chunk 包含来自 `node_modules` 目录下的模块
* 情况 2：`react` 库的体积大于 30kb
* 情况 3：由于 import 的使用，页面的并发请求数为 2
* 情况 4：不影响首页的加载

变成这种情况的原因是什么？ `react` 库文件在应用中一般不会经常性的变动。将其分割到一个单独的 chunk 中可以与应用代码分别缓存（假设你正在使用 chunkhash、records、Cache-Control 或其他类似的长期缓存方案）。

### 默认情况：例子 2

`function (chunk) | string`

// 动态引入 a.js 和 b.js
import("./a");
import("./b");
```

``` js
// a.js
import "./helpers"; // helpers 文件有 40kb 的体积

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    }
  }
};
```

``` js
// b.js
import "./helpers";
import "./more-helpers"; // more-helpers 文件也有 40kb 的体积

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks (chunk) {
        // exclude `my-excluded-chunk`
        return chunk.name !== 'my-excluded-chunk';
      }
    }
  }
};
```

**结果：** 一个包含 helpers 和其所有依赖的分割 chunk 将会被创建。import 的使用让分割 chunk 与原有的入口 chunks 并行加载。

为什么：

* 情况 1：分割 chunk 可以在 a.js 和 b.js 中共享。
* 情况 2：`helpers` 文件大于 30kb。
* 情况 3：使用 import 进行按需加载所产生的并发数为 2。
* 情况 4：不影响首页文件的加载请求。

将 `helpers` 文件中的内容放到每个 chunk 中将会导致每个 chunk 中的 helper 模块被加载 2 次。通过使用代码分割将会变成只加载一次。但是这样做将会导致附加一个并发请求，这时我们就需要有所考虑和权衡。因此才会有一个体积 30kb 的最小限度。

### `splitChunks.maxInitialRequests`

## 配置

为了让那些想要对这个功能有更多控制权的开发者们， webpack 提供了一组自定义的设置来让你满足自己的需求。

如果你手动的更改了分割策略配置，请确定你所配置的结果产生的影响是真正有益的。

W> 我们所提供的默认配置是为了满足 web 性能而产生的最佳实践，但是最好的优化策略，仍然依赖于你项目的实际情况。

### 配置缓存组

默认的配置将所有引用自 `node_modules` 目录下的模块分配到了一个叫做 `vendors` 的缓存组，同时所有模块至少被重复引用 2 次才会被归入 `default` 缓存组。

一个模块是可以被分配到多个缓存组里的。需要被优化的模块会更喜欢`优先级`（ `priority` 配置项）更高的缓存组，或体积更大的 chunks 。

### 分割情况

来自相同 chunks 和缓存组的模块完全满足下列可控的分割情况时，将会产生一个新的 chunk 。

这里有 4 个选项可以控制分割情况：

* `minSize` （默认：30000）一个 chunk 的最小体积。
* `minChunks` （默认：1）模块最少被重复引用几次才会被分割。
* `maxInitialRequests` (默认：3) 入口页面的最大并发数。
* `maxAsyncRequests` (默认：5) 按需加载的最大并发数。

### 命名

为了控制分割后的 chunk 的文件名，可以通过 `name` 选项进行设置。

W> 当把相同的命名分配给不同的分割 chunks 时，所有的混合模块将会被放置到一个单独的共享 chunk 中，但是我们并不赞成这么做，因为这将导致多余的代码加载。

使用魔法般的 `true` 值将会根据 chunks 和 缓存组键名自动选择命名，或者你也可以传入一个字符串或者函数。

当分割 chunk 命名与入口 chunk 的命名相同时，入口 chunk 将会被移除。

__webpack.config.js__

默认情况下 webpack 将会使用源 chunk 的名字自动生成分割 chunk 的名字，例如 `vendors~main.js` 。

如果你的项目不喜欢使用 `~` 字符，你可以通过该设置项设置一个别的字符，例如： `automaticNameDelimiter: "-"` 。

之后，分隔 chunk 的名字将会变成 `vendors-main.js` 。

### 选择模块

`test` 设置项控制了那些模块可以入选缓存组。默认是全部模块都有机会入选，你可以传入正则表达式，字符串或者函数进行控制。

它可以匹配模块的绝对地址或 chunk 的名字。当匹配到 chunk 的名字后，其中所有的模块都会被选中。

### 选择 chunks

使用 `chunks` 配置项可以控制该插件作用于哪种情况的 chunks 。

该设置项有 3 个可能的值 `"initial"`, `"async"` 和 `"all"` 。分别对应初始加载、按需加载、和全部情况。

`reuseExistingChunk` 选项设置了当模块完全匹配时，允许重复使用已存在的 chunks 而不是重新创建。

每个缓存组均可以设置该设置项。

Controls which modules are selected by this cache group. Omitting it selects all modules. It can match the absolute module resource path or chunk names. When a chunk name is matched, all modules in the chunk are selected.

__webpack.config.js__

如之前所说，该插件会作用于动态加载的模块。当将这个选项设置为 all 时，所有初始化 chunks 也将会被该插件影响（即便其中一些模块并不是动态加载的）。这个配置甚至可以在入口文件和按需加载文件中共享分割出来的 chunks 。

这是一个推荐的做法。

T> 你可以结合 [HtmlWebpackPlugin](https://v4.webpack.docschina.org/plugins/html-webpack-plugin/) 插件来使用这个配置项，它可以为你自动注入所有生成的分隔 chunk 的 script 引用。

Allows to override the filename when and only when it's an initial chunk.
All placeholders available in [`output.filename`](https://v4.webpack.docschina.org/configuration/output/#output-filename) are also available here.

W> This option can also be set globally in `splitChunks.filename`, but this isn't recommended and will likely lead to an error if [`splitChunks.chunks`](https://v4.webpack.docschina.org#splitchunks-chunks) is not set to `'initial'`. Avoid setting it globally.

以下的配置对象体现了 `SplitChunksPlugin` 插件的默认配置。

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          filename: '[name].bundle.js'
        }
      }
    }
  }
};
```

默认情况下缓存组会继承 `splitChunks` 的默认配置，但是 `test`,`priority` 和 `reuseExistingChunk` 只能在缓存组中进行配置。

`cacheGroups` 是一个以键名作为缓存组命名的对象。可用的配置有： `chunks`, `minSize`, `minChunks`, `maxAsyncRequests`, `maxInitialRequests`, `name` 。

你可以通过设置 `optimization.splitChunks.cacheGroups.default` 为 `false` 来禁用默认的缓存组或 `vendors` 缓存组。

默认缓存组的优先级是不允许比其他自定义缓存组的优先级高的（默认优先级为 `0`）。

以下是一些配置的例子，以及相应的作用。

### Chunks 分割：例子 1

创建一个包含所有可在入口 chunk 中共享代码段的 `commons` chunk。

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  }
};
```

W>这个配置会使你的代码文件过大，所以当一个模块不是立即被需要的时候，我们推荐使用动态引入(按需加载) 。

### Chunks 分割：例子 2

创建一个包含应用中所有来自 `node_modules` 目录下的模块的 `vendors` chunk。

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

W> 这个也许会产生一个包含所有外部库、并且体积非常大的代码文件。我们建议其中只包含你关心的框架和实用的代码段，其余的实用动态加载去引入剩余的部分。

### Split Chunks: Example 3

 Create a `custom vendor` chunk, which contains certain `node_modules` packages matched by `RegExp`.
 
 __webpack.config.js__

设置 `optimization.runtimeChunk` 为 `true` 后可以在运行时为每个 entry point 添加一个额外的 chunk。

如果设置值为 `single` ，则会只创建一个可被所有 chunk 引用的代码文件，而不是在每个 chunk 中引入重复代码。

# StylelintWebpackPlugin

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



A Stylelint plugin for webpack

## Requirements

This module requires a minimum of Node v6.9.0 and webpack v4.0.0.

## Differences With stylelint-loader

Both [`stylelint-loader`](https://github.com/adrianhall/stylelint-loader) and
this module have their uses. `stylelint-loader` lints the files you `require` 
(or the ones you define as an `entry` in your `webpack` config). However,
`@imports` in files are not followed, meaning only the main file for each
`require/entry` is linted.

`stylelint-webpack-plugin` allows defining a
[glob pattern](https://en.wikipedia.org/wiki/Glob_(programming)) matching the
configuration and use of `stylelint`.

## Getting Started

To begin, you'll need to install `stylelint-webpack-plugin`:

```console
$ npm install stylelint-webpack-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**file.ext**
```js
import file from 'file.ext';
```

```js
// webpack.config.js
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new StyleLintPlugin(options),
  ],
  // ...
}
```

And run `webpack` via your preferred method.

## Options

See stylelint's [options](http://stylelint.io/user-guide/node-api/#options) for
the complete list of options available. These options are passed through to the
`stylelint` directly.

### `configFile`

Type: `String`
Default: `undefined`

Specify the config file location to be used by `stylelint`.

_Note: By default this is
[handled by `stylelint`](http://stylelint.io/user-guide/configuration/) via
cosmiconfig._

### `context`

Type: `String`
Default: `compiler.context`

A `String` indicating the root of your `SCSS` files.

### `emitErrors`

Type: `Boolean`
Default: `true`

If true, pipes `stylelint` error severity messages to the `webpack` compiler's
error message handler.

_Note: When this property is disabled all `stylelint` messages are piped to the
`webpack` compiler's warning message handler._

### `failOnError`

Type: `Boolean`
Default: `false`

If true, throws a fatal error in the global build process. This will end the
build process on any `stylelint` error.

### `files`

Type: `String|Array[String]`
Default: `'**/*.s?(a|c)ss'`

Specify the glob pattern for finding files. Must be relative to `options.context`.

### `formatter`

Type: `Object`
Default: `require('stylelint').formatters.string`

Specify a custom formatter to format errors printed to the console.

### `lintDirtyModulesOnly`

Type: `Boolean`
Default: `false`

Lint only changed files, skip lint on start.

### `syntax`

Type: `String`
Default: `undefined`

See the `styelint`
[user guide](https://stylelint.io/user-guide/node-api/#syntax) for more info.
e.g. use `'scss'` to lint .scss files.

## Error Reporting

By default the plugin will dump full reporting of errors. Set `failOnError` to
true if you want `webpack` build process breaking with any stylelint error. You
can use the `quiet` option to avoid error output to the console.

## Acknowledgement

This project was inspired by, and is a heavily modified version of
`sasslint-webpack-plugin`.

Thanks to Javier ([@vieron](https://github.com/vieron)) for authoring this
plugin.

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/stylelint-webpack-plugin/master/LICENSE)

[npm]: https://img.shields.io/npm/v/stylelint-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/stylelint-webpack-plugin

[node]: https://img.shields.io/node/v/stylelint-webpack-plugin.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/stylelint-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/stylelint-webpack-plugin

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/stylelint-webpack-plugin.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/stylelint-webpack-plugin

[cover]: https://codecov.io/gh/webpack-contrib/stylelint-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/stylelint-webpack-plugin

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
# TerserWebpackPlugin

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



This plugin uses [terser](https://github.com/terser-js/terser) to minify your JavaScript.

> ℹ️ For `webpack@3` use [terser-webpack-plugin-legacy](https://www.npmjs.com/package/terser-webpack-plugin-legacy) package

## Getting Started

To begin, you'll need to install `terser-webpack-plugin`:

```console
$ npm install terser-webpack-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};
```

And run `webpack` via your preferred method.

## Options

### `test`

Type: `String|RegExp|Array<String|RegExp>`
Default: `/\.m?js(\?.*)?$/i`

Test to match files against.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },
};
```

### `include`

Type: `String|RegExp|Array<String|RegExp>`
Default: `undefined`

Files to include.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        include: /\/includes/,
      }),
    ],
  },
};
```

### `exclude`

Type: `String|RegExp|Array<String|RegExp>`
Default: `undefined`

Files to exclude.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        exclude: /\/excludes/,
      }),
    ],
  },
};
```

### `chunkFilter`

Type: `Function<(chunk) -> boolean>`
Default: `() => true`

Allowing to filter which chunks should be uglified (by default all chunks are uglified).
Return `true` to uglify the chunk, `false` otherwise.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        chunkFilter: (chunk) => {
          // Exclude uglification for the `vendor` chunk
          if (chunk.name === 'vendor') {
            return false;
          }

          return true;
        },
      }),
    ],
  },
};
```

### `cache`

Type: `Boolean|String`
Default: `false`

Enable file caching.
Default path to cache directory: `node_modules/.cache/terser-webpack-plugin`.

> ℹ️ If you use your own `minify` function please read the `minify` section for cache invalidation correctly.

#### `Boolean`

Enable/disable file caching.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
      }),
    ],
  },
};
```

#### `String`

Enable file caching and set path to cache directory.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: 'path/to/cache',
      }),
    ],
  },
};
```

### `cacheKeys`

Type: `Function<(defaultCacheKeys, file) -> Object>`
Default: `defaultCacheKeys => defaultCacheKeys`

Allows you to override default cache keys.

Default cache keys:

```js
({
  terser: require('terser/package.json').version, // terser version
  'terser-webpack-plugin': require('../package.json').version, // plugin version
  'terser-webpack-plugin-options': this.options, // plugin options
  path: compiler.outputPath ? `${compiler.outputPath}/${file}` : file, // asset path
  hash: crypto
    .createHash('md4')
    .update(input)
    .digest('hex'), // source file hash
});
```

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        cacheKeys: (defaultCacheKeys, file) => {
          defaultCacheKeys.myCacheKey = 'myCacheKeyValue';

          return defaultCacheKeys;
        },
      }),
    ],
  },
};
```

### `parallel`

Type: `Boolean|Number`
Default: `false`

Use multi-process parallel running to improve the build speed.
Default number of concurrent runs: `os.cpus().length - 1`.

> ℹ️ Parallelization can speedup your build significantly and is therefore **highly recommended**.

#### `Boolean`

Enable/disable multi-process parallel running.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
};
```

#### `Number`

Enable multi-process parallel running and set number of concurrent runs.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: 4,
      }),
    ],
  },
};
```

### `sourceMap`

Type: `Boolean`
Default: `false`

Use source maps to map error message locations to modules (this slows down the compilation).
If you use your own `minify` function please read the `minify` section for handling source maps correctly.

> ⚠️ **`cheap-source-map` options don't work with this plugin**.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
      }),
    ],
  },
};
```

### `minify`

Type: `Function`
Default: `undefined`

Allows you to override default minify function.
By default plugin uses [terser](https://github.com/terser-js/terser) package.
Useful for using and testing unpublished versions or forks.

> ⚠️ **Always use `require` inside `minify` function when `parallel` option enabled**.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        minify: (file, sourceMap) => {
          const extractedComments = [];

          // Custom logic for extract comments

          const { error, map, code, warnings } = require('uglify-module') // Or require('./path/to/uglify-module')
            .minify(file, {
              /* Your options for minification */
            });

          return { error, map, code, warnings, extractedComments };
        },
      }),
    ],
  },
};
```

### `terserOptions`

Type: `Object`
Default: [default](https://github.com/terser-js/terser#minify-options)

Terser minify [options](https://github.com/terser-js/terser#minify-options).

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
    ],
  },
};
```

### `extractComments`

Type: `Boolean|String|RegExp|Function<(node, comment) -> Boolean|Object>|Object`
Default: `false`

Whether comments shall be extracted to a separate file, (see [details](https://github.com/webpack/webpack/commit/71933e979e51c533b432658d5e37917f9e71595a)).
By default extract only comments using `/^\**!|@preserve|@license|@cc_on/i` regexp condition and remove remaining comments.
If the original file is named `foo.js`, then the comments will be stored to `foo.js.LICENSE`.
The `terserOptions.output.comments` option specifies whether the comment will be preserved, i.e. it is possible to preserve some comments (e.g. annotations) while extracting others or even preserving comments that have been extracted.

#### `Boolean`

Enable/disable extracting comments.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: true,
      }),
    ],
  },
};
```

#### `String`

Extract `all` or `some` (use `/^\**!|@preserve|@license|@cc_on/i` RegExp) comments.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: 'all',
      }),
    ],
  },
};
```

#### `RegExp`

All comments that match the given expression will be extracted to the separate file.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: /@extract/i,
      }),
    ],
  },
};
```

#### `Function<(node, comment) -> Boolean>`

All comments that match the given expression will be extracted to the separate file.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: (astNode, comment) => {
          if (/@extract/i.test(comment.value)) {
            return true;
          }

          return false;
        },
      }),
    ],
  },
};
```

#### `Object`

Allow to customize condition for extract comments, specify extracted file name and banner.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: (file) => {
            return `${file}.LICENSE`;
          },
          banner: (licenseFile) => {
            return `License information can be found in ${licenseFile}`;
          },
        },
      }),
    ],
  },
};
```

##### `condition`

Type: `Boolean|String|RegExp|Function<(node, comment) -> Boolean|Object>`

Condition what comments you need extract.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: 'some',
          filename: (file) => {
            return `${file}.LICENSE`;
          },
          banner: (licenseFile) => {
            return `License information can be found in ${licenseFile}`;
          },
        },
      }),
    ],
  },
};
```

##### `filename`

Type: `String|Function<(string) -> String>`
Default: `${file}.LICENSE`

The file where the extracted comments will be stored.
Default is to append the suffix `.LICENSE` to the original filename.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: 'extracted-comments.js',
          banner: (licenseFile) => {
            return `License information can be found in ${licenseFile}`;
          },
        },
      }),
    ],
  },
};
```

##### `banner`

Type: `Boolean|String|Function<(string) -> String>`
Default: `/*! For license information please see ${commentsFile} */`

The banner text that points to the extracted file and will be added on top of the original file.
Can be `false` (no banner), a `String`, or a `Function<(string) -> String>` that will be called with the filename where extracted comments have been stored.
Will be wrapped into comment.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: true,
          filename: (file) => {
            return `${file}.LICENSE`;
          },
          banner: (commentsFile) => {
            return `My custom banner about license information ${commentsFile}`;
          },
        },
      }),
    ],
  },
};
```

### `warningsFilter`

Type: `Function<(warning, source) -> Boolean>`
Default: `() => true`

Allow to filter [terser](https://github.com/terser-js/terser) warnings.
Return `true` to keep the warning, `false` otherwise.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        warningsFilter: (warning, source) => {
          if (/Dropping unreachable code/i.test(warning)) {
            return true;
          }

          if (/filename\.js/i.test(source)) {
            return true;
          }

          return false;
        },
      }),
    ],
  },
};
```

## Examples

### Cache And Parallel

Enable cache and multi-process parallel running.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
      }),
    ],
  },
};
```

### Preserve Comments

Extract all legal comments (i.e. `/^\**!|@preserve|@license|@cc_on/i`) and preserve `/@license/i` comments.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: /@license/i,
          },
        },
        extractComments: true,
      }),
    ],
  },
};
```

### Remove Comments

If you avoid building with comments, set **terserOptions.output.comments** to **false** as in this config:

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};
```

### Custom Minify Function

Override default minify function - use `uglify-js` for minification.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        // Uncomment lines below for cache invalidation correctly
        // cache: true,
        // cacheKeys: (defaultCacheKeys) => {
        //   delete defaultCacheKeys.terser;
        //
        //   return Object.assign(
        //     {},
        //     defaultCacheKeys,
        //     { 'uglify-js': require('uglify-js/package.json').version },
        //   );
        // },
        minify: (file, sourceMap) => {
          // https://github.com/mishoo/UglifyJS2#minify-options
          const uglifyJsOptions = {
            /* your `uglify-js` package options */
          };

          if (sourceMap) {
            uglifyJsOptions.sourceMap = {
              content: sourceMap,
            };
          }

          return require('uglify-js').minify(file, uglifyJsOptions);
        },
      }),
    ],
  },
};
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](https://raw.githubusercontent.com/webpack-contrib/terser-webpack-plugin/master/.github/CONTRIBUTING.md)

## License

[MIT](https://raw.githubusercontent.com/webpack-contrib/terser-webpack-plugin/master/LICENSE)

[npm]: https://img.shields.io/npm/v/terser-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/terser-webpack-plugin
[node]: https://img.shields.io/node/v/terser-webpack-plugin.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/terser-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/terser-webpack-plugin
[tests]: https://img.shields.io/circleci/project/github/webpack-contrib/terser-webpack-plugin.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/terser-webpack-plugin
[cover]: https://codecov.io/gh/webpack-contrib/terser-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/terser-webpack-plugin
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=terser-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=terser-webpack-plugin

# UglifyjsWebpackPlugin

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



This plugin uses [uglify-js](https://github.com/mishoo/UglifyJS2) to minify your JavaScript.

## Requirements

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## Getting Started

To begin, you'll need to install `uglifyjs-webpack-plugin`:

```console
$ npm install uglifyjs-webpack-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};
```

And run `webpack` via your preferred method.

## 选项

### `test`

Type: `String|RegExp|Array<String|RegExp>`
Default: `/\.js(\?.*)?$/i`

Test to match files against.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },
};
```

### `include`

Type: `String|RegExp|Array<String|RegExp>`
Default: `undefined`

Files to include.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        include: /\/includes/,
      }),
    ],
  },
};
```

### `exclude`

Type: `String|RegExp|Array<String|RegExp>`
Default: `undefined`

Files to exclude.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        exclude: /\/excludes/,
      }),
    ],
  },
};
```

### `chunkFilter`

Type: `Function<(chunk) -> boolean>`
Default: `() => true`

Allowing to filter which chunks should be uglified (by default all chunks are uglified).
Return `true` to uglify the chunk, `false` otherwise.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        chunkFilter: (chunk) => {
          // Exclude uglification for the `vendor` chunk
          if (chunk.name === 'vendor') {
            return false;
          }

          return true;
        }
      }),
    ],
  },
};
```

### `cache`

Type: `Boolean|String`
Default: `false`

Enable file caching.
Default path to cache directory: `node_modules/.cache/uglifyjs-webpack-plugin`.

> ℹ️ If you use your own `minify` function please read the `minify` section for cache invalidation correctly.

#### `Boolean`

Enable/disable file caching.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
      }),
    ],
  },
};
```

#### `String`

Enable file caching and set path to cache directory.

**webpack.config.js**

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: 'path/to/cache',
      }),
    ],
  },
};
```

### `cacheKeys`

Type: `Function<(defaultCacheKeys, file) -> Object>`
Default: `defaultCacheKeys => defaultCacheKeys`

Allows you to override default cache keys.

Default cache keys:

```js
({
  'uglify-js': require('uglify-js/package.json').version, // uglify version
  'uglifyjs-webpack-plugin': require('../package.json').version, // plugin version
  'uglifyjs-webpack-plugin-options': this.options, // plugin options
  path: compiler.outputPath ? `${compiler.outputPath}/${file}` : file, // asset path
  hash: crypto
    .createHash('md4')
    .update(input)
    .digest('hex'), // source file hash
});
```

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        cacheKeys: (defaultCacheKeys, file) => {
          defaultCacheKeys.myCacheKey = 'myCacheKeyValue';

          return defaultCacheKeys;
        },
      }),
    ],
  },
};
```

### `parallel`

Type: `Boolean|Number`
Default: `false`

Use multi-process parallel running to improve the build speed.
Default number of concurrent runs: `os.cpus().length - 1`.

> ℹ️ Parallelization can speedup your build significantly and is therefore **highly recommended**.

#### `Boolean`

Enable/disable multi-process parallel running.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
      }),
    ],
  },
};
```

#### `Number`

Enable multi-process parallel running and set number of concurrent runs.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: 4,
      }),
    ],
  },
};
```

### `sourceMap`

Type: `Boolean`
Default: `false`

Use source maps to map error message locations to modules (this slows down the compilation).
If you use your own `minify` function please read the `minify` section for handling source maps correctly.

> ⚠️ **`cheap-source-map` options don't work with this plugin**.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
      }),
    ],
  },
};
```

### `minify`

Type: `Function`
Default: `undefined`

Allows you to override default minify function.
By default plugin uses [uglify-js](https://github.com/mishoo/UglifyJS2) package.
Useful for using and testing unpublished versions or forks.

> ⚠️ **Always use `require` inside `minify` function when `parallel` option enabled**.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        minify(file, sourceMap) {
          const extractedComments = [];

          // Custom logic for extract comments

          const { error, map, code, warnings } = require('uglify-module') // Or require('./path/to/uglify-module')
            .minify(file, {
              /* Your options for minification */
            });

          return { error, map, code, warnings, extractedComments };
        },
      }),
    ],
  },
};
```

### `uglifyOptions`

Type: `Object`
Default: [default](https://github.com/mishoo/UglifyJS2#minify-options)

UglifyJS minify [options](https://github.com/mishoo/UglifyJS2#minify-options).

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_fnames: false,
        },
      }),
    ],
  },
};
```

### `extractComments`

Type: `Boolean|String|RegExp|Function<(node, comment) -> Boolean|Object>`
Default: `false`

Whether comments shall be extracted to a separate file, (see [details](https://github.com/webpack/webpack/commit/71933e979e51c533b432658d5e37917f9e71595a)).
By default extract only comments using `/^\**!|@preserve|@license|@cc_on/i` regexp condition and remove remaining comments.
If the original file is named `foo.js`, then the comments will be stored to `foo.js.LICENSE`.
The `uglifyOptions.output.comments` option specifies whether the comment will be preserved, i.e. it is possible to preserve some comments (e.g. annotations) while extracting others or even preserving comments that have been extracted.

#### `Boolean`

Enable/disable extracting comments.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: true,
      }),
    ],
  },
};
```

#### `String`

Extract `all` or `some` (use `/^\**!|@preserve|@license|@cc_on/i` RegExp) comments.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: 'all',
      }),
    ],
  },
};
```

#### `RegExp`

All comments that match the given expression will be extracted to the separate file.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: /@extract/i,
      }),
    ],
  },
};
```

#### `Function<(node, comment) -> Boolean>`

All comments that match the given expression will be extracted to the separate file.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: function(astNode, comment) {
          if (/@extract/i.test(comment.value)) {
            return true;
          }

          return false;
        },
      }),
    ],
  },
};
```

#### `Object`

Allow to customize condition for extract comments, specify extracted file name and banner.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename(file) {
            return `${file}.LICENSE`;
          },
          banner(licenseFile) {
            return `License information can be found in ${licenseFile}`;
          },
        },
      }),
    ],
  },
};
```

##### `condition`

Type: `Boolean|String|RegExp|Function<(node, comment) -> Boolean|Object>`

Condition what comments you need extract.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: {
          condition: 'some',
          filename(file) {
            return `${file}.LICENSE`;
          },
          banner(licenseFile) {
            return `License information can be found in ${licenseFile}`;
          },
        },
      }),
    ],
  },
};
```

##### `filename`

Type: `Regex|Function<(string) -> String>`
Default: `${file}.LICENSE`

The file where the extracted comments will be stored.
Default is to append the suffix `.LICENSE` to the original filename.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: 'extracted-comments.js',
          banner(licenseFile) {
            return `License information can be found in ${licenseFile}`;
          },
        },
      }),
    ],
  },
};
```

##### `banner`

Type: `Boolean|String|Function<(string) -> String>`
Default: `/*! For license information please see ${commentsFile} */`

The banner text that points to the extracted file and will be added on top of the original file.
Can be `false` (no banner), a `String`, or a `Function<(string) -> String>` that will be called with the filename where extracted comments have been stored.
Will be wrapped into comment.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: {
          condition: true,
          filename(file) {
            return `${file}.LICENSE`;
          },
          banner(commentsFile) {
            return `My custom banner about license information ${commentsFile}`;
          },
        },
      }),
    ],
  },
};
```

### `warningsFilter`

Type: `Function<(warning, source) -> Boolean>`
Default: `() => true`

Allow to filter [uglify-js](https://github.com/mishoo/UglifyJS2) warnings.
Return `true` to keep the warning, `false` otherwise.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        warningsFilter: (warning, source) => {
          if (/Dropping unreachable code/i.test(warning)) {
            return true;
          }

          if (/filename\.js/i.test(source)) {
            return true;
          }

          return false;
        },
      }),
    ],
  },
};
```

## Examples

### Cache And Parallel

Enable cache and multi-process parallel running.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
      }),
    ],
  },
};
```

### Preserve Comments

Extract all legal comments (i.e. `/^\**!|@preserve|@license|@cc_on/i`) and preserve `/@license/i` comments.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: /@license/i,
          },
        },
        extractComments: true,
      }),
    ],
  },
};
```

### Remove Comments

If you avoid building with comments, set **uglifyOptions.output.comments** to **false** as in this config:

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};
```

### Custom Minify Function

Override default minify function - use [terser](https://github.com/fabiosantoscode/terser) for minification.

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        // Uncomment lines below for cache invalidation correctly
        // cache: true,
        // cacheKeys(defaultCacheKeys) {
        //   delete defaultCacheKeys['uglify-js'];
        //
        //   return Object.assign(
        //     {},
        //     defaultCacheKeys,
        //     { 'uglify-js': require('uglify-js/package.json').version },
        //   );
        // },
        minify(file, sourceMap) {
          // https://github.com/mishoo/UglifyJS2#minify-options
          const uglifyJsOptions = {
            /* your `uglify-js` package options */
          };

          if (sourceMap) {
            uglifyJsOptions.sourceMap = {
              content: sourceMap,
            };
          }

          return require('terser').minify(file, uglifyJsOptions);
        },
      }),
    ],
  },
};
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](https://raw.githubusercontent.com/webpack-contrib/uglifyjs-webpack-plugin/master/.github/CONTRIBUTING.md)

## License

[MIT](https://raw.githubusercontent.com/webpack-contrib/uglifyjs-webpack-plugin/master/LICENSE)

[npm]: https://img.shields.io/npm/v/uglifyjs-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/uglifyjs-webpack-plugin
[node]: https://img.shields.io/node/v/uglifyjs-webpack-plugin.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/uglifyjs-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/uglifyjs-webpack-plugin
[tests]: https://img.shields.io/circleci/project/github/webpack-contrib/uglifyjs-webpack-plugin.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/uglifyjs-webpack-plugin
[cover]: https://codecov.io/gh/webpack-contrib/uglifyjs-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/uglifyjs-webpack-plugin
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=uglifyjs-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=uglifyjs-webpack-plugin

# WatchIgnorePlugin

无视指定的文件。换句话说，当处于[监视模式(watch mode)](https://v4.webpack.docschina.org/configuration/watch)下，符合给定地址的文件或者满足给定正则表达式的文件的改动不会触发重编译。

``` javascript
new webpack.WatchIgnorePlugin(paths);
```


## 选项

- `路径(paths)` (array)：一个正则表达式或者绝对路径的数组。表示符合条件的文件将不会被监视

# ZopfliWebpackPlugin

Webpack 的 Node-Zopfli 插件.

## 安装

```bash
npm i -D zopfli-webpack-plugin
```

## 用法

``` javascript
var ZopfliPlugin = require("zopfli-webpack-plugin");
module.exports = {
  plugins: [
    new ZopfliPlugin({
      asset: "[path].gz[query]",
      algorithm: "zopfli",
      test: /\.(js|html)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}
```

## 参数

* `asset`: 目标资源名。 `[file]` 被替换成原资源. `[path]` 被替换成原资源路径 `[query]` 替换成原查询字符串. 默认为 `"[path].gz[query]"`.
* `filename`: `function(asset)` 接受资源名 (被处理完之后的)，然后返回新的资源名。默认为 `false`.
* `algorithm`: 可以为 `function(buf, callback)` 也可以是字符串. 字符串来自 `zopfli`.
* `test`: 所有匹配正则表达式的资源会得到处理。默认为全部资源。
* `threshold`: 只有大于指定文件大小（size）的资源会得到处理。 单位为字节（bytes）。 默认为 `0`.
* `minRatio`: 只有资源压缩率（compress ratio）大于指定值的资源会得到处理。默认为 `0.8`.
* `deleteOriginalAssets`: 是否删除原资源。默认为 `false`.

## 可选参数

* `verbose`: 默认值: `false`,
* `verbose_more`: 默认值: `false`,
* `numiterations`: 默认值: `15`,
* `blocksplitting`: 默认值: `true`,
* `blocksplittinglast`: 默认值: `false`,
* `blocksplittingmax`: 默认值: `15`

## 维护人员

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/166921?v=3&s=150">
        </br>
        <a href="https://github.com/bebraw">Juho Vepsäläinen</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars2.githubusercontent.com/u/8420490?v=3&s=150">
        </br>
        <a href="https://github.com/d3viant0ne">Joshua Wiens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/533616?v=3&s=150">
        </br>
        <a href="https://github.com/SpaceK33z">Kees Kluskens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/3408176?v=3&s=150">
        </br>
        <a href="https://github.com/TheLarkInn">Sean Larkin</a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/zopfli-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/zopfli-webpack-plugin

[deps]: https://david-dm.org/webpack-contrib/zopfli-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/zopfli-webpack-plugin

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: http://img.shields.io/travis/webpack-contrib/zopfli-webpack-plugin.svg
[test-url]: https://travis-ci.org/webpack-contrib/zopfli-webpack-plugin

[cover]: https://codecov.io/gh/webpack-contrib/zopfli-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/zopfli-webpack-plugin
