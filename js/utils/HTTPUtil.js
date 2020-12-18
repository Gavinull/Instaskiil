
var HTTPUtil = {};

function _fetch(fetch_promise, timeout) {
        var abort_fn = null;
        var abort_promise = new Promise(function(resolve, reject) {
            abort_fn = function() {
                reject('连接服务器超时，请检查网络状态');
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


/**
 * 基于 fetch 封装的 GET请求
 * @param url
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
HTTPUtil.get = function(url, params) {
    if (params) {
        // let paramsArray = [];
        // Object.keys(params).forEach(key => paramsArray.push(key + '=' + encodeURIComponent(params[key])));
        // if (url.search(/\?/) === -1) {
        //     url += '?' + paramsArray.join('&');
        // } else {
        //     url += '&' + paramsArray.join('&');
        // }
        let parts = params['_parts'];
        let paramsStr = '';
        for (let i = 0; i < parts.length; i++) {
            paramsStr = parts[i][0] + '=' + parts[i][1];
            if (url.search(/\?/) === -1) {
                url += '?' + paramsStr + '&';

            } else {
                url += '&' + paramsStr + '&';
            }
        }
    }
    return new Promise(function (resolve, reject) {
      _fetch(fetch(url, {method: 'GET'}), 15000)
          .then((response) => {
              if (response.ok) {
                  return response.json();
              } else {
                  reject(new Error('服务器繁忙，请稍后再试；\r\nCode:' + response.status));
              }
          })
          .then((response) => {
              resolve(response);
          })
          .catch((err)=> {
            // console.log(new Error(err));
            reject(new Error(err));
          });
    });
};


/**
 * 基于 fetch 封装的 POST请求  FormData 表单数据
 * @param url
 * @param formData  
 * @param headers
 * @returns {Promise}
 */
 HTTPUtil.post = async function(url, formData) {
    // console.log(url);
    // console.log(formData);
    return new Promise(function(resolve, reject){
        _fetch(fetch(url, {method: 'POST', body:formData}), 15000)
            .then((response) => {
            // console.log(response);
            if (response.ok) {
                return response.json();
            } else {
                reject(new Error('服务器繁忙，请稍后再试；\r\nCode:' + response.status));
            }
        })
        .then((response) => {
            // console.log(response);
            resolve(response);
        })
        .catch((err)=> {
          // console.log(err);
          // console.log(new Error(err));
          reject(new Error(err));
        });
    });
};

HTTPUtil.postimg = function(url, formData) {
    // console.log(url);
    // console.log(formData);
    return new Promise(function(resolve, reject){
      fetch(url, {
            method: 'POST',
            headers:{  
                'Content-Type':'multipart/form-data',  
            },  
            body:formData
        }).then((response) => {
            // console.log(response);
            if (response.ok) {
                return response.json();
            } else {
                reject(new Error('服务器繁忙，请稍后再试；\r\nCode:' + response.status));
            }
        })
        .then((response) => {
            // console.log(response);
            resolve(response);
        })
        .catch((err)=> {
        //   console.log(err);
        //   console.log(new Error(err));
          reject(new Error(err));
        });
    });
};

export default HTTPUtil;