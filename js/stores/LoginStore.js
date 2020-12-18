import { observable, computed, action, runInAction, useStrict } from 'mobx';
import { NativeModules, Platform } from 'react-native';
import LoginApi from '../apis/LoginApi';
import AppApi   from '../apis/AppApi';
import UserApi  from '../apis/UserApi';
import StorageManager from './../configs/StorageManager';
import ToastUtil from './../utils/ToastUtil';
import FetchUtil from './../utils/FetchUtil';
import storageManager from './../configs/StorageManager';
import AppStore   from './../stores/AppStore';

//登录页
export class LoginPageStore {

    @observable loginType = 2;                  // 1. 验证码登登录  2.密码登录
    @observable isSuccesslogin = false;
    @observable loading = false;
    @observable phone = '';
    @observable password = '';
    @observable code = '';
    @observable codeText = '获取验证码';
    @observable canSendCode = true;
    
    constructor() {

    }

    @action setPhone = (value) => {
       this.phone = value;
    }
    @action setPassword = (value) => {
       this.password = value;
    }
    @action setLoginState = (value) => {
       this.isSuccesslogin = value;
    }
    @action changeLoginType = () => {
       this.loginType === 1 ? this.loginType = 2 : this.loginType = 1;
    }
    @action changeCodeText = (text) => {
       this.codeText = text;
    }
    @action changeCodeState = (value) => {
        this.canSendCode = value;
    }
    
    @action('登录请求') requstLoginAction = (username, password) => {
        
        // if(RegularUtil.isAccount(username) == false){
        //     ToastUtil.showToast("請輸入正確的賬號")
        //     return;
        // }

        // if(RegularUtil.isPassword(password) == false){
        //     ToastUtil.showToast("請輸入正確的密碼")
        //     return;
        // }

        // let url = global.UrlConst.apiLogin;
        // let params = {
        //     username:username,
        //     password:password,
        // }
        // FetchUtil.post(url, {params:params}).then((res) => { 
        //    console.log(res)
            // StorageManager.setUserToken(res.token);
        //   this.setLoginState(true);
            // AppStore.getUserInfo().then((userInfo)=>{
                // if(userInfo.role == AppStore.Enum_RoleType.students){
                    Actions.reset("Tabbar_S");
                // }else if(userInfo.role == AppStore.Enum_RoleType.teacher){
                //     Actions.reset("Tabbar_T")
                // }else{
                //     global.ToastUtil.showToast("登录角色出错");
                //     storageManager.cleanStorage();
                // }
        //     });
        // }).catch((err) => {
        //     console.log(err)  ;         
        //     ToastUtil.showToast(err.msg);
        // });
    }

    @action('第三方登录sdk') thirdLogin = (platformType) => {
        //platformType 统一第三方登录类型 --->>>  Wechat  QQ  SinaWeibo
        NativeModules.ShareSDK.login(platformType)
        .then((datas)=> {
            // console.log('-----', datas);
            let type;
            if (platformType == "Wechat"){
                type = 'weixin';
            }
            if (platformType == "QQ"){
                type = 'qq';
            }
            if (platformType == "SinaWeibo"){
                type = 'weibo';
            }
            this.thirdLoginApi( type, datas.nickname, datas.icon, datas.uid, datas.unionid, datas.sex);
        })
        .catch((err)=> {
            // console.log('-----', err);
                ToastUtil.showToast(err.message);
        });   
    }

    // 后台要求类型 ===> weixin weibo qq
    @action('第三方登录接口') thirdLoginApi = (platform, nickname, head_pic, openid, unionid, sex) => {
         LoginApi.thirdLogin(platform, nickname, head_pic, openid, unionid, sex).then((ret)=>{
            if(ret.code==200){
                this.setLoginState(true);
                let token = ret.result.token;
                StorageManager.setUserToken(token);
                this.getUserInfoApi(token);   
            }else if (ret.code==400){
                ToastUtil.showToast(ret.message);
            }  

            
        }).catch((err)=>{

        });

    }


    // @action('获取用户信息接口') getUserInfoApi = (token) => {


    //     FetchUtil.get(global.UrlConst.apiGetUserInfo).then((res) => { 
    //         let userInfo = res.profile
    //         console.log(userInfo)
    //         StorageManager.setUser(userInfo)
    //         StorageManager.setRoleType(userInfo.role)
    //         StorageManager.setUserName(userInfo.name)
    //         StorageManager.setUserHeader(userInfo.avatar);                       
    //         StorageManager.setUserSex(userInfo.gender)                       
    //         StorageManager.setUserSchool(userInfo.school)                    
    //         StorageManager.setUserGrade(userInfo.grade) 
    //         StorageManager.setUserGradeID(userInfo.grade_id)                                     
    //         StorageManager.setUserSignature(userInfo.description)                   
    //      }).catch((err) => {
    //          console.log(err)           
    //      });
   
    // }




    @action('发送验证码') sendSMS = () => {
        if (!this.canSendCode){
            return;
        }else{
            if (this.phone.length !== 11){
                ToastUtil.showToast('请输入正确的手机号');
                return;
            }                  
            AppApi.sendSmsCode( this.phone ).then((ret)=>{
                if(ret.code==200){
                    ToastUtil.showToast(ret.message);
                    this.changeCodeState(false);
                    var totalsmstime=120;
                    this.timer=setInterval(() => { 
                        --totalsmstime;
                        this.changeCodeText(parseInt(totalsmstime)+'秒后重发');
                        if(totalsmstime===0){
                                this.changeCodeText('获取验证码');
                                this.changeCodeState(true);
                                clearInterval(this.timer);
                        }
                    }, 1000);
                }else if (ret.code==400){
                     ToastUtil.showToast(ret.message);
                     this.changeCodeState(true);
                }  
            }).catch((err)=>{

            });
        }
    }
  
}

//注册页
export class RegisterPageStore {

    @observable isSuccessRegister = false;

    @observable phone = '';
    @observable password = '';

    @observable name = '';
    @observable sex = '';
    @observable birthday = '';

    @observable code = '';
    @observable codeText = '获取验证码';
    @observable canSendCode = true;

    @observable headImageUri = {uri:''};        //头像
    @observable positiveIdDCardUri = {uri:''};  //正面身份证
    @observable negativeIdDCardUri = {uri:''};  //反面身份证

    
    constructor() {

    }

    @action setPhone = (value) => {
       this.phone = value;
    }
    @action setPassword = (value) => {
       this.password = value;
    }
     @action setName = (value) => {
       this.name = value;
    }
    @action setSex = (value) => {
       this.sex = value;
    }
    @action setBirthday = (value) => {
       this.birthday = value;
    }


    @action setHeadImageUri = (value) => {
        this.headImageUri = value;
    }
    @action setPositiveIdDCardUri = (value) => {
        this.positiveIdDCardUri = value;
    }
    @action setNegativeIdDCardUri = (value) => {
        this.negativeIdDCardUri = value;
    }


    @action setisRegisterState = (value) => {
       this.isSuccessRegister = value;
    }
    @action setCode = (text) => {
       this.code = text;
    }
    @action changeCodeText = (text) => {
       this.codeText = text;
    }
    @action changeCodeState = (value) => {
        this.canSendCode = value;
    }

    
    
    @action('注册') registerAction = () => {
        if ( !this.headImageUri.uri.length > 0 ){
                ToastUtil.showToast('请选择您的头像');
                return;
        }
        if ( !this.name.length > 0 ){
                ToastUtil.showToast('请填写您的姓名');
                return;
        }
        if ( !this.sex.length > 0 ){
                ToastUtil.showToast('请填写您的性别');
                return;
        }
        if ( !this.birthday.length > 0 ){
                ToastUtil.showToast('请填写您的生日');
                return;
        }
        if ( this.phone.length !== 11 ){
                ToastUtil.showToast('请输入正确的手机号');
                return;
        }
        if ( this.code.length !== 4 ){
                ToastUtil.showToast('请输入正确验证码');
                return;
        }
        if (this.password.length < 6 || this.password.length > 20 ){
                ToastUtil.showToast('请输入正确的密码');
                return;
        }
        
        if ( !this.positiveIdDCardUri.uri.length > 0 ){
                ToastUtil.showToast('请上传您清晰的身份证正面');
                return;
        }
        if ( !this.negativeIdDCardUri.uri.length > 0 ){
                ToastUtil.showToast('请上传您清晰的身份证反面');
                return;
        }       
        

        LoginApi.phoneLogin( 1, this.phone, this.code ).then((ret)=>{  
            if(ret.code==200){
                this.setisRegisterState(true);
                ToastUtil.showToast('注册信息已提交审核,待审核通过后会短信通知您');
            }else if (ret.code==400){
                ToastUtil.showToast(ret.message);
            }  
        }).catch((err)=>{
                ToastUtil.showToast('注册出错了');
        });
    }


    @action('发送验证码') sendSMS = () => {
        if (!this.canSendCode){
            return;
        }else{
            if (this.phone.length !== 11){
                ToastUtil.showToast('请输入正确的手机号');
                return;
            }                  
            AppApi.sendSmsCode( this.phone ).then((ret)=>{
                if(ret.code==200){
                    ToastUtil.showToast(ret.message);
                    this.changeCodeState(false);
                    var totalsmstime=120;
                    this.timer=setInterval(() => { 
                        --totalsmstime;
                        this.changeCodeText(parseInt(totalsmstime)+'秒后重发');
                        if(totalsmstime===0){
                                this.changeCodeText('获取验证码');
                                this.changeCodeState(true);
                                clearInterval(this.timer);
                        }
                    }, 1000);
                }else if (ret.code==400){
                     ToastUtil.showToast(ret.message);
                     this.changeCodeState(true);
                }  
            }).catch((err)=>{
                ToastUtil.showToast('发送验证码出错了');
            });
        }
    }


}



//忘记密码-1 (验证手机号页)
export class PFCheckStore {

    @observable isCheckSuccess = false;
    @observable phone = '';
    @observable code = '';
    @observable codeText = '获取验证码';
    @observable canSendCode = true;
    
    constructor() {

    }

    @action setCheckSuccess = (value) => {
       this.isCheckSuccess = value;
    }
    @action setPhone = (value) => {
       this.phone = value;
    }
    @action setCode = (value) => {
       this.code = value;
    }
    @action changeCodeText = (text) => {
       this.codeText = text;
    }
    @action changeCodeState = (value) => {
        this.canSendCode = value;
    }

    @action('发送验证码') sendSMS = () => {
        if ( !this.canSendCode ){
            return;
        }else{
            if ( this.phone.length !== 11 ){
                ToastUtil.showToast('请输入正确的手机号');
                return;
            }                  
            AppApi.sendSmsCode( this.phone ).then((ret)=>{
                if(ret.code==200){
                    ToastUtil.showToast(ret.message);
                    this.changeCodeState(false);
                    var totalsmstime=120;
                    this.timer=setInterval(() => { 
                        --totalsmstime;
                        this.changeCodeText(parseInt(totalsmstime)+'秒后重发');
                        if(totalsmstime===0){
                                this.changeCodeText('获取验证码');
                                this.changeCodeState(true);
                                clearInterval(this.timer);
                        }
                    }, 1000);
                }else if (ret.code==400){
                     ToastUtil.showToast(ret.message);
                     this.changeCodeState(true);
                }  
            }).catch((err)=>{

            });
        }
    }

    @action('验证验证码') checkSMSCode = () => {
        if ( this.phone.length !== 11 ){
            ToastUtil.showToast('请输入正确的手机号');
            return;
        }
        if ( this.code.length !== 4 ){
            ToastUtil.showToast('请输入4位数字的验证码');
            return;
        }

        AppApi.checkSmsCode( this.phone, this.code ).then((ret)=>{
            if(ret.code==200){
                this.setCheckSuccess(true); 
            }else if (ret.code==400){
                ToastUtil.showToast(ret.message);
                this.setCheckSuccess(false);
            }
        }).catch((err)=>{
            this.setCheckSuccess(false); 
        });
    }
        
  
}


//忘记密码-2 (重设密码页)
export class PFResetStore {

    @observable isCheckSuccess = false;
    @observable phone = '';
    @observable password1 = '';
    @observable password2 = '';

    @action setCheckSuccess = (value) => {
       this.isCheckSuccess = value;
    }
    @action setPhone = (value) => {
       this.phone = value;
    }
    @action setPassword1 = (value) => {
       this.password1 = value;
    }
    @action setPassword2 = (value) => {
       this.password2 = value;
    }

    @action('重设密码') resetPassword = () => {
    
        if ( this.password1.length < 6 || this.password1.length > 20 ){
            ToastUtil.showToast('请输入正确的密码');
            return;
        }

        if ( this.password1 !== this.password2 ){
            ToastUtil.showToast('两次输入的密码不一致');
            return;
        }
        
        LoginApi.retPassword( this.phone, this.password1, this.password2 ).then((ret)=>{
            if(ret.code==200){
                ToastUtil.showToast('重设密码成功');
                this.setCheckSuccess(true); 
            }else if (ret.code==400){
                ToastUtil.showToast(ret.message);
                this.setCheckSuccess(false);
            }
        }).catch((err)=>{

        });
    }

}

