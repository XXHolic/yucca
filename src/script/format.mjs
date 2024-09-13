import { writeFile, readFileSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

// 目前得到的数据分为了两个 json ，所以进行合并生成所需的格式

const targetPath = "../localdata/original-read-08"; // 目标执行路径
const listChapter = JSON.parse(readFileSync(`${targetPath}/chapter.json`));
const listItem = JSON.parse(readFileSync(`${targetPath}/item.json`));
const listItemAll = listItem.data.article_list
const writeFilePath = `${targetPath}`;

const catalog = listChapter.data.catalog.map((ele, index) => {
  const { catalog_title, catalog_id } = ele;
  const child = listItemAll.filter((childEle, childIndex) => childEle.catalog_id == catalog_id);

  return {
    catalog_id,
    catalog_title,
    part: child
  }
});

const catalogs = catalog.map((ele, index) => {
  const { catalog_title, part } = ele
  const child = part.map((childEle, childIndex) => {
    const { title, duration_str } = childEle
    return {
      id: childIndex + 1,
      title: title,
      duration: duration_str
    }
  })

  return {
    id: index,
    catalogTitle: catalog_title,
    child: child
  }
})

const formatList = {
  title: "中国原著通读第八季《辉煌的唐诗》",
  poster: "poster.jpg",
  author: listChapter.data.author,
  path: "original-read-08",
  date: "2023.09.14",
  catalogs
}

writeFile(`${writeFilePath}/data.json`, JSON.stringify(formatList), (err) => {
  if (err) {
    console.info("err", err);
    console.error("合并生成写入失败");
  } else {
    console.info("合并生成写入成功");
  }
});