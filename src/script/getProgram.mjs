// 格式化节目信息
import { readFileSync, writeFileSync } from "node:fs";

const fileName = 'original-read-08'
const getData = () => {
  const filePath = `../localdata/${fileName}/data.json`;
  const fileContent = readFileSync(filePath, { encoding: "utf-8" });
  const { title, poster, path, catalogs, date, author } = JSON.parse(fileContent);
  let msg = { id: path, title, author, poster, date }
  const list = catalogs.map(ele => {
    const { id, catalogTitle, child } = ele;
    let temObj = {
      title: catalogTitle
    }
    if (child && child.length) {
      const format = child.map(childEle => {
        const { title } = childEle;
        return { title, fileName: `${id}.${childEle.id}.mp3` }
      })
      temObj.child = format
    }

    return temObj
  })

  msg.list = list
  const writePath = `../json/${fileName}.json`;
  writeFileSync(writePath, JSON.stringify(msg));
  console.log(`${fileName} 节目文件生成成功`);
};

getData();
