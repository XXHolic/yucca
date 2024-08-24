import axios from "../asset/js/axios.min.js";
import { api } from "./api.js";
import { spin, addEventOnce, showTrigger, storage } from "./util.js";

const tabEvent = () => {
  const loginTabAll = document.querySelector('.lap-login-tab');
  const loginTab = document.querySelector('#loginTab');
  const registerTab = document.querySelector('#registerTab');
  const touristTab = document.querySelector('#touristTab');
  const loginSection = document.querySelector('#loginSection');
  const registerSection = document.querySelector('#registerSection');
  const touristSection = document.querySelector('#touristSection');
  addEventOnce(loginTabAll, "click", (e) => {
    const target = e.target;
    const type = target.getAttribute('data-type');
    switch (type) {
      case "login": {
        loginTab.setAttribute('class', 'lap-tab active');
        registerTab.setAttribute('class', 'lap-tab');
        touristTab.setAttribute('class', 'lap-tab');
        showTrigger.show(loginSection, [registerSection, touristSection]);
        break;
      }
      case "register": {
        registerTab.setAttribute('class', 'lap-tab active');
        loginTab.setAttribute('class', 'lap-tab');
        touristTab.setAttribute('class', 'lap-tab');
        showTrigger.show(registerSection, [loginSection, touristSection]);
        break;
      }
      case "tourist": {
        touristTab.setAttribute('class', 'lap-tab active');
        registerTab.setAttribute('class', 'lap-tab');
        loginTab.setAttribute('class', 'lap-tab');
        showTrigger.show(touristSection, [registerSection, loginSection]);
        break;
      }
    }
  })
}

const saveLogin = (params) => {
  const { name, password, userId } = params
  storage.set('name', name);
  storage.set('password', password);
  storage.set('userId', userId);
}

const getLogin = () => {
  const name = storage.get('name');
  const password = storage.get('password');
  const hasData = name && password;
  return { name, password, hasData }
}

const loginEvent = () => {
  const loginUser = document.querySelector('#loginUser');
  const loginPass = document.querySelector('#loginPass');
  const loginErr = document.querySelector('#loginErr');
  const loginBtn = document.querySelector('#loginBtn');

  addEventOnce(loginBtn, "click", async (e) => {
    const name = loginUser.value;
    const password = loginPass.value;
    let userTip = '', passTip = '';
    if (!name) {
      userTip = '必填';
    }

    if (!password) {
      passTip = '必填';
    }

    if (userTip || passTip) {
      loginErr.innerHTML = '用户名和密码必填';
      return;
    }

    const params = { name, password };
    spin.show();
    try {
      const { status, data } = await axios.post(api.login, params);
      if (status == 200) {
        const { code } = data
        if (code == 200) {
          loginErr.innerHTML = '';
          saveLogin({ ...params, userId: data.data.userId });
          window.location.href = "./home.html";
        } else {
          loginErr.innerHTML = data.data
        }
      }
    } catch (error) {

    } finally { spin.hide() }
  });
}

const registerEvent = () => {
  const regUser = document.querySelector('#regUser');
  const regUserErr = document.querySelector('#regUserErr');
  const regPass = document.querySelector('#regPass');
  const regPassErr = document.querySelector('#regPassErr');
  const regErr = document.querySelector('#regErr');
  const regBtn = document.querySelector('#regBtn');

  let regUserTip = '';
  addEventOnce(regUser, "input", (e) => {
    const str = e.target.value;
    const value = str.replace(/\s*/g, "");
    if (value.length < 1 || value.length > 4) {
      regUserTip = '长度最短1，最长4';
    } else {
      regUserTip = '';
    }
    regUserErr.innerHTML = regUserTip;
  });

  let regPassTip = '';
  addEventOnce(regPass, "input", (e) => {
    const str = e.target.value;
    const value = str.replace(/\s*/g, "");
    if (value.length < 4 || value.length > 12) {
      regPassTip = '长度最短4，最长12';
    } else {
      regPassTip = '';
    }
    regPassErr.innerHTML = regPassTip;
  });

  addEventOnce(regBtn, "click", async (e) => {
    const name = regUser.value;
    const password = regPass.value;
    if (!name) {
      regUserTip = '必填';
      regUserErr.innerHTML = regUserTip;
    }

    if (!password) {
      regPassTip = '必填';
      regPassErr.innerHTML = regPassTip;
    }

    if (regUserTip || regPassTip) {
      return;
    }

    const params = { name, password };
    spin.show();
    try {
      const { status, data } = await axios.post(api.register, params);
      if (status == 200) {
        const { code } = data
        if (code == 200) {
          regUser.value = '';
          regPass.value = '';
          regErr.innerHTML = '';
          saveLogin({ ...params, userId: data.data.userId });
          window.location.href = "./home.html";
        } else {
          regErr.innerHTML = data.data
        }
      }
    } catch (error) {

    } finally { spin.hide() }
  });
}

const eventInit = () => {
  tabEvent();
  loginEvent();
  registerEvent();

  const touristBtn = document.querySelector('#touristBtn');
  addEventOnce(touristBtn, "click", async (e) => {
    spin.show();
    const params = { name: '游客', password: '1234' };
    try {
      const { status, data } = await axios.post(api.login, params);
      if (status == 200) {
        const { code } = data;
        if (code === 200) {
          saveLogin({ ...params, userId: data.data.userId });
          window.location.href = "./home.html";
        }
      }
    } catch (error) {

    } finally { spin.hide() }
  })
}

const init = () => {
  const data = getLogin();
  if (data.hasData) {
    window.location.href = "./home.html";
    return;
  }
  eventInit();
};
export { init };