## 脚本使用说明
先按照 localdata 中的 readme.md 文件做好前提准备，然后再按照下面说明操作。

使用步骤：
1. 先在 `chapter.json` 文件中找到相关信息，手动填入到 format.mjs 中 `formatList` 字段。注意检查取值字段是否对应，有时候应用进行了调整更改，也要同步更改。
2. 确认字段无误后，执行 `node format.mjs`
3. 接着为接口进行格式化，注意 getProgram.mjs 中 fileName 信息的同步，然后执行 `node getProgram.mjs` 。
4. 接着生成所有节目集合信息，执行 `node program.mjs` 。
5. 最后如何有新的作者，那么就要生产作者合集信息，执行  `node author.mjs` 。


