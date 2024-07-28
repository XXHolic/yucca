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

  const arr = fileArr.map(ele => {
    const fileContent = readFileSync(ele, { encoding: "utf-8" });
    const { name, poster, path, author } = JSON.parse(fileContent);
    return { id: path, title: name, author, poster }
  })
  const writePath = `../json/programs.json`;
  writeFileSync(writePath, JSON.stringify(arr));
  console.log("节目文件合集生成成功");
};

getFilePath(dir);
createFile();
