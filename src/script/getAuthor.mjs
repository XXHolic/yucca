import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const fileArr = [];
const dir = "../localdata";
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
      if ([".json"].includes(extname(file))) {
        fileArr.push(pathName);
      }
    }
  }
};

const createFile = () => {
  const arr = []
  for (const ele of fileArr) {
    const fileContent = readFileSync(ele, { encoding: "utf-8" });
    const { author } = JSON.parse(fileContent);
    if (arr.indexOf(author) == -1) {
      arr.push(author)
    }
  }
  const writePath = `../json/authors.json`;
  writeFileSync(writePath, JSON.stringify(arr));
  console.log("所有作者文件生成成功");
};

getFilePath(dir);
createFile();
