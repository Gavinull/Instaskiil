import * as GlobalConst from '../configs/GlobalConst';
import HTTPUtil from '../utils/HTTPUtil';

export default class OrderApi{

    /**
	 * 订单列表
     * customer_status: 用户状态
	 */
	static userOrderListApi(token, customer_status, p){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/Order/orderRs';
			let formData = new FormData();
            formData.append("token", token);
            formData.append("customer_status", customer_status);
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
	 * 添加订单
	 */
	static addOrderApi(token, contacts, mobile, car_id, coupon_price, integral, seller_id, shop_id, order_type, goods_price, goods){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/Order/addOrder';
			let formData = new FormData();
			formData.append("token", token);
			formData.append("contacts", contacts);
			formData.append("mobile", mobile);
			formData.append("car_id", car_id);
			formData.append("coupon_price", coupon_price);
			formData.append("integral", integral);
			formData.append("seller_id", seller_id);
			formData.append("shop_id", shop_id);
			formData.append("order_type", order_type);
			formData.append("goods_price", goods_price);
			formData.append("goods", goods);
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
	 * 支付订单
	 * 
	 */
	static payOrderApi(token, order_id, pay_code ){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/Payment/payConfig';
			let formData = new FormData();
            formData.append("token", token);  
			formData.append("order_id", order_id);
			formData.append("pay_code", pay_code); 
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
	 * 取消订单
	 * 
	 */
	static cancelOrderApi(token, order_id ){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/Order/cancelOrder';
			let formData = new FormData();
            formData.append("token", token);  
			formData.append("order_id", order_id);  
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
	 * 确认订单完成
	 * 
	 */
	static sureFinishOrderApi(token, order_id ){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/Order/sureFinish';
			let formData = new FormData();
            formData.append("token", token);  
			formData.append("order_id", order_id);  
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
	 * 订单二维码
	 * 
	 */
	static orderQrcodeApi(token, order_id ){
		return new Promise(function (resolve, reject) {
			var url=GlobalConst.apiHost+'/Order/qrcode';
			let formData = new FormData();
            formData.append("token", token);  
			formData.append("order_id", order_id);  
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