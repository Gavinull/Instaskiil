import { observable, computed, action, runInAction, useStrict, autorun, reaction, extendObservable } from 'mobx';
import { NativeModules, Platform, ListView } from 'react-native';
import StorageManager from './../../configs/StorageManager';
import ToastUtil from './../../utils/ToastUtil';
import AppStore  from './../../stores/AppStore';
import LoginApi from './../../apis/LoginApi';
import AppApi   from '../../apis/AppApi';
import UserApi  from '../../apis/UserApi';
import HomeApi  from '../../apis/HomeApi';

import TestData  from '../../configs/TestData';

import FetchUtil from './../../utils/FetchUtil'


export class HomePageStore {
      
    constructor() {

        this.all_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
        this.invitation_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
        this.underway_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });

    }

    //是否在刷新
    @observable is_all_Refreshing = false;
    //是否在刷新
    @observable is_invitation_Refreshing = false; 
    //是否在刷新
    @observable is_underway_Refreshing = false; 
   
    //全部
    @observable allList = [];
    @computed get allListDataSource() {
       return  this.all_ds.cloneWithRows(this.allList.slice());
    }

    //邀請
    @observable invitationList = [];
    @computed get invitationListDataSource() {
       return  this.invitation_ds.cloneWithRows(this.invitationList.slice());
    }

     //進行中
     @observable underwayList = [];
     @computed get underwayListDataSource() {
        return  this.underway_ds.cloneWithRows(this.underwayList.slice());
     }

    
    @action('切换数据源') changeListDataSource = (type, isRefreshing) => {
            this.fetchListDataSource(type, isRefreshing);        
    }
    
    @action('获取数据') fetchListDataSource = (type, isRefreshing, p=1) => {
        this.theRefreshingState(type, isRefreshing);
        
        FetchUtil.get(global.UrlConst.apiGetTeacherQuestionList, {params:{list_type:type}}).then(action((result) => {
            console.log(result)    
            let questions = result.questions;
            switch (type) {
                    case 1:
                         this.allList = questions;
                        break;
                    case 2:
                         this.invitationList = questions;
                        break;
                    case 3:
                        this.underwayList = questions;
                        break;
                    default:
                        break;
                }           
                this.theRefreshingState(type, false);               
            })).catch((err) => {
                this.theRefreshingState(type, false);               
                ToastUtil.showToast(err.message);
                console.log(err)
           });  
     }

     theRefreshingState = (type, isRefreshing) =>{
          if(type == 1){
                this.is_all_Refreshing = isRefreshing;
            }
            if(type == 2){
                this.is_invitation_Refreshing = isRefreshing;                
            }
            if(type == 3){
                this.is_underway_Refreshing = isRefreshing;                
            }
    }
      

}


// 新消息
export class NewMessagePageStore {

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




