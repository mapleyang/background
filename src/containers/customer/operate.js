import { Modal  } from 'antd'
const Operate = {
  /*异步操作*/
  getResponse: (url, data, type, dataType) => {
    let promise = new Promise(function(resolve, reject) {
      Operate.Ajax(url, data, type , dataType, resolve, reject)
    })
    return promise;
  },
  /*请求操作*/
  Ajax: (url, data, type, dataType, resolve, reject) => {
    window.$.ajax({
      type: type,
      url: url,
      data: data,
      dataType: dataType,
      success:function(res){
        if(dataType === "html") {
          let data = JSON.parse(res)
          resolve(data)
        }
        else {
          resolve(res)
        }
      },
      error:function(res){
        if(dataType === "html") {
          let data = JSON.parse(res)
          resolve(data)
        }
        else {
          resolve(res)
        }
      }
    });
  },
}

export default Operate;