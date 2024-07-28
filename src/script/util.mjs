import {
  readdirSync,
  statSync,
  existsSync,
  readFile,
  writeFile,
  unlink,
  unlinkSync,
  mkdirSync
} from "node:fs";
import { join, extname } from "node:path";

let dealPath = "../../static/zhouShuHuiZhan/serial";
let dealFile = []; // 测试 需要重命名的文件夹
let fileArr = [];

/**
 * 递归目录及下面的文件，找出目标文件，
 * @param {String} dir 文件夹路径
 */
const readDirFile = (dir) => {
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
      readDirFile(pathName);
    } else {
      if ([".json", ".md"].includes(extname(file))) {
        fileArr.push(pathName);
      }
    }
  }
};

// 只读文件夹，不读文件
const readDir = (dir) => {
  const exist = fs.existsSync(dir);
  // 排除不需要遍历的文件夹或文件
  const excludeDir = /^(\.|node_module)/;
  if (!exist) {
    console.error("目录路径不存在");
    return;
  }
  const pa = fs.readdirSync(dir);

  for (let index = 0; index < pa.length; index++) {
    let file = pa[index];
    const pathName = path.join(dir, file);
    const info = fs.statSync(pathName);
    if (info.isDirectory() && !excludeDir.test(file)) {
      fileArr.push(pathName);
    }
  }
};

const clearFile = () => {
  if (dealFile.length) {
    const dealFilePath = dealFile.map((ele) => `${dealPath}/${ele}`);
    dealFilePath.map((ele) => {
      readDirFile(ele);
    });
  } else {
    readDirFile(dealPath);
  }

  // console.log(fileArr)
  fileArr.map((ele) => {
    const strSplit = ele.split(path.sep);
    const lastEle = strSplit[strSplit.length - 2];
    if (Number(lastEle) > 53) {
      unlinkSync(ele);
      console.log(`clear ${ele} done`);
    }
    // fs.unlinkSync(ele)
    // console.log(`clear ${ele} done`)
  });
  console.log("clear all file done");
};

const createFold = (path) => {
  if (existsSync(path)) {
    console.log(`fold exist ${path} `)
  } else {
    mkdirSync(path);
    console.log(`creat fold ${path} `)
  }

}

const sortTest = () => {
  // 冒泡排序示例
  var arr = [5, 4, 3, 2, 1];
  console.log("初始数组：", arr); // 5,4,3,2,1
  //一次次遍历，有多少个数就遍历多少次
  for (var i = 0; i < arr.length; i++) {
    //循环两两比较数组中的数字
    for (var j = 0; j < arr.length; j++) {
      //if判断，如果数组中的当前一个比后一个大，那么两个交换一下位置
      if (arr[j] > arr[j + 1]) {
        var tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        console.log("i=" + i, arr);
      }
    }
  }
  console.log("排序结束：", arr); // 1,2,3,4,5
}

export { readDirFile, readDir, clearFile, createFold };
