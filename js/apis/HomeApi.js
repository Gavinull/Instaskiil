import  * as GlobalConst from '../configs/GlobalConst';
import HTTPUtil from '../utils/HTTPUtil';

export default class HomeApi{

    /**
	 * 商品列表
     * order_by: 1:价格, 2:距离（默认）
     * shop_type:1:上门（默认）, 2:到店
	 */
	static businessListApi(latitude, longitude, order_by, shop_type, keyword, page){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/Shop/shopRs';
			let formData = new FormData();
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);
            formData.append("order_by", order_by);
            formData.append("shop_type", shop_type);
			keyword && formData.append("keyword", keyword);
			page && formData.append("p", page);
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
	 * 商品信息
	 */
	static businessShopInfoApi(shop_id, latitude, longitude, token){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/Shop/shopInfo';
			let formData = new FormData();
			formData.append("shop_id", shop_id);
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);
			token ? formData.append("token", token):null;
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
	 * 店铺评价
	 */
	static businessShopCommentApi(shop_id, p=1){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/Shop/commentRs';
			let formData = new FormData();
			formData.append("shop_id", shop_id);
            formData.append("p", p);
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
	 * 热门搜索
	 */
	static getHotSearchApi(){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/Shop/hotSearch';
			// let formData = new FormData();
			// formData.append("latitude", latitude);
			// formData.append("longitude", longitude);
			// formData.append("order_by", order_by);
			// formData.append("shop_type", shop_type);
			// console.log(url, formData);
			HTTPUtil.post(url).then((json) => {
				console.log(url, json);
				resolve(json);
			}).catch((err) => {
				reject(new Error(GlobalConst.unConnectError));
			});
		});
	}


}