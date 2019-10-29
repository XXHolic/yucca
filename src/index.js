import request from './request';

request({type: 'get', url: "https://xxholic.github.io/lab/data/hemeraData.json"}).then((data) =>{
  console.info('run success1',data);
});

request({type: 'get', url: "https://xxholic.github.io/lab/data/hemeraData.json"}).then((data) =>{
  console.info('run success2',data);
});