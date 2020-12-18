import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';
import AppStore from '../stores/AppStore';
import  DateUtil from '../utils/DateUtil';

var storage = new Storage({ 
                    size: 1000,
                    storageBackend: AsyncStorage,
                    defaultExpires: null,
                    enableCache: true,
                    sync: {}
});  
//开启持久化Storage
global.GlobalStorage = storage;

let   instance   = null;

const KRoleType   = 'KRoleType';
const KSignature   = 'KSignature';
const KSchool   = 'KSchool';
const KGrade   = 'KGrade';
const KGradeID = 'KGradeID';

const kUser      = 'kUser';
const kUserToken = 'kUserToken';
const kUserHeader = 'kUserHeader';
const kUserSex   = 'kUserSex';
const kUserName  = 'kUserName';
const kUserPhone   = 'kUserPhone';
const kUserEmail  = 'kUserEmail';

const KQuestionCount = 'KQuestionCount';
const KSolvedCount = 'KSolvedCount';
const KReplyCount   = 'KReplyCount';
const KRatingCount  = 'KRatingCount';

const KUserSubject  = 'KUserSubject';
const KUserSubjectID  = 'KUserSubjectID';


class StorageManager {

        constructor(props) {
            if(!instance){  
                 instance = this;                 
            }
            this.loadData();
            return instance;
        }
        //初始化AppStore属性数据
        loadData(){

            this.loadObjectWithKey(kUserToken).then((res)=>{
                  console.log("Token:", res);
                  AppStore.setUserToken(res);
            }).catch((err)=>{
                console.log("------", err);
            });

            this.loadObjectWithKey(KRoleType).then((res)=>{
                  console.log("角色:", res);
                  AppStore.setRoleType(res)
            }).catch((err)=>{
                  console.log("角色錯誤---", err);
            });

              //userInfo
              this.loadObjectWithKey(kUser).then((userInfo)=>{
                        console.log("用戶信息", userInfo);
                        this.setUser(userInfo)
                        this.setRoleType(userInfo.role)
                        this.setUserName(userInfo.name)
                        this.setUserHeader(userInfo.avatar);                       
                        this.setUserSex(userInfo.gender)                       
                        this.setUserSchool(userInfo.school)                    
                        this.setUserGrade(userInfo.grade) 
                        this.setUserGradeID(userInfo.grade_id)                  
                        this.setUserSignature(userInfo.description)
                        this.setUserQuestionCount(userInfo.question_times)
                        this.setUserSolvedCount(userInfo.solved_times)
                        this.setUserReplyCount(userInfo.reply_times)
                        this.setUserRatingCount(userInfo.rating)
                        this.setUserPhone(userInfo.phone)
                        this.setUserEmail(userInfo.email)
                        this.setUserSubject(userInfo.good_subject_name)
                        this.setUserSubjectID(userInfo.good_subject)
    
    
              }).catch((err)=>{
                  console.log("------", err);
              });
        }

        cleanStorage(){
                  this.setRoleType(1);                                              
                  this.setUserToken(null);                                              
                  this.setUser(null);
                  this.setUserHeader('');
                  this.setUserName('');
                  this.setUserSex(1); 
                  this.setUserSignature("")
                  this.setUserSchool("")
                  this.setUserGrade("")
                  this.setUserQuestionCount(0)
                  this.setUserSolvedCount(0)
                  this.setUserReplyCount(0)
                  this.setUserRatingCount(0)
                  this.setUserPhone("")
                  this.setUserEmail("")
                  this.setUserSubject("")
                  this.setUserSubjectID(0)


        }

        //保存一个对象
        saveObject(key, data){
            console.log(key, data);
            if (data === undefined || data === null){
                data = "";
            }
                GlobalStorage.save({key:key, data:data});
        }
        //读取一个对象
        loadObjectWithKey(key){
          return new Promise(function (resolve, reject) { 
                      GlobalStorage.load({key: key})
                                   .then(ret => { resolve(ret); })
                                   .catch(err => { reject(err); });
                      });
        }

      //RoleType
      setRoleType = (value) => {
            this.saveObject(KRoleType, value);
            AppStore.setRoleType(value);
      }
      getRoleType(){
            return this.loadObjectWithKey(KRoleType);
      }

      setUserSignature = (value) => {
            this.saveObject(KSignature, value);
            AppStore.setUserSignature(value);
      }
      getUserSignature(){
            return this.loadObjectWithKey(KSignature);
      }

      setUserSchool = (value) => {
            this.saveObject(KSchool, value);
            AppStore.setUserSchool(value);
      }
      getUserSchool(){
            return this.loadObjectWithKey(KSchool);
      }

      setUserGrade = (value) => {
            this.saveObject(KGrade, value);
            AppStore.setUserGrade(value);
      }
      getUserGrade(){
            return this.loadObjectWithKey(KGrade);
      }

      setUserGradeID = (value) => {
            this.saveObject(KGradeID, value);
            AppStore.setUserGradeID(value);
      }
      getUserGradeID(){
            return this.loadObjectWithKey(KGradeID);
      }

      setUserQuestionCount = (value) => {
            this.saveObject(KQuestionCount, value);
            AppStore.setUserQuestionCount(value);
      }
      getUserQuestionCount(){
            return this.loadObjectWithKey(KQuestionCount);
      }

      setUserSolvedCount = (value) => {
            this.saveObject(KSolvedCount, value);
            AppStore.setUserSolvedCount(value);
      }
      getUserSolvedCount(){
            return this.loadObjectWithKey(KSolvedCount);
      }

      setUserReplyCount = (value) => {
            this.saveObject(KReplyCount, value);
            AppStore.setUserReplyCount(value);
      }
      getUserReplyCount(){
            return this.loadObjectWithKey(KReplyCount);
      }

      setUserRatingCount = (value) => {
            this.saveObject(KRatingCount, value);
            AppStore.setUserRatingCount(value);
      }
      getUserRatingCount(){
            return this.loadObjectWithKey(KRatingCount);
      }
        
//user
        setUser = (value) => {
              this.saveObject(kUser, value);
              AppStore.setUser(value);
        }
        getUser(){
            return this.loadObjectWithKey(kUser);
        }

//token
        setUserToken = (value) => {
              this.saveObject(kUserToken, value);
              AppStore.setUserToken(value);
        }
        getUserToken(){
            return this.loadObjectWithKey(kUserToken);
        }

//userHeader
        setUserHeader = (value) => {
              this.saveObject(kUserHeader, value);
              AppStore.setUserHeader(value);
        }
        getUserHeader(){
           return this.loadObjectWithKey(kUserHeader);
        }


//userName
        setUserName = (value) => {
              this.saveObject(kUserName, value);
              AppStore.setUserName(value);
        }
        getUserMame(){
           return this.loadObjectWithKey(kUserName);
        }


//userSex
        setUserSex = (value) => {
              this.saveObject(kUserSex, value);
              AppStore.setUserSex(value);
        }
        getUserSex(){
           return this.loadObjectWithKey(kUserSex);
        }

      setUserPhone = (value) => {
            this.saveObject(kUserPhone, value);
            AppStore.setUserPhone(value);
      }
      getUserPhone(){
         return this.loadObjectWithKey(kUserPhone);
      }

      setUserEmail = (value) => {
            this.saveObject(kUserEmail, value);
            AppStore.setUserEmail(value);
      }
      getUserEmail(){
            return this.loadObjectWithKey(kUserEmail);
      }


      setUserSubject = (value) => {
            this.saveObject(KUserSubject, value);
            AppStore.setUserSubject(value)
      }
      getUserSubject(){
         return this.loadObjectWithKey(KUserSubject);
      }

      setUserSubjectID = (value) => {
            this.saveObject(KUserSubjectID, value);
            AppStore.setUserSubjectID(value)
      }
      getUserSubjectID(){
         return this.loadObjectWithKey(KUserSubjectID);
      }



  }

const storageManager = new StorageManager();
export default storageManager;