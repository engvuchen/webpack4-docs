# babel-loader

此 package 允许你使用 [Babel](https://github.com/babel/babel) 和 [webpack](https://github.com/webpack/webpack) 转译 `JavaScript` 文件。

**注意**：请在 Babel [Issues](https://github.com/babel/babel/issues) tracker 上报告输出时遇到的问题。

## 中文文档

<a href="https://babel.docschina.org" target="_blank" style="font-size: 24px;">Babel 中文文档</a>

## 安装

> webpack 4.x | babel-loader 8.x | babel 7.x

```bash
npm install -D babel-loader @babel/core @babel/preset-env webpack
```

## 用法

webpack 文档：[loaders](https://webpack.docschina.org/loaders/)

在 webpack 配置对象中，需要将 babel-loader 添加到 module 列表中，就像下面这样：

```javascript
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}
```

## 选项

查看 `babel` [选项](https://babel.docschina.org/docs/en/options)。

你可以使用 [`options`](https://webpack.docschina.org/configuration/module/#rule-options-rule-query) 属性，来向 loader 传递 options 选项：

```javascript
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-object-rest-spread']
        }
      }
    }
  ]
}
```

此 loader 也支持下面这些 loader 特有的选项：

* `cacheDirectory`：默认值为 `false`。当有设置时，指定的目录将用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程(recompilation process)。如果设置了一个空值 (`loader: 'babel-loader?cacheDirectory'`) 或者 `true` (`loader: 'babel-loader?cacheDirectory=true'`)，loader 将使用默认的缓存目录 `node_modules/.cache/babel-loader`，如果在任何根目录下都没有找到 `node_modules` 目录，将会降级回退到操作系统默认的临时文件目录。

* `cacheIdentifier`：默认是由 `@babel/core` 版本号，`babel-loader` 版本号，`.babelrc` 文件内容（存在的情况下），环境变量 `BABEL_ENV` 的值（没有时降级到 `NODE_ENV`）组成的一个字符串。可以设置为一个自定义的值，在 identifier 改变后，来强制缓存失效。

* `cacheCompression`：默认值为 `true`。当设置此值时，会使用 Gzip 压缩每个 Babel transform 输出。如果你想要退出缓存压缩，将它设置为 `false` -- 如果你的项目中有数千个文件需要压缩转译，那么设置此选项可能会从中收益。

* `customize`: 默认值为 `null`。导出 `custom` 回调函数的模块路径，[例如传入 `.custom()` 的 callback 函数](https://v4.webpack.docschina.org#自定义-loader)。由于你必须创建一个新文件才能使用它，建议改为使用 `.custom` 来创建一个包装 loader。只有在你_必须_继续直接使用 `babel-loader` 但又想自定义的情况下，才使用这项配置。

## 疑难解答

### babel-loader 很慢！

确保转译尽可能少的文件。你可能使用 `/\.m?js$/` 来匹配，这样也许会去转译 `node_modules` 目录或者其他不需要的源代码。

要排除 `node_modules`，参考文档中的 `loaders` 配置的 `exclude` 选项。

你也可以通过使用 `cacheDirectory` 选项，将 babel-loader 提速至少两倍。这会将转译的结果缓存到文件系统中。

### Babel 在每个文件都插入了辅助代码，使代码体积过大！

Babel 对一些公共方法使用了非常小的辅助代码，比如 `_extend`。默认情况下会被添加到每一个需要它的文件中

你可以引入 Babel runtime 作为一个独立模块，来避免重复引入。

下面的配置禁用了 Babel 自动对每个文件的 runtime 注入，而是引入 `@babel/plugin-transform-runtime` 并且使所有辅助代码从这里引用。

更多信息请查看 [文档](https://babel.docschina.org/docs/en/babel-plugin-transform-runtime/)。

**注意**：你必须执行 `npm install -D @babel/plugin-transform-runtime` 来把它包含到你的项目中，然后使用 `npm install @babel/runtime` 把 `@babel/runtime` 安装为一个依赖。

```javascript
rules: [
  // 'transform-runtime' 插件告诉 Babel
  // 要引用 runtime 来代替注入。
  {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime']
      }
    }
  }
]
```

#### **注意**：transform-runtime 和自定义 polyfills (例如 Promise library)

由于 [@babel/plugin-transform-runtime](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-runtime) 包含了一个 polyfill，含有自定义的 [regenerator-runtime](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js) 和 [core-js](https://github.com/zloirock/core-js), 下面使用 `webpack.ProvidePlugin` 来配置 shimming 的常用方法将没有作用：

```javascript
// ...
        new webpack.ProvidePlugin({
            'Promise': 'bluebird'
        }),
// ...
```

下面这样的写法也没有作用：

```javascript
require('@babel/runtime/core-js/promise').default = require('bluebird');

var promise = new Promise;
```

它其实会生成下面这样 (使用了 `runtime` 后)：

```javascript
'use strict';

var _Promise = require('@babel/runtime/core-js/promise')['default'];

require('@babel/runtime/core-js/promise')['default'] = require('bluebird');

var promise = new _Promise();
```

前面的 `Promise` library 在被覆盖前已经被引用和使用了。

一种可行的办法是，在你的应用程序中加入一个“引导(bootstrap)”步骤，在应用程序开始前先覆盖默认的全局变量。

```javascript
// bootstrap.js

require('@babel/runtime/core-js/promise').default = require('bluebird');

// ...

require('./app');
```

### `babel` 的 Node.js API 已经被移到 `babel-core` 中。（原文：The Node.js API for `babel` has been moved to `babel-core`.）

如果你收到这个信息，这说明你有一个已经安装的 `babel` npm package，并且在 webpack 配置中使用 loader 简写方式（在 webpack 2.x 版本中将不再支持这种方式）。
```javascript
  {
    test: /\.m?js$/,
    loader: 'babel',
  }
```

webpack 将尝试读取 `babel` package 而不是 `babel-loader`。

想要修复这个问题，你需要卸载 `babel` npm package，因为它在 Babel v6 中已经被废除。（安装 `@babel/cli` 或者 `@babel/core` 来替代它）
在另一种场景中，如果你的依赖于 `babel` 而无法删除它，可以在 webpack 配置中使用完整的 loader 名称来解决：
```javascript
  {
    test: /\.m?js$/,
    loader: 'babel-loader',
  }
```

## 自定义 loader

`babel-loader` 提供了一个 loader-builder 工具函数，
允许用户为 Babel 处理过的每个文件添加自定义处理选项。

`.custom` 接收一个 callback 函数，
它将被调用，并传入 loader 中的 `babel` 实例，
因此，此工具函数才能够完全确保它使用与 loader 的 `@babel/core` 相同的实例。

如果你想自定义，但实际上某个文件又不想调用 `.custom`，
可以向 `customize` 选项传入一个字符串，
此字符串指向一个导出 `custom` 回调函数的文件。

### 示例

```js
// 从 "./my-custom-loader.js" 中导出，或者任何你想要的文件中导出。
module.exports = require("babel-loader").custom(babel => {
  function myPlugin() {
    return {
      visitor: {},
    };
  }

  return {
    // 传给 loader 的选项。
    customOptions({ opt1, opt2, ...loader }) {
      return {
        // 获取 loader 可能会有的自定义选项
        custom: { opt1, opt2 },

        // 传入"移除了两个自定义选项"后的选项
        loader,
      };
    },

    // 提供 Babel 的 'PartialConfig' 对象
    config(cfg) {
      if (cfg.hasFilesystemConfig()) {
        // 使用正常的配置
        return cfg.options;
      }

      return {
        ...cfg.options,
        plugins: [
          ...(cfg.options.plugins || []),

          // 在选项中包含自定义 plugin
          myPlugin,
        ],
      };
    },

    result(result) {
      return {
        ...result,
        code: result.code + "\n// Generated by some custom loader",
      };
    },
  };
});
```

```js
// 然后，在你的 webpack config 文件中
module.exports = {
  // ..
  module: {
    rules: [{
      // ...
      loader: path.join(__dirname, 'my-custom-loader.js'),
      // ...
    }]
  }
};
```

### `customOptions(options: Object): { custom: Object, loader: Object }`

指定的 loader 的选项，
从 `babel-loader` 选项中分离出自定义选项。


### `config(cfg: PartialConfig): Object`

指定的 Babel 的 `PartialConfig` 对象，
返回应该被传递给 `babel.transform` 的 `option` 对象。


### `result(result: Result): Result`

指定的 Babel 结果对象，允许 loaders 对它进行额外的调整。


## License
[MIT](https://couto.mit-license.org/)

# bundle-loader

webpack 的 bundle loader

## 安装

```bash
npm i bundle-loader --save
```

## 用法

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.bundle\.js$/,
        use: 'bundle-loader'
      }
    ]
  }
}
```

当你引用 bundle-loader 时，chunk 会被浏览器请求(request)。

**file.js**
```js
import bundle from './file.bundle.js';
```

为了 chunk 在浏览器加载（以及在获取其导出）时可用时，
你需要异步等待。

```js
bundle((file) => {
  // use the file like it was required
  const file = require('./file.js')
});
```

上述代码会将 `require('file.js')` 包裹在一段 `require.ensure` 代码块中

可以添加多个回调函数。它们会按照添加的顺序依次执行。

```js
bundle(callbackTwo)
bundle(callbackThree)
```

当依赖模块都加载完毕时, 如果此时添加一个回调函数，它将会立即执行。

## 选项(options)

|名称|类型|默认值|描述|
|:--:|:--:|:-----:|:----------|
|**`lazy`**|`{Boolean}`|`false`|异步加载导入的 bundle|
|**`name`**|`{String}`|`[id].[name]`|为导入的 bundle 配置自定义文件名|

##

当你使用 bundle-loader 时，文件会被请求(request)。如果想让它按需加载(request it lazy)，请使用：

**webpack.config.js**
```js
{
  loader: 'bundle-loader',
  options: {
    lazy: true
  }
}
```

```js
import bundle from './file.bundle.js'

bundle((file) => {...})
```

> ℹ️  只有调用 load 函数时，chunk 才会被请求(request)

### `name`

可以通过配置中 `name` 选项参数，来设置 bundle 的名称。
查看 [文档](https://github.com/webpack/loader-utils#interpolatename)。

**webpack.config.js**
```js
{
  loader: 'bundle-loader',
  options: {
    name: '[name]'
  }
}
```

> :warning: 一旦 loader 创建了 chunk，它们将遵循以下命名规则
[`output.chunkFilename`](https://webpack.docschina.org/configuration/output/#output-chunkfilename) 规则，默认是 `[id].[name]`。这里 `[name]` 对应着配置中 `name` 选项参数设置的 chunk 名称。

## 示例

```js
import bundle from './file.bundle.js'
```

**webpack.config.js**
``` js
module.exports = {
  entry: {
   index: './App.js'
  },
  output: {
    path: path.resolve(__dirname, 'dest'),
    filename: '[name].js',
    // 此处可以自定义其他格式
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      {
        test: /\.bundle\.js$/,
        use: {
          loader: 'bundle-loader',
          options: {
            name: 'my-chunk'
          }
        }
      }
    ]
  }
}
```

一般情况下，chunk 会使用上面的 `filename` 规则，并根据其对应的 `[chunkname]` 命名。

然而，来自 `bundle-loader` 中的 chunk 会使用 `chunkFilename` 规则命名。因此，打包后的示例文件最终将生成为 `my-chunk.1.js` 和 `file-2.js`。

当然，你也可以在 `chunkFilename` 添加哈希值作为文件名的一部分，这是因为在 bundle 的配置选项中放置 `[hash]` 不会生效。

## 维护人员

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


[npm]: https://img.shields.io/npm/v/bundle-loader.svg
[npm-url]: https://npmjs.com/package/bundle-loader

[node]: https://img.shields.io/node/v/bundle-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/bundle-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/bundle-loader

[tests]: http://img.shields.io/travis/webpack-contrib/bundle-loader.svg
[tests-url]: https://travis-ci.org/webpack-contrib/bundle-loader

[cover]: https://coveralls.io/repos/github/webpack-contrib/bundle-loader/badge.svg
[cover-url]: https://coveralls.io/github/webpack-contrib/bundle-loader

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack

# undefined

s---
title: cache-loader
source: https://raw.githubusercontent.com/webpack-contrib/cache-loader/master/README.md
edit: https://github.com/webpack-contrib/cache-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/cache-loader
---

用于缓存后面加载器的结果，写入本地默认磁盘或数据库。


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



The `cache-loader` allow to Caches the result of following loaders on disk (default) or in the database.

## 起步

To begin, you'll need to install `cache-loader`:

```console
npm install --save-dev cache-loader
```

在一些性能开销较大的 loader 之前添加此 loader，以将结果缓存到磁盘里。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ["cache-loader", ...loaders],
        include: path.resolve("src")
      }
    ]
  }
};
```

> ⚠️ 请注意，保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader。

## 选项

|         Name          |                       Type                       |                     Default                     | Description                                                                          |
| :-------------------: | :----------------------------------------------: | :---------------------------------------------: | :----------------------------------------------------------------------------------- |
|  **`cacheContext`**   |                    `{String}`                    |                   `undefined`                   | 允许重写默认缓存上下文，然后生成相应路径。默认情况下，使用绝对路径                   |
|    **`cacheKey`**     |    `{Function(options, request) -> {String}}`    |                   `undefined`                   | 允许重写默认缓存密钥生成器                                                           |
| **`cacheDirectory`**  |                    `{String}`                    |         `path.resolve('.cache-loader')`         | 提供应存储（用于默认读/写实现）缓存项的缓存目录                                      |
| **`cacheIdentifier`** |                    `{String}`                    | `cache-loader:{version} {process.env.NODE_ENV}` | 提供用于生成哈希值的无效标识符。可以为（用于默认读/写实现的）加载器添加额外依赖项。  |
|      **`write`**      | `{Function(cacheKey, data, callback) -> {void}}` |                   `undefined`                   | 允许重写默认写入缓存数据 (e.g. Redis, memcached)                                     |
|      **`read`**       |    `{Function(cacheKey, callback) -> {void}}`    |                   `undefined`                   | 允许重写默认读取缓存数据                                                             |
|    **`readOnly`**     |                   `{Boolean}`                    |                     `false`                     | 允许重写默认值并将缓存设为只读（对于某些只从缓存中读取，不希望更新缓存的环境很有用） |

## 示例

### Basic

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["cache-loader", "babel-loader"],
        include: path.resolve("src")
      }
    ]
  }
};
```

### Database Integration

**webpack.config.js**

```js
// Or different database client - memcached, mongodb, ...
const redis = require("redis");
const crypto = require("crypto");

// ...
// connect to client
// ...

const BUILD_CACHE_TIMEOUT = 24 * 3600; // 1 day

function digest(str) {
  return crypto
    .createHash("md5")
    .update(str)
    .digest("hex");
}

// Generate own cache key
function cacheKey(options, request) {
  return `build:cache:${digest(request)}`;
}

// Read data from database and parse them
function read(key, callback) {
  client.get(key, (err, result) => {
    if (err) {
      return callback(err);
    }

    if (!result) {
      return callback(new Error(`Key ${key} not found`));
    }

    try {
      let data = JSON.parse(result);
      callback(null, data);
    } catch (e) {
      callback(e);
    }
  });
}

// Write data to database under cacheKey
function write(key, data, callback) {
  client.set(key, JSON.stringify(data), "EX", BUILD_CACHE_TIMEOUT, callback);
}

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "cache-loader",
            options: {
              cacheKey,
              read,
              write
            }
          },
          "babel-loader"
        ],
        include: path.resolve("src")
      }
    ]
  }
};
```

## 贡献

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](https://raw.githubusercontent.com/webpack-contrib/cache-loader/master/.github/CONTRIBUTING.md)

## License

[npm]: https://img.shields.io/npm/v/cache-loader.svg
[npm-url]: https://npmjs.com/package/cache-loader
[node]: https://img.shields.io/node/v/cache-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/cache-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/cache-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[test]: http://img.shields.io/travis/webpack-contrib/cache-loader.svg
[test-url]: https://travis-ci.org/webpack-contrib/cache-loader
[cover]: https://codecov.io/gh/webpack-contrib/cache-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/cache-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=cache-loader
[size-url]: https://packagephobia.now.sh/result?p=cache-loader

# coffee-loader

就像加载 JavaScript 那样，加载 <a href="https://coffeescript.org/">CoffeeScript</a>

## 安装

```bash
npm install --save-dev coffee-loader
```

## 用法


```js
import coffee from 'coffee-loader!./file.coffee';
```

##


```js
import coffee from 'file.coffee';
```

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.coffee$/,
        use: [ 'coffee-loader' ]
      }
    ]
  }
}
```

## 选项

|名称|默认|描述|
|:--:|:-----:|:----------|
|**`literate`**|`false`|在 markdown （代码块）中启用 CoffeeScript，例如 `file.coffee.md`|
|**`transpile`**|`false`|提供 Babel 预设(preset)和插件(plugin)|

### [`Literate`](http://coffeescript.org/#literate)

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.coffee.md$/,
        use: [
          {
            loader: 'coffee-loader',
            options: { literate: true }
          }
        ]
      }
    ]
  }
}
```

### `Sourcemaps`

source maps 总是产生。

### [`Transpile`](https://coffeescript.org/#transpilation)

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.coffee$/,
        use: [
          {
            loader: 'coffee-loader',
            options: {
              transpile: {
                presets: ['env']
              }
            }
          }
        ]
      }
    ]
  }
}
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


[npm]: https://img.shields.io/npm/v/coffee-loader.svg
[npm-url]: https://npmjs.com/package/coffee-loader

[node]: https://img.shields.io/node/v/coffee-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack/coffee-loader.svg
[deps-url]: https://david-dm.org/webpack/coffee-loader

[tests]: http://img.shields.io/travis/webpack/coffee-loader.svg
[tests-url]: https://travis-ci.org/webpack/coffee-loader

[cover]: https://coveralls.io/repos/github/webpack/coffee-loader/badge.svg
[cover-url]: https://coveralls.io/github/webpack/coffee-loader

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack

# coffee-redux-loader

Coffee Script Redux loader for Webpack.

## 安装

```bash
npm i -D coffee-redux-loader
```

## 用法

``` javascript
var exportsOfFile = require("coffee-redux-loader!./file.coffee");
// => return exports of executed and compiled file.coffee
```

如果你想要在 node 运行环境中使用，不要忘了 polyfill `require`。
请查看 `webpack` 文档。


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


[npm]: https://img.shields.io/npm/v/coffee-redux-loader.svg
[npm-url]: https://npmjs.com/package/coffee-redux-loader

[deps]: https://david-dm.org/webpack-contrib/coffee-redux-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/coffee-redux-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# config-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



DEPRECATED. `webpack-command` is also deprecated. Please use `webpack-cli`. If any features were not implemented in `webpack-cli` feel free to create issue. 

Why deprecated `webpack-command` ?
- `webpack-cli` is very stable and have more features.
- Two CLIs are misleading for developers.
- Hard to maintain two package with same purpose.
- The author stopped developing the package.
- Most of the features are already implemented in `webpack-cli`.

Thanks for using `webpack`! We apologize for the inconvenience. In the future, we will avoid such situations.
_____

A webpack configuration loader.

This module utilizes [`cosmiconfig`](https://github.com/davidtheclark/cosmiconfig)
which supports declaring a webpack configuration in a number of different file
formats including; `.webpackrc`, `webpack.config.js`, and a `webpack` property
in a `package.json`.

`config-loader` supports configuration modules which export an `Object`, `Array`,
`Function`, `Promise`, and `Function` which returns a `Promise`.

The module also validates found configurations against webpack's options schema
to ensure that the configuration is correct before webpack attempts to use it.

## Requirements

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## Getting Started

To begin, you'll need to install `config-loader`:

```console
$ npm install @webpack-contrib/config-loader --save-dev
```

And get straight to loading a config:

```js
const loader = require('@webpack-contrib/config-loader');
const options = { ... };

loader(options).then((result) => {
  // ...
  // result = { config: Object, configPath: String }
});

```

## Extending Configuration Files

This module supports extending webpack configuration files with
[ESLint-style](https://eslint.org/docs/user-guide/configuring#extending-configuration-files)
`extends` functionality. This feature allows users to create a "base" config and
in essence, "inherit" from that base config in a separate config. A bare-bones
example:

```js
// base.config.js
module.exports = {
  name: 'base',
  mode: 'development',
  plugins: [...]
}
```

```js
// webpack.config.js
module.exports = {
  extends: path.join(..., 'base-config.js'),
  name: 'dev'
```

The resulting configuration object would resemble:

```js
// result
{
  name: 'dev',
  mode: 'development',
  plugins: [...]
}
```

The `webpack.config.js` file will be intelligently extended with properties
from `base.config.js`.

The `extends` property also supports naming installed NPM modules which export
webpack configurations. Various configuration properties can also be filtered in
different ways based on need.

[Read More about Extending Configuration Files](https://raw.githubusercontent.com/webpack-contrib/config-loader/master/docs/EXTENDS.md)

## Gotchas

### Function-Config Parameters

When using a configuration file that exports a `Function`, users of `webpack-cli`
have become accustom to the function signature:

```
function config (env, argv)
```

`webpack-cli` provides any CLI flags prefixed with `--env` as a single object in
the `env` parameter, which is an unnecessary feature.
[Environment Variables](https://en.wikipedia.org/wiki/Environment_variable#Syntax)
have long served the same purpose, and are easily accessible within a
[Node environment](https://nodejs.org/api/process.html#process_process_env).

As such, `config-loader` does not call `Function` configs with the `env`
parameter. Rather, it makes calls with only the `argv` parameter.

### Extending Configuration Files in Symlinked Modules

When using `extends` to extend a configuration which exists in a different package, care must be taken to ensure you don't hit module resolution issues if you are developing with these packages with symlinks (i.e. with `npm link` or `yarn link`).

By default, Node.js does not search for modules through symlinks, and so you may experience errors such as:

`module not found: Error: Can't resolve 'webpack-hot-client/client'`

This can be fixed by using Node's `--preserve-symlinks` flag which will allow you to develop cross-module, without experiencing inconsistencies when comparing against a normal, non-linked install:

For webpack-command:

```console
node --preserve-symlinks ./node_modules/.bin/wp
```

For webpack-serve:

```console
node --preserve-symlinks ./node_modules/.bin/webpack-serve
```

## Supported Compilers

This module can support non-standard JavaScript file formats when a compatible
compiler is registered via the `require` option. If the option is defined,
`config-loader` will attempt to require the specified module(s) before the
target config is found and loaded.

As such, `config-loader` will also search for the following file extensions;
`.js`, `.es6`, `.flow`, `.mjs`, and `.ts`.

The module is also tested with the following compilers:

- [`babel-register`](https://github.com/babel/babel/tree/6.x/packages/babel-register)
- [`flow-remove-types/register`](https://github.com/flowtype/flow-remove-types)
- [`ts-node/register`](https://www.npmjs.com/package/ts-node)

_Note: Compilers are not part of or built-into this module. To use a specific compiler, you
must install it and specify its use by using the `--require` CLI flag._

## API

### loader([options])

Returns a `Promise`, which resolves with an `Object` containing:

#### `config`

Type: `Object`

Contains the actual configuration object.

#### `configPath`

Type: `String`

Contains the full, absolute filesystem path to the configuration file.

## Options

#### `allowMissing`

Type: `Boolean`  
Default: `false`

Instructs the module to allow a missing config file, and returns an `Object`
with empty `config` and `configPath` properties in the event a config file was
not found.

### `configPath`

Type: `String`
Default: `undefined`

Specifies an absolute path to a valid configuration file on the filesystem.

### `cwd`

Type: `String`
Default: `process.cwd()`

Specifies an filesystem path from which point `config-loader` will begin looking
for a configuration file.

### `require`

Type: `String | Array[String]`
Default: `undefined`

Specifies compiler(s) to use when loading modules from files containing the
configuration. For example:

```js
const loader = require('@webpack-contrib/config-loader');
const options = { require: 'ts-node/register' };

loader(options).then((result) => { ... });

```

See
[Supported Compilers](https://github.com/webpack-contrib/config-loader#supported-compilers)
for more information.

### `schema`

Type: `Object`
Default: `undefined`

An object containing a valid
[JSON Schema Definition](http://json-schema.org/latest/json-schema-validation.html).

By default, `config-loader` validates your webpack config against the
[webpack config schema](https://github.com/webpack/webpack/blob/master/schemas/WebpackOptions.json).
However, it can be useful to append additional schema data to allow configs,
which contain properties not present in the webpack schema, to pass validation.

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

#### [CONTRIBUTING](https://raw.githubusercontent.com/webpack-contrib/config-loader/master/.github/CONTRIBUTING.md)

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/config-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/@webpack-contrib/config-loader.svg
[npm-url]: https://www.npmjs.com/package/@webpack-contrib/config-loader

[node]: https://img.shields.io/node/v/@webpack-contrib/config-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/config-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/config-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/config-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/config-loader

[cover]: https://codecov.io/gh/webpack-contrib/config-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/config-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# coverjs-loader

## 用法

``` javascript
webpack-dev-server "mocha!./cover-my-client-tests.js" --options webpackOptions.js
```

``` javascript
// webpackOptions.js
module.exports = {
	// 你的 webpack options
	output: "bundle.js",
	publicPrefix: "/",
	debug: true,
	includeFilenames: true,
	watch: true,

	// 绑定 coverjs loader
	postLoaders: [{
		test: "", // 所有文件
		exclude: [
			"node_modules.chai",
			"node_modules.coverjs-loader",
			"node_modules.webpack.buildin"
		],
		loader: "coverjs-loader"
	}]
}
```

``` javascript
// cover-my-client-tests.js
require("./my-client-tests");

after(function() {
	require("cover-loader").reportHtml();
});
```

参考示例 [the-big-test](https://github.com/webpack/the-big-test)。

这是一个独立的 loader，你不必一定把它和 mocha loader 结合一起使用。如果你想 cover 一个普通的项目，也可以直接使用它。`reportHtml` 方法会把输出内容添加到 body 中。


## License

MIT (http://www.opensource.org/licenses/mit-license.php)

# css-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



The `css-loader` interprets `@import` and `url()` like `import/require()` and will resolve them.

## 起步

To begin, you'll need to install `css-loader`:

```console
npm install --save-dev css-loader
```

Then add the plugin to your `webpack` config. For example:

**file.js**

```js
import css from 'file.css';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

对于这些引用资源，你应该在配置中指定的，比较合适的 loader 是 [file-loader](https://v4.webpack.docschina.org/loaders/file-loader/) 和 [url-loader](https://v4.webpack.docschina.org/loaders/url-loader/)（查看[如下设置](https://github.com/webpack-contrib/css-loader#assets)）。

And run `webpack` via your preferred method.

### `toString`

你也可以直接将 css-loader 的结果作为字符串使用，例如 Angular 的组件样式。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
      },
    ],
  },
};
```

或者

```js
const css = require('./test.css').toString();

console.log(css); // {String}
```

如果有 SourceMap，它们也将包含在字符串结果中。

如果由于某种原因，你需要将 CSS 提取为纯粹的字符串资源
（即不包含在 JS 模块中），
则可能需要查看 [extract-loader](https://github.com/peerigon/extract-loader)。
例如，当你需要将 CSS 作为字符串进行后处理时，这很有用。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'handlebars-loader', // handlebars loader expects raw resource string
          'extract-loader',
          'css-loader',
        ],
      },
    ],
  },
};
```

## 选项

|名称|类型|默认值|描述|
|:--:|:--:|:-----:|:----------|
|**[`url`](https://v4.webpack.docschina.org#url)**|`{Boolean}`|`true`| 启用/禁用 `url()` 处理|
|**[`import`](https://v4.webpack.docschina.org#import)** |`{Boolean}`|`true`| 启用/禁用 @import 处理|
|**[`modules`](https://v4.webpack.docschina.org#modules)**|`{Boolean}`|`false`|启用/禁用 CSS 模块|
|**[`localIdentName`](https://v4.webpack.docschina.org#localidentname)**|`{String}`|`[hash:base64]`|配置生成的标识符(ident)|
|**[`sourceMap`](https://v4.webpack.docschina.org#sourcemap)**|`{Boolean}`|`false`|启用/禁用 Sourcemap|
|**[`camelCase`](https://v4.webpack.docschina.org#camelcase)**|`{Boolean\|String}`|`false`|以驼峰化式命名导出类名|
|**[`importLoaders`](https://v4.webpack.docschina.org#importloaders)**|`{Number}`|`0`|在 css-loader 前应用的 loader 的数量|

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          url: (url, resourcePath) => {
            // resourcePath - path to css file

            // `url()` with `img.png` stay untouched
            return url.includes('img.png');
          },
        },
      },
    ],
  },
};
```

### `import`

类型：`Boolean`
默认：`true`

Control `@import` resolving. Absolute urls in `@import` will be moved in runtime code.

Examples resolutions:

```
@import 'style.css' => require('./style.css')
@import url(style.css) => require('./style.css')
@import url('style.css') => require('./style.css')
@import './style.css' => require('./style.css')
@import url(./style.css) => require('./style.css')
@import url('./style.css') => require('./style.css')
@import url('http://dontwritehorriblecode.com/style.css') => @import url('http://dontwritehorriblecode.com/style.css') in runtime
```

### `alias`

用别名重写你的 URL，在难以改变输入文件的url 路径时，这会很有帮助，例如，当你使用另一个包(package)（如 bootstrap, ratchet, font-awesome 等）中一些 css/sass 文件。

`css-loader` 的别名，遵循与webpack 的 `resolve.alias` 相同的语法，你可以在[resolve 文档](https://webpack.docschina.org/configuration/resolve/#resolve-alias) 查看细节

**file.scss**
```css
@charset "UTF-8";
@import "bootstrap";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          import: (parsedImport, resourcePath) => {
            // parsedImport.url - url of `@import`
            // parsedImport.media - media query of `@import`
            // resourcePath - path to css file

            // `@import` with `style.css` stay untouched
            return parsedImport.url.includes('style.css');
          },
        },
      },
    ],
  },
};
```

### [`modules`](https://github.com/css-modules/css-modules)

类型：`Boolean|String`
默认：`false`

The `modules` option enables/disables the **CSS Modules** spec and setup basic behaviour.

|      Name      |    Type     | Description                                                                                                                      |
| :------------: | :---------: | :------------------------------------------------------------------------------------------------------------------------------- |
|   **`true`**   | `{Boolean}` | Enables local scoped CSS by default (use **local** mode by default)                                                              |
|  **`false`**   | `{Boolean}` | Disable the **CSS Modules** spec, all **CSS Modules** features (like `@value`, `:local`, `:global` and `composes`) will not work |
| **`'local'`**  | `{String}`  | Enables local scoped CSS by default (same as `true` value)                                                                       |
| **`'global'`** | `{String}`  | Enables global scoped CSS by default                                                                                             |

Using `false` value increase performance because we avoid parsing **CSS Modules** features, it will be useful for developers who use vanilla css or use other technologies.

You can read about **modes** below.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          modules: true,
        },
      },
    ],
  },
};
```

##### `Scope`

Using `local` value requires you to specify `:global` classes.
Using `global` value requires you to specify `:local` classes.

You can find more information [here](https://github.com/css-modules/css-modules).

Styles can be locally scoped to avoid globally scoping styles.

语法 `:local(.className)` 可以被用来在局部作用域中声明 `className`。局部的作用域标识符会以模块形式暴露出去。

使用 `:local`（无括号）可以为此选择器启用局部模式。
`:global(.className)` 可以用来声明一个明确的全局选择器。
使用 `:global`（无括号）可以将此选择器切换至全局模式。

loader 会用唯一的标识符(identifier)来替换局部选择器。所选择的唯一标识符以模块形式暴露出去。

```css
:local(.className) {
  background: red;
}
:local .className {
  color: green;
}
:local(.className .subClass) {
  color: green;
}
:local .className .subClass :global(.global-class-name) {
  color: blue;
}
```

```css
._23_aKvs-b8bW2Vg3fwHozO {
  background: red;
}
._23_aKvs-b8bW2Vg3fwHozO {
  color: green;
}
._23_aKvs-b8bW2Vg3fwHozO ._13LGdX8RMStbBE9w-t0gZ1 {
  color: green;
}
._23_aKvs-b8bW2Vg3fwHozO ._13LGdX8RMStbBE9w-t0gZ1 .global-class-name {
  color: blue;
}
```

> ℹ️ 标识符被导出

```js
exports.locals = {
  className: '_23_aKvs-b8bW2Vg3fwHozO',
  subClass: '_13LGdX8RMStbBE9w-t0gZ1',
};
```

建议局部选择器使用驼峰式。它们在导入 JS 模块中更容易使用。

你可以使用 `:local(#someId)`，但不推荐这种用法。推荐使用 class 代替 id。

#### `Composing`

当声明一个局部类名时，你可以与另一个局部类名组合为一个局部类。

```css
:local(.className) {
  background: red;
  color: yellow;
}

:local(.subClass) {
  composes: className;
  background: blue;
}
```

这不会导致 CSS 本身的任何更改，而是导出多个类名。

```js
exports.locals = {
  className: '_23_aKvs-b8bW2Vg3fwHozO',
  subClass: '_13LGdX8RMStbBE9w-t0gZ1 _23_aKvs-b8bW2Vg3fwHozO',
};
```

```css
._23_aKvs-b8bW2Vg3fwHozO {
  background: red;
  color: yellow;
}

._13LGdX8RMStbBE9w-t0gZ1 {
  background: blue;
}
```

##### `Importing`

从其他模块导入局部类名。

```css
:local(.continueButton) {
  composes: button from 'library/button.css';
  background: red;
}
```

```css
:local(.nameEdit) {
  composes: edit highlight from './edit.css';
  background: red;
}
```

要从多个模块导入，请使用多个 `composes:` 规则。

```css
:local(.className) {
  composes: edit hightlight from './edit.css';
  composes: button from 'module/button.css';
  composes: classFromThisModule;
  background: red;
}
```

### `localIdentName`

 你可以使用 localIdentName 查询参数来配置生成的 ident。 可以在 [loader-utils 文档](https://github.com/webpack/loader-utils#interpolatename) 查看更多信息。

 **webpack.config.js**
```js
{
  test: /\.css$/,
  use: [
    {
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: '[path][name]__[local]--[hash:base64:5]'
      }
    }
  ]
}
```

你还可以通过自定义 getLocalIdent 函数来指定绝对路径，以根据不同的模式(schema)生成类名。这需要 webpack >= 2.2.1（options 对象支持传入函数）。

**webpack.config.js**

```js
{
  loader: 'css-loader',
  options: {
    modules: true,
    localIdentName: '[path][name]__[local]--[hash:base64:5]',
    getLocalIdent: (context, localIdentName, localName, options) => {
      return 'whatever_random_class_name'
    }
  }
}
```

> ℹ️ 对于使用 extract-text-webpack-plugin 预渲染，你应该在预渲染 bundle 中 使用 css-loader/locals 而不是 style-loader!css-loader 。它不会嵌入 CSS，但只导出标识符映射(identifier map)。

### `sourceMap`

类型：`Boolean`
默认：`false`

设置 `sourceMap` 选项查询参数来引入 source map。

例如，`mini-css-extract-plugin` 能够处理它们。

默认情况下不启用它们，因为它们会导致运行时的额外开销，并增加了 bundle 大小 (JS source map 不会)。此外，相对路径是错误的，你需要使用包含服务器 URL 的绝对公用路径。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  },
};
```

### `camelCase`

类型：`Boolean|String`
默认：`false`

默认情况下，导出 JSON 键值对形式的类名。如果想要驼峰化(camelize)类名（有助于在 JS 中使用），通过设置 css-loader 的查询参数 `camelCase` 即可实现。

|名称|类型|描述|
|:--:|:--:|:----------|
|**`false`**|`{Boolean}`|Class names will be camelized, the original class name will not to be removed from the locals|
|**`true`**|`{Boolean}`|类名将被骆驼化|
|**`'dashes'`**|`{String}`|只有类名中的破折号将被骆驼化|
|**`'only'`** |`{String}`|在 `0.27.1` 中加入。类名将被骆驼化，初始类名将从局部移除|
|**`'dashesOnly'`**|`{String}`|在 `0.27.1` 中加入。类名中的破折号将被骆驼化，初始类名将从局部移除|

**file.css**

```css
.class-name {
}
```

**file.js**

```js
import { className } from 'file.css';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          camelCase: true,
        },
      },
    ],
  },
};
```

### `importLoaders`

类型：`Number`
默认：`0`

查询参数 `importLoaders`，用于配置「`css-loader` 作用于 `@import` 的资源之前」有多少个 loader。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
```

在模块系统（即 webpack）支持原始 loader 匹配后，此功能可能在将来会发生变化。

### `exportOnlyLocals`

类型：`Boolean`
默认：`false`

Export only locals (**useful** when you use **css modules**).
For pre-rendering with `mini-css-extract-plugin` you should use this option instead of `style-loader!css-loader` **in the pre-rendering bundle**.
It doesn't embed CSS but only exports the identifier mappings.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          exportOnlyLocals: true,
        },
      },
    ],
  },
};
```

## 示例

对于生产环境构建，建议从 bundle 中提取 CSS，以便之后可以并行加载 CSS/JS 资源。
可以通过使用 [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) 来实现，在生产环境模式运行中提取 CSS。

### 提取

对于生产环境构建，建议从 bundle 中提取 CSS，以便之后可以并行加载 CSS/JS 资源。

- 可以通过使用 [mini-css-extract-plugin](https://v4.webpack.docschina.org/plugins/mini-css-extract-plugin/) 来实现，在生产环境模式运行中提取 CSS。

- As an alternative, if seeking better development performance and css outputs that mimic production. [extract-css-chunks-webpack-plugin](https://github.com/faceyspacey/extract-css-chunks-webpack-plugin) offers a hot module reload friendly, extended version of mini-css-extract-plugin. HMR real CSS files in dev, works like mini-css in non-dev

## 贡献

Please take a moment to read our contributing guidelines if you haven't yet done so.

[贡献指南](https://raw.githubusercontent.com/webpack-contrib/css-loader/master/.github/CONTRIBUTING.md)

## License

[MIT](https://raw.githubusercontent.com/webpack-contrib/css-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/css-loader.svg
[npm-url]: https://npmjs.com/package/css-loader
[node]: https://img.shields.io/node/v/css-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/css-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/css-loader
[tests]: https://img.shields.io/circleci/project/github/webpack-contrib/css-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/css-loader
[cover]: https://codecov.io/gh/webpack-contrib/css-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/css-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=css-loader
[size-url]: https://packagephobia.now.sh/result?p=css-loader

# eslint-loader

> eslint loader for webpack

## Install

```console
$ npm install eslint-loader --save-dev
```

**NOTE**: You also need to install `eslint` from npm, if you haven't already:

```console
$ npm install eslint --save-dev
```

## Usage

In your webpack configuration

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          // eslint options (if necessary)
        }
      }
    ]
  }
  // ...
};
```

When using with transpiling loaders (like `babel-loader`), make sure they are in correct order
(bottom to top). Otherwise files will be checked after being processed by `babel-loader`

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
      }
    ]
  }
  // ...
};
```

To be safe, you can use `enforce: "pre"` section to check source files, not modified
by other loaders (like `babel-loader`)

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
  // ...
};
```

### Options

You can pass [eslint options](http://eslint.org/docs/developer-guide/nodejs-api#cliengine)
using standard webpack [loader options](https://webpack.js.org/configuration/module/#useentry).

Note that the config option you provide will be passed to the `CLIEngine`.
This is a different set of options than what you'd specify in `package.json` or `.eslintrc`.
See the [eslint docs](http://eslint.org/docs/developer-guide/nodejs-api#cliengine) for more detail.

#### `fix` (default: false)

This option will enable
[ESLint autofix feature](http://eslint.org/docs/user-guide/command-line-interface#fix).

**Be careful: this option will change source files.**

#### `cache` (default: false)

This option will enable caching of the linting results into a file.
This is particularly useful in reducing linting time when doing a full build.

This can either be a `boolean` value or the cache directory path(ex: `'./.eslint-loader-cache'`).

If `cache: true` is used, the cache file is written to the `./node_modules/.cache` directory.
This is the recommended usage.

#### `formatter` (default: eslint stylish formatter)

Loader accepts a function that will have one argument: an array of eslint messages (object).
The function must return the output as a string.
You can use official eslint formatters.

```js
module.exports = {
  entry: "...",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          // several examples !

          // default value
          formatter: require("eslint/lib/formatters/stylish"),

          // community formatter
          formatter: require("eslint-friendly-formatter"),

          // custom formatter
          formatter: function(results) {
            // `results` format is available here
            // http://eslint.org/docs/developer-guide/nodejs-api.html#executeonfiles()

            // you should return a string
            // DO NOT USE console.*() directly !
            return "OUTPUT";
          }
        }
      }
    ]
  }
};
```

#### `eslintPath` (default: "eslint")

Path to `eslint` instance that will be used for linting.  
If the `eslintPath` is a folder like a official eslint, or specify a `formatter` option. now you dont have to install `eslint` .

```js
module.exports = {
  entry: "...",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          eslintPath: path.join(__dirname, "reusable-eslint")
        }
      }
    ]
  }
};
```

#### Errors and Warning

**By default the loader will auto adjust error reporting depending
on eslint errors/warnings counts.**
You can still force this behavior by using `emitError` **or** `emitWarning` options:

##### `emitError` (default: `false`)

Loader will always return errors if this option is set to `true`.

```js
module.exports = {
  entry: "...",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          emitError: true
        }
      }
    ]
  }
};
```

##### `emitWarning` (default: `false`)

Loader will always return warnings if option is set to `true`. If you're using hot module replacement, you may wish to enable this in development, or else updates will be skipped when there's an eslint error.

#### `quiet` (default: `false`)

Loader will process and report errors only and ignore warnings if this option is set to true

```js
module.exports = {
  entry: "...",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          quiet: true
        }
      }
    ]
  }
};
```

##### `failOnWarning` (default: `false`)

Loader will cause the module build to fail if there are any eslint warnings.

```js
module.exports = {
  entry: "...",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          failOnWarning: true
        }
      }
    ]
  }
};
```

##### `failOnError` (default: `false`)

Loader will cause the module build to fail if there are any eslint errors.

```js
module.exports = {
  entry: "...",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          failOnError: true
        }
      }
    ]
  }
};
```

##### `outputReport` (default: `false`)

Write the output of the errors to a file, for example a checkstyle xml file for use for reporting on Jenkins CI

The `filePath` is relative to the webpack config: output.path
You can pass in a different formatter for the output file, if none is passed in the default/configured formatter will be used

```js
module.exports = {
  entry: "...",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          outputReport: {
            filePath: "checkstyle.xml",
            formatter: require("eslint/lib/formatters/checkstyle")
          }
        }
      }
    ]
  }
};
```

## Gotchas

### NoErrorsPlugin

`NoErrorsPlugin` prevents webpack from outputting anything into a bundle. So even ESLint warnings
will fail the build. No matter what error settings are used for `eslint-loader`.

So if you want to see ESLint warnings in console during development using `WebpackDevServer`
remove `NoErrorsPlugin` from webpack config.

### Defining `configFile` or using `eslint -c path/.eslintrc`

Bear in mind that when you define `configFile`, `eslint` doesn't automatically look for
`.eslintrc` files in the directory of the file to be linted.
More information is available in official eslint documentation in section [_Using Configuration Files_](http://eslint.org/docs/user-guide/configuring#using-configuration-files).
See [#129](https://github.com/webpack-contrib/eslint-loader/issues/129).

---

## [Changelog](https://raw.githubusercontent.com/webpack-contrib/eslint-loader/master/CHANGELOG.md)

## [License](https://raw.githubusercontent.com/webpack-contrib/eslint-loader/master/LICENSE)

# exports-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



exports loader module for webpack

## Requirements

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## Getting Started

To begin, you'll need to install `exports-loader`:

```console
$ npm install exports-loader --save-dev
```

Then add the loader to the desired `require` calls. For example:

```js
require('exports-loader?file,parse=helpers.parse!./file.js');
// adds the following code to the file's source:
//  exports['file'] = file;
//  exports['parse'] = helpers.parse;

require('exports-loader?file!./file.js');
// adds the following code to the file's source:
//  module.exports = file;

require('exports-loader?[name]!./file.js');
// adds the following code to the file's source:
//  module.exports = file;
```

And run `webpack` via your preferred method.

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

#### [CONTRIBUTING](https://raw.githubusercontent.com/webpack-contrib/exports-loader/master/.github/CONTRIBUTING.md)

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/exports-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/exports-loader.svg
[npm-url]: https://npmjs.com/package/exports-loader

[node]: https://img.shields.io/node/v/exports-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/exports-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/exports-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/exports-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/exports-loader

[cover]: https://codecov.io/gh/webpack-contrib/exports-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/exports-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# expose-loader

The expose loader adds modules to the global object. This is useful for debugging, or <a href="https://webpack.docschina.org/guides/shimming/">supporting libraries that depend on libraries in globals</a>.


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



expose loader module for webpack

## Requirements

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## Getting Started

To begin, you'll need to install `expose-loader`:

```console
$ npm install expose-loader --save-dev
```

Then add the loader to your `webpack` config. For example:

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.js/,
        use: [
          {
            loader: `expose-loader`,
            options: {...options}
          }
        ]
      }
    ]
  }
}
```

And then require the target file in your bundle's code:

```js
// src/entry.js
require("expose-loader?libraryName!./thing.js");
```

And run `webpack` via your preferred method.

## Examples

例如，假设你要将 jQuery 暴露至全局并称为 `$`：

```js
require("expose-loader?$!jquery");
```

然后，`window.$` 就可以在浏览器控制台中使用。

或者，你可以通过配置文件来设置：

```js
// webpack.config.js
module: {
  rules: [{
    test: require.resolve('jquery'),
    use: [{
      loader: 'expose-loader',
      options: '$'
    }]
  }]
}
```

除了暴露为 `window. $` 之外，假设你还想把它暴露为 `window.jQuery`。
对于多个暴露，你可以在 loader 字符串中使用 `!`：

```js
// webpack.config.js
module: {
  rules: [{
    test: require.resolve('jquery'),
    use: [{
      loader: 'expose-loader',
      options: 'jQuery'
    },{
      loader: 'expose-loader',
      options: '$'
    }]
  }]
}
```

[`require.resolve`](https://nodejs.org/api/modules.html#modules_require_resolve_request_options) 调用是一个 Node.js 函数
（与 webpack 处理流程中的 `require.resolve` 无关）。
`require.resolve` 用来获取模块的绝对路径
（`"/.../app/node_modules/react/react.js"`）。
所以这里的暴露只会作用于 React 模块。
并且只在 bundle 中使用到它时，才进行暴露。

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

#### [CONTRIBUTING](https://raw.githubusercontent.com/webpack-contrib/expose-loader/master/.github/CONTRIBUTING.md)

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/expose-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/expose-loader.svg
[npm-url]: https://npmjs.com/package/expose-loader

[node]: https://img.shields.io/node/v/expose-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/expose-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/expose-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/expose-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/expose-loader

[cover]: https://codecov.io/gh/webpack-contrib/expose-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/expose-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# extract-loader

**用于从 bundle 中提取 HTML 和 CSS**

[![](https://img.shields.io/npm/v/extract-loader.svg)](https://www.npmjs.com/package/extract-loader)
[![](https://img.shields.io/npm/dm/extract-loader.svg)](https://www.npmjs.com/package/extract-loader)
[![Dependency Status](https://david-dm.org/peerigon/extract-loader.svg)](https://david-dm.org/peerigon/extract-loader)
[![Build Status](https://travis-ci.org/peerigon/extract-loader.svg?branch=master)](https://travis-ci.org/peerigon/extract-loader)
[![Coverage Status](https://img.shields.io/coveralls/peerigon/extract-loader.svg)](https://coveralls.io/r/peerigon/extract-loader?branch=master)

extract-loader 可以动态地评估给定的源代码，并以字符串形式返回结果。主要作用是解析 HTML 和 CSS 中来自各自 loader 的 urls. 使用 [file-loader](https://v4.webpack.docschina.org/loaders/file-loader/) 将 extract-loader 的结果以单独文件发布。

```javascript
import stylesheetUrl from "file-loader!extract-loader!css-loader!main.css";
// stylesheetUrl will now be the hashed url to the final stylesheet
```

extract-loader 的工作原理与 [extract-text-webpack-plugin](https://v4.webpack.docschina.org/plugins/extract-text-webpack-plugin/) 类似，然而 extract-loader 更加简洁。在评估源代码时，它提供了一个伪造的上下文，该上下文专门用于处理由 [html-loader](https://v4.webpack.docschina.org/loaders/html-loader/) 或 [css-loader](https://v4.webpack.docschina.org/loaders/css-loader/) 生成的代码。因此，其他情况下可能不起作用。

<br>

## 安装

`npm install extract-loader`

<br>

## 示例

将 CSS 与 webpack 捆绑在一起好处多多，如在开发环境中使用哈希 url 或 [hot module replacement](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html) 引用图像和字体。另一方面，在生产环境中，根据 JS 的执行情况应用样式表并非最佳选择。因为渲染可能会延迟，甚至导致 [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) -- Flash of unstyled content (文档样式短暂失效)。因此，在最终的生产构建中，最好将它们作为单独的文件保存。

使用 extract-loader, 可以将 `main.css` 作为常规的 `entry` 引用。下面的 `webpack.config.js` 演示了在开发环境中如何使用 [style-loader](https://v4.webpack.docschina.org/loaders/style-loader/) 加载样式，以及在生产环境中如何使用单独的文件加载样式。

```js
module.exports = ({ mode }) => {
    const pathToMainCss = require.resolve("./app/main.css");
    const loaders = [{
        loader: "css-loader",
        options: {
            sourceMap: true
        }
    }];

    if (mode === "production") {
        loaders.unshift(
            "file-loader",
            "extract-loader"
        );
    } else {
        loaders.unshift("style-loader");
    }

    return {
        mode,
        entry: pathToMainCss,
        module: {
            rules: [
                {
                    test: pathToMainCss,
                    loaders: loaders
                },
            ]
        }
    };
};
```

### [提取 index.html](https://github.com/peerigon/extract-loader/tree/master/examples/index-html)

也可以将 `index.html` 添加为 `entry`, 并从中引用样式表。只需为 html-loader 添加选项配置 `link:href`:

```js
module.exports = ({ mode }) => {
    const pathToMainJs = require.resolve("./app/main.js");
    const pathToIndexHtml = require.resolve("./app/index.html");

    return {
        mode,
        entry: [
            pathToMainJs,
            pathToIndexHtml
        ],
        module: {
            rules: [
                {
                    test: pathToIndexHtml,
                    use: [
                        "file-loader",
                        "extract-loader",
                        {
                            loader: "html-loader",
                            options: {
                                attrs: ["img:src", "link:href"]
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        "file-loader",
                        "extract-loader",
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.jpg$/,
                    use: "file-loader"
                }
            ]
        }
    };
}
```

这样操作，可以将如下代码

```html
<html>
  <head>
    <link href="main.css" type="text/css" rel="stylesheet" />
  </head>
  <body>
    <img src="hi.jpg" />
  </body>
</html>
```

转换为：

```html
<html>
  <head>
    <link
      href="7c57758b88216530ef48069c2a4c685a.css"
      type="text/css"
      rel="stylesheet"
    />
  </head>
  <body>
    <img src="6ac05174ae9b62257ff3aa8be43cf828.jpg" />
  </body>
</html>
```

<br>

Source Maps
------------------------------------------------------------------------

If you want source maps in your extracted CSS files, you need to set the [`sourceMap` option](https://github.com/webpack-contrib/css-loader#sourcemap) of the **css-loader**:

```js
    {
        loader: "css-loader",
        options: {
            sourceMap: true
        }
    }
```

<br>

Options
------------------------------------------------------------------------

There is currently exactly one option: `publicPath`.
If you are using a relative `publicPath` in webpack's [output options](https://webpack.js.org/configuration/output/#output-publicpath) and extracting to a file with the `file-loader`, you might need this to account for the location of your extracted file. `publicPath` may be defined as a string or a function that accepts current [loader context](https://webpack.js.org/api/loaders/#the-loader-context) as single argument.

Example with publicPath option as a string:

```js
module.exports = {
  output: {
    path: path.resolve("./dist"),
    publicPath: "dist/"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/[name].[ext]"
            }
          },
          {
            loader: "extract-loader",
            options: {
              publicPath: "../"
            }
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  }
};
```

<br>

## 贡献投稿

提交 bug 报告，创建一个 pr 请求，无论以何种形式，我们都**无任欢迎并感谢所有贡献投稿**。如果您计划实现新功能或更改 API，请先创建一个问题，以便我们确认你的宝贵工作不会白费。

请确保所有的 pr 请求有 100% 的测试覆盖率（包含明显异常），并且需要通过所有测试。

- Call `npm test` to run the unit tests
- Call `npm run coverage` to check the test coverage (using [istanbul](https://github.com/gotwarlost/istanbul))

<br>

## License

Unlicense

## 赞助者

[<img src="https://assets.peerigon.com/peerigon/logo/peerigon-logo-flat-spinat.png" width="150" />](https://peerigon.com/)

# file-loader

指示 webpack 将所需的对象作为文件发送并返回其公用 URL


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



The `file-loader` resolves `import`/`require()` on a file into a url and emits the file into the output directory.

## 起步

你需要预先安装 `file-loader`：

```console
$ npm install file-loader --save-dev
```

在一个 bundle 文件中 import（或 `require`）目标文件：

**file.js**

```js
import img from "./file.png";
```

然后，在 `webpack` 配置中添加 loader。例如：

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      }
    ]
  }
};
```

然后，通过你偏爱的方式去运行 `webpack`。将 `file.png` 作为一个文件，生成到输出目录，
（如果指定了选项，则使用指定的命名约定）
并返回文件的 public URI。

> ℹ️ 默认情况下，生成文件的文件名，是文件内容的 MD5 哈希值，并会保留所引用资源的原始扩展名。

## 选项

|         名称          |         类型         |                                                       默认值                                                        | 描述                                                                                                                      |
| :-------------------: | :------------------: | :-----------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------ |
|      **`name`**       | `{String\|Function}` |                                                   `[hash].[ext]`                                                    | 为你的文件配置自定义文件名模板                                                                                            |
|     **`context`**     |      `{String}`      |                                               `this.options.context`                                                | 配置自定义文件 context，默认为 `webpack.config.js` [context](https://webpack.docschina.org/configuration/entry-context/#context) |
|   **`publicPath`**    | `{String\|Function}` | [`__webpack_public_path__`](https://webpack.docschina.org/api/module-variables/#__webpack_public_path__-webpack-specific-) | 为你的文件配置自定义 `public` 发布目录                                                                                    |
|   **`outputPath`**    | `{String\|Function}` |                                                    `'undefined'`                                                    | 为你的文件配置自定义 `output` 输出目录                                                                                    |
| **`useRelativePath`** |     `{Boolean}`      |                                                       `false`                                                       | 如果你希望为每个文件生成一个相对 url 的 `context` 时，应该将其设置为 `true`                                               |
|    **`emitFile`**     |     `{Boolean}`      |                                                       `true`                                                        | 默认情况下会生成文件，可以通过将此项设置为 false 来禁止（例如，使用了服务端的 packages）                                  |

类型：`String|Function`
默认：`'[hash].[ext]'`

您可以使用查询参数为您的文件配置自定义文件名模板 `name`。例如，要将文件从 `context` 目录复制到保留完整目录结构的输出目录中，可以使用

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                if (process.env.NODE_ENV === 'development') {
                  return '[path][name].[ext]';
                }

                return '[hash].[ext]';
              },
            },
          },
        ],
      },
    ],
  },
};
```

> ℹ️ 默认情况下，文件会按照你指定的路径和名称输出同一目录中，且会使用相同的 URI 路径来访问文件。

|     名称     |    类型    |                             默认值                             | 描述                                         |
| :----------: | :--------: | :------------------------------------------------------------: | :------------------------------------------- |
| **`[ext]`**  | `{String}` |                         `file.extname`                         | 资源扩展名                                   |
| **`[name]`** | `{String}` |                        `file.basename`                         | 资源的基本名称                               |
| **`[path]`** | `{String}` |                         `file.dirname`                         | 资源相对于 `context`的路径                   |
| **`[hash]`** | `{String}` |                             `md5`                              | 内容的哈希值，下面的 hashes 配置中有更多信息 |
|  **`[N]`**   | `{Number}` | ``|当前文件名按照查询参数 `regExp` 匹配后获得到第 N 个匹配结果 |

类型：`String|Function`
默认：`undefined`

Specify a filesystem path where the target file(s) will be placed.

|       名称       |    类型    |  默认值  | 描述                                                                                  |
| :--------------: | :--------: | :------: | :------------------------------------------------------------------------------------ |
|  **`hashType`**  | `{String}` |  `md5`   | `sha1`, `md5`, `sha256`, `sha512`                                                     |
| **`digestType`** | `{String}` | `base64` | `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64` |
|   **`length`**   | `{Number}` |  `9999`  | 字符的长度                                                                            |

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: (url, resourcePath, context) => {
                // `resourcePath` is original absolute path to asset
                // `context` is directory where stored asset (`rootContext`) or `context` option

                // To get relative path you can use
                // const relativePath = path.relative(context, resourcePath);

                if (/my-custom-image\.png/.test(resourcePath)) {
                  return `other_output_path/${url}`;
                }

                if (/images/.test(context)) {
                  return `image_output_path/${url}`;
                }

                return `output_path/${url}`;
              },
            },
          },
        ],
      },
    ],
  },
};
```

### `publicPath`

类型：`String|Function`
默认：[`__webpack_public_path__`](https://webpack.js.org/api/module-variables/#__webpack_public_path__-webpack-specific-)

Specifies a custom public path for the target file(s).

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: 'assets',
            },
          },
        ],
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: (url, resourcePath, context) => {
                // `resourcePath` is original absolute path to asset
                // `context` is directory where stored asset (`rootContext`) or `context` option

                // To get relative path you can use
                // const relativePath = path.relative(context, resourcePath);

                if (/my-custom-image\.png/.test(resourcePath)) {
                  return `other_public_path/${url}`;
                }

                if (/images/.test(context)) {
                  return `image_output_path/${url}`;
                }

                return `public_path/${url}`;
              },
            },
          },
        ],
      },
    ],
  },
};
```

### `context`

类型：`String`
默认：[`context`](https://webpack.js.org/configuration/entry-context/#context)

Specifies a custom file context.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              context: 'project',
            },
          },
        ],
      },
    ],
  },
};
```

### `emitFile`

类型：`Boolean`
默认：`true`

如果是 true，生成一个文件（向文件系统写入一个文件）。
如果是 false，loader 会返回 public URI，但**不会**生成文件。
对于服务器端 package，禁用此选项通常很有用。

**file.js**

```js
import img from "./file.png";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              emitFile: false,
            },
          },
        ],
      },
    ],
  },
};
```

> ⚠️ 返回 public URL 但**不会**生成文件

Specifies a Regular Expression to one or many parts of the target file path.
The capture groups can be reused in the `name` property using `[N]`
[placeholder](https://github.com/webpack-contrib/file-loader#placeholders).

**file.js**

```js
import img from './customer01/file.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/,
              name: '[1]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

> ℹ️ If `[0]` is used, it will be replaced by the entire tested string, whereas `[1]` will contain the first capturing parenthesis of your regex and so on...

## placeholders

Full information about placeholders you can find [here](https://github.com/webpack/loader-utils#interpolatename).

### `[ext]`

类型：`String`
默认：`file.extname`

目标文件/资源的文件扩展名。

### `[name]`

类型：`String`
默认：`file.basename`

文件/资源的基本名称。

### `[path]`

类型：`String`
默认：`file.directory`

The path of the resource relative to the webpack/config `context`.

### `[folder]`

类型：`String`
默认：`file.folder`

The folder of the resource is in.

### `[emoji]`

类型：`String`
默认：`undefined`

A random emoji representation of `content`.

### `[emoji:<length>]`

类型：`String`
默认：`undefined`

Same as above, but with a customizable number of emojis

### `[hash]`

类型：`String`
默认：`md5`

指定生成文件内容哈希值的哈希方法。

### `[<hashType>:hash:<digestType>:<length>]`

类型：`String`

The hash of options.content (Buffer) (by default it's the hex digest of the hash).

#### `digestType`

类型：`String`
默认：`'hex'`

The [digest](https://en.wikipedia.org/wiki/Cryptographic_hash_function) that the
hash function should use. Valid values include: base26, base32, base36,
base49, base52, base58, base62, base64, and hex.

#### `hashType`

类型：`String`
默认：`'md5'`

The type of hash that the has function should use. Valid values include: `md5`,
`sha1`, `sha256`, and `sha512`.

#### `length`

类型：`Number`
默认：`undefined`

Users may also specify a length for the computed hash.

### `[N]`

类型：`String`
默认：`undefined`

The n-th match obtained from matching the current file name against the `regExp`.

## 示例

```js
import png from "image.png";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'dirname/[hash].[ext]',
            },
          }
        ],
      },
    ],
  },
};
```

结果：

```bash
# result
dirname/0dcbbaa701328ae351f.png
```

**webpack.config.js**

```js
import png from './image.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[sha512:hash:base64:7].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

结果：

```bash
# result
gdyb21L.png
```

---

**file.js**

```js
import png from "path/to/file.png";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]?[hash]',
            },
          },
        ],
      },
    ],
  },
};
```

结果：

```bash
# result
path/to/file.png?e43b20c069c4a01867c31e98cbce33c9
```

## 贡献

如果你从未阅读过我们的贡献指南，请在上面花点时间。

[贡献指南](https://raw.githubusercontent.com/webpack-contrib/file-loader/master/.github/CONTRIBUTING.md)

[npm]: https://img.shields.io/npm/v/file-loader.svg
[npm-url]: https://npmjs.com/package/file-loader
[node]: https://img.shields.io/node/v/file-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/file-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/file-loader
[tests]: http://img.shields.io/travis/webpack-contrib/file-loader.svg
[tests-url]: https://travis-ci.org/webpack-contrib/file-loader
[cover]: https://img.shields.io/codecov/c/github/webpack-contrib/file-loader.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/file-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=file-loader
[size-url]: https://packagephobia.now.sh/result?p=file-loader

# gzip-loader

用于 webpack 的 gzip 加载器模块

启用加载 gzip 资源。

## 安装

```bash
npm install --save-dev gzip-loader
```

## 用法

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.gz$/,
        enforce: "pre",
        use: "gzip-loader"
      }
    ]
  }
};
```

**bundle.js**

```js
require("gzip-loader!./file.js.gz");
```

## 维护人员

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/jdalton">
          <img width="150" height="150" src="https://avatars.githubusercontent.com/u/4303?v=3&s=150">
          </br>
          John-David Dalton
        </a>
      </td>
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

[npm]: https://img.shields.io/npm/v/gzip-loader.svg
[npm-url]: https://npmjs.com/package/gzip-loader
[deps]: https://david-dm.org/webpack-contrib/gzip-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/gzip-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[test]: http://img.shields.io/travis/webpack-contrib/gzip-loader.svg
[test-url]: https://travis-ci.org/webpack-contrib/gzip-loader
[cover]: https://codecov.io/gh/webpack-contrib/gzip-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/gzip-loader

# html-loader

将 HTML 导出为字符串。当编译器要求时，HTML 被最小化。

## 安装

```bash
npm i -D html-loader
```

## 用法

默认情况下，每个本地的 `<img src="image.png">` 都需要通过 require （`require('./image.png')`）来进行加载。你可能需要在配置中为图片指定 loader（推荐 `file-loader` 或 `url-loader` ）

你可以通过查询参数 `attrs`，来指定哪个标签属性组合(tag-attribute combination)应该被此 loader 处理。传递数组或以空格分隔的 `<tag>:<attribute>` 组合的列表。（默认值：`attrs=img:src`）

当使用 `<custom-elements>` 时，它们中的很多都使用了一个 `custom-src` 属性，无需指定每个组合 `<tag>:<attribute>`，只需指定一个空标签就可以匹配每个元素，比如：`attrs=:custom-src`

```js
{
  test: /\.(html)$/,
  use: {
    loader: 'html-loader',
    options: {
      attrs: [':data-src']
    }
  }
}
```

要完全禁用对标签属性的处理（例如，如果你在客户端处理图片加载），你可以传入 `attrs=false`。

## 示例

使用此配置：

```js
{
  module: {
    rules: [
      { test: /\.jpg$/, use: [ "file-loader" ] },
      { test: /\.png$/, use: [ "url-loader?mimetype=image/png" ] }
    ]
  },
  output: {
    publicPath: "http://cdn.example.com/[hash]/"
  }
}
```

```html
<!-- file.html -->
<img src="image.png" data-src="image2x.png" />
```

```js
require("html-loader!./file.html");

// => '<img src="http://cdn.example.com/49eba9f/a992ca.png"
//         data-src="image2x.png">'
```

```js
require("html-loader?attrs=img:data-src!./file.html");

// => '<img src="image.png" data-src="data:image/png;base64,..." >'
```

```js
require("html-loader?attrs=img:src img:data-src!./file.html");
require("html-loader?attrs[]=img:src&attrs[]=img:data-src!./file.html");

// => '<img  src="http://cdn.example.com/49eba9f/a992ca.png"
//           data-src="data:image/png;base64,..." >'
```

```js
require("html-loader?-attrs!./file.html");

// => '<img  src="image.jpg"  data-src="image2x.png" >'
```

通过运行 `webpack --optimize-minimize` 来最小化

```html
'<img src=http://cdn.example.com/49eba9f/a9f92ca.jpg
data-src=data:image/png;base64,...>'
```

或者在 `webpack.conf.js` 的 rule 选项中指定 `minimize` 属性

```js
module: {
  rules: [
    {
      test: /\.html$/,
      use: [
        {
          loader: "html-loader",
          options: {
            minimize: true
          }
        }
      ]
    }
  ];
}
```

参考 [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference)的文档了解更多可用的配置信息。

默认启用的最小化规则有以下几种:
 - removeComments
 - removeCommentsFromCDATA
 - removeCDATASectionsFromCDATA
 - collapseWhitespace
 - conservativeCollapse
 - removeAttributeQuotes
 - useShortDoctype
 - keepClosingSlash
 - minifyJS
 - minifyCSS
 - removeScriptTypeAttributes
 - removeStyleTypeAttributes

可以禁用规则的项如下，配置文件：`webpack.conf.js`

```js
module: {
  rules: [
    {
      test: /\.html$/,
      use: [
        {
          loader: "html-loader",
          options: {
            minimize: true,
            removeComments: false,
            collapseWhitespace: false
          }
        }
      ]
    }
  ];
}
```

## 相对根目录的 URLs

对于以 `/` 开头的 url，默认行为是不转换它们。如果设置了 `root` 查询参数，它将被添加到 URL 之前，然后进行转换。

和上面配置相同：

```html
<img src="/image.jpg" />
```

```js
require("html-loader!./file.html");

// => '<img  src="/image.jpg">'
```

```js
require("html-loader?root=.!./file.html");

// => '<img  src="http://cdn.example.com/49eba9f/a992ca.jpg">'
```

### 插值

你可以使用 `interpolate` 标记，为 ES6 模板字符串启用插值语法，就像这样：

```js
require("html-loader?interpolate!./file.html");
```

```html
<img src="${require(`./images/gallery.png`)}" />

<div>${require('./components/gallery.html')}</div>
```

如果你只想在模板中使用 `require`，任何其它的 `${}` 不被转换，你可以设置 `interpolate` 标记为 `require`，就像这样：

```js
require("html-loader?interpolate=require!./file.ftl");
```

```html

<#list list as list>
  <a href="${list.href!}" />${list.name}</a>
</#list>

<img src="${require(`./images/gallery.png`)}">

<div>${require('./components/gallery.html')}</div>
```

### 导出格式

这里有几种不同的可用导出格式：

- `module.exports`（默认配置，cjs 格式）。"Hello world" 转为 `module.exports = "Hello world";`
- `exports.default` (当设置了 `exportAsDefault` 参数，es6to5 格式）。"Hello world" 转为 `exports.default = "Hello world";`
- `export default` (当设置了 `exportAsEs6Default` 参数，es6 格式)。"Hello world" 转为 `export default "Hello world";`

### 高级选项

如果你需要传递[更多高级选项](https://github.com/webpack/html-loader/pull/46)，特别是那些不能被字符串化，你还可以在 `webpack.config.js` 中定义一个 `htmlLoader` 属性：

```js
var path = require('path')

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [ "html-loader" ]
      }
    ]
  },
  htmlLoader: {
    ignoreCustomFragments: [/\{\{.*?}}/],
    root: path.resolve(__dirname, 'assets'),
    attrs: ['img:src', 'link:href']
  }
};
```

如果你需要定义两个不同的 loader 配置，你也可以通过 `html-loader?config=otherHtmlLoaderConfig` 改变配置的属性名：

```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [ "html-loader?config=otherHtmlLoaderConfig" ]
      }
    ]
  },
  otherHtmlLoaderConfig: {
    ...
  }
};
```

### 导出到 HTML 文件

一个很常见的场景，将 HTML 导出到 _.html_ 文件中，直接访问它们，而不是使用 javascript 注入。这可以通过 3 个 loader 的组合来实现：

- [file-loader](https://github.com/webpack/file-loader)
- [extract-loader](https://github.com/peerigon/extract-loader)
- html-loader

html-loader 将解析 URL，并请求图片和你所期望的一切资源。extract-loader 会将 javascript 解析为合适的 html 文件，确保引用的图片指向正确的路径，file-loader 将结果写入 .html 文件。示例：

```js
{
  test: /\.html$/,
  use: ['file-loader?name=[name].[ext]', 'extract-loader', 'html-loader'],
}
```

## 维护人员

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/u/18315?v=3">
        </br>
        <a href="https://github.com/hemanth">Hemanth</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/u/8420490?v=3">
        </br>
        <a href="https://github.com/d3viant0ne">Joshua Wiens</a>
      </td>
      <td align="center">
        <img width="150" height="150" src="https://avatars.githubusercontent.com/u/5419992?v=3">
        </br>
        <a href="https://github.com/michael-ciniawsky">Michael Ciniawsky</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/u/6542274?v=3">
        </br>
        <a href="https://github.com/imvetri">Imvetri</a>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/u/1520965?v=3">
        </br>
        <a href="https://github.com/andreicek">Andrei Crnković</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/u/3367801?v=3">
        </br>
        <a href="https://github.com/abouthiroppy">Yuta Hiroto</a>
      </td>
      <td align="center">
        <img width="150" height="150" src="https://avatars.githubusercontent.com/u/80044?v=3">
        </br>
        <a href="https://github.com/petrunov">Vesselin Petrunov</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/u/973543?v=3">
        </br>
        <a href="https://github.com/gajus">Gajus Kuizinas</a>
      </td>
    </tr>
  </tbody>
</table>

[npm]: https://img.shields.io/npm/v/html-loader.svg
[npm-url]: https://npmjs.com/package/html-loader
[deps]: https://david-dm.org/webpack/html-loader.svg
[deps-url]: https://david-dm.org/webpack/html-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[test]: http://img.shields.io/travis/webpack/html-loader.svg
[test-url]: https://travis-ci.org/webpack/html-loader
[cover]: https://codecov.io/gh/webpack/html-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack/html-loader

# i18n-loader

##  用法

### ./colors.json

``` javascript
{
	"red": "red",
	"green": "green",
	"blue": "blue"
}
```

### ./de-de.colors.json

``` javascript
{
	"red": "rot",
	"green": "gr�n"
}
```

### 调用

``` javascript
// 假如我们的所在区域是 "de-de-berlin"
var locale = require("i18n!./colors.json");

// 等待准备就绪，在一个 web 项目中所有地区只需要一次
// 因为所有地区的语言被合并到一个块中
locale(function() {
	console.log(locale.red); // 输出 rot
	console.log(locale.blue); // 输出 blue
});
```

### 配置

如果想要一次加载然后可以同步地使用，
你应该告诉 loader 所有要使用的地区。

``` javascript
{
  "i18n": {
    "locales": [
      "de",
      "de-de",
      "fr"
    ],
    // "bundleTogether": false
    // 可以禁止所有地区打包到一起
  }
}
```

### 可选的调用方法

``` javascript
require("i18n/choose!./file.js"); // 根据地区选择正确的文件，
					// 但是不会合并到对象中
require("i18n/concat!./file.js"); // 拼接所有合适的地区
require("i18n/merge!./file.js"); // 合并到对象中
					// ./file.js 在编译时会被排除掉
require("i18n!./file.json") == require("i18n/merge!json!./file.json")
```

如果需要在 node 中使用，不要忘记填补（polyfill）`require`。
可以参考 `webpack` 文档。

## License

MIT (http://www.opensource.org/licenses/mit-license.php)

# imports-loader

imports loader 允许使用依赖于特定全局变量的模块。

这对于依赖全局变量 `$` 或 `this` 作为 `window` 对象的第三方模块非常有用。imports loader 可以添加必要的 `require('whatever')` 调用，因此这些模块可以与 webpack 一起使用。

## 安装

```bash
npm install imports-loader
```

## <a href="https://webpack.docschina.org/concepts/loaders">用法</a>

假设你有 `example.js` 这个文件

```javascript
$("img").doSomeAwesomeJqueryPluginStuff();
```

然后你可以像下面这样通过配置 imports-loader 插入 `$` 变量到模块中：

```javascript
require("imports-loader?$=jquery!./example.js");
```

这将简单的把 `var $ = require("jquery");` 前置插入到 `example.js` 中。

##

| loader 查询值       | 含义                                  |
| ------------------- | ------------------------------------- |
| `angular`           |  `var angular = require("angular");`  |
| `$=jquery`          | `var $ = require("jquery");`          |
| `define=>false`     | `var define = false;`                 |
| `config=>{size:50}` | `var config = {size:50};`             |
| `this=>window`      | `(function () { ... }).call(window);` |

### 多个值

使用逗号 `,` 来分隔和使用多个值：

```javascript
require("imports-loader?$=jquery,angular,config=>{size:50}!./file.js");
```

### webpack.config.js

同样的，在你的 `webpack.config.js` 配置文件中进行配置会更好：

```javascript
// ./webpack.config.js

module.exports = {
    ...
    module: {
        rules: [
            {
                test: require.resolve("some-module"),
                use: "imports-loader?this=>window"
            }
        ]
    }
};
```

## 典型的使用场景

### jQuery 插件

`imports-loader?$=jquery`

### 自定义的 Angular 模块

`imports-loader?angular`

### 禁用 AMD

有很多模块在使用 CommonJS 前会进行 `define` 函数的检查。自从 webpack 两种格式都可以使用后，在这种场景下默认使用了 AMD 可能会造成某些问题（如果接口的实现比较古怪）。

你可以像下面这样轻松的禁用 AMD

```javascript
imports-loader?define=>false
```

关于兼容性问题的更多提示，可以参考官方的文档 [Shimming Modules](http://webpack.github.io/docs/shimming-modules.html)。

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

[npm]: https://img.shields.io/npm/v/imports-loader.svg
[npm-url]: https://npmjs.com/package/imports-loader
[deps]: https://david-dm.org/webpack-contrib/imports-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/imports-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[test]: http://img.shields.io/travis/webpack-contrib/imports-loader.svg
[test-url]: https://travis-ci.org/webpack-contrib/imports-loader

# loader

webpack 可以使用 [loader](https://v4.webpack.docschina.org/concepts/loaders) 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。你可以使用 Node.js 来很简单地编写自己的 loader。

loader 通过在 `require()` 语句中使用 `loadername!` 前缀来激活，或者通过 webpack 配置中的正则表达式来自动应用 - 查看[配置](https://v4.webpack.docschina.org/concepts/loaders#configuration)。


## 文件

- [`raw-loader`](https://v4.webpack.docschina.org/loaders/raw-loader) 加载文件原始内容（utf-8）
- [`val-loader`](https://v4.webpack.docschina.org/loaders/val-loader) 将代码作为模块执行，并将 exports 转为 JS 代码
- [`url-loader`](https://v4.webpack.docschina.org/loaders/url-loader) 像 file loader 一样工作，但如果文件小于限制，可以返回 [data URL](https://tools.ietf.org/html/rfc2397)
- [`file-loader`](https://v4.webpack.docschina.org/loaders/file-loader) 将文件发送到输出文件夹，并返回（相对）URL
- [`ref-loader`](https://www.npmjs.com/package/ref-loader) 手动创建所有文件之间的依赖关系


## JSON

- [`json-loader`](https://v4.webpack.docschina.org/loaders/json-loader) 加载 [JSON](http://json.org/) 文件（默认包含）
- [`json5-loader`](https://v4.webpack.docschina.org/loaders/json5-loader) 加载和转译 [JSON 5](https://json5.org/) 文件
- `cson-loader` 加载和转译 [CSON](https://github.com/awnist/cson-loader) 文件


## 转译(transpiling)

- [`script-loader`](https://v4.webpack.docschina.org/loaders/script-loader) 在全局上下文中执行一次 JavaScript 文件（如在 script 标签），不需要解析
- [`babel-loader`](https://v4.webpack.docschina.org/loaders/babel-loader) 加载 ES2015+ 代码，然后使用 [Babel](https://babel.docschina.org/) 转译为 ES5
- [`buble-loader`](https://github.com/sairion/buble-loader) 使用 [Bublé](https://buble.surge.sh/guide/) 加载 ES2015+ 代码，并且将代码转译为 ES5
- [`traceur-loader`](https://github.com/jupl/traceur-loader) 加载 ES2015+ 代码，然后使用 [Traceur](https://github.com/google/traceur-compiler#readme) 转译为 ES5
- [`ts-loader`](https://github.com/TypeStrong/ts-loader) 或 [`awesome-typescript-loader`](https://github.com/s-panferov/awesome-typescript-loader) 像 JavaScript 一样加载 [TypeScript](https://www.typescriptlang.org/) 2.0+
- [`coffee-loader`](https://v4.webpack.docschina.org/loaders/coffee-loader) 像 JavaScript 一样加载 [CoffeeScript](http://coffeescript.org/)
- [`fengari-loader`](https://github.com/fengari-lua/fengari-loader/) 使用 [fengari](https://fengari.io/) 加载 Lua 代码


## 模板(templating)

- [`html-loader`](https://v4.webpack.docschina.org/loaders/html-loader) 导出 HTML 为字符串，需要引用静态资源
- [`pug-loader`](https://github.com/pugjs/pug-loader) 加载 Pug 模板并返回一个函数
- [`markdown-loader`](https://github.com/peerigon/markdown-loader) 将 Markdown 转译为 HTML
- [`react-markdown-loader`](https://github.com/javiercf/react-markdown-loader) 使用 markdown-parse parser(解析器) 将 Markdown 编译为 React 组件
- [`posthtml-loader`](https://github.com/posthtml/posthtml-loader) 使用 [PostHTML](https://github.com/posthtml/posthtml) 加载并转换 HTML 文件
- [`handlebars-loader`](https://github.com/pcardune/handlebars-loader) 将 Handlebars 转移为 HTML
- [`markup-inline-loader`](https://github.com/asnowwolf/markup-inline-loader) 将内联的 SVG/MathML 文件转换为 HTML。在应用于图标字体，或将 CSS 动画应用于 SVG 时非常有用。
- [`twig-loader`](https://github.com/zimmo-be/twig-loader) 编译 Twig 模板，然后返回一个函数

## 样式

- [`style-loader`](https://v4.webpack.docschina.org/loaders/style-loader) 将模块的导出作为样式添加到 DOM 中
- [`css-loader`](https://v4.webpack.docschina.org/loaders/css-loader) 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
- [`less-loader`](https://v4.webpack.docschina.org/loaders/less-loader) 加载和转译 LESS 文件
- [`sass-loader`](https://v4.webpack.docschina.org/loaders/sass-loader) 加载和转译 SASS/SCSS 文件
- [`postcss-loader`](https://v4.webpack.docschina.org/loaders/postcss-loader) 使用 [PostCSS](http://postcss.org) 加载和转译 CSS/SSS 文件
- [`stylus-loader`](https://github.com/shama/stylus-loader) 加载和转译 Stylus 文件


## 代码检查和测试(linting && testing)

- [`mocha-loader`](https://v4.webpack.docschina.org/loaders/mocha-loader) 使用 [mocha](https://mochajs.org/) 测试（浏览器/NodeJS）
- [`eslint-loader`](https://github.com/webpack-contrib/eslint-loader) PreLoader，使用 [ESLint](https://eslint.org/) 清理代码
- [`jshint-loader`](https://v4.webpack.docschina.org/loaders/jshint-loader) PreLoader，使用 [JSHint](http://jshint.com/about/) 清理代码
- [`jscs-loader`](https://github.com/unindented/jscs-loader) PreLoader，使用 [JSCS](http://jscs.info/) 检查代码样式
- [`coverjs-loader`](https://v4.webpack.docschina.org/loaders/coverjs-loader) PreLoader，使用 [CoverJS](https://github.com/arian/CoverJS) 确定测试覆盖率


## 框架(frameworks)

- [`vue-loader`](https://github.com/vuejs/vue-loader) 加载和转译 [Vue 组件](https://vuejs.org/v2/guide/components.html)
- [`polymer-loader`](https://github.com/webpack-contrib/polymer-webpack-loader) 使用选择预处理器(preprocessor)处理，并且 `require()` 类似一等模块(first-class)的 Web 组件
- [`angular2-template-loader`](https://github.com/TheLarkInn/angular2-template-loader) 加载和转译 [Angular](https://angular.io/) 组件

## Awesome

更多第三方 loader，查看 [awesome-webpack](https://github.com/webpack-contrib/awesome-webpack#loaders) 列表。

# istanbul-instrumenter-loader

Instrument JS files with [istanbul-lib-instrument](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-lib-instrument) for subsequent code coverage reporting

使用 [istanbul-lib-instrument](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-lib-instrument) 可以检测 JS 文件随后的代码覆盖率报告

## 安装

```bash
npm i -D istanbul-instrumenter-loader
```

## <a href="https://webpack.docschina.org/concepts/loaders">用法</a>

##

- [karma-webpack](https://github.com/webpack/karma-webpack)
- [karma-coverage-istanbul-reporter](https://github.com/mattlewis92/karma-coverage-istanbul-reporter)

### `结构`

```
├─ src
│ |– components
│ | |– bar
│ | │ |─ index.js
│ | |– foo/
│     |– index.js
|– test
| |– src
| | |– components
| | | |– foo
| | | | |– index.js
```

为生成所有组件（包括你没写测试的那些）的代码覆盖率报告，你需要 require 所有**业务**和**测试**的代码。相关内容在 [karma-webpack 其他用法](https://github.com/webpack/karma-webpack#alternative-usage)中有涉及

**test/index.js**

```js
// requires 所有在 `project/test/src/components/**/index.js` 中的测试
const tests = require.context("./src/components/", true, /index\.js$/);

tests.keys().forEach(tests);

// requires 所有在 `project/src/components/**/index.js` 中的组件
const components = require.context("../src/components/", true, /index\.js$/);

components.keys().forEach(components);
```

> ℹ️ 以下为 `karma` 的唯一`入口`起点文件

**karma.conf.js**

```js
config.set({
  ...
  files: [
    'test/index.js'
  ],
  preprocessors: {
    'test/index.js': 'webpack'
  },
  webpack: {
    ...
    module: {
      rules: [
        // 用 Istanbul 只监测业务代码
        {
          test: /\.js$/,
          use: { loader: 'istanbul-instrumenter-loader' },
          include: path.resolve('src/components/')
        }
      ]
    }
    ...
  },
  reporters: [ 'progress', 'coverage-istanbul' ],
  coverageIstanbulReporter: {
    reports: [ 'text-summary' ],
    fixWebpackSourcePaths: true
  }
  ...
});
```

### 使用 `Babel`

须将该检测作为后续步骤运行

**webpack.config.js**

```js
{
  test: /\.js$|\.jsx$/,
  use: {
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true }
  },
  enforce: 'post',
  exclude: /node_modules|\.spec\.js$/,
}
```

## <a href="https://github.com/istanbuljs/istanbuljs/blob/master/packages/istanbul-lib-instrument/api.md#instrumenter">Options</a>

此 loader 支持 `istanbul-lib-instrument` 的所有配置选项

|            Name            |     Type     |    Default     | Description                                                                      |
| :------------------------: | :----------: | :------------: | :------------------------------------------------------------------------------- |
|        **`debug`**         | `{Boolean}`  |    `false`     | 打开调试模式                                                                     |
|       **`compact`**        | `{Boolean}`  |     `true`     |                                                                                  |
|       **`autoWrap`**       | `{Boolean}`  |    `false`     | 生成紧凑的代码                                                                   |
|      **`esModules`**       | `{Boolean}`  |    `false`     | 设置为 `true` 以检测 ES2015 模块                                                 |
|   **`coverageVariable`**   |  `{String}`  | `__coverage__` | 全局覆盖变量的名称                                                               |
|   **`preserveComments`**   | `{Boolean}`  |    `false`     | 保留 `输出` 中的注释                                                             |
|   **`produceSourceMap`**   | `{Boolean}`  |    `false`     | 设置为 `true` 以生成已检测代码的 source map                                      |
| **`sourceMapUrlCallback`** | `{Function}` |     `null`     | 在原始代码中找到源映射 URL 时调用的回调函数，使用源文件名和源映射 URL 调用此函数 |

**webpack.config.js**

```js
{
  test: /\.js$/,
  use: {
    loader: 'istanbul-instrumenter-loader',
    options: {...options}
  }
}
```

## 维护人员

<table>
  <tbody>
    <tr>
      <td align="center">
      <a href="https://github.com/deepsweet">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/u/266822?v=3&s=150">
        </br>
        Kir Belevich</a>
      </td>
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
        <a href="https://github.com/mattlewis92">
          <img width="150" height="150" src="https://github.com/mattlewis92.png?v=3&s=150">
          </br>
          Matt Lewis
        </a>
      </td>
    </tr>
  <tbody>
</table>

[npm]: https://img.shields.io/npm/v/istanbul-instrumenter-loader.svg
[npm-url]: https://npmjs.com/package/istanbul-instrumenter-loader
[node]: https://img.shields.io/node/v/istanbul-instrumenter-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/istanbul-instrumenter-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/istanbul-instrumenter-loader
[tests]: http://img.shields.io/travis/webpack-contrib/istanbul-instrumenter-loader.svg
[tests-url]: https://travis-ci.org/webpack-contrib/istanbul-instrumenter-loader
[cover]: https://codecov.io/gh/webpack-contrib/istanbul-instrumenter-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/istanbul-instrumenter-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack

# jshint-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



处理 JSHint 模块的 webpack loader。
在构建时(build-time)，对 bundle 中的 JavaScript 文件，执行 [JSHint](http://jshint.com/) 检查。

## 要求

此模块需要 Node v6.9.0+ 和 webpack v4.0.0+。

## 起步

你需要预先安装 `jshint-loader`：

```console
$ npm install jshint-loader --save-dev
```

然后，在 `webpack` 配置中添加 loader。例如：

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.js/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          {
            loader: `jshint-loader`,
            options: {...options}
          }
        ]
      }
    ]
  }
}
```


然后，通过你偏爱的方式去运行 `webpack`。

## 选项

除了下面列出的自定义 loader 选项外，
所有有效的 JSHint 选项在此对象中都有效：

delete options.;
delete options.;
delete options.;

### `emitErrors`

类型：`Boolean`
默认值：`undefined`

命令 loader，将所有 JSHint 警告和错误，都作为 webpack 错误触发。

### `failOnHint`

类型：`Boolean`
默认值：`undefined`

命令 loader，在所有 JSHint 发生警告和错误时，
都产生 webpack 构建失败。

### `reporter`

类型：`Function`
默认值：`undefined`

此函数用于对 JSHint 输出进行格式化，也可以发出警告和错误。

## 自定义报告函数(custom reporter)

默认情况下，`jshint-loader` 自带一个默认报告函数。

然而，如果你想设置自定义的报告函数，
向 `jshint` 选项的 `reporter` 属性传递一个函数（查看*上面*用法）

报告函数执行时，会传入一个 JSHint 产生的，
由错误/警告构成的数组，结构如下：
```js
[
{
    id:        [字符串，通常是 '(error)'],
    code:      [字符串，错误/警告编码(error/warning code)],
    reason:    [字符串，错误/警告消息(error/warning message)],
    evidence:  [字符串，产生此错误的那段代码]
    line:      [数字]
    character: [数字]
    scope:     [字符串，消息作用域；
                通常是 '(main)' 除非代码被解析过(eval)]

    [+ 还有一些旧有字段，不必关心。]
},
// ...
// 更多的错误/警告
]
```

报告函数会将 loader 的上下文信息保存在 `this` 后执行。你可以使用 `this.emitWarning(...)` 或者 `this.emitError(...)` 方法，手动触发信息的报告。请参考[关于 loader 上下文的 webpack 文档](https://webpack.docschina.org/api/loaders/#the-loader-context).

_注意：JSHint reporter **并不兼容** JSHint-loader！
这是因为，事实上 reporter 的输入，
只能处理一个文件，而不能处理多个文件。
以这种方式报告的错误，不同于用于 JSHint 的 [传统 reporter](http://www.jshint.com/docs/reporters/) 报告的错误，
这是因为，会对每个资源文件执行 loader plugin（也就是 JSHint-loader），
因此 reporter 函数也会被每个文件执行。_

webpack CLI 中的输出通常是：
```js
...
WARNING in ./path/to/file.js
<reporter output>
...
```
`

## 贡献

如果你从未阅读过我们的贡献指南，请在上面花点时间。

#### [贡献指南](https://raw.githubusercontent.com/webpack-contrib/jshint-loader/master/.github/CONTRIBUTING)

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/jshint-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/jshint-loader.svg
[npm-url]: https://npmjs.com/package/jshint-loader

[node]: https://img.shields.io/node/v/jshint-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/jshint-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/jshint-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/jshint-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/jshint-loader

[cover]: https://codecov.io/gh/webpack-contrib/jshint-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/jshint-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# json-loader

## 安装

```bash
npm install --save-dev json-loader
```

> ⚠️ **注意：由于 `webpack >= v2.0.0` 默认支持导入 JSON 文件。如果你使用自定义文件扩展名，你可能仍然需要使用此 loader。See the [v1.0.0 -> v2.0.0 Migration Guide](https://webpack.docschina.org/guides/migrating/#json-loader-is-not-required-anymore) for more information**

## 用法

##

```js
const json = require('json-loader!./file.json');
```

### `通过配置`（推荐）

```js
const json = require('./file.json');
```

**webpack.config.js**
```js
module.exports = {
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
}
```

## 维护人员

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150" src="https://avatars.githubusercontent.com/sokra?v=3">
        </br>
        <a href="https://github.com/sokra">Tobias Koppers</a>
      </td>
    </tr>
  </tbody>
</table>


[npm]: https://img.shields.io/npm/v/json-loader.svg
[npm-url]: https://npmjs.com/package/json-loader

[node]: https://img.shields.io/node/v/json-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack/json-loader.svg
[deps-url]: https://david-dm.org/webpack/json-loader

[tests]: http://img.shields.io/travis/webpack/json-loader.svg
[tests-url]: https://travis-ci.org/webpack/json-loader

[cover]: https://coveralls.io/repos/github/webpack/json-loader/badge.svg
[cover-url]: https://coveralls.io/github/webpack/json-loader

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack

# json5-loader

用于将 <a href="http://json5.org/"><code>json5</code></a> 文件解析为 JavaScript 对象


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



A webpack loader for parsing [json5](https://json5.org/) files into JavaScript objects.

## Getting Started

To begin, you'll need to install `json5-loader`:

```sh
$ npm install json5-loader --save-dev
```

你可以通过以下用法使用这个 loader

- 在 webpack 配置里的 `module.loaders` 对象中配置 `json5-loader`；
- 直接在 require 语句中使用 `json5-loader!` 前缀。

假设我们有下面这个 `json5` 文件

```js
// appData.json5
{
  env: 'production',
  passwordStrength: 'strong',
}
```

### Usage with preconfigured loader

**webpack.config.js**

```js
// webpack.config.js
module.exports = {
  entry: "./index.js",
  output: {
    /* ... */
  },
  module: {
    loaders: [
      {
        // 使所有以 .json5 结尾的文件使用 `json5-loader`
        test: /\.json5$/,
        loader: "json5-loader"
      }
    ]
  }
};
```

```js
// index.js
var appConfig = require("./appData.json5");
// 或者 ES6 语法
// import appConfig from './appData.json5'

console.log(appConfig.env); // 'production'
```

#### require 语句使用 loader 前缀的用法

```js
var appConfig = require("json5-loader!./appData.json5");
// 返回的是 json 解析过的对象

console.log(appConfig.env); // 'production'
```

如果需要在 Node.js 中使用，不要忘记兼容(polyfill) require。更多参考 webpack 文档。

## 贡献

Please take a moment to read our contributing guidelines if you haven't yet done so.

[贡献指南](https://raw.githubusercontent.com/webpack-contrib/json5-loader/master/.github/CONTRIBUTING.md)

## License

[MIT](https://raw.githubusercontent.com/webpack-contrib/json5-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/json5-loader.svg
[npm-url]: https://npmjs.com/package/json5-loader
[node]: https://img.shields.io/node/v/json5-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/json5-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/json5-loader
[tests]: http://img.shields.io/travis/webpack-contrib/json5-loader.svg
[tests-url]: https://travis-ci.org/webpack-contrib/json5-loader
[cover]: https://codecov.io/gh/webpack-contrib/json5-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/json5-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=json5-loader
[size-url]: https://packagephobia.now.sh/result?p=json5-loader

# less-loader

<p align="center">Compiles Less to CSS.</p>

使用 [css-loader](https://v4.webpack.docschina.org/loaders/css-loader/) 或 [raw-loader](https://v4.webpack.docschina.org/loaders/raw-loader/) 将其转换为 JS 模块，然后使用 [ExtractTextPlugin](https://v4.webpack.docschina.org/plugins/extract-text-webpack-plugin/) 将其提取到单独的文件中。

此模块需要 Node v6.9.0+ 和 webpack v4.0.0+。

## 起步

less-loader 的 [`peerDependency`](https://docs.npmjs.com/files/package.json#peerdependencies)(同版本依赖) 是 [less](https://github.com/less/less.js) 。因此，可以实现精准版本控制。

```console
$ npm install less-loader --save-dev
```

然后，修改 `webpack.config.js`：

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.less$/,
      loader: 'less-loader' // 将 Less 编译为 CSS
    }]
  }
};
```

可以通过 [loader options](https://webpack.docschina.org/configuration/module/#rule-options-rule-query) 将任何 Less 特定选项传递给 less-loader。请参阅 [Less documentation](http://lesscss.org/usage/#command-line-usage-options) 文档以查看 dash-case(连接符命名) 的所有可用选项。由于我们将这些选项以编程方式传递给 Less，所以您需要在这里使用 camelCase(驼峰命名) 传递这些选项:

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: 'style-loader' // creates style nodes from JS strings
      }, {
        loader: 'css-loader' // translates CSS into CommonJS
      }, {
        loader: 'less-loader' // compiles Less to CSS
      }]
    }]
  }
};
```

You can pass any Less specific options to the `less-loader` via [loader options](https://webpack.js.org/configuration/module/#rule-options-rule-query).
See the [Less documentation](http://lesscss.org/usage/#command-line-usage-options)
for all available options in dash-case. Since we're passing these options to
Less programmatically, you need to pass them in camelCase here:

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'less-loader', options: {
          strictMath: true,
          noIeCompat: true
        }
      }]
    }]
  }
};
```

Unfortunately, Less doesn't map all options 1-by-1 to camelCase. When in doubt,
[check their executable](https://github.com/less/less.js/blob/3.x/bin/lessc)
and search for the dash-case option.

### In production

Usually, it's recommended to extract the style sheets into a dedicated file in
production using the
[MiniCssExtractPlugin](https://v4.webpack.docschina.org/plugins/mini-css-extract-plugin/).
This way your styles are not dependent on JavaScript.

### 引入

Starting with `less-loader` 4, you can now choose between Less' builtin resolver
and webpack's resolver. By default, webpack's resolver is used.

#### webpack resolver

webpack 提供了一种
[解析文件的高级机制](https://webpack.js.org/configuration/resolve/)。
`less-loader` 应用一个 Less 插件，并且将所有查询参数传递给 webpack resolver。
所以，你可以从 `node_modules` 导入你的 less 模块。
只要添加一个 `~` 前缀，告诉 webpack 去查询 [`模块`](https://webpack.js.org/configuration/resolve/#resolve-modules)。
从 less-loader 4 开始，您现在可以选择 Less 的内置解析器和 webpackt 的解析器。默认情况下，使用 webpackt 的解析器。


```css
@import '~bootstrap/less/bootstrap';
```

重要的是只使用 `~` 前缀，因为 `~/` 会解析为主目录。webpack 需要区分 `bootstrap` 和 `~bootstrap`，因为 CSS 和 Less 文件没有用于导入相对文件的特殊语法。`@import "file"` 与 `@import "./file";` 写法相同

##### Non-Less imports

使用 webpack resolver，你可以引入任何文件类型。
你只需要一个导出有效的 Less 代码的 loader。
通常，你还需要设置 `issuer` 条件，
以确保此规则仅适用于 Less 文件的导入：

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.js$/,
      issuer: /\.less$/,
      use: [{
        loader: 'js-to-less-loader'
      }]
    }]
  }
};
```

#### Less 解析器

如果明确声明了 `paths` 选项，less-loader 则不会使用 webpack 的解析器。在本地文件夹中无法解析的模块将在给定的内容中搜索 `paths`。这是 Less 的默认行为。`paths` 应该是一个拥有绝对路径的数组：

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'less-loader', options: {
          paths: [
            path.resolve(__dirname, 'node_modules')
          ]
        }
      }]
    }]
  }
};
```

在这种情况下，所有的 webpack 功能，如导入 non-Less 文件或别名，都将失效。

### 插件

想要使用 [插件](http://lesscss.org/usage/#plugins)，
只需像下面这样简单设置 `plugins` 选项：

```js
// webpack.config.js
const CleanCSSPlugin = require('less-plugin-clean-css');

module.exports = {
  ...
    {
      loader: 'less-loader', options: {
        plugins: [
          new CleanCSSPlugin({ advanced: true })
        ]
      }
    }]
  ...
};
```

### Extracting style sheets

将 CSS 与 webpack 捆绑在一起好处多多，如在开发环境中使用哈希 url 或 [hot module replacement](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html) 引用图像和字体。另一方面，在生产环境中，根据 JS 的执行情况应用样式表并非最佳选择。因为渲染可能会延迟，甚至导致 [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) -- Flash of unstyled content (文档样式短暂失效)。因此，在最终的生产构建中，最好将它们作为单独的文件保存。

有两种方式可以从 bundle 中提取样式表：

- [extract-loader](https://github.com/peerigon/extract-loader)（简单，但仅用于 css-loader 的输出）
- [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)（复杂，但适用于所有使用情况）

### Source maps

想要启用 CSS 的 source map，你需要将 `sourceMap` 选项传递给 *`less-loader`* 和 *`css-loader`*。所以你的 `webpack.config.js' 应该是这样：

```javascript
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader', options: {
          sourceMap: true
        }
      }, {
        loader: 'less-loader', options: {
          sourceMap: true
        }
      }]
    }]
  }
};
```

Also checkout the [sourceMaps example](https://github.com/webpack-contrib/less-loader/tree/master/examples/sourceMaps).

如果你要在 Chrome 中编辑原始 Less 文件，
[这里有一个很好的博客文章](https://medium.com/@toolmantim/getting-started-with-css-sourcemaps-and-in-browser-sass-editing-b4daab987fb0)。
此博客文章是关于 Sass 的，但它也适用于 Less。

### CSS modules gotcha

语句中有关 Less 和 [CSS modules](https://github.com/css-modules/css-modules) 的相关文件路径存在已知问题 `url(...)`。[请参阅此问题以获取解释](https://github.com/webpack-contrib/less-loader/issues/109#issuecomment-253797335)。

如果你从未阅读过我们的贡献指南，
请在上面花点时间。

#### [贡献指南](https://raw.githubusercontent.com/webpack-contrib/less-loader/master/.github/CONTRIBUTING.md)

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/less-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/less-loader.svg
[npm-url]: https://npmjs.com/package/less-loader
[node]: https://img.shields.io/node/v/less-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/less-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/less-loader
[travis]: http://img.shields.io/travis/webpack-contrib/less-loader.svg
[travis-url]: https://travis-ci.org/webpack-contrib/less-loader
[appveyor-url]: https://ci.appveyor.com/project/jhnns/less-loader/branch/master
[appveyor]: https://ci.appveyor.com/api/projects/status/github/webpack-contrib/less-loader?svg=true
[coverage]: https://img.shields.io/codecov/c/github/webpack-contrib/less-loader.svg
[coverage-url]: https://codecov.io/gh/webpack-contrib/less-loader
[chat]: https://badges.gitter.im/webpack-contrib/webpack.svg
[chat-url]: https://gitter.im/webpack-contrib/webpack

# mocha-loader

Allows <a href="http://mochajs.org/">Mocha</a> tests to be loaded and run via webpack

## 安装

```bash
npm i -D mocha-loader
```

## 用法

##

```bash
webpack --module-bind 'mocha-loader!./test'
```

### 要求

```js
import test from 'mocha-loader!./test'
```

### 配置（推荐）

```js
import test from './test'
```

**`webpack.config.js`**
```js
module.exports = {
  entry: './entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /test\.js$/,
        use: 'mocha-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

## 选项

>

> **None**

>

## 示例

### 基本

**`module.js`**
```js
module.exports = true
```

**`test.js`**
```js
describe('Test', () => {
  it('should succeed', (done) => {
    setTimeout(done, 1000)
  })

  it('should fail', () => {
    setTimeout(() => {
      throw new Error('Failed')
    }, 1000)
  })

  it('should randomly fail', () => {
    if (require('./module')) {
      throw new Error('Randomly failed')
    }
  })
})
```


[npm]: https://img.shields.io/npm/v/mocha-loader.svg
[npm-url]: https://npmjs.com/package/mocha-loader

[node]: https://img.shields.io/node/v/mocha-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/mocha-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/mocha-loader

[test]: 	https://img.shields.io/circleci/project/github/webpack-contrib/mocha-loader.svg
[test-url]: https://circleci.com/gh/webpack-contrib/mocha-loader

[cover]: https://codecov.io/gh/webpack-contrib/mocha-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/mocha-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# multi-loader

multi-loader 需要多次加载模块，每次加载不同的 loader。就像在多入口点一样，导出最后一项的出口。


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



用于分离模块和组合使用多个 loader 的 `webpack` loader。
这个 loader 会多次引用一个模块，每次不同的 loader 加载这个模块，
就像下面配置中定义的那样。

_注意：在多入口，最后一项的 exports 会被导出。_

## 要求

此模块需要 Node v6.9.0+ 和 webpack v4.0.0+。

## 起步

你需要预先安装 `multi-loader`：

```console
$ npm install multi-loader --save-dev
```

然后，在 `webpack` 配置中添加 loader。例如：

```javascript
var multi = require("multi-loader");
{
  module: {
    loaders: [
      {
        test: /\.css$/,
        // Add CSS to the DOM
        // and
        // Return the raw content
        loader: multi(
          "style-loader!css-loader!autoprefixer-loader",
          "raw-loader"
        )
      }
    ];
  }
}
```

然后，通过你偏爱的方式去运行 `webpack`。

## License

[npm]: https://img.shields.io/npm/v/multi-loader.svg
[npm-url]: https://npmjs.com/package/multi-loader
[deps]: https://david-dm.org/webpack-contrib/multi-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/multi-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# node-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



A [Node.js add-ons](https://nodejs.org/dist/latest/docs/api/addons.html) loader
module for enhanced-require. Executes add-ons in
[enhanced-require](https://github.com/webpack/enhanced-require).

## Requirements

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## Getting Started

To begin, you'll need to install `node-loader`:

```console
$ npm install node-loader --save-dev
```

Then add the loader to your `webpack` config. For example:

```js
import node from 'file.node';
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  }
}
```

Or on the command-line:

```console
$ webpack --module-bind 'node=node-loader'
```

### Inline

**In your application**
```js
import node from 'node-loader!./file.node';
```

And run `webpack` via your preferred method.

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/node-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/node-loader.svg
[npm-url]: https://npmjs.com/package/node-loader

[node]: https://img.shields.io/node/v/node-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/node-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/node-loader

[tests]: https://circleci.com/gh/webpack-contrib/node-loader.svg?style=svg
[tests-url]: https://circleci.com/gh/webpack-contrib/node-loader

[cover]: https://codecov.io/gh/webpack-contrib/node-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/node-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# null-loader

返回空模块

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



返回一个空模块的 webpack loader。

此 loader 的一个用途是，使依赖项导入的模块静音。
例如，项目依赖于一个 ES6 库，会导入不需要的 polyfill，
因此删除它将不会导致功能损失。

## 要求

null-loader 的一个用途是使依赖项导入的模块静音。例如，当项目依赖于 ES6 库而并不需要 polyfill，因此删除它将不会影响任何功能。测试 polyfill 的路径，它不会包含在依赖包中：

```js
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: path.resolve(__dirname, "node_modules/library/polyfill.js"),
        use: "null-loader"
      }
    ]
  }
};
```

然后，通过你偏爱的方式去运行 `webpack`。

## 贡献人员

如果你从未阅读过我们的贡献指南，请在上面花点时间。

#### [贡献指南](https://raw.githubusercontent.com/webpack-contrib/null-loader/master/.github/CONTRIBUTING)

[npm]: https://img.shields.io/npm/v/null-loader.svg
[npm-url]: https://npmjs.com/package/null-loader
[deps]: https://david-dm.org/webpack-contrib/null-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/null-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# polymer-webpack-loader

[![npm version](https://badge.fury.io/js/polymer-webpack-loader.svg)](https://badge.fury.io/js/polymer-webpack-loader)
[![build status](https://travis-ci.org/webpack-contrib/polymer-webpack-loader.svg?branch=master)](https://travis-ci.org/webpack-contrib/polymer-webpack-loader)

> [Polymer](https://www.polymer-project.org/) component loader for [webpack](https://webpack.docschina.org/).

polymer-webpack-loader 允许编写混合的 HTML, CSS 和 JavaScript Polymer 元素，并仍然使用完整的 webpack 生态系统，包括模块捆绑和代码拆分。

<img width="1024" alt="" src="https://user-images.githubusercontent.com/1066253/28131928-3b257288-66f0-11e7-8295-cb968cefb040.png">

可以转换组件:

- `<link rel="import" href="./my-other-element.html">` -> `import './my-other-element.html';`
- `<dom-module>` 成为在运行时注册的字符串
- `<script src="./other-script.js"></script>` -> `import './other-script.js';`
- `<script>/* contents */</script>` -> `/* contents */`

这意味着什么呢?

任何不是**外部链接**且不以 `~`, `/`, `./` 或一系列 `../` 开头的 `<link>` "href" or `<script>` "src", 都会在其开头添加一个 `./`。为了防止这种变化，使用下面的忽略链接选项。

## Path Translations

| `tag`                                                     | `import`                                |
| --------------------------------------------------------- | --------------------------------------- |
| `<link rel="import" href="path/to/some-element.html">`    | `import "./path/to/some-element.html"`  |
| `<link rel="import" href="/path/to/some-element.html">`   | `import "/path/to/some-element.html"`   |
| `<link rel="import" href="../path/to/some-element.html">` | `import "../path/to/some-element.html"` |
| `<link rel="import" href="./path/to/some-element.html">`  | `import "./path/to/some-element.html"`  |
| `<link rel="import" href="~path/to/some-element.html">`   | `import "~path/to/some-element.html"`   |

## Configuring the Loader

```javascript
{
  test: /\.html$/,
  include: Condition(s) (optional),
  exclude: Condition(s) (optional),
  options: {
    ignoreLinks: Condition(s) (optional),
    ignorePathReWrite: Condition(s) (optional),
    processStyleLinks: Boolean (optional),
    htmlLoader: Object (optional)
  },
  loader: 'polymer-webpack-loader'
},
```

### include: Condition(s)

请参阅 webpack 文档中的 [Rule.include]和 [Condition]。与 include 匹配的路径将由 polymer-webpack-loader 处理。警告：如果此属性存在，polymer-webpack-loader 将只处理符合给定条件的文件。如果你的组件有一个 `<link>` 指向另一个组件（例如在另一个目录中），那么这个 include 条件也**必须**匹配该目录。

[rule.include]: https://webpack.docschina.org/configuration/module/#rule-include
[condition]: https://webpack.docschina.org/configuration/module/#condition

### exclude: Condition(s)

请参阅 webpack 文档中的 [Rule.exclude] 和 [Condition]。与 exclude 匹配的路径将被 polymer-webpack-loader 忽略。注：通过 `<link>` 导入的文件将不会被排除。请查看 `Options.ignoreLinks`。

[rule.exclude]: https://webpack.docschina.org/configuration/module/#rule-exclude

### 选项

#### ignoreLinks: Condition(s)

如果 `<link>` 的指向符合 webpack 的 [Condition]，将不会转换为 `import`。

#### ignorePathReWrite: Condition(s)

如果 `<link>` 的路径匹配 webpack 中的 [Condition]，那么在转换为 `import` 时不会发生改变。这对于遵守别名规则，loader 句法（例如 `markup-inline-loader!./my-element.html`）或模块路径都有用处。

#### processStyleLinks Boolean

设置为 true 时，位于 dom 模块内部的 `<link import="css" href="...">` 或者 `<link rel="stylesheet" href="...">` 将被重写为 `<style>require('...')</style>`。这将允许文件由 webpack 配置中设置的 loader 来处理它们的文件类型。

1. 任何在 `<dom-module>` 中但没有包含在 `<template>` 中的 `<link>` 都会被添加到 `<template>` 标签中。
2. 只有当 `<link>` 的 href 是相对路径时，loader 才会执行替换。任何以 `http`, `https` 或 `//` 开头的链接都不会被替换。

```html
<dom-module>
  <link rel="stylesheet" href="file1.css" />
  <template>
    <link rel="stylesheet" href="file2.css" />
  </template>
</dom-module>

会生成如下代码

<dom-module>
  <template>
    <style>
      require('file1.css')
    </style>
    <style>
      require('file2.css')
    </style>
  </template>
</dom-module>
```

#### htmlLoader: Object

传递给 html-loader 的选项，请参阅 [html-loader](https://v4.webpack.docschina.org/loaders/html-loader/)。

### Use with Babel (or other JS transpilers)

如需转译 `<script>` 块的内容，可以参考 [chain an additional loader](https://webpack.docschina.org/configuration/module/#rule-use)。

```js
module: {
  loaders: [
    {
      test: /\.html$/,
      use: [
        // Chained loaders are applied last to first
        { loader: "babel-loader" },
        { loader: "polymer-webpack-loader" }
      ]
    }
  ];
}

// alternative syntax

module: {
  loaders: [
    {
      test: /\.html$/,
      // Chained loaders are applied right to left
      loader: "babel-loader!polymer-webpack-loader"
    }
  ];
}
```

### Use of HtmlWebpackPlugin

出现 polymer-webpack-loader 冲突时，该如何配置 HtmlWebpackPlugin，请看示例：

```javascript
{
  test: /\.html$/,
  loader: 'html-loader',
  include: [
    path.resolve(__dirname, './index.html'),
  ],
},
{
  test: /\.html$/,
  loader: 'polymer-webpack-loader'
}
```

根据 html-loader 使用的进程，将 index.html 文件暴露给 polymer-webpack-loader。这种情况需要从 polymer-webpack-loader 中排除 html 文件，或者寻找其他方法来避免冲突。请参阅：[html-webpack-plugin 模板选项](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md)

## Shimming（匀场模块）

并非所有聚合物元素都要被编写为模块才能执行，也并非所有聚合物元素需要更改才能使用 webpack。最常见的问题是模块不在全局范围内执行。变量，函数和类将不再是全局的，除非它们被声明为全局对象 (window) 上的属性。

```js
class MyElement {} // I'm not global anymore
window.myElement = MyElement; // Now I'm global again
```

- Use the [exports-loader](https://webpack.docschina.org/guides/shimming/#exports-loader) to
  add a module export to components which expect a symbol to be global.
- Use the [imports-loader](https://webpack.docschina.org/guides/shimming/#imports-loader) when a script
  expects the `this` keyword to reference `window`.
- Use the [ProvidePlugin](https://webpack.docschina.org/guides/shimming/#provideplugin) to add a module
  import statement when a script expects a variable to be globally defined (but is now a module export).
- Use the [NormalModuleReplacementPlugin](https://webpack.docschina.org/plugins/normal-module-replacement-plugin/)
  to have webpack swap a module-compliant version for a script.

You may need to apply multiple shimming techniques to the same component.

对于外部库代码，webpack 提供 [匀场选项 shimming options](https://webpack.docschina.org/guides/shimming/)。

使用 exports-loader 将模块导出添加到期望符号为全局的组件。
脚本需要 this 引用关键字时使用 imports-loader window。
当脚本需要全局定义变量（但现在是模块导出）时，使用 ProvidePlugin 添加模块导入语句。
使用 NormalModuleReplacementPlugin 让 webpack 交换脚本的模块兼容版本。
您可能需要将多种匀场技术应用于相同的组件。

## Boostrapping Your Application

The webcomponent polyfills must be added in a specific order. If you do not delay loading the main bundle with your components, you will see the following exceptions in the browser console:

```
Uncaught TypeError: Failed to construct 'HTMLElement': Please use the 'new' operator, this DOM object constructor cannot be called as a function.
```

Reference the [demo html file](https://github.com/webpack-contrib/polymer-webpack-loader/blob/master/demo/src/index.ejs)
for the proper loading sequence.

## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/bryandcoulter">
          <img width="150" height="150" src="https://avatars.githubusercontent.com/u/18359726?v=3">
          </br>
          Bryan Coulter
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/ChadKillingsworth">
          <img width="150" height="150" src="https://avatars.githubusercontent.com/u/1247639?v=3">
          </br>
          Chad Killingsworth
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/robdodson">
          <img width="150" height="150" src="https://avatars.githubusercontent.com/u/1066253?v=3">
          </br>
          Rob Dodson
        </a>
      </td>
    </tr>
  <tbody>
</table>

# postcss-loader

  <p>用于使用 <a href="http://postcss.org/">PostCSS</a> 处理CSS的 <a href="http://webpack.js.org/">webpack</a> Loader</p>
</div>

## Install

```bash
npm i -D postcss-loader
```

## Usage

##

**`postcss.config.js`**
```js
module.exports = {
  parser: 'sugarss',
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {},
    'cssnano': {}
  }
}
```

您可以在[此处](https://v4.webpack.docschina.org(https://github.com/michael-ciniawsky/postcss-load-config))阅读有关常见 PostCSS 配置的详细信息。

### `Config Cascade`

您可以在不同的目录中使用不同的 `postcss.config.js` 文件。webpack 会从 `path.dirname(file)` 开始，并向上遍历文件树，直至找到配置文件。

```
|– components
| |– component
| | |– index.js
| | |– index.png
| | |– style.css (1)
| | |– postcss.config.js (1)
| |– component
| | |– index.js
| | |– image.png
| | |– style.css (2)
|
|– postcss.config.js (1 && 2 (recommended))
|– webpack.config.js
|
|– package.json
```

在配置 `postcss.config.js` 后，需要将 `postcss-loader` 添加到 `webpack.config.js` 中。 您可以单独使用它，也可以与 `css-loader` 一起使用（推荐）。在 `css-loader` 和 `style-loader` **之后**使用它，但如果使用其它预处理器 loader，例如 `sass|less|stylus-loader`，需要将 `postcss-loader` 放在其**之前**。

**`webpack.config.js`**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'postcss-loader' ]
      }
    ]
  }
}
```

> ⚠️ 当单独使用 `postcss-loader` （没有使用 `css-loader` ）时，不要在你的CSS中使用 `@import`，因为这会导致 bundle 文件非常臃肿

**`webpack.config.js` (recommended)**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }
    ]
  }
}
```

## Options

| 名称                       | 类型                | 默认值      | 描述                                     |
| :------------------------: | :-----------------: | :---------: | :--------------------------------------- |
| [`exec`](https://v4.webpack.docschina.org#exec)            | `{Boolean}`         | `undefined` | 在 `CSS-in-JS` 中启用 PostCSS 解析器支持 |
| [`parser`](https://v4.webpack.docschina.org#syntaxes)      | `{String\|Object}`  | `undefined` | 配置 PostCSS 解析器                      |
| [`syntax`](https://v4.webpack.docschina.org#syntaxes)      | `{String\|Object}`  | `undefined` | 配置 PostCSS 语法                        |
| [`stringifier`](https://v4.webpack.docschina.org#syntaxes) | `{String\|Object}`  | `undefined` | 配置 PostCSS Stringifier                 |
| [`config`](https://v4.webpack.docschina.org#config)        | `{Object}`          | `undefined` | 配置 `postcss.config.js` 路径 && `ctx`   |
| [`plugins`](https://v4.webpack.docschina.org#plugins)      | `{Array\|Function}` | `[]`        | 配置 PostCSS 插件                        |
| [`sourceMap`](https://v4.webpack.docschina.org#sourceMap)  | `{String\|Boolean}` | `false`     | 启用 Source Maps                         |

### `Exec`

如果你没有使用 [`postcss-js`][postcss-js] 解析器解析JS样式，需添加 `exec` 选项。

**`webpack.config.js`**
```js
{
  test: /\.style.js$/,
  use: [
    'style-loader',
    { loader: 'css-loader', options: { importLoaders: 1 } },
    { loader: 'postcss-loader', options: { parser: 'sugarss', exec: true } }
  ]
}
```

### `Config`

| 名称                  | 类型       | 默认值      | 描述                       |
| :-------------------: | :--------: | :---------: | :------------------------- |
| [`path`](https://v4.webpack.docschina.org#path)       | `{String}` | `undefined` | `postcss.config.js` 路径   |
| [`context`](https://v4.webpack.docschina.org#context) | `{Object}` | `undefined` | `postcss.config.js` 上下文 |

#### `Path`

您可以使用 `config.path` 选项手动指定配置文件（`postcss.config.js`）的路径。如果将配置存放在单独的 `./config || ./.config` 文件夹中，您需要配置此选项。

> ⚠️ 否则，**不需要**也**不**推荐配置此选项

> ⚠️  Note that you **can't** use a **filename** other than the [supported config formats] (e.g `.postcssrc.js`, `postcss.config.js`), this option only allows you to manually specify the **directory** where config lookup should **start** from

**`webpack.config.js`**
```js
{
  loader: 'postcss-loader',
  options: {
    config: {
      path: 'path/to/.config/' ✅
      path: 'path/to/.config/css.config.js' ❌
    }
  }
}
```

[supported config formats]: https://github.com/michael-ciniawsky/postcss-load-config#usage

#### `Context (ctx)`

| 名称      | 类型       | 默认值                | 描述                             |
| :-------: | :--------: | :-------------------: | :------------------------------- |
| `env`     | `{String}` | `'development'`       | `process.env.NODE_ENV`           |
| `file`    | `{Object}` | `loader.resourcePath` | `extname`, `dirname`, `basename` |
| `options` | `{Object}` | `{}`                  | 选项                             |

`postcss-loader` 将上下文 `ctx` 暴露给配置文件，使你的 `postcss.config.js` 动态化，所以可以使用这一选项来实现一些神奇的功能 ✨

**`postcss.config.js`**
```js
module.exports = ({ file, options, env }) => ({
  parser: file.extname === '.sss' ? 'sugarss' : false,
  plugins: {
    'postcss-import': { root: file.dirname },
    'postcss-preset-env': options['postcss-preset-env'] ? options['postcss-preset-env'] : false,
    'cssnano': env === 'production' ? options.cssnano : false
  }
})
```

**`webpack.config.js`**
```js
{
  loader: 'postcss-loader',
  options: {
    config: {
      ctx: {
        'postcss-preset-env': {...options},
        cssnano: {...options},
      }
    }
  }
}
```

### `Plugins`

**`webpack.config.js`**
```js
{
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: (loader) => [
      require('postcss-import')({ root: loader.resourcePath }),
      require('postcss-preset-env')(),
      require('cssnano')()
    ]
  }
}
```

> ⚠️ 当使用 `{Function}/require` 时，需要在 `options` 中配置一个标识符（`ident`）（复杂选项）。`ident` 可以自由命名，只要它是唯一的。建议命名为（`ident：'postcss'`）

### `Syntaxes`

| 名称                          | 类型                 | 默认值      | 描述                       |
| :---------------------------: | :------------------: | :---------: | :------------------------- |
| [`parser`](https://v4.webpack.docschina.org#parser)           | `{String\|Function}` | `undefined` | 自定义 PostCSS 解析器      |
| [`syntax`](https://v4.webpack.docschina.org#syntax)           | `{String\|Function}` | `undefined` | 自定义 PostCSS 语法        |
| [`stringifier`](https://v4.webpack.docschina.org#stringifier) | `{String\|Function}` | `undefined` | 自定义 PostCSS Stringifier |

#### `Parser`

**`webpack.config.js`**
```js
{
  test: /\.sss$/,
  use: [
    ...,
    { loader: 'postcss-loader', options: { parser: 'sugarss' } }
  ]
}
```

#### `Syntax`

**`webpack.config.js`**
```js
{
  test: /\.css$/,
  use: [
    ...,
    { loader: 'postcss-loader', options: { syntax: 'sugarss' } }
  ]
}
```

#### `Stringifier`

**`webpack.config.js`**
```js
{
  test: /\.css$/,
  use: [
    ...,
    { loader: 'postcss-loader', options: { stringifier: 'midas' } }
  ]
}
```

### `SourceMap`

启用 source map 支持，`postcss-loader` 将使用之前其他 loader 生成的 source map 并相应地更新，如果在 `postcss-loader` 之前没有应用 loader，则 `postcss-loader` 将为您生成 source map。

> :警告：如果之前使用了像 `sass-loader` 之类的 loader 并且设置了 `sourceMap` 选项，但是 `postcss-loader` 中的 `sourceMap` 选项被省略，之前的 source map 将被 `postcss-loader` **完全**丢弃。

**webpack.config.js**
```js
{
  test: /\.css/,
  use: [
    { loader: 'style-loader', options: { sourceMap: true } },
    { loader: 'css-loader', options: { sourceMap: true } },
    { loader: 'postcss-loader', options: { sourceMap: true } },
    { loader: 'sass-loader', options: { sourceMap: true } }
  ]
}
```

#### `'inline'`

您可以设置 `sourceMap：'inline'` 选项，将改动用注释标注，并内嵌到 CSS 文件中。

**`webpack.config.js`**
```js
{
  loader: 'postcss-loader',
  options: {
    sourceMap: 'inline'
  }
}
```

```css
.class { color: red; }

/*# sourceMappingURL=data:application/json;base64, ... */
```

## Examples

### `Stylelint`

**`webpack.config.js`**
```js
{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: [
          require('postcss-import')(),
          require('stylelint')(),
          ...,
        ]
      }
    }
  ]
}
```

### `Autoprefixing`

**`webpack.config.js`**
```js
{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: [
          require('autoprefixer')({...options}),
          ...,
        ]
      }
    }
  ]
}
```

> :warning: [`postcss-preset-env`](https://github.com/csstools/postcss-preset-env) includes [`autoprefixer`](https://github.com/postcss/autoprefixer), so adding it separately is not necessary if you already use the preset.

### `CSS Modules`

由于 `css-loader` 处理文件导入的方式，`postcss-loader` [不能直接使用][CSS 模块]。若要使用，需要配置 css-loader 的[`importLoaders`]选项。

**`webpack.config.js`**
```js
{
  test: /\.css$/,
  use: [
    'style-loader',
    { loader: 'css-loader', options: { modules: true, importLoaders: 1 } },
    'postcss-loader'
  ]
}
```

或使用[postcss-modules]代替 `css-loader`。

[`importLoaders`]: https://github.com/webpack-contrib/css-loader#importloaders
[cannot be used]: https://github.com/webpack/css-loader/issues/137
[CSS Modules]: https://github.com/webpack/css-loader#css-modules
[postcss-modules]: https://github.com/css-modules/postcss-modules

### `CSS-in-JS`

如果要处理用 JavaScript 编写的样式，请使用[postcss-js]解析器。

[postcss-js]: https://github.com/postcss/postcss-js

**`webpack.config.js`**
```js
{
  test: /\.style.js$/,
  use: [
    'style-loader',
    { loader: 'css-loader', options: { importLoaders: 2 } },
    { loader: 'postcss-loader', options: { parser: 'postcss-js' } },
    'babel-loader'
  ]
}
```

因此，您将能够以下列方式编写样式

```js
import colors from './styles/colors'

export default {
    '.menu': {
      color: colors.main,
      height: 25,
      '&_link': {
      color: 'white'
    }
  }
}
```

> :警告：如果您使用 Babel，则需要执行以下操作才能使设置生效

> 1. 在配置中添加 [babel-plugin-add-module-exports]
> 2. 每个样式模块只能有一个**default**导出

[babel-plugin-add-module-exports]: https://github.com/59naga/babel-plugin-add-module-exports

### [Extract CSS][ExtractPlugin]

[ExtractPlugin]: https://github.com/webpack-contrib/mini-css-extract-plugin

**`webpack.config.js`**
```js
const devMode = process.env.NODE_ENV !== 'production'

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css'
    })
  ]
}
```

## 维护人员

<table>
  <tbody>
    <tr>
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


[npm]: https://img.shields.io/npm/v/postcss-loader.svg
[npm-url]: https://npmjs.com/package/postcss-loader

[node]: https://img.shields.io/node/v/postcss-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/postcss/postcss-loader.svg
[deps-url]: https://david-dm.org/postcss/postcss-loader

[tests]: https://img.shields.io/travis/postcss/postcss-loader.svg
[tests-url]: https://travis-ci.org/postcss/postcss-loader

[cover]: https://coveralls.io/repos/github/postcss/postcss-loader/badge.svg
[cover-url]: https://coveralls.io/github/postcss/postcss-loader

[chat]: https://badges.gitter.im/postcss/postcss.svg
[chat-url]: https://gitter.im/postcss/postcss

# raw-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



可以将文件作为字符串导入的 webpack loader。

## 起步

你需要预先安装 `raw-loader`：

```console
$ npm install raw-loader --save-dev
```

在然后 `webpack` 配置中添加 loader：

**file.js**

```js
import txt from './file.txt';
```

**webpack.config.js**

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
    ],
  },
};
```

或者，通过命令行使用：

```console
$ webpack --module-bind 'txt=raw-loader'
```

然后，运行 `webpack`。

## 示例

### Inline

```js
import txt from 'raw-loader!./file.txt';
```

Beware, if you already define loader(s) for extension(s) in `webpack.config.js` you should use:

```js
import css from '!!raw-loader!./file.css'; // Adding `!!` to a request will disable all loaders specified in the configuration
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](https://raw.githubusercontent.com/webpack-contrib/raw-loader/master/.github/CONTRIBUTING.md)

## License

[MIT](https://raw.githubusercontent.com/webpack-contrib/raw-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/raw-loader.svg
[npm-url]: https://npmjs.com/package/raw-loader
[node]: https://img.shields.io/node/v/raw-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/raw-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/raw-loader
[tests]: https://img.shields.io/circleci/project/github/webpack-contrib/raw-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/raw-loader
[cover]: https://codecov.io/gh/webpack-contrib/raw-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/raw-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=raw-loader
[size-url]: https://packagephobia.now.sh/result?p=raw-loader

# react-proxy-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]

[![chat][chat]][chat-url]



通过将 react 组件包裹在一个代理组件中，来启用代码分离(code splitting)功能，
可以按需加载 react 组件和它的依赖。

## 要求

此模块需要 Node v6.9.0+ 和 webpack v4.0.0+。

## 起步

你需要预先安装 `react-proxy-loader`：

```console
$ npm install react-proxy-loader --save-dev
```

然后，在 `webpack` 配置中添加 loader。例如：

``` js
// 返回代理组件，并按需加载
// webpack 会为此组件和它的依赖创建一个额外的 chunk
const Component = require('react-proxy-loader!./Component');

// 返回代理组件的 mixin
// 可以在这里设置代理组件的加载中状态
const ComponentProxyMixin = require('react-proxy-loader!./Component').Mixin;

const ComponentProxy = React.createClass({
	mixins: [ComponentProxyMixin],
	renderUnavailable: function() {
		return <p>Loading...</p>;
	}
});
```

或者，在配置中指定需要代理的组件：

``` js
// webpack.config.js
module.exports = {
	module: {
		loaders: [
			/* ... */
			{
				test: [
					/component\.jsx$/, // 通过正则表达式(RegExp)匹配选择组件
					/\.async\.jsx$/, // 通过扩展名(extension)匹配选择组件
					"/abs/path/to/component.jsx" // 通过绝对路径(absolute path)匹配选择组件
				],
				loader: "react-proxy-loader"
			}
		]
	}
};
```

或者，在 `name` 查询参数中提供一个 chunk 名称：

``` js
var Component = require("react-proxy-loader?name=chunkName!./Component");
```

然后，通过你偏爱的方式去运行 `webpack`。


## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/react-proxy-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/react-proxy-loader.svg
[npm-url]: https://npmjs.com/package/react-proxy-loader

[node]: https://img.shields.io/node/v/react-proxy-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/react-proxy-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/react-proxy-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/react-proxy-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/react-proxy-loader

[cover]: https://codecov.io/gh/webpack-contrib/react-proxy-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/react-proxy-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# restyle-loader

<div align="center">

Updates style `<link>` href value with a hash to trigger a style reload

Loader new home: [restyle-loader](https://github.com/danielverejan/restyle-loader)

</div>

## 安装

```bash
npm install --save-dev restyle-loader
```

## 用法

[文档：使用 loader](https://webpack.docschina.org/loaders/)

## 示例

**webpack.config.js**

```js
{
  test: /\.css?$/,
  use: [
    {
      loader: "restyle-loader"
    },
    {
      loader: "file-loader",
      options: {
        name: "[name].css?[hash:8]"
      }
    }
  ]
}
```
hash 需要启用热模块替换(Hot Module Replacement)

**bundle.js**

```js
require("./index.css");

// 在这里打包代码...
```


**index.html**

```html

<head>
  <link rel="stylesheet" type="text/css" href="css/index.css">
</head>

```
loader 运行后就变成
```html

<head>
  <link rel="stylesheet" type="text/css" href="css/index.css?531fdfd0">
</head>

```


## 维护人员

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/">
          <img width="150" height="150" src="https://avatars2.githubusercontent.com/u/7072732?v=3&s=150">
          <br />
          <a href="https://github.com/">Daniel Verejan</a>
        </a>
      </td>

    </tr>
  <tbody>
</table>

[npm]: https://img.shields.io/npm/v/restyle-loader.svg
[npm-url]: https://npmjs.com/package/restyle-loader

[deps]: https://david-dm.org/webpack-contrib/restyle-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/restyle-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: http://img.shields.io/travis/webpack-contrib/restyle-loader.svg
[test-url]: https://travis-ci.org/webpack-contrib/restyle-loader

[cover]: https://codecov.io/gh/webpack-contrib/restyle-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/restyle-loader

# sass-loader

Loads a Sass/SCSS file and compiles it to CSS.

Use the [css-loader](https://v4.webpack.docschina.org/loaders/css-loader/) or the [raw-loader](https://v4.webpack.docschina.org/loaders/raw-loader/) to turn it into a JS module and the [mini-css-extract-plugin](https://v4.webpack.docschina.org/plugins/mini-css-extract-plugin/) to extract it into a separate file.
Looking for the webpack 1 loader? Check out the [archive/webpack-1 branch](https://github.com/webpack-contrib/sass-loader/tree/archive/webpack-1).

## 安装

```bash
npm install sass-loader node-sass webpack --save-dev
```

[webpack](https://github.com/webpack) 是 sass-loader 的 [`peerDependency`](https://docs.npmjs.com/files/package.json#peerdependencies)，
并且还需要你预先安装
[Node Sass](https://github.com/sass/node-sass) 或 [Dart Sass](https://github.com/sass/dart-sass)。
这可以控制所有依赖的版本，
并选择要使用的 Sass 实现。

[Node Sass]：https://github.com/sass/node-sass
[Dart Sass]：http://sass-lang.com/dart-sass

## 示例

通过将 [style-loader](https://github.com/webpack-contrib/style-loader) 和 [css-loader](https://github.com/webpack-contrib/css-loader) 与 sass-loader 链式调用，可以立刻将样式作用在 DOM 元素。

```bash
npm install style-loader css-loader --save-dev
```

```js
// webpack.config.js
module.exports = {
	...
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                "style-loader", // 将 JS 字符串生成为 style 节点
                "css-loader", // 将 CSS 转化成 CommonJS 模块
                "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
            ]
        }]
    }
};
```

也可以直接将选项传递给 [Node Sass][] 或 [Dart Sass][]：

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader"
      }, {
        loader: "sass-loader",
        options: {
          includePaths: ["absolute/path/a", "absolute/path/b"]
        }
      }]
    }]
  }
};
```

更多 Sass 可用选项，查看 [Node Sass 文档](https://github.com/sass/node-sass/blob/master/README.md#options) for all available Sass options.

By default the loader resolve the implementation based on your dependencies.
Just add required implementation to `package.json`
(`node-sass` or `sass` package) and install dependencies.

Example where the `sass-loader` loader uses the `sass` (`dart-sass`) implementation:

**package.json**

```json
{
   "devDependencies": {
      "sass-loader": "*",
      "sass": "*"
   }
}
```

Example where the `sass-loader` loader uses the `node-sass` implementation:

**package.json**

```json
{
   "devDependencies": {
      "sass-loader": "*",
      "node-sass": "*"
   }
}
```

Beware the situation
when `node-sass` and `sass` was installed, by default the `sass-loader`
prefers `node-sass`, to avoid this situation use the `implementation` option.

The special `implementation` option determines which implementation of Sass to
use. It takes either a [Node Sass][] or a [Dart Sass][] module. For example, to
use Dart Sass, you'd pass:

```js
// ...
    {
        loader: "sass-loader",
        options: {
            implementation: require("sass")
        }
    }
// ...
```

Note that when using Dart Sass, **synchronous compilation is twice as fast as
asynchronous compilation** by default, due to the overhead of asynchronous
callbacks. To avoid this overhead, you can use the
[`fibers`](https://www.npmjs.com/package/fibers) package to call asynchronous
importers from the synchronous code path. To enable this, pass the `Fiber` class
to the `fiber` option:

```js
// webpack.config.js
const Fiber = require('fibers');

module.exports = {
    ...
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader",
                options: {
                    implementation: require("sass"),
                    fiber: Fiber
                }
            }]
        }]
    }
};
```

##

通常，生产环境下比较推荐的做法是，使用 [mini-css-extract-plugin](https://v4.webpack.docschina.org/plugins/mini-css-extract-plugin/) 将样式表抽离成专门的单独文件。这样，样式表将不再依赖于 JavaScript：

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	...
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                // fallback to style-loader in development
                process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                "css-loader",
                "sass-loader"
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};
```

## 用法

### 导入(import)

webpack 提供一种[解析文件的高级的机制](https://webpack.docschina.org/concepts/module-resolution/)。sass-loader 使用 node-sass 的 custom importer 特性，将所有的 query 传递给 webpack 的解析引擎(resolving engine)。只要它们前面加上 `~`，告诉 webpack 它不是一个相对路径，这样就可以 import 导入 `node_modules` 目录里面的 sass 模块：

```css
@import "~bootstrap/dist/css/bootstrap";
```

重要的是，只在前面加上 `~`，因为 `~/` 会解析到主目录(home directory)。webpack 需要区分 `bootstrap` 和 `~bootstrap`，因为 CSS 和 Sass 文件没有用于导入相关文件的特殊语法。`@import "file"` 与 `@import "./file";` 这两种写法是相同的

### `url(...)` 的问题

由于 Sass/[libsass](https://github.com/sass/libsass) 并没有提供[url rewriting](https://github.com/sass/libsass/issues/532) 的功能，所以所有的链接资源都是相对输出文件(output)而言。

- 如果生成的 CSS 没有传递给 css-loader，它相对于网站的根目录。
- 如果生成的 CSS 传递给了 css-loader，则所有的 url 都相对于入口文件（例如：`main.scss`）。

第二种情况可能会带来一些问题。正常情况下我们期望相对路径的引用是相对于 `.scss` 去解析（如同在 `.css` 文件一样）。幸运的是，有2个方法可以解决这个问题：

- 将 [resolve-url-loader](https://github.com/bholloway/resolve-url-loader) 设置于 loader 链中的 sass-loader 之前，就可以重写 url。
- Library 作者一般都会提供变量，用来设置资源路径，如 [bootstrap-sass](https://github.com/twbs/bootstrap-sass) 可以通过 `$icon-font-path` 来设置。参见[this working bootstrap example](https://github.com/webpack-contrib/sass-loader/tree/master/test/bootstrapSass)。

### 提取样式表

使用 webpack 打包 CSS 有许多优点，在开发环境，可以通过 hashed urls 或 [模块热替换(HMR)](https://webpack.docschina.org/concepts/hot-module-replacement/) 引用图片和字体资源。而在线上环境，使样式依赖 JS 执行环境并不是一个好的实践。渲染会被推迟，甚至会出现 [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)，因此在最终线上环境构建时，最好还是能够将 CSS 放在单独的文件中。

从 bundle 中提取样式表，有2种可用的方法：

- [extract-loader](https://github.com/peerigon/extract-loader) （简单，专门针对 css-loader 的输出）
- [mini-css-extract-plugin](https://v4.webpack.docschina.org/plugins/mini-css-extract-plugin/) (use this, when using webpack 4 configuration. Works in all use-cases)

### Source maps

要启用 CSS source map，需要将 `sourceMap` 选项作为参数，传递给 *sass-loader* 和 *css-loader*。此时`webpack.config.js` 如下：

```javascript
module.exports = {
    ...
    devtool: "source-map", // any "source-map"-like devtool is possible
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader", options: {
                    sourceMap: true
                }
            }, {
                loader: "css-loader", options: {
                    sourceMap: true
                }
            }, {
                loader: "sass-loader", options: {
                    sourceMap: true
                }
            }]
        }]
    }
};
```

如果你要在 Chrome 中编辑原始的 Sass 文件，建议阅读[这篇不错的博客文章](https://medium.com/@toolmantim/getting-started-with-css-sourcemaps-and-in-browser-sass-editing-b4daab987fb0)。具体示例参考 [test/sourceMap](https://github.com/webpack-contrib/sass-loader/tree/master/test)。

### 环境变量

如果你要将 Sass 代码放在实际的入口文件(entry file)之前，可以设置 `data` 选项。此时 sass-loader 不会覆盖 `data` 选项，只会将它拼接在入口文件的内容之前。当 Sass 变量依赖于环境时，这一点尤其有用。

```javascript
{
    loader: "sass-loader",
    options: {
        data: "$env: " + process.env.NODE_ENV + ";"
    }
}
```

The `data` option supports `Function` notation:

```javascript
{
    loader: "sass-loader",
    options: {
        data: (loaderContext) => {
          // More information about avalaible options https://webpack.js.org/api/loaders/
          const { resourcePath, rootContext } = loaderContext;
          const relativePath = path.relative(rootContext,resourcePath);

          if (relativePath === "styles/foo.scss") {
             return "$value: 100px;"
          }

          return "$value: 200px;"
        }
    }
}
```

**注意：**由于代码注入, 会破坏整个入口文件的 source map。通常一个简单的解决方案是，多个 Sass 文件入口。

## 维护人员

<table>
    <tr>
      <td align="center">
        <a href="https://github.com/jhnns"><img width="150" height="150" src="https://avatars0.githubusercontent.com/u/781746?v=3"></a><br>
        <a href="https://github.com/jhnns">Johannes Ewald</a>
      </td>
      <td align="center">
        <a href="https://github.com/webpack-contrib"><img width="150" height="150" src="https://avatars1.githubusercontent.com/u/1243901?v=3&s=460"></a><br>
        <a href="https://github.com/webpack-contrib">Jorik Tangelder</a>
      </td>
      <td align="center">
        <a href="https://github.com/akiran"><img width="150" height="150" src="https://avatars1.githubusercontent.com/u/3403295?v=3"></a><br>
        <a href="https://github.com/akiran">Kiran</a>
      </td>
    <tr>
</table>


## License

[MIT](http://www.opensource.org/licenses/mit-license.php)

[npm]: https://img.shields.io/npm/v/sass-loader.svg
[npm-stats]: https://img.shields.io/npm/dm/sass-loader.svg
[npm-url]: https://npmjs.com/package/sass-loader

[node]: https://img.shields.io/node/v/sass-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/sass-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/sass-loader

[travis]: http://img.shields.io/travis/webpack-contrib/sass-loader.svg
[travis-url]: https://travis-ci.org/webpack-contrib/sass-loader

[appveyor-url]: https://ci.appveyor.com/project/webpack-contrib/sass-loader/branch/master
[appveyor]: https://ci.appveyor.com/api/projects/status/rqpy1vaovh20ttxs/branch/master?svg=true

[cover]: https://codecov.io/gh/webpack-contrib/sass-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/sass-loader

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack

# script-loader

## 安装

```bash
npm install --save-dev script-loader
```

## 用法

在全局上下文(global context)执行一次 JS 脚本。

> :警告: 在 node.js 中不会运行

##

```js
import exec from 'script.exec.js';
```

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.exec\.js$/,
        use: [ 'script-loader' ]
      }
    ]
  }
}
```

### 内联

```js
import exec from 'script-loader!./script.js';
```

## Options

|                    Name                     |         Type          |     Default     | Description                                 |
| :-----------------------------------------: | :-------------------: | :-------------: | :------------------------------------------ |
|        **[`sourceMap`](https://v4.webpack.docschina.org#sourcemap)**        |      `{Boolean}`      |     `false`     | Enable/Disable Sourcemaps

### `sourceMap`

Type: `Boolean`
Default: `false`

To include source maps set the `sourceMap` option.

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.script\.js$/,
        use: [
          {
            loader: 'script-loader',
            options: {
              sourceMap: true,
            },
          },
        ]
      }
    ]
  }
}
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


[npm]: https://img.shields.io/npm/v/script-loader.svg
[npm-url]: https://npmjs.com/package/script-loader

[node]: https://img.shields.io/node/v/script-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack/script-loader.svg
[deps-url]: https://david-dm.org/webpack/script-loader

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack

# source-map-loader

Extracts source maps from existing source files (from their <code>sourceMappingURL</code>).

## 安装

```bash
npm i -D source-map-loader
```

## 用法

[文档：使用 loader](https://webpack.docschina.org/concepts/#loaders)


##

``` javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]
  }
};
```

`source-map-loader` extracts existing source maps from all JavaScript entries. This includes both inline source maps as well as those linked via URL. All source map data is passed to webpack for processing as per a chosen [source map style](https://webpack.docschina.org/configuration/devtool/) specified by the `devtool` option in [webpack.config.js](https://webpack.docschina.org/configuration/).

This loader is especially useful when using 3rd-party libraries having their own source maps. If not extracted and processed into the source map of the webpack bundle, browsers may misinterpret source map data. `source-map-loader` allows webpack to maintain source map data continuity across libraries so ease of debugging is preserved.

`source-map-loader` will extract from any JavaScript file, including those in the `node_modules` directory. Be mindful in setting [include](https://webpack.docschina.org/configuration/module/#rule-include) and [exclude](https://webpack.docschina.org/configuration/module/#rule-exclude) rule conditions to maximize bundling performance.

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


[npm]: https://img.shields.io/npm/v/source-map-loader.svg
[npm-url]: https://npmjs.com/package/source-map-loader

[deps]: https://david-dm.org/webpack-contrib/source-map-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/source-map-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# style-loader

Adds CSS to the DOM by injecting a <code>&lt;style&gt;</code> tag

## 安装

```bash
npm install style-loader --save-dev
```

## 用法

建议将 `style-loader` 与 [`css-loader`](https://github.com/webpack/css-loader) 结合使用

**component.js**

```js
import style from './file.css';
```

**webpack.config.js**

```js
{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ];
  }
}
```

###

在使用[局部作用域 CSS](https://github.com/webpack/css-loader#css-scope) 时，模块导出生成的（局部）标识符(identifier)。

**component.js**

```js
import style from './file.css';

style.className === 'z849f98ca812';
```

### `Url`

也可以添加一个URL `<link href="path/to/file.css" rel="stylesheet">`，而不是用带有 `<style></style>` 标签的内联 CSS `{String}`。

```js
import url from 'file.css';
```

**webpack.config.js**

```js
{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader/url' }, { loader: 'file-loader' }],
      },
    ];
  }
}
```

```html
<link rel="stylesheet" href="path/to/file.css" />
```

> ℹ️ 使用 `url` 引用的 Source map 和资源：当 style-loader 与 `{ options: { sourceMap: true } }` 选项一起使用时，CSS 模块将生成为 `Blob`，因此相对路径无法正常工作（他们将相对于 `chrome:blob` 或 `chrome:devtools`）。为了使资源保持正确的路径，必须设置 webpack 配置中的 `output.publicPath` 属性，以便生成绝对路径。或者，你可以启用上面提到的 `convertToAbsoluteUrls` 选项。

### `可选的(Useable)`

The `style-loader` injects the styles lazily making them useable on-demand via `style.use()` / `style.unuse()`

按照惯例，`引用计数器 API(Reference Counter API)` 应关联到 `.useable.css`，而 `.css` 的载入，应该使用基本的 `style-loader` 用法（类似于其他文件类型，例如 `.useable.less` 和 `.less`）。

**webpack.config.js**

```js
{
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.useable\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ],
      },
      {
        test: /\.useable\.css$/,
        use: [
          {
            loader: "style-loader/useable"
          },
          { loader: "css-loader" },
        ],
      },
    ],
  },
}
```

#### `引用计数器 API(reference counter API)`

**component.js**

```js
import style from './file.css';

style.use(); // = style.ref();
style.unuse(); // = style.unref();
```

样式不会添加在 `import/require()` 上，而是在调用 `use`/`ref` 时添加。如果 `unuse`/`unref` 与 `use`/`ref` 一样频繁地被调用，那么样式将从页面中删除。

> ⚠️ 当 `unuse`/`unref` 比 `use`/`ref` 调用频繁的时候，产生的行为是不确定的。所以不要这样做。

## 选项

|名称|类型|默认值|描述|
|:--:|:--:|:-----:|:----------|
|**`hmr`**|`{Boolean}`|`true`|Enable/disable Hot Module Replacement (HMR), if disabled no HMR Code will be added (good for non local development/production)|
|**`base`** |`{Number}`|`true`|设置模块 ID 基础 (DLLPlugin)|
|**`attrs`**|`{Object}`|`{}`|添加自定义 attrs 到 `<style></style>`|
|**`transform`** |`{Function}`|`false`|转换/条件加载 CSS，通过传递转换/条件函数|
|**`insertAt`**|`{String\|Object}`|`bottom`|在给定位置处插入 `<style></style>`|
|**`insertInto`**|`{String}`|`<head>`|给定位置中插入 `<style></style>`|
|**`singleton`**|`{Boolean}`|`undefined`|Reuses a single `<style></style>` element, instead of adding/removing individual elements for each required module.|
|**`sourceMap`**|`{Boolean}`|`false`|启用/禁用 Sourcemap|
|**`convertToAbsoluteUrls`**|`{Boolean}`|`false`|启用 source map 后，将相对 URL 转换为绝对 URL|

### `hmr`

Enable/disable Hot Module Replacement (HMR), if disabled no HMR Code will be added.
This could be used for non local development and production.

**webpack.config.js**

```js
{
  loader: 'style-loader',
  options: {
    hmr: false
  }
}
```

### `base`

当使用一个或多个 [DllPlugin](https://robertknight.github.io/posts/webpack-dll-plugins/) 时，此设置主要用作 [css 冲突](https://github.com/webpack-contrib/style-loader/issues/163) 的修补方案。`base` 可以防止 _app_ 的 css（或 _DllPlugin2_ 的 css）覆盖 _DllPlugin1_ 的 css，方法是指定一个 css 模块的 id 大于 _DllPlugin1_ 的范围，例如：

**webpack.dll1.config.js**

```js
{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader'
  ]
}
```

**webpack.dll2.config.js**

```js
{
  test: /\.css$/,
  use: [
    { loader: 'style-loader', options: { base: 1000 } },
    'css-loader'
  ]
}
```

**webpack.app.config.js**

```
{
  test: /\.css$/,
  use: [
    { loader: 'style-loader', options: { base: 2000 } },
    'css-loader'
  ]
}
```

### `attrs`

如果已定义，style-loader 将把属性值附加在 `<style>` / `<link>` 元素上。

**component.js**

```js
import style from './file.css';
```

**webpack.config.js**

```js
{
  test: /\.css$/,
  use: [
    { loader: 'style-loader', options: { attrs: { id: 'id' } } }
    { loader: 'css-loader' }
  ]
}
```

```html
<style id="id"></style>
```

#### `Url`

**component.js**

```js
import link from './file.css';
```

**webpack.config.js**

```js
{
  test: /\.css$/,
  use: [
    { loader: 'style-loader/url', options: { attrs: { id: 'id' } } }
    { loader: 'file-loader' }
  ]
}
```

### `transform`

`transform` 是一个函数，可以在通过 style-loader 加载到页面之前修改 css。
该函数将在即将加载的 css 上调用，函数的返回值将被加载到页面，而不是原始的 css 中。
如果 `transform` 函数的返回值是 falsy 值，那么 css 根本就不会加载到页面中。

> ⚠️ In case you are using ES Module syntax in `tranform.js` then, you **need to transpile** it or otherwise it will throw an `{Error}`.

**webpack.config.js**

```js
{
  loader: 'style-loader',
  options: {
    transform: 'path/to/transform.js'
  }
}
```

**transform.js**

```js
module.exports = function(css) {
  // Here we can change the original css
  const transformed = css.replace('.classNameA', '.classNameB');

  return transformed;
};
```

#### `Conditional`

**webpack.config.js**

```js
{
  loader: 'style-loader',
  options: {
    transform: 'path/to/conditional.js'
  }
}
```

**conditional.js**

```js
module.exports = function(css) {
  // 如果条件匹配则加载[和转换] CSS
  if (css.includes('something I want to check')) {
    return css;
  }
  // 如果返回 falsy 值，则不会加载 CSS
  return false;
};
```

### `insertAt`

默认情况下，style-loader 将 `<style>` 元素附加到样式目标(style target)的末尾，即页面的 `<head>` 标签，也可以是由 `insertInto` 指定其他标签。这将导致 loader 创建的 CSS 优先于目标中已经存在的 CSS。要在目标的起始处插入 style 元素，请将此查询参数(query parameter)设置为 'top'，例如

**webpack.config.js**

```js
{
  loader: 'style-loader',
  options: {
    insertAt: 'top'
  }
}
```

A new `<style>` element can be inserted before a specific element by passing an object, e.g.

**webpack.config.js**

```js
{
  loader: 'style-loader',
  options: {
    insertAt: {
        before: '#id'
    }
  }
}
```

### `insertInto`

默认情况下，样式加载器将 `<style>` 元素插入到页面的 `<head>` 标签中。如果要将标签插入到其他位置，可以在这里为该元素指定 CSS 选择器。如果你想要插入到 [IFrame](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement) 中，请确保你具有足够的访问权限，样式将被注入到内容文档的 head 中。

You can also pass function to override default behavior and insert styles in your container, e.g

**webpack.config.js**

```js
{
  loader: 'style-loader',
  options: {
    insertInto: () => document.querySelector("#root"),
  }
}
```

通过使用函数，可以将样式插入到 [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) 中，例如

**webpack.config.js**

```js
{
  loader: 'style-loader',
  options: {
    insertInto: () => document.querySelector("#root").shadowRoot,
  }
}
```

### `singleton`

如果已定义，则 style-loader 将重用单个 `<style></style>` 元素，而不是为每个所需的模块添加/删除单个元素。

> ℹ️ 默认情况下启用此选项，IE9 对页面上允许的 style 标签数量有严格的限制。你可以使用 singleton 选项来启用或禁用它。

**webpack.config.js**

```js
{
  loader: 'style-loader',
  options: {
    singleton: true
  }
}
```

### `sourceMap`

启用/禁用 source map 加载

**webpack.config.js**

```js
{
  loader: 'style-loader',
  options: {
    sourceMap: true
  }
}
```

### `convertToAbsoluteUrls`

如果 convertToAbsoluteUrls 和 sourceMaps 都启用，那么相对 url 将在 css 注入页面之前，被转换为绝对 url。这解决了在启用 source map 时，相对资源无法加载的[问题](https://github.com/webpack/style-loader/pull/96)。你可以使用 convertToAbsoluteUrls 选项启用它。

**webpack.config.js**

```js
{
  loader: 'style-loader',
  options: {
    sourceMap: true,
    convertToAbsoluteUrls: true
  }
}
```

## 维护人员

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
        <a href="https://github.com/sapegin">
          <img width="150" height="150" src="https://github.com/sapegin.png?v=3&s=150">
          </br>
          Artem Sapegin
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
    <tr>
      <td align="center">
        <a href="https://github.com/sokra">
          <img width="150" height="150" src="https://github.com/sokra.png?v=3&s=150">
          </br>
          Tobias Koppers
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/SpaceK33z">
          <img width="150" height="150" src="https://github.com/SpaceK33z.png?v=3&s=150">
          </br>
          Kees Kluskens
        </a>
      </td>
    <tr>
  <tbody>
</table>

[npm]: https://img.shields.io/npm/v/style-loader.svg
[npm-url]: https://npmjs.com/package/style-loader
[node]: https://img.shields.io/node/v/style-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack/style-loader.svg
[deps-url]: https://david-dm.org/webpack/file-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack

# svg-inline-loader

This Webpack loader inlines SVG as module. If you use Adobe suite or Sketch to export SVGs, you will get auto-generated, unneeded crusts. This loader removes it for you, too.

## 安装

```bash
npm install svg-inline-loader --save-dev
```

## 配置

只需加载配置对象到 `module.loaders` 像下面这样。

```javascript
    {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
    }
```

警告: 这个loader你应只配置一次，通过 `module.loaders` 或者 `require('!...')` 配置。 更多细节参考 [#15](https://github.com/webpack-contrib/svg-inline-loader/issues/15)。

## Query 选项

###

删除指定的标签和它的子元素，你可以指定标签通过设置 `removingTags` 查询多个。

默认值: `removeTags: false`

#### `removingTags: [...string]`

警告: 你指定 `removeTags: true` 时，它才会执行。

默认值: `removingTags: ['title', 'desc', 'defs', 'style']`

#### `warnTags: [...string]`

警告标签,例: ['desc', 'defs', 'style']

默认值: `warnTags: []`

#### `removeSVGTagAttrs: boolean`

删除 `<svg />` 的 `width` 和 `height` 属性。

默认值: `removeSVGTagAttrs: true`

#### `removingTagAttrs: [...string]`

删除内部的 `<svg />`的属性。

默认值: `removingTagAttrs: []`

#### `warnTagAttrs: [...string]`

在console发出关于内部 `<svg />` 属性的警告

默认值: `warnTagAttrs: []`
#### `classPrefix: boolean || string`

添加一个前缀到svg文件的class，以避免碰撞。

默认值: `classPrefix: false`

#### `idPrefix: boolean || string`

添加一个前缀到svg文件的id，以避免碰撞。

默认值: `idPrefix: false`

## 使用示例

```js
// 使用默认 hashed prefix (__[hash:base64:7]__)
var logoTwo = require('svg-inline-loader?classPrefix!./logo_two.svg');

// 使用自定义字符串
var logoOne = require('svg-inline-loader?classPrefix=my-prefix-!./logo_one.svg');

// 使用自定义字符串和hash
var logoThree = require('svg-inline-loader?classPrefix=__prefix-[sha512:hash:hex:5]__!./logo_three.svg');
```
hash 操作请参照 [loader-utils](https://github.com/webpack/loader-utils#interpolatename)。

通过 `module.loaders` 优先使用:
```js
    {
        test: /\.svg$/,
        loader: 'svg-inline-loader?classPrefix'
    }
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

[npm]: https://img.shields.io/npm/v/svg-inline-loader.svg
[npm-url]: https://npmjs.com/package/svg-inline-loader

[deps]: https://david-dm.org/webpack-contrib/svg-inline-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/svg-inline-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: https://travis-ci.org/webpack-contrib/svg-inline-loader.svg?branch=master
[test-url]: https://travis-ci.org/webpack-contrib/svg-inline-loader

[cover]: https://codecov.io/gh/webpack-contrib/svg-inline-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/svg-inline-loader

# thread-loader

Runs the following loaders in a worker pool.

## 安装

```bash
npm install --save-dev thread-loader
```

## 用法

把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行

在 worker 池(worker pool)中运行的 loader 是受到限制的。例如：

* 这些 loader 不能产生新的文件。
* 这些 loader 不能使用定制的 loader API（也就是说，通过插件）。
* 这些 loader 无法获取 webpack 的选项设置。

每个 worker 都是一个单独的有 600ms 限制的 node.js 进程。同时跨进程的数据交换也会被限制。

请仅在耗时的 loader 上使用

## 示例

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve("src"),
        use: [
          "thread-loader",
          // your expensive loader (e.g babel-loader)
        ]
      }
    ]
  }
}
```

**可配选项**

```js
use: [
  {
    loader: "thread-loader",
    // 有同样配置的 loader 会共享一个 worker 池(worker pool)
    options: {
      // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)
      // 或者，在 require('os').cpus() 是 undefined 时回退至 1
      workers: 2,

      // 一个 worker 进程中并行执行工作的数量
      // 默认为 20
      workerParallelJobs: 50,

      // 额外的 Node.js 参数
      workerNodeArgs: ['--max-old-space-size=1024'],

      // Allow to respawn a dead worker pool
      // respawning slows down the entire compilation
      // and should be set to false for development
      poolRespawn: false,

      // 闲置时定时删除 worker 进程
      // 默认为 500ms
      // 可以设置为无穷大， 这样在监视模式(--watch)下可以保持 worker 持续存在
      poolTimeout: 2000,

      // 池(pool)分配给 worker 的工作数量
      // 默认为 200
      // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
      poolParallelJobs: 50,

      // 池(pool)的名称
      // 可以修改名称来创建其余选项都一样的池(pool)
      name: "my-pool"
    }
  },
  // your expensive loader (e.g babel-loader)
]
```

**预热**

可以通过预热 worker 池(worker pool)来防止启动 worker 时的高延时。

这会启动池(pool)内最大数量的 worker 并把指定的模块载入 node.js 的模块缓存中。

``` js
const threadLoader = require('thread-loader');

threadLoader.warmup({
  // pool options, like passed to loader options
  // must match loader options to boot the correct pool
}, [
  // modules to load
  // can be any module, i. e.
  'babel-loader',
  'babel-preset-es2015',
  'sass-loader',
]);
```


## 维护人员

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/sokra">
          <img width="150" height="150" src="https://github.com/sokra.png?size=150">
          </br>
          sokra
        </a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/thread-loader.svg
[npm-url]: https://npmjs.com/package/thread-loader

[deps]: https://david-dm.org/webpack-contrib/thread-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/thread-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: http://img.shields.io/travis/webpack-contrib/thread-loader.svg
[test-url]: https://travis-ci.org/webpack-contrib/thread-loader

[cover]: https://codecov.io/gh/webpack-contrib/thread-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/thread-loader

# transform-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]

A browserify transformation loader for webpack.

This loader allows use of
[browserify transforms](https://github.com/substack/node-browserify/wiki/list-of-transforms)
via a webpack loader.query parameter

## Requirements

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## Getting Started

To begin, you'll need to install `transform-loader`:

```console
$ npm install transform-loader --save-dev
```

_Note: We're using the [coffeeify](https://github.com/jnordberg/coffeeify)
tranform for these examples._

Then invoke the loader through a require like so:

```js
const thing = require('!transform-loader?coffeeify!widget/thing');
```

Or add the loader to your `webpack` config. For example:

```js
// entry.js
import thing from 'widget/thing';
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.coffee?$/,
        loader: `transform-loader?coffeeify`,
        // options: {...}
      },
    ],
  },
}
```

And run `webpack` via your preferred method.

## QueryString Options

When using the loader via a `require` query string you may specify one of two
types; a loader name, or a function index.

### <loder-name>

Type: `String`

The name of the `browserify` transform you wish to use.

_Note: You must install the correct transform manually. Webpack nor this loader
will do that for you._

### <loder-index>

Type: `Number`

The index of a function contained within `options.transforms` which to use to
transform the target file(s).

## Options

### `transforms`

Type: `Array[Function]`
Default: `undefined`

An array of `functions` that can be used to transform a given file matching the
configured loader `test`. For example:

```js
// entry.js
const thing = require('widget/thing');
```

```js
// webpack.config.js
const through = require('through2');

module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        // NOTE: we've specified an index of 0, which will use the `transform`
        //       function in `transforms` below.
        loader: 'transform-loader?0',
        options: {
          transforms: [
            function transform() {
              return through(
                (buffer) => {
                  const result = buffer
                    .split('')
                    .map((chunk) => String.fromCharCode(127 - chunk.charCodeAt(0)));
                  return this.queue(result).join('');
                },
                () => this.queue(null)
              );
            }
          ]
        }
      }
    ]
  }
}
```

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/transform-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/transform-loader.svg
[npm-url]: https://npmjs.com/package/transform-loader

[node]: https://img.shields.io/node/v/transform-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/transform-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/transform-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/transform-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/transform-loader

[cover]: https://codecov.io/gh/webpack-contrib/transform-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/transform-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# undefined

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# url-loader

一个将文件转换成 base64 URIs 的 webpack loader。

## 起步

首先，你需要安装 `url-loader`：

```console
$ npm install url-loader --save-dev
```

`url-loader` 功能类似于
[`file-loader`](https://github.com/webpack-contrib/file-loader), 但是在文件大小（byte）小于某个阈值时，可以返回一个 DataURL。

**index.js**

```js
import img from './image.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
};
```

配置完成后，按照你喜欢的方式运行 `webpack`。

## 选项(Options)

|             名称              |            类型             |                            默认值                            | 描述                                                                         |
| :---------------------------: | :-------------------------: | :-----------------------------------------------------------: | :---------------------------------------------------------------------------------- |
|     **[`limit`](https://v4.webpack.docschina.org#limit)**     | `{Boolean\|Number\|String}` |                            `true`                             | Specifying the maximum size of a file in bytes.                                     |
|  **[`mimetype`](https://v4.webpack.docschina.org#mimetype)**  |     `{Boolean\|String}`     | based from [mime-types](https://github.com/jshttp/mime-types) | Sets the MIME type for the file to be transformed.                                  |
|  **[`encoding`](https://v4.webpack.docschina.org#encoding)**  |     `{Boolean\|String}`     |                           `base64`                            | Specify the encoding which the file will be inlined with.                           |
| **[`generator`](https://v4.webpack.docschina.org#generator)** |        `{Function}`         |           `() => type/subtype;encoding,base64_data`           | You can create you own custom implementation for encoding data.                     |
|  **[`fallback`](https://v4.webpack.docschina.org#fallback)**  |         `{String}`          |                         `file-loader`                         | 当目标文件的大小超过设置的阈值时，指定一个替代 url-loader 的 loader。 |
|  **[`esModule`](https://v4.webpack.docschina.org#esmodule)**  |         `{Boolean}`         |                            `true`                             | Use ES modules syntax.                                                              |

### `limit`

Type: `Boolean|Number|String`
Default: `undefined`

可以通过 loader 选项指定阈值，默认不限制阈值。

#### `Boolean`

是否开启将文件转换为 base64。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: false,
            },
          },
        ],
      },
    ],
  },
};
```

#### `Number|String`

传递一个 `Number` 或 `String` 来指定文件的最大大小，以字节为单位。
如果文件大小等于或大于阈值，将会（默认）使用 [`file-loader`](https://github.com/webpack-contrib/file-loader) 来处理文件，并且所有参数都会传递过去。

通过 `fallback` 选项可以设置其它 `loader` 来替代 `file-loader`。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
};
```

### `mimetype`

Type: `Boolean|String`
Default: based from [mime-types](https://github.com/jshttp/mime-types)

设置要转换文件的 `mimetype` 类型。
如果没有指定 `mimetype` 的值，则使用 [mime-types](https://github.com/jshttp/mime-types) 指定。

#### `Boolean`

The `true` value allows to generation the `mimetype` part from [mime-types](https://github.com/jshttp/mime-types).
The `false` value removes the `mediatype` part from a Data URL (if omitted, defaults to `text/plain;charset=US-ASCII`).

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: false,
            },
          },
        ],
      },
    ],
  },
};
```

#### `String`

Sets the MIME type for the file to be transformed.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
            },
          },
        ],
      },
    ],
  },
};
```

### `encoding`

Type: `Boolean|String`
Default: `base64`

Specify the `encoding` which the file will be inlined with.
If unspecified the `encoding` will be `base64`.

#### `Boolean`

If you don't want to use any encoding you can set `encoding` to `false` however if you set it to `true` it will use the default encoding `base64`.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              encoding: false,
            },
          },
        ],
      },
    ],
  },
};
```

#### `String`

It supports [Node.js Buffers and Character Encodings](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) which are `["utf8","utf16le","latin1","base64","hex","ascii","binary","ucs2"]`.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              encoding: 'utf8',
            },
          },
        ],
      },
    ],
  },
};
```

### `generator`

Type: `Function`
Default: `(mimetype, encoding, content, resourcePath) => mimetype;encoding,base64_content`

You can create you own custom implementation for encoding data.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|html)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              // The `mimetype` and `encoding` arguments will be obtained from your options
              // The `resourcePath` argument is path to file.
              generator: (content, mimetype, encoding, resourcePath) => {
                if (/\.html$/i.test(resourcePath)) {
                  return `data:${mimetype},${content.toString()}`;
                }

                return `data:${mimetype}${
                  encoding ? `;${encoding}` : ''
                },${content.toString(encoding)}`;
              },
            },
          },
        ],
      },
    ],
  },
};
```

### `fallback`

Type: `String`
Default: `'file-loader'`

当目标文件的大小超过设置的阈值（通过 `limit` 选项设置）时，指定一个替代 url-loader 的 loader。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: require.resolve('responsive-loader'),
            },
          },
        ],
      },
    ],
  },
};
```

通过 fallback 指定的 loader 将会接收和 url-loader 一样的配置选项。

例如，想要传递给 responsive-loader 一个 quality 选项，需要如下：

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: require.resolve('responsive-loader'),
              quality: 85,
            },
          },
        ],
      },
    ],
  },
};
```

### `esModule`

Type: `Boolean`
Default: `true`

By default, `file-loader` generates JS modules that use the ES modules syntax.
There are some cases in which using ES modules is beneficial, like in the case of [module concatenation](https://webpack.js.org/plugins/module-concatenation-plugin/) and [tree shaking](https://webpack.js.org/guides/tree-shaking/).

You can enable a CommonJS module syntax using:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
```

## Examples

### SVG

SVG can be compressed into a more compact output, avoiding `base64`.
You can read about it more [here](https://css-tricks.com/probably-dont-base64-svg/).
You can do it using [mini-svg-data-uri](https://github.com/tigt/mini-svg-data-uri) package.

**webpack.config.js**

```js
const svgToMiniDataURI = require('mini-svg-data-uri');

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              generator: (content) => svgToMiniDataURI(content.toString()),
            },
          },
        ],
      },
    ],
  },
};
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](https://v4.webpack.docschina.org./.github/CONTRIBUTING.md)

## License

[MIT](https://v4.webpack.docschina.org./LICENSE)

[npm]: https://img.shields.io/npm/v/url-loader.svg
[npm-url]: https://npmjs.com/package/url-loader
[node]: https://img.shields.io/node/v/url-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/url-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/url-loader
[tests]: https://dev.azure.com/webpack-contrib/url-loader/_apis/build/status/webpack-contrib.url-loader?branchName=master
[tests-url]: https://dev.azure.com/webpack-contrib/url-loader/_build/latest?definitionId=2&branchName=master
[cover]: https://codecov.io/gh/webpack-contrib/url-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/url-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=url-loader
[size-url]: https://packagephobia.now.sh/result?p=url-loader

```

```

# val-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



A webpack loader which executes a given module, and returns the result of the
execution at build-time, when the module is required in the bundle. In this way,
the loader changes a module from code to a result.

Another way to view `val-loader`, is that it allows a user a way to make their
own custom loader logic, without having to write a custom loader.

## Requirements

The function will be called with the loader [`options`](https://webpack.docschina.org/configuration/module/#useentry) and must either return

## Getting Started

To begin, you'll need to install `val-loader`:

```console
$ npm install val-loader --save-dev
```

Then add the loader to your `webpack` config. For example:

```js
// target-file.js
module.exports = () => {
  return { code: 'module.exports = 42;' }
};
```

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /target-file.js$/,
        use: [
          {
            loader: `val-loader`
          }
        ]
      }
    ]
  }
}
```

```js
// src/entry.js
const answer = require('test-file');
```

And run `webpack` via your preferred method.

## Return Object Properties

Targeted modules of this loader must export either a `Function` or `Promise`
that returns an object containing a `code` property at a minimum, but can
contain any number of additional properties.

### `code`

Type: `String|Buffer`
Default: `undefined`
_Required_

Code passed along to webpack or the next loader that will replace the module.

### `sourceMap`

Type: `Object`
Default: `undefined`

A source map passed along to webpack or the next loader.

### `ast`

Type: `Array[Object]`
Default: `undefined`

An [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
that will be passed to the next loader. Useful to speed up the build time if the
next loader uses the same AST.

### `dependencies`

Type: `Array[String]`
Default: `[]`

An array of absolute, native paths to file dependencies that should be watched
by webpack for changes.

### `contextDependencies`

Type: `Array[String]`
Default: `[]`

An array of absolute, native paths to directory dependencies that should be
watched by webpack for changes.

### `cacheable`

Type: `Boolean`
Default: `false`

If `true`, specifies that the code can be re-used in watch mode if none of the
`dependencies` have changed.

## Examples

In this example the loader is configured to operator on a file name of
`years-in-ms.js`, execute the code, and store the result in the bundle as the
result of the execution. This example passes `years` as an `option`, which
corresponds to the `years` parameter in the target module exported function:

```js
// years-in-ms.js
module.exports = function yearsInMs({ years }) {
  const value = years * 365 * 24 * 60 * 60 * 1000;
  // NOTE: this return value will replace the module in the bundle
  return { code: 'module.exports = ' + value };
}
```

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: require.resolve('src/years-in-ms.js'),
        use: [
          {
            loader: 'val-loader',
            options: {
              years: 10
            }
          }
        ]
      }
    ]
  }
};
```

In the bundle, requiring the module then returns:

```js
// ... bundle code ...

  const tenYearsMs = require('years-in-ms'); // 315360000000

// ... bundle code ...
```

require("val-loader!tenyearsinms") == 315360000000

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/val-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/val-loader.svg
[npm-url]: https://npmjs.com/package/val-loader

[node]: https://img.shields.io/node/v/val-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/val-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/val-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/val-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/val-loader

[cover]: https://codecov.io/gh/webpack-contrib/val-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/val-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

# worker-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



将脚本注册为 Web Worker 的 webpack loader

## 要求

此模块需要 Node v6.9.0+ 和 webpack v4.0.0+。

## 起步

你需要预先安装 `worker-loader`：

```console
$ npm install worker-loader --save-dev
```

### 内联

```js
// App.js
import Worker from 'worker-loader!./Worker.js';
```

### 配置

```js
// webpack.config.js
{
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  }
}
```

```js
// App.js
import Worker from './file.worker.js';

const worker = new Worker();

worker.postMessage({ a: 1 });
worker.onmessage = function (event) {};

worker.addEventListener("message", function (event) {});
```

然后，通过你偏爱的方式去运行 `webpack`。

## 选项

### `fallback`

类型：`Boolean`
默认值：`false`

是否需要支持非 worker 环境的回退

```js
// webpack.config.js
{
  loader: 'worker-loader'
  options: { fallback: false }
}
```

### `inline`

类型：`Boolean`
默认值：`false`

你也可以使用 `inline` 参数，将 worker 内联为一个 BLOB

```js
// webpack.config.js
{
  loader: 'worker-loader',
  options: { inline: true }
}
```

_注意：内联模式还会为不支持内联 worker 的浏览器创建 chunk，
要禁用此行为，只需将`fallback` 参数设置为
`false`。_

```js
// webpack.config.js
{
  loader: 'worker-loader'
  options: { inline: true, fallback: false }
}
```

### `name`

类型：`String`
默认值：`[hash].worker.js`

使用 `name` 参数，为每个输出的脚本，设置一个自定义名称。
名称可能含有 `[hash]` 字符串，会被替换为依赖内容哈希值(content dependent hash)，用于缓存目的。
只使用 `name` 时，可以省略 `[hash]`。

```js
// webpack.config.js
{
  loader: 'worker-loader',
  options: { name: 'WorkerName.[hash].js' }
}
```

### publicPath

类型：`String`
默认值：`null`

重写 worker 脚本的下载路径。如果未指定，
则使用与其他 webpack 资源相同的公共路径(public path)。

```js
// webpack.config.js
{
  loader: 'worker-loader'
  options: { publicPath: '/scripts/workers/' }
}
```

## 示例

worker 文件可以像其他脚本文件导入依赖那样，来导入依赖：

```js
// Worker.js
const _ = require('lodash')

const obj = { foo: 'foo' }

_.has(obj, 'foo')

// 发送数据到父线程
self.postMessage({ foo: 'foo' })

// 响应父线程的消息
self.addEventListener('message', (event) => console.log(event))
```

### 集成 ES2015 模块

_注意：如果配置好 [`babel-loader`](https://github.com/babel/babel-loader) ，
你甚至可以使用 ES2015 模块。_

```js
// Worker.js
import _ from 'lodash'

const obj = { foo: 'foo' }

_.has(obj, 'foo')

// 发送数据到父线程
self.postMessage({ foo: 'foo' })

// 响应父线程的消息
self.addEventListener('message', (event) => console.log(event))
```

### 集成 TypeScript

集成 TypeScript，在导出 worker 时，你需要声明一个自定义模块

```typescript
// typings/custom.d.ts
declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
```

```typescript
// Worker.ts
const ctx: Worker = self as any;

// 发送数据到父线程
ctx.postMessage({ foo: "foo" });

// 响应父线程的消息
ctx.addEventListener("message", (event) => console.log(event));
```

```typescript
// App.ts
import Worker from "worker-loader!./Worker";

const worker = new Worker();

worker.postMessage({ a: 1 });
worker.onmessage = (event) => {};

worker.addEventListener("message", (event) => {});
```

### 跨域策略

[`WebWorkers`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
受到 [同源策略](https://en.wikipedia.org/wiki/Same-origin_policy) 的限制，
如果 `webpack` 资源的访问服务，和应用程序不是同源，
就会在浏览器中拦截其下载。
如果在 CDN 域下托管资源，
通常就会出现这种情况。
甚至从 `webpack-dev-server` 下载时都会被拦截。有两种解决方法：

第一种，通过配置 [`inline`](https://v4.webpack.docschina.org#inline) 参数，将 worker 作为 blob 内联，
而不是将其作为外部脚本下载

```js
// App.js
import Worker from './file.worker.js';
```

```js
// webpack.config.js
{
  loader: 'worker-loader'
  options: { inline: true }
}
```

第二种，通过配置 [`publicPath`](https://v4.webpack.docschina.org#publicpath) 选项，
重写 worker 脚本的基础下载 URL

```js
// App.js
// 会从 `/workers/file.worker.js` 下载 worker 脚本
import Worker from './file.worker.js';
```

```js
// webpack.config.js
{
  loader: 'worker-loader'
  options: { publicPath: '/workers/' }
}
```

## 贡献

如果你从未阅读过我们的贡献指南，请在上面花点时间。

#### [贡献指南](https://raw.githubusercontent.com/webpack-contrib/worker-loader/master/.github/CONTRIBUTING.md)

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/worker-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/worker-loader.svg
[npm-url]: https://npmjs.com/package/worker-loader

[node]: https://img.shields.io/node/v/worker-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/worker-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/worker-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/worker-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/worker-loader

[cover]: https://codecov.io/gh/webpack-contrib/worker-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/worker-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[size]: https://packagephobia.now.sh/badge?p=worker-loader
[size-url]: https://packagephobia.now.sh/result?p=worker-loader

# workerize-loader

<img src="https://i.imgur.com/HZZG8wr.jpg" width="1358" alt="workerize-loader">



> A webpack loader that moves a module and its dependencies into a Web Worker, automatically reflecting exported functions as asynchronous proxies.

- Bundles a tiny, purpose-built RPC implementation into your app
- If exported module methods are already async, signature is unchanged
- Supports synchronous and asynchronous worker functions
- Works beautifully with async/await
- Imported value is instantiable, just a decorated `Worker`


## Install

```sh
npm install -D workerize-loader
```


### Usage

**worker.js**:

```js
// block for `time` ms, then return the number of loops we could run in that time:
export function expensive(time) {
	let start = Date.now(),
		count = 0
	while (Date.now() - start < time) count++
	return count
}
```

**index.js**: _(our demo)_

```js
import worker from 'workerize-loader!./worker'

let instance = worker()  // `new` is optional

instance.expensive(1000).then( count => {
	console.log(`Ran ${count} loops`)
})
```


### Credit

The inner workings here are heavily inspired by [worker-loader](https://v4.webpack.docschina.org/loaders/worker-loader/). It's worth a read!


### License

[MIT License](https://oss.ninja/mit/developit) © [Jason Miller](https://jasonformat.com/)

# yaml-frontmatter-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]

YAML Frontmatter loader for [webpack](https://webpack.docschina.org/). Converts YAML in files to JSON. You should chain it with [json-loader](https://v4.webpack.docschina.org/loaders/json-loader/).



YAML frontmatter loader for webpack. Converts YAML in files to JSON.

## Requirements

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## Getting Started

To begin, you'll need to install `yaml-frontmatter-loader`:

```console
$ npm install yaml-frontmatter-loader --save-dev
```

Then add the loader to your `webpack` config. For example:

```js
const json = require('yaml-frontmatter-loader!./file.md');
// => returns file.md as javascript object
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
         test: /\.md$/,
         use: [ 'json-loader', 'yaml-frontmatter-loader' ]
      }
    ]
  }
}
```

And run `webpack` via your preferred method.

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/yaml-frontmatter-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/yaml-frontmatter-loader.svg
[npm-url]: https://npmjs.com/package/yaml-frontmatter-loader

[node]: https://img.shields.io/node/v/yaml-frontmatter-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/yaml-frontmatter-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/yaml-frontmatter-loader

[tests]: https://circleci.com/gh/webpack-contrib/yaml-frontmatter-loader.svg?style=svg
[tests-url]: https://circleci.com/gh/webpack-contrib/yaml-frontmatter-loader

[cover]: https://codecov.io/gh/webpack-contrib/yaml-frontmatter-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/yaml-frontmatter-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
