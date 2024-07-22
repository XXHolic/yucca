import { readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const fileArr = [];
const getFilePath = () => {
  const dir = "../localdatajson";
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
      if ([".json"].includes(extname(file))) {
        fileArr.push(pathName);
      }
    }
  }
};

const createFile = () => {
  const writePath = "./songsPath.json";
  writeFileSync(writePath, JSON.stringify(fileArr));
  console.log("记录所有歌曲文件路径文件生成成功");
};

getFilePath();
createFile();
