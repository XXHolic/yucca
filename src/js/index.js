import axios from "../asset/js/axios.min.js";
import { api } from "./api.js";
import { spin } from "./util.js";
import { audioEvent } from "./player.js";

let originData = [] // 用来本地筛选

const listObj = document.querySelector("#lapListBody");
const allWriter = document.querySelector("#allWriter");

const formatList = (data) => {
  const listStr = data.reduce((acc, cur, index) => {
    const { id, title, author, poster } = cur;
    const isPlaying = false;
    const playingMark = isPlaying ? '<i class="fa-solid fa-ear-listen fa-beat"></i>' : '';
    acc += `<div class="lap-list-row" data-id=${id}>
          <div class="lap-list-status">${playingMark}</div>
          <div class="lap-list-img"><img class="lap-list-poster" src="./localdata/${id}/${poster}"></div>
          <div>
            <div>${title}</div>
            <div style="color: #9392a7">${author}</div>
          </div>
        </div>`;
    return acc;
  }, '')

  listObj.innerHTML = listStr;
}

const eventInit = () => {
  allWriter.addEventListener("change", () => {
    const index = allWriter.selectedIndex; //序号，取当前选中选项的序号
    const text = allWriter.options[index].text;
    const validData = originData.filter(ele => ele.author == text)
    formatList(validData)
  });
  const newNodeList = lapListBody.querySelectorAll(".lap-list-row");
  for (let i = 0; i < newNodeList.length; i++) {
    const listenEle = newNodeList[i]
    listenEle.addEventListener("click", (e) => {
      const target = e.target;
      const id = target.getAttribute('data-id')
      console.log('id', id)
    });
  }

};

const getAuthors = async () => {
  const { status, data } = await axios.get(api.author);
  if (status == 200) {
    data.map((ele, index) => {
      allWriter.add(new Option(ele, index + 1));
    });
  }
};

const getPrograms = async () => {
  const { status, data } = await axios.get(api.program);
  if (status == 200) {
    originData = data;
    formatList(data)
  }
};

const init = () => {
  getPrograms()
  getAuthors()
  eventInit()
  audioEvent();
};
export { init };
