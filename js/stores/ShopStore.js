import { observable, computed, action, runInAction, useStrict, autorun, reaction, extendObservable } from 'mobx';
import { NativeModules, Platform, ListView } from 'react-native';
import StorageManager from './../configs/StorageManager';
import ToastUtil from './../utils/ToastUtil';
import AppStore  from './../stores/AppStore';
import LoginApi from './../apis/LoginApi';
import AppApi   from '../apis/AppApi';
import UserApi  from '../apis/UserApi';
import HomeApi  from '../apis/HomeApi';

import TestData  from '../configs/TestData';



export class ShopPageStore {
      
        

        constructor() {
            //商品数据源
            this.goods_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
           //已选商品数据源
            this.haveAddGoods_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
            
            this.timer = setTimeout( () => { 
                this.shopGoods = TestData.shopGoodList;
            }, 500);  
          
        }

        //商品
        @observable shopGoods = [];
        @computed  get goodsDataSource() {
           return  this.goods_ds.cloneWithRows(this.shopGoods.slice());
        }

      
        //购物车状态
        @observable shopCartData = {
                        totalAmount:0,    //购物车总金额
                        selectNumber:0,   //商品数量
                        goodsList:[],     //已选商品
                        isShowHaveAddGoodsList:false,    //是否显示已选商品列表
        }
    
        @computed get haveAddgoodsDataSource () {
            return this.haveAddGoods_ds.cloneWithRows(this.shopCartData.goodsList.slice());
        }
        
        @action('添加商品') addGoods = (goods) =>{

             if(!goods.isSelect){
                // extendObservable(goods, {selectNumber: 0});
                goods.selectNumber  = 0;
                goods.isSelect = true;
                this.shopCartData.goodsList.push(goods);
             }
             this.shopCartData.totalAmount += goods.price;
             this.shopCartData.totalAmount = Math.round(parseFloat( this.shopCartData.totalAmount*100))/100
             this.shopCartData.selectNumber += 1;
             goods.selectNumber  += 1;

              if(this.shopCartData.selectNumber==0){
                  this.shopCartData.totalAmount = 0.00;
                }

        }
        @action('删除单个商品') removeGoods = (goods) =>{
                
                if(goods.isSelect){
                    goods.selectNumber  -= 1;
                    this.shopCartData.totalAmount -= goods.price;
                     this.shopCartData.totalAmount = Math.round(parseFloat( this.shopCartData.totalAmount*100))/100
                    this.shopCartData.selectNumber -= 1;
                    if(!goods.selectNumber){
                        goods.isSelect = false;
                        goods.selectNumber  = 0;
                        this.shopCartData.goodsList.remove(goods);
                    }
                 }
                if(this.shopCartData.selectNumber==0){
                  this.shopCartData.totalAmount = 0.00;
                }            
        }
        @action('删除所以商品') removeAllGoods = () =>{
            this.shopCartData.goodsList.forEach(function(goods) {
                 goods.selectNumber  = 0;
                 goods.isSelect = false;
            }, this);
            this.shopCartData.goodsList.splice(0,this.shopCartData.goodsList.length);
            this.shopCartData.totalAmount = 0.00;
            this.shopCartData.selectNumber = 0;
            
        }

        @action fmoney = (s, n) =>{   
              n = n > 0 && n <= 20 ? n : 2; 
s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1]; 
t = ""; 
for (i = 0; i < l.length; i++) { 
t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
} 
return t.split("").reverse().join("") + "." + r;   
        } 
}


export class ShopOrderPageStore {
      
        constructor() {
            //待支付订单
            this.pay_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
           //待完成订单
            this.service_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
            //已完成订单
            this.complete_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
    
        }

        //待支付订单
        @observable payList = [];
        @computed get payListDataSource() {
           return  this.pay_ds.cloneWithRows(this.payList.slice());
        }

        //待完成订单
        @observable serviceList = [];
        @computed get serviceDataSource() {
           return  this.service_ds.cloneWithRows(this.serviceList.slice());
        }


        //已完成订单
        @observable completeList = [];
        @computed get completeListDataSource() {
           return  this.complete_ds.cloneWithRows(this.completeList.slice());
        }

       
        @action('切换数据源') changeListDataSource = (type) => {
            // console.log(type);
            // let dataSource;

             this.timer = setTimeout( () => { 
               switch (type) {
                case 1:
                    // dataSource =  this.payListDataSource;
                    this.fetchListDataSource(type);
                    break;
                case 2:
                    // dataSource =  this.serviceDataSource;
                    this.fetchListDataSource(type);
                    break;
                case 3:
                    // dataSource =  this.evaluationListDataSource;
                    this.fetchListDataSource(type);
                    break;
                default:
                    break;
            }
            }, 500);  
            
        //    return dataSource;
        }
        
        @action('获取数据') fetchListDataSource = (type, p=1) => {

            // OrderApi.userOrderListApi(AppStore.userToken, type, p).then(action((ret) => {
            //                 if( ret.code === 200 ){
            //                     let result = ret.result;
                                switch (type) {
                                    case 1:
                                         this.payList = TestData.myShopOrder_Pay_List;
                                        break;
                                    case 2:
                                         this.serviceList = TestData.myShopOrder_server_List;
                                        break;
                                    case 3:
                                         this.completeList = TestData.myShopOrder_completed_List;
                                        break;
                                    default:
                                        break;
                                }
            //                 }else{

            //                 }  
            //             })).catch((err) => {

            // });
         }

        
}

