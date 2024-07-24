import { readFile, writeFile, unlink } from "node:fs/promises";
import { dealPost, backOkMsg, backErrMsg } from "./util.mjs";

const getPrograms = async (res) => {
  const programPath = '../json/programs.json'
  const contents = await readFile(programPath, { encoding: "utf-8" });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(contents);
}

const getAuthors = async (res) => {
  const authorPath = '../json/authors.json'
  const contents = await readFile(authorPath, { encoding: "utf-8" });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(contents);
}

const getProgramDetail = (req, res) => {
  dealPost(req, async (params) => {
    const detailPath = `../json/${params.id}.json`
    const contents = await readFile(detailPath, { encoding: "utf-8" });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(contents);
  });
}

export { getPrograms, getAuthors, getProgramDetail }