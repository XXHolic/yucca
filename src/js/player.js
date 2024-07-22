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
  }

  static get(ele) {
    return ele[expando];
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

const getMusic = async (params, opt = {}) => {
  const { needUpdate = true } = opt;
  const { status, data } = await axios.post(api.song, params);
  if (status == 200) {
    const { src, format, singerName, songName } = data;
    playerMsg.innerHTML = `${songName}-${singerName}`;
    playerTimeTotal.innerHTML = format;
    playerPlaying.style.width = "0%";
    audioEle.src = src;
    audioEle.setAttribute("data-songid", params.songId); // 播放时给上一首、下一首功能用
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
        const playerCycleOrder = document.querySelector("#playerCycleOrder");
        // 顺序播放
        if (playerCycleOrder.style.display === "block") {
          const songId = audioEle.getAttribute("data-songid");
          const selector = `.lmp-song-row[data-songid='${songId}']`;
          const playingRow = playerPopList.querySelector(selector);
          const nextId = playingRow.getAttribute("data-nextid");
          const selectorNext = `.lmp-song-row[data-songid='${nextId}']`;
          const targetRow = playerPopList.querySelector(selectorNext);
          const msg = getSongMsg(targetRow);
          getMusic(msg, { needUpdate: false });
        } else {
          player.play();
        }
      });
    } else {
      audioEle.play();
    }
  }
};

const audioEvent = () => {
  const playerContainer = document.querySelector("#playerContainer");
  const lapPopTime = document.querySelector("#lapPopTime");

  addEventOnce(playerContainer, "click", (e) => {
    const ele = e.target;
    const eleType = ele.getAttribute("data-type");
    console.info("eleType", eleType);
    switch (eleType) {
      case "list": {
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
        getMusic(msg, { needUpdate: false });
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
        getMusic(msg, { needUpdate: false });
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
};

export { getMusic, audioEvent };
