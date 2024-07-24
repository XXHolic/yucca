import { readFile, writeFile, unlink } from "node:fs/promises";

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

export { getPrograms, getAuthors }