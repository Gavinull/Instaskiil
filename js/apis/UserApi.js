import * as GlobalConst from '../configs/GlobalConst';
import HTTPUtil from '../utils/HTTPUtil';

export default class UserApi{

    /**
	 * 获取用户信息
	 */
	static userInfo(token){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/userInfo';
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
			}).catch( (err) => {
				reject(new Error(GlobalConst.unConnectError));
			});
		});
	}


	/**
	 * 编辑户信息
	 */
	static editUserApi(token, fullname, sex, age){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/editUser';
			let formData = new FormData();
            formData.append("token", token);
			if(fullname){
				formData.append("fullname", fullname);
				formData.append("nickname", fullname);
			}
			if(sex){
				formData.append("sex", sex);
			}
			if(age){
				formData.append("age", age);
			}
			console.log(url, formData);
			HTTPUtil.post(url, formData).then((json) => {
				console.log(url, json);
				resolve(json);
			}).catch( (err) => {
				console.log(url, err);
				reject(new Error(GlobalConst.unConnectError));
			});
		});
	}


	/**
	 * 上传用户头像
	 */
	static uploadUserPicApi(token, head_pic ){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/uploadUserPic';
			let formData = new FormData();
            formData.append("token", token);
			let file = {uri: 'file://' + head_pic, type: 'multipart/form-data', name: 'user.jpg'};
			formData.append("head_pic", file);
			console.log(url, formData);
			HTTPUtil.post(url, formData).then((json) => {											
				resolve(json);
			}).catch( (err) => {
				reject(new Error(GlobalConst.unConnectError));
			});
		});
	}

   /**
	 * 用户积分与余额日志
	 * type: 1:余额 2.积分
	 * 
	 */
	static integralBalanceLogApi(token, type, p){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/consumeLog';
			let formData = new FormData();
            formData.append("token", token);  
			formData.append("type", type);
			formData.append("p", p);
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
	 * 用户的优惠券
	 * type: 0全部 1:未使用 2:已过期
	 * 
	 */

	static couponListApi(token, type){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/couponRs';
			let formData = new FormData();
            formData.append("token", token);  
			formData.append("type", type);  
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
	 * 用户的车辆
	 * 
	 */

	static userCarApi( token ){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/myCar';
			let formData = new FormData();
            formData.append("token", token);  
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
	 * 添加车辆
	 * is_default: 1是 0否
	 */

	// static addCarApi( token, car_id, is_default, brand_id, brand_name, car_color, car_abb, car_name){
	// 	return new Promise(function (resolve, reject) {
	// 		var url=GlobalConst.apiHost+'/User/addMyCar';
	// 		let formData = new FormData();
     //        formData.append("token", token);
	// 		console.log(url, formData);
	// 		HTTPUtil.post(url, formData).then((json) => {
	// 			console.log(url, json);
	// 			resolve(json);
	// 		}).catch((err)=>{
	// 			reject(new Error(GlobalConst.unConnectError));
	// 		});
	// 	});
	// }


	/**
	 * 编辑车辆
	 * is_default: 1是 0否
	 */
	static editCarApi( token, {is_default, brand_id, brand_name, car_color, car_abb, car_name, car_id}){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/editMyCar';
			let formData = new FormData();
            formData.append("token", token);
			if (is_default === 0 || is_default === 1) {
				formData.append("is_default", is_default);
			}
			brand_id && formData.append("brand_id", brand_id);
			brand_name && formData.append("brand_name", brand_name);
			car_color && formData.append("car_color", car_color);
			car_abb && formData.append("car_abb", car_abb);
			car_name && formData.append("car_name", car_name);
			car_id && formData.append("car_id", car_id);
			console.log(url, formData);
			HTTPUtil.post(url, formData).then((json) => {
				console.log(url, json);
				resolve(json);
			}).catch((err)=>{
				reject(new Error(GlobalConst.unConnectError));
			});
		});
	}

	static delUserCar(carId, token) {
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/editMyCar';
			let formData = new FormData();
			formData.append("token", token);
			formData.append("car_id", carId);
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
	 * 用户的收藏
	 */
	static collectListApi(token){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/collectList';
			let formData = new FormData();
			formData.append("token", token);  
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
	 * 添加收藏
	 */
	static addCollectApi(token, shop_id){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/addCollect';
			let formData = new FormData();
			formData.append("token", token);
			formData.append("shop_id", shop_id);    
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
	 * 取消收藏
	 */
	static cancelCollectApi(token, shop_id){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/cancelCollect';
			let formData = new FormData();
			formData.append("token", token);
			formData.append("shop_id", shop_id);    
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
	 * 用户的评价
	 * 
	 */

	static commentListApi(token, p){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/commentRs';
			let formData = new FormData();
            formData.append("token", token);  
			formData.append("p", p);  
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
	 * 密码管理
	 */

	static editPwdApi( token, mobile, password, code ){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/editPwd';
			let formData = new FormData();
            formData.append("token", token);
			formData.append("mobile", mobile);  
            formData.append("password", password);  
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



	/**
	 * 意见反馈
	 * img:图片路径 多张用 ; 隔开
	 */

	static feedbackApi( token, mobile, content, img ){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/addFeedback';
			let formData = new FormData();
            formData.append("token", token);
			mobile && formData.append("mobile", mobile);
			content && formData.append("content", content);
			img && formData.append("img", img);
  
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
	 * 上传意见反馈图片
	 */

	static uploadFeedbackImgApi( token, img ){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/uploadFeedback';
			let formData = new FormData();
			formData.append("token", token);
			let file = {uri: 'file://' + img, type: 'multipart/form-data', name: 'user.jpg'};
			formData.append("feedback", file);
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
	 *  添加车辆
	 * @param token
	 * @param brandId
	 * @param brandName
	 * @param carAbb
	 * @param color
	 * @param model
	 * @param carName
	 * @param isDefault
	 * @returns {Promise}
	 */
	static addUserCarApi( token, brandId, brandName, carAbb, color, model, carName, isDefault ){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/User/addMyCar';
			let formData = new FormData();
			formData.append("token", token);
			formData.append("brand_id", brandId);
			formData.append("brand_name", brandName);
			formData.append("car_abb", carAbb);
			formData.append("car_color", color);
			formData.append("car_model", model);
			formData.append("car_name", carName);
			formData.append("is_default", isDefault);
			console.log(url, formData);
			HTTPUtil.post(url, formData).then((json) => {
				console.log(url, json);
				resolve(json);
			}).catch((err)=>{
				console.log(url, err);
				reject(new Error(GlobalConst.unConnectError));
			});
		});
	}

}