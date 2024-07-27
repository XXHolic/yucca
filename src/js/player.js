import axios from "../asset/js/axios.min.js";
import { api } from "./api.js";
import { spin, info, showTrigger, storage, addEventOnce } from "./util.js";

const expando = "player" + new Date().getTime();
class AudioPlayer {
  constructor(params) {
    const { ele, src } = params;
    ele[expando] = this;
    this.ele = ele;
    this.src = src;
    this.playCount = 0;
  }

  static get(ele) {
    return ele[expando];
  }

  getCount() {
    return this.playCount;
  }

  resetCount() {
    this.playCount = 0;
  }

  addCount() {
    this.playCount = this.playCount + 1;
  }

  play() {
    this.ele.play();
  }

  pause() {
    this.ele.pause();
  }

  on(type, fun) {
    this.ele.addEventListener(type, fun);
  }
}

const audioEle = document.querySelector("#audioPlayer");
const playerMsg = document.querySelector("#playerMsg");
const lapCurrentList = document.querySelector("#lapCurrentList");

const getCurrent = async (params = {}) => {
  const { showSpin = true } = params;
  showSpin && spin.show();
  try {
    const { status, data } = await axios.get(api.current);
    if (status == 200) {
      const { id, title, author, poster, date, list } = data
      const lapCurrentTitle = document.querySelector("#lapCurrentTitle");
      const lapCurrentAuthor = document.querySelector("#lapCurrentAuthor");
      lapCurrentTitle.innerHTML = title;
      lapCurrentAuthor.innerHTML = author;
      const currentPlay = audioEle.getAttribute('data-mark');
      const total = list.length;
      const listStr = list.reduce((acc, cur, index) => {
        const { title, child } = cur;
        let childStr = ''
        if (child) {
          const childTotal = child.length;
          childStr = child.reduce((accChild, curChild, indexChild) => {
            const { fileName } = curChild;
            const isFirst = index === 0 && indexChild === 0;
            const isChildFirst = indexChild === 0;
            const isLast = index === total - 1 && indexChild === childTotal - 1;
            const isChildLast = indexChild === childTotal - 1;
            let elePre = {},
              eleNext = {},
              dataPreId = "none",
              dataNextId = "none";
            // 先排除只有一条的情况
            if (!(isFirst && isLast)) {
              // 只有一个子元素的情况
              if (childTotal === 1) {
                const preChapter = list[index - 1];
                if (preChapter) {
                  const preChild = preChapter.child;
                  elePre = preChild[preChild.length - 1];
                  dataPreId = elePre.fileName;
                }
                const nextChapter = list[index + 1];
                if (nextChapter) {
                  const nextChild = nextChapter.child;
                  eleNext = nextChild[0];
                  dataNextId = eleNext.fileName;
                }
              } else {
                if (isChildFirst) {
                  eleNext = child[indexChild + 1];
                  if (eleNext) {
                    dataNextId = eleNext.fileName;
                  }
                  const preChapter = list[index - 1];
                  if (preChapter) {
                    const preChild = preChapter.child;
                    elePre = preChild[preChild.length - 1];
                    dataPreId = elePre.fileName;
                  }
                } else if (isChildLast) {
                  elePre = child[indexChild - 1];
                  if (elePre) {
                    dataPreId = elePre.fileName;
                  }
                  const nextChapter = list[index + 1];
                  if (nextChapter) {
                    const nextChild = nextChapter.child;
                    eleNext = nextChild[0];
                    dataNextId = eleNext.fileName;
                  }
                } else {
                  eleNext = child[indexChild + 1];
                  elePre = child[indexChild - 1];
                  dataPreId = elePre.fileName;
                  dataNextId = eleNext.fileName;
                }
              }

            }
            const mark = `${id}/${fileName}`
            const cls = currentPlay === mark ? 'lap-row-section red' : 'lap-row-section'
            accChild += `<div class="${cls}" data-pre=${dataPreId} data-next=${dataNextId} data-id="${id}" data-mark="${mark}" data-type="play">${curChild.title}</div>`;
            return accChild
          }, '')

        }
        acc += `<div class="lap-detail-row">
            <div class="lap-row-chapter">${title}</div>
            ${childStr}
          </div>`;
        return acc;
      }, '')
      lapCurrentList.innerHTML = listStr;
    }
  } catch (error) {
    console.log('error', error)
  } finally {
    spin.hide()
  }

}

const getAudio = async (params, opt = {}) => {
  const { needUpdate = true } = opt;
  const { title, mark } = params;
  playerMsg.innerHTML = title;
  const src = `./localdata/${mark}`
  audioEle.src = src;
  audioEle.setAttribute("data-mark", mark); // 播放时给上一首、下一首功能用
  // 上一首，下一首功能不需要这个
  if (needUpdate) {
    axios.post(api.currentAdd, params).then(() => {
      getCurrent({ showSpin: false });
    });
  }
  const hasInstance = AudioPlayer.get(audioEle);
  if (!hasInstance) {
    const player = new AudioPlayer({ ele: audioEle, src });
    player.play();

    player.on("ended", () => {
      const playerCycleOrder = document.querySelector(".lap-time-opt active");
      // 顺序播放
      if (playerCycleOrder.style.display === "block") {
        const songId = audioEle.getAttribute("data-songid");
        const selector = `.lmp-song-row[data-songid='${songId}']`;
        const playingRow = playerPopList.querySelector(selector);
        const nextId = playingRow.getAttribute("data-nextid");
        const selectorNext = `.lmp-song-row[data-songid='${nextId}']`;
        const targetRow = playerPopList.querySelector(selectorNext);
        const msg = getSongMsg(targetRow);
        getAudio(msg, { needUpdate: false });
      } else {
        player.play();
      }
    });
  } else {
    audioEle.play();
  }
};

const popPlayIntoView = () => {
  setTimeout(() => {
    const currentMark = audioEle.getAttribute('data-mark');
    const selector = `.lap-row-section[data-mark="${currentMark}"]`;
    const listTarget = lapCurrentList.querySelector(selector);
    listTarget && listTarget.scrollIntoView()
  }, 1000)
}

const audioEvent = () => {
  const playerContainer = document.querySelector("#playerContainer");
  const lapPopTime = document.querySelector("#lapPopTime");
  const lapPopCurrent = document.querySelector("#lapPopCurrent");
  const lapCurrentClose = document.querySelector("#lapCurrentClose");

  addEventOnce(playerContainer, "click", (e) => {
    const ele = e.target;
    const eleType = ele.getAttribute("data-type");
    console.info("eleType", eleType);
    switch (eleType) {
      case "list": {
        getCurrent();
        showTrigger.show(lapPopCurrent);
        popPlayIntoView();
        break;
      }
      case "time": {
        const timeSet = storage.get("timeSet");
        if (timeSet) {
          const timeItemEle =
            lapPopTime.getElementsByClassName("lap-time-opt") || [];
          Array.prototype.forEach.call(timeItemEle, (ele) => {
            ele.setAttribute("class", "lap-time-opt");
          });
          const selector = `.lap-time-opt[data-id='${timeSet}']`;
          const activeEle = lapPopTime.querySelector(selector);
          activeEle.setAttribute("class", "lap-time-opt active");
        }
        showTrigger.show(lapPopTime);
        break;
      }
      case "pre": {
        if (!audioEle.src) {
          info.show("暂无节目播放");
          return;
        }
        const songId = audioEle.getAttribute("data-songid");
        const selector = `.lmp-song-row[data-songid='${songId}']`;
        const playingRow = playerPopList.querySelector(selector);
        const preId = playingRow.getAttribute("data-preid");
        const selectorPre = `.lmp-song-row[data-songid='${preId}']`;
        const targetRow = playerPopList.querySelector(selectorPre);
        const msg = getSongMsg(targetRow);
        getAudio(msg, { needUpdate: false });
        setTimeout(() => {
          getCurrent({ showSpin: false });
        }, 1000);
        break;
      }
      case "next": {
        if (!audioEle.src) {
          info.show("暂无节目播放");
          return;
        }
        const songId = audioEle.getAttribute("data-songid");
        const selector = `.lmp-song-row[data-songid='${songId}']`;
        const playingRow = playerPopList.querySelector(selector);
        const nextId = playingRow.getAttribute("data-nextid");
        const selectorNext = `.lmp-song-row[data-songid='${nextId}']`;
        const targetRow = playerPopList.querySelector(selectorNext);
        const msg = getSongMsg(targetRow);
        getAudio(msg, { needUpdate: false });
        setTimeout(() => {
          getCurrent({ showSpin: false });
        }, 1000);
        break;
      }
    }
  });

  lapPopTime.addEventListener("click", (e) => {
    const ele = e.target;
    const type = ele.getAttribute("data-type");
    switch (type) {
      case "time": {
        const id = ele.getAttribute("data-id");
        storage.set("timeSet", id);
        showTrigger.hide(lapPopTime);
      }
      case "cancel": {
        showTrigger.hide(lapPopTime);
        break;
      }
    }
  });

  lapCurrentClose.addEventListener("click", (e) => {
    showTrigger.hide(lapPopCurrent);
  });

  lapCurrentList.addEventListener("click", (e) => {
    const target = e.target;
    const type = target.getAttribute('data-type');
    const audioMark = target.getAttribute('data-mark');
    const audioId = target.getAttribute('data-id');
    const currentMark = audioEle.getAttribute('data-mark');
    if (type !== 'play') {
      return;
    }
    // 有已经或正在播放的，且是属于这个节目的，就要取消正在播放的样式
    const isSameProgram = currentMark && currentMark === audioMark;
    if (!isSameProgram) {
      const selector = `.lap-row-section[data-mark="${currentMark}"]`;
      const listTarget = lapCurrentList.querySelector(selector);
      listTarget && listTarget.setAttribute('class', 'lap-row-section');
      target.setAttribute('class', 'lap-row-section red')
    }
    getAudio({ id: audioId, mark: audioMark, title: target.innerText })
  });
};

export { getAudio, audioEvent };
