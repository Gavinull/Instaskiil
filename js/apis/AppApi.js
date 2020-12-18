import  * as GlobalConst from '../configs/GlobalConst';
import HTTPUtil from '../utils/HTTPUtil';

export default class LoginApi{

    /**
	 * 发送验证码 
	 */
	static sendSmsCode(mobile){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/sendSmsCode';
			let formData = new FormData();
            formData.append("mobile", mobile);
			console.log(url, formData);
			HTTPUtil.post(url, formData).then((json) => {
				console.log(url, json);
				resolve(json);						
			}).catch((err) => {
				reject(new Error(GlobalConst.unConnectError));
			});
		});
	}


    /**
	 * 验证验证码 
	 */
	static checkSmsCode(mobile, code){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/checkSmsCode';
			let formData = new FormData();
            formData.append("mobile", mobile);
            formData.append("code", code);
			console.log(url, formData);
			HTTPUtil.post(url, formData).then((json) => {
				console.log(url, json);
				resolve(json);										
			}).catch((err)=>{
				reject(new Error(GlobalConst.unConnectError));
			});
		});
	}
  

}