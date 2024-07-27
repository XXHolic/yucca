import { api } from "./api.mjs";
import { getPrograms, getAuthors, getProgramDetail, addCurrent, getCurrent } from './home.mjs'


const route = (req, res) => {
  console.log("About to route a request for " + req.url);
  const { url } = req;
  switch (url) {
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
    default: {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end("No Match Url");
    }
  }
};

export { route };
