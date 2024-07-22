const spin = {
  show: () => {
    const ele = document.querySelector("#lapSpin");
    ele.style.display = "block";
  },
  hide: () => {
    const ele = document.querySelector("#lapSpin");
    ele.style.display = "none";
  },
};

const info = {
  show: (str, time = 2000) => {
    const ele = document.querySelector("#lapInfo");
    ele.style.display = "block";
    ele.innerHTML = str ? str : "操作成功";
    setTimeout(() => {
      ele.style.display = "none";
    }, time);
  },
  err: (str, time = 2000) => {
    const ele = document.querySelector("#lapInfo");
    ele.style.display = "block";
    ele.innerHTML = `<div style="color:red">${str}</div>`;
    setTimeout(() => {
      ele.innerHTML = "";
      ele.style.display = "none";
    }, time);
  },
  hide: () => {
    const ele = document.querySelector("#lapInfo");
    ele.innerHTML = "";
    ele.style.display = "none";
  },
};

const showTrigger = {
  show: (showEle, hideEle) => {
    if (Array.isArray(showEle)) {
      showEle.forEach((ele) => {
        ele.style.display = "block";
      });
    } else {
      showEle.style.display = "block";
    }
    if (hideEle) {
      if (Array.isArray(hideEle)) {
        hideEle.forEach((ele) => {
          ele.style.display = "none";
        });
      } else {
        hideEle.style.display = "none";
      }
    }
  },
  hide: (hideEle) => {
    if (Array.isArray(hideEle)) {
      hideEle.forEach((ele) => {
        ele.style.display = "none";
      });
    } else {
      hideEle.style.display = "none";
    }
  },
};

// 避免重复绑定事件
const addEventOnce = (ele, eventName, handler) => {
  if (ele.clickHandler) {
    ele.removeEventListener(eventName, ele.clickHandler);
  }
  ele.clickHandler = handler;
  ele.addEventListener(eventName, ele.clickHandler);
};

const formatSeconds = (times) => {
  let t = "";
  if (times > -1) {
    let hour = Math.floor(times / 3600);
    let min = Math.floor(times / 60) % 60;
    let sec = times % 60;
    if (hour > 0) {
      if (hour < 10) {
        t = "0" + hour + ":";
      } else {
        t = hour + ":";
      }
    }

    if (min < 10) {
      t += "0";
    }
    t += min + ":";
    if (sec < 10) {
      t += "0";
    }
    t += sec.toFixed(2);
  }
  t = t.substring(0, t.length - 3);
  return t;
};

const getSongMsg = (ele) => {
  const songId = Number(ele.getAttribute("data-songid"));
  const songName = ele.getAttribute("data-songname");
  const singerId = Number(ele.getAttribute("data-singerid"));
  const singerName = ele.getAttribute("data-singername");
  return { songId, songName, singerId, singerName };
};

const storage = {
  set: (name, value) => {
    window.localStorage.setItem(name, value);
  },
  get: (name) => {
    return window.localStorage.getItem(name);
  },
  remove: (name) => {
    window.localStorage.removeItem(name);
  },
};

export {
  spin,
  info,
  showTrigger,
  storage,
  addEventOnce,
  formatSeconds,
  getSongMsg,
};