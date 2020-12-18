import { DeviceEventEmitter, Alert } from 'react-native';
import AppStore from './.../../../stores/AppStore';
import { Actions } from 'react-native-router-flux';


 //退出登录
 function loginOut(){
  //发送退出登录消息
  // global.ToastUtil.showToast("身份驗證失敗,請重新登錄")
    // Alert.alert("身份驗證失敗,請重新登錄")

   DeviceEventEmitter.emit(global.KeyConst.KNotification_logout, true);
}

//用户未激活
function notActivatedAndLoginOut(){
  
   DeviceEventEmitter.emit(global.KeyConst.KNotification_logout, true);
}


function _fetch(fetch_promise, timeout) {
        var abort_fn = null;
        var abort_promise = new Promise(function(resolve, reject) {
            abort_fn = function() {
                // reject('连接服务器超时，请检查网络状态');
            };
        });
       var abortable_promise = Promise.race([
            fetch_promise,
            abort_promise
       ]);
       setTimeout(function() {
             abort_fn();
        }, timeout);
       return abortable_promise;
}

 const request = (url, options) => {


    console.log(options)
    let method = options.method
    let params = options.data.params
    let imageData = options.imageData

    let formData = new FormData();

    if(method == "GET"){
      if (params) {
        let paramsStr = '';
        for (var key in params){
          paramsStr += (key + '=' + params[key] + "&")
        }
        url += (url.search(/\?/) === -1) ? ('?'+paramsStr):(paramsStr)
      }
    }else{
      for (var key in params){
          formData.append(key, params[key]);
      }
    }

    if(imageData){
      let uri = imageData.uri
      let fileName = imageData.fileName
      let name = imageData.name
      let mime = imageData.mime
      let file = {uri: 'file://' + uri, type: mime, name: name};
			formData.append(fileName, file);
    }
    console.log(url)
    return new Promise(function (resolve, reject) {
      _fetch(
            fetch(url, 
                  { method: method, 
                    body: method == "GET" ? null:( imageData ? formData:JSON.stringify(params)),
                    headers: {
                      'Accept':'application/json',
                      'Content-Type': imageData ? 'multipart/form-data':'application/json',
                      'Authorization': AppStore.userToken,
                    },
                  }
            ), 
            15000
          ).then((response) => {
            console.log(response);
             return response.json();  
          }).then((responseJson) => {
            console.log(url,":",responseJson)
            if(responseJson.hash && responseJson.key){
              return responseJson
            }else{
              let code = responseJson.code
              let data = responseJson.data
              let msg = responseJson.msg
              if (code == 0){
                return data;
              }else if(code == 1){
                Alert.alert(msg, '', [ {text:'确认', onPress:()=>{Actions.pop();}}], {cancelable:false});
                reject(new Error(msg));
              }else if(code == 4999){
                // global.ToastUtil.showToast(msg)
                reject(new Error(msg))
                Alert.alert(msg)
              }else if(code == 4001){
                // 退出登录
                Alert.alert("身份驗證失敗,請重新登錄")
                loginOut()
                reject(new Error("身份驗證失敗,請重新登錄"))
              }else if(code == 4003){
                Alert.alert(msg,'',[ {text:'确认',onPress:()=>notActivatedAndLoginOut()}],{cancelable:false})
                reject(new Error(msg))
              }else{
                reject(new Error(msg))
              }
            }
          }).then((result) => {
             resolve(result);
          }).catch((error)=> {
            console.log(error);
             reject(error);
          });
    });

}

const get = (url, data = {}) => {
    return request(url, { method: 'GET', data: data })
  }
  
  const post = (url, data= {}) => {
    return request(url, { method: 'POST', data: data })
  }
  
  const put = (url, data= {}) => {
    return request(url, { method: 'PUT', data: data })
  }
  
  const remove = (url, data = {}) => {
    return request(url, { method: 'DELETE', data: data })
  }

  const postImage = (url, data= {}, imageData={uri:'',fileName:"",name:"name.jpg"}) => {
    return request(url, { method: 'POST', data: data, imageData: imageData})
  }
  
  module.exports = {
    get,
    post,
    put,
    remove,
    postImage,
  }