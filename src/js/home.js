import axios from "../asset/js/axios.min.js";
import { api } from "./api.js";
import { spin, addEventOnce, showTrigger, storage, info } from "./util.js";
import { audioEvent, getAudio, getCurrent, AudioPlayer, getCurrentPlay } from "./player.js";

let originData = [] // 用来本地筛选

const audioEle = document.querySelector("#audioPlayer");
const listObj = document.querySelector("#lapListBody");
const allWriter = document.querySelector("#allWriter");
const lapProgram = document.querySelector("#lapProgram");
const lapProgramDetail = document.querySelector("#lapProgramDetail");
const lapDetailList = document.querySelector("#lapDetailList")
const lapProgramHistory = document.querySelector("#lapProgramHistory")
// 用来记录首页的点击进入详情的元素标记，这么做是因为首页滚动位置跟详情的滚动位置共享了，需要各自区分位置
let clickId = '';

const formatList = (data) => {
  const listStr = data.reduce((acc, cur, index) => {
    const { id, title, author, poster, date } = cur;
    acc += `<div class="lap-list-row" data-id=${id}>
          <div class="lap-list-img"><img class="lap-list-poster" data-src="./localdata/${id}/${poster}" src="./asset/list-default.png"></div>
          <div class="lap-list-msg">
            <div>${title}</div>
            <div class="lap-author">${date} ${author}</div>
          </div>
        </div>`;
    return acc;
  }, '')
  listObj.innerHTML = listStr;
}

const detailEvent = () => {
  const lapDetailBack = document.querySelector('#lapDetailBack')
  addEventOnce(lapDetailBack, "click", (e) => {
    showTrigger.show(lapProgram, lapProgramDetail);
    setTimeout(() => {
      const selector = `.lap-list-row[data-id="${clickId}"]`;
      const showTarget = listObj.querySelector(selector);
      if (showTarget) {
        showTarget.scrollIntoView({ block: "center" });
      }
    }, 500)
  })

  addEventOnce(lapDetailList, "click", (e) => {
    const target = e.target;
    const type = target.getAttribute('data-type');
    const sectionMark = target.getAttribute('data-mark');
    const sectionId = target.getAttribute('data-id');
    const currentPlay = audioEle.getAttribute('data-mark');
    if (type !== 'play') {
      return;
    }
    // 有已经或正在播放的，且是属于这个节目的，就要取消正在播放的样式
    const isSameProgram = currentPlay && currentPlay === sectionMark
    if (!isSameProgram) {
      const selector = `.lap-row-section[data-mark="${currentPlay}"]`;
      const playingTarget = lapDetailList.querySelector(selector);
      playingTarget && playingTarget.setAttribute('class', 'lap-row-section');
      target.setAttribute('class', 'lap-row-section red');
      const hasInstance = AudioPlayer.get(audioEle);
      hasInstance && AudioPlayer.resetCount();
      getAudio({ id: sectionId, mark: sectionMark, title: target.innerText })
    }
  })
}

const getDetail = async (params) => {
  spin.show()
  try {
    const { status, data } = await axios.post(api.programDetail, params);
    if (status == 200) {
      const { id, title, author, poster, date, list } = data
      const lapDetailPoster = document.querySelector("#lapDetailPoster");
      const lapDetailTitle = document.querySelector("#lapDetailTitle");
      const lapDetailAuthor = document.querySelector("#lapDetailAuthor");
      const lapDetailDate = document.querySelector("#lapDetailDate");
      lapDetailPoster.src = `./localdata/${id}/${poster}`;
      lapDetailTitle.innerHTML = title;
      lapDetailAuthor.innerHTML = author;
      lapDetailDate.innerHTML = `${date}首次发表`;
      const currentPlay = audioEle.getAttribute('data-mark');
      const listStr = list.reduce((acc, cur) => {
        const { title, child } = cur;
        let childStr = ''
        if (child) {
          childStr = child.reduce((accChild, curChild) => {
            const { fileName } = curChild;
            const mark = `${id}/${fileName}`
            const cls = currentPlay === mark ? 'lap-row-section red' : 'lap-row-section'
            accChild += `<div class="${cls}" data-id="${id}" data-mark="${mark}" data-name="${fileName}" data-type="play">${curChild.title}</div>`;
            return accChild
          }, '')

        }
        acc += `<div class="lap-detail-row">
            <div class="lap-row-chapter">${title}</div>
            ${childStr}
          </div>`;
        return acc;
      }, '')
      lapDetailList.innerHTML = listStr;
      setTimeout(() => {
        lapDetailPoster.scrollIntoView();
      }, 500);
      detailEvent()
    }
  } catch (error) {

  } finally {
    spin.hide()
  }

}

const historyEvent = () => {
  const lapHistoryBack = document.querySelector('#lapHistoryBack')
  addEventOnce(lapHistoryBack, "click", (e) => {
    showTrigger.show(lapProgram, lapProgramHistory);
    setTimeout(() => {
      const selector = `.lap-list-row[data-id="${clickId}"]`;
      const showTarget = listObj.querySelector(selector);
      if (showTarget) {
        showTarget.scrollIntoView({ block: "center" });
      }
    }, 500)
  })

  const lapHistoryList = lapProgramHistory.querySelector("#lapHistoryList");
  addEventOnce(lapHistoryList, "click", (e) => {
    const target = e.target;
    const type = target.getAttribute('data-type');
    const sectionMark = target.getAttribute('data-mark');
    const currentPlay = audioEle.getAttribute('data-mark');
    if (type !== 'play') {
      return;
    }
    const isSameProgram = currentPlay && currentPlay === sectionMark
    if (!isSameProgram) {
      const hasInstance = AudioPlayer.get(audioEle);
      hasInstance && AudioPlayer.resetCount();
      const arr = sectionMark.split('/');
      const sectionId = arr[0];
      getAudio({ id: sectionId, mark: sectionMark, title: target.innerText })
    }
  })
}

const getHistory = async () => {
  spin.show()
  try {
    const { status, data } = await axios.get(api.history);
    if (status == 200) {
      const listStr = data.reduce((acc, cur) => {
        const keys = Object.keys(cur);
        const key = keys[0];
        const values = cur[key];
        let childStr = values.reduce((accChild, curChild) => {
          const { mark, title } = curChild;
          accChild += `<div class="lap-row-section" data-mark="${mark}" data-type="play">${title}</div>`;
          return accChild
        }, '')

        acc += `<div class="lap-detail-row">
            <div class="lap-row-chapter">${key}</div>
            ${childStr}
          </div>`;
        return acc;
      }, '')
      const lapHistoryList = lapProgramHistory.querySelector("#lapHistoryList");
      lapHistoryList.innerHTML = listStr;
      historyEvent();
      setTimeout(() => {
        const ancor = lapProgramHistory.querySelector("#lapHistoryAncor");
        ancor.scrollIntoView();
      }, 500);

    }
  } catch (error) {

  } finally {
    spin.hide()
  }

}

const lazyLoadImg = () => {
  const imgEle = listObj.getElementsByTagName("img");
  callback(imgEle);
  const observer = new IntersectionObserver(callback);
  function callback(entries) {
    for (let i of entries) {
      if (i.isIntersecting) {
        let img = i.target;
        let trueSrc = img.getAttribute("data-src");
        img.setAttribute("src", trueSrc);
        observer.unobserve(img);
      }
    }
  }
  for (let i of imgEle) {
    if (!i.isIntersecting) {
      observer.observe(i);
    }
  }
}

const listEvent = () => {
  const newNodeList = lapListBody.querySelectorAll(".lap-list-row");
  for (let i = 0; i < newNodeList.length; i++) {
    const listenEle = newNodeList[i]
    const id = listenEle.getAttribute('data-id')
    addEventOnce(listenEle, "click", (e) => {
      clickId = id;
      showTrigger.show(lapProgramDetail, lapProgram)
      getDetail({ id })
    })
  }

  lazyLoadImg();
}

const eventInit = () => {
  allWriter.addEventListener("change", () => {
    const index = allWriter.selectedIndex; //序号，取当前选中选项的序号
    const text = allWriter.options[index].text;
    const validData = text === '全部' ? originData : originData.filter(ele => ele.author == text)
    formatList(validData)
    setTimeout(() => {
      listEvent();
    }, 1000)
  });

  setTimeout(() => {
    listEvent();
  }, 1000)

  const lapUser = document.querySelector('#lapUser');
  lapUser.addEventListener("click", () => {
    if (window.confirm("确定要退出吗?")) {
      storage.remove('name');
      storage.remove('password');
      storage.remove('userId');
      window.location.href = './index.html';
    }
  });

  const lapHistory = document.querySelector('#lapHistory');
  lapHistory.addEventListener("click", () => {
    const newNodeList = lapListBody.querySelectorAll(".lap-list-row");
    for (let i = 0; i < newNodeList.length; i++) {
      const listenEle = newNodeList[i];
      const { top } = listenEle.getBoundingClientRect();
      if (top > 50) {
        const id = listenEle.getAttribute('data-id');
        clickId = id;
        break;
      }
    }
    showTrigger.show(lapProgramHistory, lapProgram);
    getHistory();
  });

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
    eventInit()
  }
};

const init = () => {
  // 全局设置请求
  const userId = storage.get('userId');
  const name = storage.get('name');
  if (!userId) {
    info.show("用户登陆信息无效");
    return false;
  }
  const lapUser = document.querySelector('#lapUser');
  lapUser.innerHTML = name;
  axios.defaults.headers.common['Authorization'] = userId;
  getPrograms();
  getAuthors();
  audioEvent();
  getCurrent({ showSpin: false });
  getCurrentPlay();
};
export { init };
