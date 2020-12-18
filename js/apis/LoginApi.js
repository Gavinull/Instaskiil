import * as GlobalConst from '../configs/GlobalConst';
import HTTPUtil from '../utils/HTTPUtil';

export default class LoginApi{

    /**
	 * 手机登录
     * @param type:登录类型 1验证码 2密码 
	 */
	static phoneLogin(type, mobile, password){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/login';
			let formData = new FormData();
            formData.append("type", type);
			formData.append("mobile", mobile);
            type === 1 ?  formData.append("code", password) : formData.append("password", password);
			console.log(url, formData);
			HTTPUtil.post(url, formData).then((json) => {
				console.log(url, json);
				resolve(json);
			}).catch((err)=>{
				reject(new Error(GlobalConst.unConnectError));
			});
		});
	}

   /**
	 * 第三方登录
	 * 
	 * @static
	 * @param {any} platform:第三方平台 weixin weibo qq
	 * @param {any} openid:用户唯一标识
     * @param {any} unionid:第三方唯一标识
	 * @returns
	 * 
	 */
	static thirdLogin(platform, nickname, head_pic, openid, unionid, sex){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/thirdLogin';
			let formData = new FormData();
            formData.append("platform", platform);  
			formData.append("nickname", nickname);  
			formData.append("head_pic", head_pic);  
			formData.append("openid", openid);  
			formData.append("unionid", unionid);
			formData.append("sex", sex);
			console.log(url, formData);
			HTTPUtil.post(url, formData).then((json) => {
				console.log(url, json);
				resolve(json);						
			}).catch((err)=>{
				reject(new Error(GlobalConst.unConnectError));
			});
		});
	}

	/**
	 * 退出登录
	 */
	static loginOut(token){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/logout';
			let formData = new FormData();
            formData.append("token", token);
			console.log(url, formData);
			HTTPUtil.post(url, formData).then((json) => {
				console.log(url, json);
				if(json.code==200){															
					resolve(json.result);						
				}
				else{
					if(json.result.length>0){
						reject(new Error(json.result));
					}
					else{
						reject(new Error(GlobalConst.connecError));
					}
				}
			}).catch((err)=>{
				reject(new Error(GlobalConst.unConnectError));
			});
		});
	}



	/**
	 * 忘记密码
	 */
	static retPassword(mobile, password, password2){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/setPwd';
			let formData = new FormData();
			formData.append("mobile", mobile);  
			formData.append("password", password);  
			formData.append("password2", password2);  
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