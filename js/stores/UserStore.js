import { observable, action, useStrict, computed, runInAction } from 'mobx';
import { ListView } from 'react-native';
import UserApi  from '../apis/UserApi';
import AppStore   from './../stores/AppStore';
import ToastUtil from './../utils/ToastUtil';
import AppApi   from '../apis/AppApi';
import TestData from './../configs/TestData';
import RegularUtil from './../utils/RegularUtil';

//我的余额
export class BalancePageStore {

    @observable list = [];
    @observable page = 1;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable refreshing = false;

    constructor() {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
    }

    @computed get dataSource() {
        return this.ds.cloneWithRowsAndSections({section1:this.list.slice()});
    }

    @action loadData = () => {
        this.list = TestData.myBooksList;
        // UserApi.integralBalanceLogApi(AppStore.userToken, 1, this.page).then(action((ret) => {
        //       if( ret.code === 200 ){
        //           this.list = ret.result.consumeRs;
        //       }
        // })).catch((err) => {

        // });
    }

}

//我的积分
export class IntegralPageStore {

    @observable list = [];
    @observable page = 1;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable refreshing = false;

    constructor() {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
    }

    @computed get dataSource() {
        return this.ds.cloneWithRowsAndSections({section1:this.list.slice()});
    }

    @action loadData = () => {
        UserApi.integralBalanceLogApi(AppStore.userToken, 2, this.page).then(action((ret) => {
              if( ret.code === 200 ){
                  this.list = ret.result.consumeRs;
              }
        })).catch((err) => {

        });
    }

}


//我的优惠券
export class CouponPageStore {

    @observable list = [];
    @observable page = 1;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable refreshing = false;

    constructor() {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    @computed get dataSource() {
        return this.ds.cloneWithRows(this.list.slice());
    }

    @action loadData = () => {
        UserApi.couponListApi(AppStore.userToken, 0).then(action((ret) => {
              if( ret.code === 200 ){
                  this.list = ret.result;
              }
        })).catch((err) => {

        });
    }

}


//我过期的优惠券
export class ExpiredCouponPageStore {

    @observable list = [];
    @observable page = 1;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable refreshing = false;

    constructor() {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    @computed get dataSource() {
        return this.ds.cloneWithRows(this.list.slice());
    }

    @action loadData = () => {
        UserApi.couponListApi( AppStore.userToken, 2).then(action((ret) => {
              if( ret.code === 200 ){
                  this.list = ret.result;
              }
        })).catch((err) => {

        });
    }

}


//我的车辆
export class UserCarPageStore {

    @observable listData = [];
    @observable page = 1;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable refreshing = false;

    constructor() {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    @computed get dataSource() {
        return this.ds.cloneWithRows(this.listData.slice());
    }

    @action loadData = () => {
        UserApi.userCarApi(AppStore.userToken).then(action((ret) => {
              if( ret.code === 200 ){
                  this.listData = ret.result;
              }
        })).catch((err) => {

        });
    }

    @action('添加车辆') addCarApi(brandId, brandName, carAbb, color, model, carName, isDefault){
        return new Promise((resolve, reject) => {
            UserApi.addUserCarApi(AppStore.userToken, brandId, brandName, carAbb, color, model, carName, isDefault).then((json) => {
                if (json.code === 200){
                    ToastUtil.showToast('添加成功');
                    this.loadData();
                    resolve(true);
                } else{
                    let msg = json.message ? json.message : '添加失败';
                    ToastUtil.showToast(msg);
                    reject(false);
                }
            }).catch(() => {
                ToastUtil.showToast('添加失败');
                reject(false);
            })
        });
    }

    @action setDefaultCar = (id) => {
        var arr = [];
        for (var index = 0; index < this.listData.length; index++) {
            if (this.listData[index].car_id == id) {
                this.listData[index].is_default = this.listData[index].is_default ? 0 : 1;
                let object = {is_default: this.listData[index].is_default, car_id: id};
                // console.log("1", object);
                this.modifyUserCar(object).then((flag) => {
                    ToastUtil.showToast("修改成功");
                }).catch((error) => {
                    ToastUtil.showToast("修改失败");
                });
            }else if (this.listData[index].is_default === 1){
                this.listData[index].is_default = 0;
                // console.log("0");
                let object = {is_default: this.listData[index].is_default, car_id: this.listData[index].car_id};
                // console.log("0", object);
                this.modifyUserCar(object).then((flag) => {

                }).catch((error) => {

                });
            } else {
                this.listData[index].is_default = 0;
            }
            arr.push(this.listData[index]);
        }
        this.listData = arr;


    }

    @action('修改车辆') modifyUserCar(object) {
        return new Promise((resolve, reject) => {
            UserApi.editCarApi(AppStore.userToken, object).then((json) => {
                if (json.code == 200){
                    // ToastUtil.showToast("修改成功");
                    // this.loadData();
                    resolve(true);
                    return
                }
                // ToastUtil.showToast("修改失败");
                reject(false);
            }).catch((error) => {
                // ToastUtil.showToast("修改失败");
                reject(false);
            })
        });
    }

    @action('删除车辆') delUserCar(carId) {
        UserApi.delUserCar(carId, AppStore.userToken).then((json) => {
            if (json.code == 200){
                ToastUtil.showToast("删除成功");
                this.loadData();
                return
            }
            ToastUtil.showToast("删除失败");
        }).catch((error) => {
            ToastUtil.showToast("删除失败");
        })
    }

}

//我的收藏
export class CollectPageStore {

    @observable list = [];
    @observable page = 1;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable refreshing = false;

    constructor() {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    @computed get dataSource() {
        return this.ds.cloneWithRows(this.list.slice());
    }

    @action loadData = () => {
        this.list = TestData.orderHistoryList;

        // UserApi.collectListApi(AppStore.userToken).then(action((ret) => {
        //       if( ret.code === 200 ){
        //           this.list = ret.result;
        //       }
        // })).catch((err) => {

        // });
    }

}

//我的评价
export class EvaluationPageStore {

    @observable list = [];
    @observable page = 1;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable refreshing = false;

    constructor() {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    @computed get dataSource() {
        return this.ds.cloneWithRows(this.list.slice());
    }

    @action loadData = () => {
        UserApi.commentListApi(AppStore.userToken, this.page).then(action((ret) => {
              if( ret.code === 200 ){
                  this.list = ret.result;
              }
        })).catch((err) => {

        });
    }

}


//密码管理
export class PWManagerPageStore {


    @observable password = '';
    @observable new_password = '';
   
    constructor() {
       
    }

    @action('确认修改密码') confirmChangePassword () {

        let {password, new_password } = this;

        if(global.RegularUtil.isPassword(password) == false){
            ToastUtil.showToast("請輸入正確格式的原密碼");
            return;
        }
        if(global.RegularUtil.isPassword(new_password) == false){
            ToastUtil.showToast("請輸入正確格式的新密碼");
            return;
        }


        let params = {
            password:password,
            new_password:new_password
        };
        global.FetchUtil.post(global.UrlConst.apiUpdatePassword, {params:params}).then((res) => {
            ToastUtil.showToast("修改成功");
            Actions.pop();
        })

        
    }


}


export class ModifyUserInfoPageStore {

    @action('选择擅长科目 回调') chooseSubjectBlock = (subjects) => {
        let  ids = subjects.map((subject) =>{ return subject.id})

        this.modifyUserInfo(AppStore.Enum_UserInfoType.subject, ids.join(','));

    }

    @action('修改用戶信息') modifyUserInfo(userInfoType, updateValue) {
        return new Promise((resolve, reject) => {

            if(userInfoType == AppStore.Enum_UserInfoType.name){
                if(updateValue.length > 0 == false){
                    ToastUtil.showToast('姓名不能為空');
                    reject()
                    return
                }
                
            }else if(userInfoType == AppStore.Enum_UserInfoType.signature){
                if(updateValue.length > 0 == false){
                    ToastUtil.showToast('個性簽名不能為空');
                    reject()
                    return
                }
                
            }else if(userInfoType == AppStore.Enum_UserInfoType.school){
                if(updateValue.length > 0 == false){
                    ToastUtil.showToast('學校名稱不能為空');
                    reject()
                    return
                }
            }else if(userInfoType == AppStore.Enum_UserInfoType.phone){
                if(updateValue.length > 0 == false){
                    ToastUtil.showToast('聯繫電話不能為空');
                    reject()
                    return
                }

                if(RegularUtil.isMacauPhone(updateValue) == false){
                    ToastUtil.showToast('請輸入正確格式的電話號碼');
                    reject()
                    return
                }

                
            }else if(userInfoType == AppStore.Enum_UserInfoType.email){
                if(updateValue.length > 0 == false){
                    ToastUtil.showToast('郵箱地址不能為空');
                    reject()
                    return
                }
                if(RegularUtil.isEmail(updateValue) == false){
                    ToastUtil.showToast('請輸入正確格式的郵箱地址');
                    reject()
                    return
                }
            }else if(userInfoType == AppStore.Enum_UserInfoType.grade){
                
            }else if(userInfoType == AppStore.Enum_UserInfoType.subject){
                
            }else if(userInfoType == AppStore.Enum_UserInfoType.sex){
                
            }else if(userInfoType == AppStore.Enum_UserInfoType.headImage){
                
            }else{
                reject()
                return
            }

            global.FetchUtil.post(global.UrlConst.apiSetUserInfo,{params:{edit_type:userInfoType,update_value:updateValue}}).then((res) => {
                resolve(userInfoType, updateValue)
                AppStore.getUserInfo()
            }).catch((err)=>{
                reject(err)
            })

        })

    }

    @action('上传用户头像') uploadUserPic(pic){
        return new Promise((resolve, reject) => {
            UserApi.uploadUserPicApi(AppStore.userToken, pic).then((json) => {
                if (json.code === 200){
                    ToastUtil.showToast('修改成功');
                    resolve(json);
                } else{
                    let msg = json.message ? json.message : '修改失败';
                    ToastUtil.showToast(msg);
                    reject(false);
                }
            }).catch(() => {
                ToastUtil.showToast('上传图片失败');
                reject(false);
            })
        });
    }

}

export class FeedbackPageStore {

    @action('意见反馈') feedback(  mobile, content, img  ) {
        return new Promise((resolve, reject) => {
            UserApi.feedbackApi(AppStore.userToken, mobile, content, img).then((json) => {
                if (json.code === 200){
                    ToastUtil.showToast('意见反馈成功');
                    resolve(true);
                } else{
                    let msg = json.message ? json.message : '意见反馈失败！请稍后重试';
                    ToastUtil.showToast(msg);
                    reject(false);
                }
            }).catch((error) => {
                ToastUtil.showToast('意见反馈失败！请稍后重试');
                reject(false);
            })
        });
    }

    @action('上传反馈图片') uploadFeedbackPic(pic){
        return new Promise((resolve, reject) => {
            UserApi.uploadFeedbackImgApi(AppStore.userToken, pic).then((json) => {
                if (json.code === 200){
                    // ToastUtil.showToast('上传成功');
                    resolve(json);
                } else{
                    let msg = json.message ? json.message : '上传失败';
                    ToastUtil.showToast(msg);
                    reject(false);
                }
            }).catch(() => {
                ToastUtil.showToast('上传图片失败');
                reject(false);
            })
        });
    }

}