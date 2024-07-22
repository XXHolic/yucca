import { api } from "./api.mjs";

const route = (req, res) => {
  console.log("About to route a request for " + req.url);
  const { url } = req;
  switch (url) {
    case api.sheet: {
      sheetList(res);
      break;
    }
    default: {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end("No Match Url");
    }
  }
};

export { route };
