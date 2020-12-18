import { observable, action, useStrict, computed, runInAction } from 'mobx';
import { ListView } from 'react-native';
import UserApi  from '../../apis/UserApi';
import AppStore   from './../../stores/AppStore';
import ToastUtil from './../../utils/ToastUtil';
import AppApi   from '../../apis/AppApi';
import TestData from './../../configs/TestData';

import FetchUtil from './../../utils/FetchUtil'

import HTTPUtil from './../../utils/HTTPUtil'

export class MineCollectionPageStore {

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
       
        FetchUtil.get(global.UrlConst.apiGetCollectionnList).then(action((result) => {
           this.list = result.collection;
                   
          this.stopRefreshing();
      })).catch((err) => {
          this.stopRefreshing();
          ToastUtil.showToast(err.message);
      });
    }

    @action stopRefreshing = () => {
        let self = this;
        setTimeout(function() {
            self.isRefreshing = false;
       }, 500);  
    }


}


export class SearchQuestionPageStore {

    @observable list = [];
    @observable page = 1;
    @observable limit = 20;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable isRefreshing = false;

    @observable grade = {id:null, name:"選擇年級"};
    @observable grade_list = [];
    @observable subject = {id:null, name:"選擇科目"};
    @observable subject_list = [];
    @observable start_dateStr = "開始日期";
    @observable start_dateTimeStamp = null;
    @observable end_dateStr = "結束日期";
    @observable end_dateTimeStamp = null;
    @observable keyword = "";


    constructor() {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
        this.fetchGradeList();
        this.fetchSubjectList();
    }

    @computed get dataSource() {
        return this.ds.cloneWithRowsAndSections({section1:this.list.slice()});
    }

    // 搜索
    @action fetchSearchQuestionList = (isRefreshHub) => {

        let {
            grade,
            subject,
            keyword,
            start_dateTimeStamp,
            end_dateTimeStamp,
        } = this;

        if(grade.id || subject.id || keyword || start_dateTimeStamp || end_dateTimeStamp){
            this.isRefreshing = isRefreshHub;
            global.FetchUtil.post(global.UrlConst.apiSearchQuestion, {params:{grade_id:grade.id, subject_id:subject.id, keyword:keyword, start_date:start_dateTimeStamp, end_date:end_dateTimeStamp}}).then((res) => {
                this.list = res.questions;
                this.stopRefreshing();
            }).catch((err) => {
                this.stopRefreshing();
                ToastUtil.showToast(err.message);
            });
        }

        
    }

    @action stopRefreshing = () => {
        let self = this;
        setTimeout(function() {
            self.isRefreshing = false;
       }, 500);  
    }

     // 年級
     @action fetchGradeList = () => {

        global.FetchUtil.get(global.UrlConst.apiGetGradeList).then((res) => {
            this.grade_list =  res.grade_list;
        }).catch((err) => {
            ToastUtil.showToast(err.msg);
        });
    }

     // 科目
     @action fetchSubjectList = () => {

        global.FetchUtil.get(global.UrlConst.apiGetSubjectList).then((res) => {
            this.subject_list = res.subject_list;
        }).catch((err) => {
            ToastUtil.showToast(err.msg);
        });
    }

    



}



// 學生 - 我的提問
export class MineQuestionsPageStore {
      
    constructor() {

        this.waitAnswer_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
        this.answering_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
        this.waitEvaluate_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
        this.evaluate_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });

    
    }

    //是否在刷新
    @observable is_waitAnswer_Refreshing = false;
    //是否在刷新
    @observable is_answering_Refreshing = false; 
    //是否在刷新
    @observable is_waitEvaluate_Refreshing = false; 
    //是否在刷新
    @observable is_evaluate_Refreshing = false; 
   
   
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

      //已評價
    @observable evaluateList = [];
    @computed get evaluateListDataSource() {
       return  this.evaluate_ds.cloneWithRows(this.evaluateList.slice());
    }

    @action('切换数据源') changeListDataSource = (type, isRefreshing) => {
        console.log(type, isRefreshing);    
        this.fetchListDataSource(type, isRefreshing);        
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
                    case 3:
                       this.evaluateList = result.questions;
                      break;
                    default:
                        break;
                }           
                this.theRefreshingState(type, false);               
            })).catch((err) => {
                this.theRefreshingState(type, false);               
                ToastUtil.showToast(err.message);
           });  
     }

     theRefreshingState = (type, isRefreshing) =>{
        if(isRefreshing == false){
            let self = this;

            setTimeout(function() {
                
               if(type == 0){
                    self.is_waitAnswer_Refreshing = isRefreshing;
               }
               if(type == 1){
                    self.is_answering_Refreshing = isRefreshing;                
               }
               if(type == 2){
                    self.is_waitEvaluate_Refreshing = isRefreshing;                
               }
               if(type == 3){
                    self.is_evaluate_Refreshing = isRefreshing;                
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
           if(type == 3){
               this.is_evaluate_Refreshing = isRefreshing;                
           }
        }

        
    }
      

}

