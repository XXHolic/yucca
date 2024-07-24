// 统一移动文件
import { rename, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";

const fileArr = [];
const dir = "F:/kan/restate-history-06";
const destPathPre = "F:/kan/yucca/src/localdata/restate-history-06";

const getFilePath = (dir) => {
  const exist = existsSync(dir);
  // 排除不需要遍历的文件夹或文件
  const excludeDir = /^(\.|node_module)/;
  if (!exist) {
    console.error("目录路径不存在");
    return;
  }
  const pa = readdirSync(dir);

  for (let index = 0; index < pa.length; index++) {
    let file = pa[index];
    const pathName = join(dir, file);
    const info = statSync(pathName);
    if (info.isDirectory() && !excludeDir.test(file)) {
      getFilePath(pathName);
    } else {
      if ([".mp3"].includes(extname(file))) {
        fileArr.push({ path: pathName, fileName: basename(pathName) });
      }
    }
  }
};

const moveFile = () => {
  fileArr.map(ele => {
    const { fileName } = ele
    rename(ele.path, `${destPathPre}/${fileName}`, (err) => {
      if (err) throw err;
    });
  })
}

getFilePath(dir)
moveFile()
console.log('所有转移成功')