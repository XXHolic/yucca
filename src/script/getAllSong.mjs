import { readFileSync, writeFileSync } from "node:fs";

const getData = () => {
  const filePath = "./songsPath.json";
  const fileContent = readFileSync(filePath, { encoding: "utf-8" });
  const fileArr = JSON.parse(fileContent);
  let len = fileArr.length;
  let music = [];
  const pageSize = 100;
  const count = Math.round(len / pageSize);
  const countUse = count ? count : 1;
  for (let num = 0; num < countUse; num++) {
    const sliceArr = fileArr.slice(num * pageSize, num * pageSize + pageSize);
    const sliceArrLen = sliceArr.length;
    for (let index = 0; index < sliceArrLen; index++) {
      const content = readFileSync(sliceArr[index], { encoding: "utf-8" });
      const contentsObj = JSON.parse(content);
      const { songId, songName, singerId, singerName, playCount } = contentsObj;
      music.push({ songId, songName, singerId, singerName });
    }
    const fileId = num + 1;
    const writePath = `../json/music${fileId}.json`;
    const fileContent = {
      total: len,
      page: fileId,
      pageSize: pageSize, // 这个固定
      list: music,
    };
    writeFileSync(writePath, JSON.stringify(fileContent));
    console.log(`歌曲合集文件music${fileId}生成成功`);
    music = [];
  }
};

getData();
