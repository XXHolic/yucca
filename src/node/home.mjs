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
  dealPost(req, async (params) => {
    const { id } = params
    const detailPath = `${preFold}/json/${id}.json`
    const contents = await readFile(detailPath, { encoding: "utf-8" });
    const writePath = `${preFold}/json/current.json`
    writeFile(writePath, contents).then(() => {
      backOkMsg(res)
    })
  });
}

const getCurrent = async (req, res) => {
  const currentPath = `${preFold}/json/current.json`
  const contents = await readFile(currentPath, { encoding: "utf-8" });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(contents);
}

const saveCurrentPlay = (req, res) => {
  dealPost(req, (params) => {
    const playPath = `${preFold}/json/current-play.json`
    writeFile(playPath, JSON.stringify(params)).then(() => {
      backOkMsg(res)
    })
  });
}

const getCurrentPlay = async (req, res) => {
  const playPath = `${preFold}/json/current-play.json`
  const contents = await readFile(playPath, { encoding: "utf-8" });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(contents);
}


export { getPrograms, getAuthors, getProgramDetail, addCurrent, getCurrent, saveCurrentPlay, getCurrentPlay }