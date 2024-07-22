import axios from "../asset/js/axios.min.js";
import { api } from "./api.js";
import { spin } from "./util.js";
import { audioEvent } from "./player.js";

const eventInit = () => {};

const getAuthor = async () => {
  const { status, data } = await axios.get(api.author);
  if (status == 200) {
  }
};

const getProgram = async () => {
  const { status, data } = await axios.get(api.program);
  if (status == 200) {
  }
};

const init = () => {
  audioEvent();
};
export { init };
