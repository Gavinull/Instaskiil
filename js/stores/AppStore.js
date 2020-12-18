import { DeviceEventEmitter } from 'react-native';
import { observable, action } from 'mobx';
import StorageManager from './../configs/StorageManager'
let instance = null;

class AppStore {
    
     @observable userToken = '';
     @observable roleType  = this.Enum_RoleType.students;
     @observable user = {};
     @observable userHeader = '';
     @observable userSex = '';
     @observable userName = '';
     @observable userSignature = '';
     @observable userSchool  = '';
     @observable userGrade  = '';
     @observable userGradeID  = '';

     @observable userQuestionCount = 0;
     @observable userSolvedCount  = 0;
     @observable userReplyCount  = 0;
     @observable userRatingCount  = 0;

     @observable userPhone  = "";
     @observable userEmail  = "";

     @observable userSubject  = "";
     @observable userSubjectID  = "";


      // 角色 類型
      Enum_RoleType = {
        students:1,
        teacher:2
      }

      // 用戶 信息 類型
      Enum_UserInfoType = {
        headImage:0,
        name:1,
        sex:2,
        signature:3,
        school:4,
        grade:5,
        phone:6,
        email:7,
        subject:8,
      }


      // 選擇 問題 類別
      Enum_ChoosePageType = {
        settingQuestionType:0,
        createQuestion:1,
      }

      // 編輯問題 創建 或 追問(編輯問題)
      Enum_EidtorQuestionType = {
        create:1,
        eidtor:2,
      }


     constructor(){
           if(!instance){  
                instance = this;  
            }
            return instance;
     }

    @action setRoleType = (value) => { 
        this.roleType = value;
    }


      @action setUser = (value) => { 
          this.user = value;
      }
      @action setUserToken = (value) => {
          this.userToken = value;
      }
      @action setUserHeader = (value) => {
          this.userHeader = value;
      }
     
      @action setUserSex = (value) => {
          this.userSex = value;
      }
      
      @action setUserName = (value) => {
          this.userName = value;
      }
     
    
        @action setUserSignature  = (value) => {
            this.userSignature = value;
        }
        @action setUserSchool = (value) => {
            this.userSchool = value;
        }
        @action setUserGrade= (value) => {
            this.userGrade = value;
        }

        @action setUserGradeID= (value) => {
            this.userGradeID = value;
        }

        @action setUserQuestionCount = (value) => {
            this.userQuestionCount = value;
        }
        @action setUserSolvedCount= (value) => {
            this.userSolvedCount = value;
        }

        @action setUserReplyCount= (value) => {
            this.userReplyCount = value;
        }
        @action setUserRatingCount= (value) => {
            this.userRatingCount = value;
        }

        @action setUserPhone= (value) => {
            this.userPhone = value;
        }
        @action setUserEmail= (value) => {
            this.userEmail = value;
        }

        @action setUserSubject= (value) => {
            this.userSubject = value;
        }
        @action setUserSubjectID= (value) => {
            this.userSubjectID = value;
        }

        @action('获取用户信息接口') getUserInfo = (token) => {
            return new Promise(function (resolve, reject) {

                global.FetchUtil.get(global.UrlConst.apiGetUserInfo).then((res) => { 
                    let userInfo = res.profile
                    console.log(userInfo)
                    StorageManager.setUser(userInfo)
                    StorageManager.setRoleType(userInfo.role)
                    StorageManager.setUserName(userInfo.name)
                    StorageManager.setUserHeader(userInfo.avatar?userInfo.avatar:"");                       
                    StorageManager.setUserSex(userInfo.gender)                       
                    StorageManager.setUserSchool(userInfo.school)                    
                    StorageManager.setUserGrade(userInfo.grade) 
                    StorageManager.setUserGradeID(userInfo.grade_id)                                     
                    StorageManager.setUserSignature(userInfo.description) 

                    StorageManager.setUserQuestionCount(userInfo.question_times)
                    StorageManager.setUserSolvedCount(userInfo.solved_times)
                    StorageManager.setUserReplyCount(userInfo.reply_times)
                    StorageManager.setUserRatingCount(userInfo.rating)

                    StorageManager.setUserPhone(userInfo.phone);
                    StorageManager.setUserEmail(userInfo.email);

                    if(userInfo.good_subjects){
                        StorageManager.setUserSubject(userInfo.good_subjects.map((subject) =>{ return subject.name;}).join('、'));
                        StorageManager.setUserSubjectID(userInfo.good_subjects.map((subject) =>{ return subject.id;}));    
                    }
                   



                    resolve(userInfo)                  
                }).catch((err) => {
                    console.log(err) 
                    reject(err)          
                });
            });
       
        }

        @action('通知刷新问题列表') uploadQuestionList = (isload) => {
            DeviceEventEmitter.emit(global.KeyConst.KNotification_uploadList, isload);
        }


 
      
}
const store = new AppStore();
export default store;