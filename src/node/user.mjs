import { readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dealPost, backOkMsg, backErrMsg, dateFormat } from "./util.mjs";

// 这个是针对 pm2 启动时无法找到路径的问题
const fileName = fileURLToPath(import.meta.url)
const preFold = resolve(dirname(fileName), '..');

const userPath = `${preFold}/json/user/user.json`;

const currentDemo = { id: "", title: "", author: "", poster: "", date: "", list: [] };
const currentPlayDemo = {};
const currentHistoryDemo = [];

const userLogin = (req, res) => {
  dealPost(req, async (params) => {
    const { name, password } = params;
    const contents = await readFile(userPath, { encoding: "utf-8" });
    const userList = JSON.parse(contents);
    const target = userList.find(ele => ele.name === name);
    if (target && target.password === password) {
      const currentPath = `${preFold}/json/user/current${target.id}.json`;
      const currentPlayPath = `${preFold}/json/user/current${target.id}-play.json`;
      if (!existsSync(currentPath)) {
        await writeFile(currentPath, JSON.stringify(currentDemo));
        await writeFile(currentPlayPath, JSON.stringify(currentPlayDemo));
      }
      backOkMsg(res, { code: 200, data: { userId: target.id } });
    } else {
      backOkMsg(res, { code: 500, data: '用户名或密码错误' });
    }
  });
}

const userRegister = (req, res) => {
  dealPost(req, async (params) => {
    const { name, password } = params;
    const signUpDate = dateFormat(new Date());
    const newUser = { name, password, signUpDate };

    const contents = await readFile(userPath, { encoding: "utf-8" });
    const userList = JSON.parse(contents);
    const hasSameName = userList.find(ele => ele.name === name);
    if (hasSameName) {
      backOkMsg(res, { code: 500, data: '用户名重复' });
      return false;
    }
    const userId = userList.map(ele => ele.id);
    let newUserId = 1;
    if (userId && userId.length) {
      newUserId = Math.max(...userId) + 1;
    }
    newUser.id = newUserId;
    userList.push(newUser);
    await writeFile(userPath, JSON.stringify(userList))
    const currentPath = `${preFold}/json/user/current${newUserId}.json`;
    const currentPlayPath = `${preFold}/json/user/current${newUserId}-play.json`;
    const currentHistoryPath = `${preFold}/json/user/current${newUserId}-history.json`;
    await writeFile(currentPath, JSON.stringify(currentDemo));
    await writeFile(currentPlayPath, JSON.stringify(currentPlayDemo));
    await writeFile(currentHistoryPath, JSON.stringify(currentHistoryDemo));
    backOkMsg(res, { code: 200, data: { userId: newUserId } })
  });
}


export { userLogin, userRegister }