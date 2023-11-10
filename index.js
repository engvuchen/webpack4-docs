const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const frontmatter = require('front-matter');

/**
 * 1. 基本上是二层结构：文件夹/*.md
 * 2. 有引用其他文件 (guide...) https://v4.webpack.docschina.org/api/node/#stats-%E5%AF%B9%E8%B1%A1-stats-object-
 *
 * 2.1 引用有锚点吗？
 * 
 * 3. 文章顺序，按 yaml 里面的 sort；有部分不满足，中文文档顺序没有对齐官网最新
 * 
 * 4. 一级标题是可能是 sort === 0 的文章的 title
 */

main('/Users/zqian/Documents/10-jian-guo/01-my-docs/99-文档汇总');

async function main(targetPath) {
  const prefix = 'webpack.js.org/src/content/';
  const dirs = ['guides', 'loaders', 'plugins'];
  const host = 'https://v4.webpack.docschina.org';
  const linkReg = /\[.+?\]\(((?!http).+?)\)/g; // 匹配 [起步](/guides/getting-started)

  await Promise.all(
    dirs.map(async dir => {
      let firstLevelTitle = dir;
      let mds = getFilesWithExtension(prefix + dir);
      let list = await Promise.all(
        mds.map(async mdPath => {
          let data = await fsp.readFile(mdPath, 'utf-8');
          let { attributes: attr, body = '' } = frontmatter(data);

          if (attr?.sort === 0) firstLevelTitle = attr.title;
          body = body.replace(linkReg, function (p1, p2) {
            return p1.replace(p2, host + p2);
          });
          return {
            sort: attr.sort || 0,
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
