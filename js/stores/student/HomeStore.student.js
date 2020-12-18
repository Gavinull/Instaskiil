import { observable, action, useStrict, computed, runInAction } from 'mobx';
import { ListView } from 'react-native';
import UserApi  from '../../apis/UserApi';
import AppStore   from './../../stores/AppStore';
import ToastUtil from './../../utils/ToastUtil';
import AppApi   from '../../apis/AppApi';
import TestData from './../../configs/TestData';

import FetchUtil from './../../utils/FetchUtil'


// 首頁 推薦問題
export class HomePageStore {

    @observable list = [];
    @observable page = 1;
    @observable limit = 20;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable isRefreshing = false;

    constructor() {
        this.recommend_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
        this.waitAnswer_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
        this.answering_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
        this.waitEvaluate_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
  
    }

    //是否在刷新
    @observable is_recommend_Refreshing = false;
    //是否在刷新
    @observable is_waitAnswer_Refreshing = false; 
    
    @observable is_answering_Refreshing = false; 
    //是否在刷新
    @observable is_waitEvaluate_Refreshing = false; 
   

    //推薦問題(不同一個接口)
    @observable recommendList = [];
    @computed get recommendListDataSource() {
        return  this.recommend_ds.cloneWithRows(this.recommendList.slice());
    }

    //待解答
    @observable waitAnswerList = [];
    @computed get waitAnswerListDataSource() {
       return  this.waitAnswer_ds.cloneWithRows(this.waitAnswerList.slice());
    }

    //解答中
    @observable answeringList = [];
    @computed get answeringListDataSource() {
       return  this.answering_ds.cloneWithRows(this.answeringList.slice());
    }

     //待評價
     @observable waitEvaluateList = [];
     @computed get waitEvaluateListDataSource() {
        return  this.waitEvaluate_ds.cloneWithRows(this.waitEvaluateList.slice());
     }

    
    @action("推薦問題列表數據") loadRecommendData = (isRefreshHub) => {
        this.is_recommend_Refreshing = isRefreshHub;
        // 暂时去掉 params:{self.page};
        FetchUtil.get(global.UrlConst.apiRecommendQuestionList, {params:{}}).then(action((result) => {
           this.recommendList = this.page == 1 ? result.questions:this.list.concat(result.questions);            
           this.stopRefreshing();
        })).catch((err) => {
          this.stopRefreshing();
          ToastUtil.showToast(err.message);
      });
    }

    @action stopRefreshing = () => {
        let self = this;
        setTimeout(function() {
            self.is_recommend_Refreshing = false;
       }, 500);  
    }


    @action('切换数据源') changeListDataSource = (type, isRefreshing) => {
        console.log(type, isRefreshing);    
        if(type == 0){
            this.loadRecommendData(isRefreshing);
        }else{
            this.fetchListDataSource(type-1, isRefreshing); 
        }

    }
    
    @action('获取数据') fetchListDataSource = (type, isRefreshing, p=1) => {
        this.theRefreshingState(type, isRefreshing);
        
        FetchUtil.get(global.UrlConst.apiGetQuestionList, {params:{status:type}}).then(action((result) => {
                switch (type) {
                    case 0:
                         this.waitAnswerList = result.questions;
                        break;
                    case 1:
                         this.answeringList = result.questions;
                        break;
                    case 2:
                        this.waitEvaluateList = result.questions;
                       break;
                    default:
                        break;
                } 
                console.log(type, isRefreshing);    
       
                this.theRefreshingState(type, false);               
            })).catch((err) => {
                this.theRefreshingState(type, false);               
           });  
     }

     theRefreshingState = (type, isRefreshing) =>{
        console.log(type, isRefreshing);    

        if(isRefreshing == false){
            let _this = this;

            setTimeout(function() {
                
               if(type == 0){
                _this.is_waitAnswer_Refreshing = isRefreshing;
   
            }
               if(type == 1){
                _this.is_answering_Refreshing = isRefreshing;                
               }
               if(type == 2){
                _this.is_waitEvaluate_Refreshing = isRefreshing;                
               }
            }, 500); 
           
        }else{
            if(type == 0){
                this.is_waitAnswer_Refreshing = isRefreshing;
           }
           if(type == 1){
               this.is_answering_Refreshing = isRefreshing;                
           }
           if(type == 2){
               this.is_waitEvaluate_Refreshing = isRefreshing;                
           }
        } 
    }

}

// 新回答
export class NewAnswerQuestionPageStore {

    @observable list = [];
    @observable page = 1;
    @observable limit = 20;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable isRefreshing = false;

    constructor() {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
    }

    @computed get dataSource() {
        return this.ds.cloneWithRowsAndSections({section1:this.list.slice()});
    }

    @action loadData = (isRefreshHub) => {
        this.isRefreshing = isRefreshHub;
       
     FetchUtil.get('https://hn2.api.okayapi.com/?s=App.Table.FreeQuery&model_name=apiAnswerList&logic=and&where=[[%22id%22,%20%22%3E%22,%200]]&page=1&perpage=20&app_key=A3504C412A5BC4E18E4EE118988954BD').then(action((result) => {
           this.list = result;            
           this.isRefreshing = false;
      })).catch((err) => {
          this.isRefreshing = false;
          ToastUtil.showToast(err.message);
      });
    }

}
