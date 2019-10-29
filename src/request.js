import axios from 'axios';

class Request {
  constructor(options) {
    let axiosConfig = {
      timeout: 10000,
      headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
      }
    };
    const { headers, url } = options;
    if (headers) {
      axiosConfig = {...axiosConfig, ...headers };
    }
    // debugger;
    this.axiosConfig = {...axiosConfig};
    this.options = {...options};
    this.url = url;
    this.axiosInstance = axios.create();
    // 返回数据的处理，不能多次注册，多次注册会多次触发
    this.axiosInstance.interceptors.response.use(function (config) {
      // console.info('config',config);
      return config.data;
    }, function (error) {
      //
      return Promise.reject(error);
    });
  }

  get(data) {
    const { axiosInstance,url,axiosConfig } = this;

    let paramStr = '', reqUrl = url;
    Object.keys(data).forEach((key) => {
      paramStr += `${key}=${data[key]}&`;
    });
    if (paramStr !== '') {
      paramStr = paramStr.substr(0, paramStr.lastIndexOf('&'));
      reqUrl = `${url}?${paramStr}`;
    }

    return axiosInstance.get(reqUrl,axiosConfig).then((data) => {
      if (data) {
        return Promise.resolve(data);
      }
    });

  }

  post(data) {
    const { axiosInstance,url,axiosConfig,options } = this;
    const { isUpload } = options;

    let bodyData = null;
    if (isUpload) {
      bodyData = new FormData();
      Object.keys(data).forEach((key) => {
        bodyData.append(key, data[key]);
      });
    } else {
      bodyData = JSON.stringify(data);
    }

    return axiosInstance.post(url, bodyData, axiosConfig).then((data) => {
      if (data) {
        return Promise.resolve(data);
      }
    });
  }
}

const createRequest = (options={}, data={}) => {
  const { type } = options;
  const request = new Request(options);
  const reqType = String(type).toLowerCase();
  switch (reqType) {
    case 'get':
      return new Promise ((resolve) => {
        request.get(data).then((backData) => {
          // console.info('inner data',backData);
          if (backData) {
            resolve(backData);
          }
        });
      });
    case 'post':
      return new Promise ((resolve) => {
        request.post(data).then((backData) => {
          // console.info('inner data',backData);
          if (backData) {
            resolve(backData);
          }
        });
      });
  }
  return ;
}


export default createRequest;