import axios from "../asset/js/axios.min.js";
import { api } from "./api.js";
import { spin, info, showTrigger, addEventOnce, getSongMsg } from "./util.js";
import { collectSong } from "./singer.js";

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

const getCurrent = async (params) => {
  const { showSpin = true } = params || {};
  showSpin && spin.show();
  try {
    const { status, data } = await axios.get(api.current);
    if (status === 200) {
      const playingId = Number(audioEle.getAttribute("data-songid"));
      const total = data.length;
      const listStr =
        data &&
        data.reduce((acc, cur, index) => {
          const { singerId, singerName, songId, songName } = cur;
          const isFirst = index === 0;
          const isLast = index === total - 1;
          const isPlaying = playingId == songId && audioEle.src;
          let elePre = {},
            eleNext = {},
            dataPreId = songId,
            dataNextId = songId;
          if (total != 1) {
            if (isFirst) {
              elePre = data[total - 1];
              eleNext = data[index + 1];
              if (eleNext) {
                dataNextId = eleNext.songId;
                dataPreId = elePre.songId;
              }
            } else if (isLast) {
              elePre = data[index - 1];
              eleNext = data[0];
              if (elePre) {
                dataPreId = elePre.songId;
                dataNextId = eleNext.songId;
              }
            } else {
              eleNext = data[index + 1];
              elePre = data[index - 1];
              dataPreId = elePre.songId;
              dataNextId = eleNext.songId;
            }
          }
          const rowCls = index % 2 ? "" : "lmp-song-odd";
          const playingStyle = isPlaying ? "inline-block" : "none";
          acc += `<div class="lmp-song-row ${rowCls}" data-preid=${dataPreId} data-nextid=${dataNextId} data-songid=${songId} data-songname=${songName} data-singername=${singerName} data-singerid=${singerId}>
                      <div class="lmp-song-status"><i class="fa-solid fa-music fa-beat" style="display: ${playingStyle}"></i></div>
                      <div class="lmp-song-name">${songName}</div>
                      <div class="lmp-song-singer">
                        <span class="lmp-song-span lmp-cursor-pointer" data-id=${singerId} data-name=${singerName} data-type="jump">${singerName}</span>
                      </div>
                      <div class="lmp-song-operate">
                        <div class="lmp-operate-play lmp-cursor-pointer" title="播放">
                          <i class="fa-regular fa-circle-play fa-lg" data-songid=${songId}  data-songname=${songName} data-singername=${singerName} data-singerid=${singerId} data-type="play"></i>
                        </div>
                        <div class="lmp-operate-add lmp-cursor-pointer" title="收藏">
                          <i class="fa-solid fa-folder fa-lg" data-songid=${songId}  data-songname=${songName} data-singername=${singerName} data-singerid=${singerId} data-type="tuck"></i>
                        </div>
                        <div class="lmp-operate-dele lmp-cursor-pointer" title="移除">
                          <i class="fa-solid fa-trash-can fa-lg" data-songid=${songId} data-type="dele"></i>
                        </div>
                        <div class="lmp-operate-drag lmp-cursor-pointer" title="拖拽排序" data-songid=${songId}>
                          <i class="fa-solid fa-bars fa-lg"></i>
                        </div>
                      </div>
                    </div>`;
          return acc;
        }, "");
      const listObj = document.querySelector("#playerPopBody");
      listObj.innerHTML = listStr;
    }
  } catch (error) {
    console.error(error);
  } finally {
    showSpin && spin.hide();
  }
};

const playBtnTrigger = (status) => {
  // 播放歌曲时统一播放样式，其它就是交互互斥
  const playerPlay = document.querySelector("#playerPlay");
  const playerPause = document.querySelector("#playerPause");
  if (status === "play") {
    showTrigger.show(playerPause, playerPlay);
    return;
  }
  if (playerPlay.style.display === "block") {
    showTrigger.show(playerPause, playerPlay);
  } else {
    showTrigger.show(playerPlay, playerPause);
  }
};

const addCurrentPlayList = (params) => {
  if (params.isPlayAll) {
    axios.post(api.currentAdd, params).then(() => {
      getCurrent({ showSpin: false });
    });
    return;
  }
  axios.post(api.currentAdd, params).then(() => {
    info.show("添加成功");
    getCurrent({ showSpin: false });
  });
};

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
      playBtnTrigger("play");

      player.on("play", () => {
        preloadProgress();
        playingProgress();
      });

      player.on("pause", () => {
        clearTimeout(preloadTimer);
        clearTimeout(playingTimer);
      });

      player.on("ended", () => {
        clearTimeout(preloadTimer);
        clearTimeout(playingTimer);
        playerPreload.style.width = "0%";
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
          playBtnTrigger("play");
        }
      });
    } else {
      audioEle.play();
      playBtnTrigger("play");
    }
  }
};

const audioEvent = () => {
  const playerControlBtn = document.querySelector("#playerControlBtn");
  const playerOperateBtn = document.querySelector("#playerOperateBtn");
  const playerCycleLoop = document.querySelector("#playerCycleLoop");
  // const playerCycleRandom = document.querySelector("#playerCycleRandom");
  const playerCycleOrder = document.querySelector("#playerCycleOrder");
  const playerPopList = document.querySelector("#playerPopList");
  const playerPopTriangle = document.querySelector("#playerPopTriangle");
  const playerProgress = document.querySelector("#playerProgress");

  addEventOnce(playerControlBtn, "click", (e) => {
    if (!audioEle.src) {
      info.show("暂无歌曲播放");
      return;
    }
    const ele = e.target;
    const eleType = ele.getAttribute("data-type");
    console.info("eleType", eleType);
    switch (eleType) {
      case "pre": {
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
      case "play": {
        playBtnTrigger();
        if (audioEle.paused) {
          audioEle.play();
        } else {
          audioEle.pause();
        }
        break;
      }
      case "next": {
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

  const currentDele = async (params) => {
    const { isAll } = params;
    const { status } = await axios.post(api.currentDel, params);
    if (status === 200) {
      getCurrent();
      const listTotal = document.querySelector("#playerTotalCount");
      const total = Number(listTotal.getAttribute("data-total"));
      const isNeedReset = total == 1 || isAll;
      if (isNeedReset && audioEle.src) {
        if (!audioEle.paused) {
          audioEle.pause();
        }
        audioEle.src = "";
        playerMsg.innerHTML = "/-/";
        playerTimePlaying.innerHTML = "00:00";
        playerTimeTotal.innerHTML = "00:00";
        preloadTimer && clearTimeout(preloadTimer);
        playingTimer && clearTimeout(playingTimer);
        playerPreload.style.width = `0%`;
        playerPlaying.style.width = `0%`;
      }
    }
  };

  addEventOnce(playerOperateBtn, "click", (e) => {
    const ele = e.target;
    const eleType = ele.getAttribute("data-type");
    switch (eleType) {
      case "playLoop": {
        showTrigger.show(playerCycleOrder, playerCycleLoop);
        audioEle.loop = false;
        break;
      }
      case "playRandom": {
        break;
      }
      case "playOrder": {
        showTrigger.show(playerCycleLoop, playerCycleOrder);
        audioEle.loop = true;
        break;
      }
      case "list": {
        if (playerPopList.style.display == "block") {
          showTrigger.hide([playerPopList, playerPopTriangle]);
        } else {
          showTrigger.show([playerPopList, playerPopTriangle]);
          getCurrent();
        }
        break;
      }
      case "play": {
        const msg = getSongMsg(ele);
        getMusic(msg, { needUpdate: false });
        setTimeout(() => {
          getCurrent({ showSpin: false });
        }, 1000);
        break;
      }
      case "tuck": {
        const msg = getSongMsg(ele);
        collectSong(msg);
        break;
      }
    }
  });

  addEventOnce(playerProgress, "click", (e) => {
    if (audioEle.src) {
      const width = parseFloat(
        window.getComputedStyle(playerProgress, null).getPropertyValue("width")
      );
      const currentTime = ((e.offsetX / width) * audioEle.duration).toFixed();
      audioEle.currentTime = currentTime;
    }
  });
};

export { getMusic, audioEvent, addCurrentPlayList };
