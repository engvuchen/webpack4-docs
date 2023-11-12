const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const frontmatter = require('front-matter');

/**
 * 1. 基本上是二层结构：文件夹/*.md
 * 2. 有引用其他文件 (guide...) https://v4.webpack.docschina.org/api/node/#stats-%E5%AF%B9%E8%B1%A1-stats-object-
 *
 * 2.1 引用有锚点吗？暂无
 *
 * 3. 文章顺序，按 yaml 里面的 sort；有部分不满足，中文文档顺序没有对齐官网最新
 *
 * 4. 一级标题可能是 sort === 0 的文章的 title
 */

let targetPath = process.argv[2] || ''; // node index.js target
main(targetPath);

async function main(targetPath) {
  const prefix = 'webpack.js.org/src/content/';
  const dirs = [
    // 'guides',
    'concepts',
    'configuration',
    'loaders',
    'plugins',
  ];
  const host = 'https://v4.webpack.docschina.org';
  const linkReg = /\[.+?\]\(((?!http).+?)\)/g; // 匹配 [起步](/guides/getting-started)
  const titleParamReg = /#+ (<(.+?)>).*?\n/g; // `### <loder-name>` 类似这种，会被识别为 html 标签，但实际是“参数”；会让编辑器的渲染异常；换成方括号
  const badgeReg = /\[!\[.+?\]\[.+?\]\]\[.+?\]/g; // npm 徽章无法正确，渲染，去掉它们
  const betterReferenceReg = /(T|W)> /g; // 存在 `T>` 的奇怪引用。转为标准 `>`

  await Promise.all(
    dirs.map(async dir => {
      let firstLevelTitle = dir;
      let mds = getFilesWithExtension(prefix + dir);
      let list = await Promise.all(
        mds.map(async mdPath => {
          let data = await fsp.readFile(mdPath, 'utf-8');
          // 部分 loader 没有 yaml 信息，补充上
          let { attributes: attr = { title: path.parse(mdPath).name, sort: 1 }, body = '' } = frontmatter(data);
          // configuration 以 1 开始，其他是 0；暂时先这样处理
          if (attr?.sort === 0) {
            firstLevelTitle = attr.title;
          }
          // 文档的相对引用，指向在线链接
          body = body
            .replace(linkReg, function (p1, p2) {
              return p1.replace(p2, host + p2);
            })
            .replace(titleParamReg, function (p1, p2, p3) {
              return p1.replace(p2, `[${p3}]`);
            })
            .replace(badgeReg, '')
            .replace(betterReferenceReg, '> ');
          return {
            // 1. loader 大部分文档，没有 sort
            sort: attr.sort !== undefined ? attr.sort : 1,
            body: `# ${attr.title}\n\n${body}`,
          };
        })
      );

      list.sort((a, b) => a.sort - b.sort);

      await fsp.writeFile(
        `${targetPath ? `${targetPath}/` : ''}${firstLevelTitle}.md`,
        `${list.map(curr => curr.body).join('\n')}`
      );
    })
  );
}
// 获取指定文件夹下，指定文件后缀的（仅一层）
function getFilesWithExtension(directoryPath, extension = '.md') {
  const files = fs.readdirSync(directoryPath);
  let result = files.reduce((arr, file) => {
    if (path.extname(file) === extension) arr.push(`${directoryPath}/${file}`);
    return arr;
  }, []);
  return result;
}
