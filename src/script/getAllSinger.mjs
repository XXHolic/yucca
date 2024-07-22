import { readFileSync, writeFileSync } from "node:fs";
import { pinyin } from "../asset/js/pinyin.mjs";

const getData = () => {
  const filePath = "./songsPath.json";
  const fileContent = readFileSync(filePath, { encoding: "utf-8" });
  const fileArr = JSON.parse(fileContent);
  let len = fileArr.length;
  const singers = [],
    idArr = [],
    sortObj = {};
  for (let index = 0; index < len; index++) {
    const content = readFileSync(fileArr[index], { encoding: "utf-8" });
    const contentsObj = JSON.parse(content);
    const { songId, songName, singerId, singerName, playCount } = contentsObj;
    if (!idArr.includes(singerId)) {
      let tempObj = { singerId, singerName };
      const py = pinyin(singerName, { pattern: "first", type: "array" });
      const firstLetter = py[0].toLowerCase();
      let target = sortObj[firstLetter];
      if (target) {
        target.push(tempObj);
      } else {
        sortObj[firstLetter] = [tempObj];
      }
      singers.push(tempObj);
      idArr.push(singerId);
    }
  }
  const writePath = "../json/singers.json";
  writeFileSync(writePath, JSON.stringify(sortObj));
  console.log("所有歌手文件生成成功");
};

getData();
