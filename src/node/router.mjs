import { api } from "./api.mjs";
import { userLogin, userRegister } from './user.mjs'
import { getPrograms, getAuthors, getProgramDetail, addCurrent, getCurrent, saveCurrentPlay, getCurrentPlay, getHistory } from './home.mjs'


const route = (req, res) => {
  console.log("About to route a request for " + req.url);
  const { url } = req;
  switch (url) {
    case api.login: {
      userLogin(req, res)
      break;
    }
    case api.register: {
      userRegister(req, res)
      break;
    }
    case api.program: {
      getPrograms(res)
      break;
    }
    case api.author: {
      getAuthors(res)
      break;
    }
    case api.programDetail: {
      getProgramDetail(req, res)
      break;
    }
    case api.currentAdd: {
      addCurrent(req, res)
      break;
    }
    case api.current: {
      getCurrent(req, res)
      break;
    }
    case api.currentPlaySave: {
      saveCurrentPlay(req, res)
      break;
    }
    case api.currentPlayGet: {
      getCurrentPlay(req, res)
      break;
    }
    case api.history: {
      getHistory(req, res)
      break;
    }
    default: {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end("No Match Url");
    }
  }
};

export { route };
