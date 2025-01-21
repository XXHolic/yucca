import { readFile, writeFile, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dealPost, backOkMsg, backErrMsg } from "./util.mjs";

// 这个是针对 pm2 启动时无法找到路径的问题
const fileName = fileURLToPath(import.meta.url)
const preFold = resolve(dirname(fileName), '..');

const getPrograms = async (res) => {
  const programPath = `${preFold}/json/programs.json`
  const contents = await readFile(programPath, { encoding: "utf-8" });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(contents);
}

const getAuthors = async (res) => {
  const authorPath = `${preFold}/json/authors.json`
  const contents = await readFile(authorPath, { encoding: "utf-8" });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(contents);
}

const getProgramDetail = (req, res) => {
  dealPost(req, async (params) => {
    const detailPath = `${preFold}/json/${params.id}.json`
    const contents = await readFile(detailPath, { encoding: "utf-8" });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(contents);
  });
}

const addCurrent = (req, res) => {
  const headers = req.headers;
  const userId = headers['authorization'];
  if (!userId) {
    backErrMsg(res, '用户信息无效');
    return;
  }
  dealPost(req, async (params) => {
    const { id } = params
    const detailPath = `${preFold}/json/${id}.json`
    const contents = await readFile(detailPath, { encoding: "utf-8" });
    const writePath = `${preFold}/json/user/current${userId}.json`
    writeFile(writePath, contents).then(() => {
      backOkMsg(res)
    })
  });
}

const getCurrent = async (req, res) => {
  const headers = req.headers;
  const userId = headers['authorization'];
  if (!userId) {
    backErrMsg(res, '用户信息无效');
    return;
  }
  const currentPath = `${preFold}/json/user/current${userId}.json`
  const contents = await readFile(currentPath, { encoding: "utf-8" });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(contents);
}

const saveCurrentPlay = (req, res) => {
  const headers = req.headers;
  const userId = headers['authorization'];
  if (!userId) {
    backErrMsg(res, '用户信息无效');
    return;
  }
  dealPost(req, (params) => {
    const playPath = `${preFold}/json/user/current${userId}-play.json`;
    const historyPath = `${preFold}/json/user/current${userId}-history.json`;
    writeFile(playPath, JSON.stringify(params)).then(() => {
      backOkMsg(res)
    });
    // 添加到历史记录中,先要判断是否有相同日期，即使节目有重复也没关系，就是要记录
    readFile(historyPath, { encoding: "utf-8" }).then((data) => {
      const allData = JSON.parse(data);
      if (allData.length > 100) {
        allData.pop();
      }
      const currentTime = new Date();
      const year = currentTime.getFullYear();
      const month = currentTime.getMonth() + 1; // 月份从0开始，因此需要加1
      const day = currentTime.getDate();
      const dateStr = `${year}.${month}.${day}`;
      const targetData = allData.find(ele => ele[dateStr]);
      if (targetData) {
        const targetArr = targetData[dateStr];
        targetArr.unshift(params);
      } else {
        let recordData = {};
        recordData[dateStr] = [params];
        allData.unshift(recordData);
      }
      writeFile(historyPath, JSON.stringify(allData));
    });
  });
}

const getCurrentPlay = async (req, res) => {
  const headers = req.headers;
  const userId = headers['authorization'];
  if (!userId) {
    backErrMsg(res, '用户信息无效');
    return;
  }
  const playPath = `${preFold}/json/user/current${userId}-play.json`
  const contents = await readFile(playPath, { encoding: "utf-8" });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(contents);
}

const getHistory = async (req, res) => {
  const headers = req.headers;
  const userId = headers['authorization'];
  if (!userId) {
    backErrMsg(res, '用户信息无效');
    return;
  }
  const historyPath = `${preFold}/json/user/current${userId}-history.json`
  const contents = await readFile(historyPath, { encoding: "utf-8" });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(contents);
}


export { getPrograms, getAuthors, getProgramDetail, addCurrent, getCurrent, saveCurrentPlay, getCurrentPlay, getHistory }