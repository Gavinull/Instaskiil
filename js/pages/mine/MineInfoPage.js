import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView,
    ScrollView
} from 'react-native';
import AppStore from '../../stores/AppStore';
import { observer } from 'mobx-react/native';
import ModifyUserInfoPage from './ModifyUserInfoPage';
import ToastUtils from '../../utils/ToastUtil';
import ImagePicker from 'react-native-image-picker';
import {ModifyUserInfoPageStore} from '../../stores/UserStore';
import StorageManager from './../../configs/StorageManager';
import * as GlobalConst from '../../configs/GlobalConst';
import  DateUtil from './../../utils/DateUtil';
import ActionSheet from 'react-native-actionsheet'
import  RandomUtil from './../../utils/RandomUtil';

 const { width, height } = Dimensions.get('window');

@observer
 export default class MineInfoPage extends React.Component{

        constructor(props){
            super(props);
            let isThirdLogin = false;
            let avatar = require('./../../images/head.png');
            if (AppStore.userHeader && AppStore.userHeader.indexOf("http://") >= 0){
                isThirdLogin = true;
                avatar = {uri: AppStore.userHeader};
            }
            this.state = {
                avatar: (!AppStore.userHeader || isThirdLogin) ? avatar : {uri: AppStore.userHeader},
                grade:{id:"", name:""},
                grade_list:[],
                subject:{id:"", name:""},
                subject_list:[],
            };
            this.pageStore = new ModifyUserInfoPageStore();
        }

        componentWillMount(){
            if(AppStore.roleType == AppStore.Enum_RoleType.students){
                //獲取年級列表
                this.fetchGradeList();
            }

            if(AppStore.roleType == AppStore.Enum_RoleType.teacher){
                //獲取科目列表
               this.fetchSubjectList();
            }
        }

        
        goToModifyPage(userInfoType,userInfoName) {

            console.log(userInfoType,userInfoName)

            Actions.ModifyUserInfoPage({userInfoType:userInfoType,userInfoName:userInfoName})
        }

        //选择图片
        onChoiceImage() {
            
            let options = {
            title: '请选择图片',
            cancelButtonTitle: '取消',
            chooseFromLibraryButtonTitle: '相册',
            takePhotoButtonTitle: '拍照',
            allowsEditing: true,
            quality: 0.9,
            maxWidth: 1080,
            maxHeight: 1080
        };
        ImagePicker.showImagePicker(options, (res) => {
            if (res.didCancel) {
                // ToastUtils.showToast('已取消选择');
            } else if (res.error) {
                ToastUtils.showToast('选择图片错误');
            } else if (res.customButton) {

            } else {
                let source = '';
                let path = '';
                if (Platform.OS === 'ios') {
                    source = {uri: res.uri.replace('file://', ''), isStatic: true};
                    path = res.uri.replace('file://', '');
                } else {
                    source = {uri: res.uri, isStatic: true};
                    path = res.path;
                }
                // this.ModifyUserInfoPageStore.uploadUserPic(path).then((json) => {
                //     // console.log('----------', json);
                //     StorageManager.setUserHeader(json.result.urlpath);
                //     this.setState({
                //         avatar: source
                //     })
                // }).catch(() => {})

                global.FetchUtil.get(global.UrlConst.apiGetUploadToken).then((result) => {
                        let token = result.upload_token;
                        let name = RandomUtil.randomFileName(".jpg")
                        let key = RandomUtil.randomUploadFilePath("headImage",".jpg")
                        global.FetchUtil.postImage(global.UrlConst.qiniuHost, {params:{token:token,key:key}}, {uri:path, fileName:"file", name:name, mime:'image/jpg'}).then((result) => {

                         if(result.key){
                             let url = global.UrlConst.sourceHost + result.key;
                            this.pageStore.modifyUserInfo(AppStore.Enum_UserInfoType.headImage, url);
                         }
    
                    })

                })

            }
        });
    }

        //ScrollView
     renderScrollView(){
         // 老師 || 學生
         let items = [
             {name:"頭像", dataKey:"userHeader",  type:AppStore.Enum_UserInfoType.headImage, isTopLine:true, height:100},
             {name:"姓名", dataKey:"userName", type:AppStore.Enum_UserInfoType.name, isTopLine:false, height:50},
             {name:"性別", dataKey:"userSex", type:AppStore.Enum_UserInfoType.sex, isTopLine:false, height:50},
         ];

         if(AppStore.roleType == AppStore.Enum_RoleType.students){
             items.push({name:"學校", dataKey:"userSchool", type:AppStore.Enum_UserInfoType.school, isTopLine:true, height:50});
             items.push({name:"年級", dataKey:"userGrade", type:AppStore.Enum_UserInfoType.grade, isTopLine:false, height:50});
         }

         if(AppStore.roleType == AppStore.Enum_RoleType.teacher){
            items.push({name:"擅長科目", dataKey:"userSubject", type:AppStore.Enum_UserInfoType.subject, isTopLine:true, height:50});
        }

         items.push({name:"電話", dataKey:"userPhone", type:AppStore.Enum_UserInfoType.phone, isTopLine:true, height:50});
         items.push({name:"郵箱", dataKey:"userEmail", type:AppStore.Enum_UserInfoType.email, isTopLine:false, height:50});
         items.push({name:"個性簽名", dataKey:"userSignature", type:AppStore.Enum_UserInfoType.signature, isTopLine:false, height:80});

         

         return (
             <ScrollView style={{flex: 1}}>
                 {
                     items.map((rowData, rowID) => {
                         return (
                             <TouchableOpacity key={rowData.name}
                                            activeOpacity={0.5}
                                               accessible={rowID !== 1} activeOpacity={ rowID === 1 ? 1:0.4}
                                               style={{flexDirection:'column',alignItems:'center'}} onPress={() => {
                                 if (rowData.type == AppStore.Enum_UserInfoType.headImage) {
                                     this.onChoiceImage();
                                 }else if(rowData.type == AppStore.Enum_UserInfoType.grade){
                                    this.gradeActionSheet.show()
                                 }else if(rowData.type == AppStore.Enum_UserInfoType.subject){
                                    var defaultSubjects = [];
                                    if(AppStore.userSubjectID.length>0){
                                        defaultSubjects = AppStore.userSubjectID.map((id) =>{ return {id:id, name:""}; });
                                    }
                                    Actions.ChooseSubjectPage({lastPageStore:this.pageStore, defaultSubjects:defaultSubjects});
                                    {/* this.subjectActionSheet.show() */}
                                 }else {
                                     this.goToModifyPage(rowData.type, rowData.name);
                                 }
                             }}>
                                {
                                    rowData.isTopLine ? (<View style={{height:5, backgroundColor:'#f0f0f0'}}/>):null
                                }
                                 <View style={{flex:1,height:rowData.height, backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
                                     <Text style={{flex:1,marginLeft:15,color:'#000000'}}>{rowData.name}</Text>
                                     {
                                         rowID==0 ?  (
                                             <Image source={ !AppStore.userHeader  ? require('../../resources/img/mine_icon_avatar.png') : {uri: AppStore[rowData.dataKey]}} style={{width:70,height:70,borderRadius:10,marginRight:8}}/>
                                         )
                                             : <Text style={{color:'rgba(70,70,70,0.5)',flex:3,marginRight:8,textAlign:'right'}} numberOfLines={2}>{rowData.type == AppStore.Enum_UserInfoType.sex ? (AppStore[rowData.dataKey] == 1 ? "男":"女"):AppStore[rowData.dataKey]}</Text>
                                     }
                                     
                                     <Image source={require('./../../images/icon_arrow.png')} style={{width:14, height:14, resizeMode:'contain', marginRight:20, backgroundColor:'white', alignSelf: 'center', }} />
                                     
                                 </View>
                                <View style={{height:1,backgroundColor:'#f0f0f0',position:'absolute',bottom:0,left:0,right:0}}/>
                                
                             </TouchableOpacity>
                         )
                     })
                 }
             </ScrollView>
         );
        }

        render() {
            return (
                <View style={styles.container}>
                {this.renderScrollView()}
                {this.renderGradeActionSheet()}  
                {this.renderSubjectActionSheet()} 
            </View>

            )
        }


         // 年級
        fetchGradeList(){

            global.FetchUtil.get(global.UrlConst.apiGetGradeList).then((res) => {
            this.setState({grade_list:res.grade_list}) 
            console.log(this.state.grade_list)           
            }).catch((err) => {
                ToastUtil.showToast(err.msg);
            });
        }

         // 科目
         fetchSubjectList(){

            global.FetchUtil.get(global.UrlConst.apiGetSubjectList).then((res) => {
            this.setState({subject_list:res.subject_list}) 
            console.log(this.state.subject_list)           
            }).catch((err) => {
                ToastUtil.showToast(err.msg);
            });
        }


        renderGradeActionSheet(){
            let  options = this.state.grade_list.map((grade) =>{ return grade.name})
            let cancelButtonIndex = options.push("取消")-1;
            console.log(options)
            return (
                <ActionSheet
                    ref={o => this.gradeActionSheet = o}
                    title={'選擇年級'}
                    options={options}
                    cancelButtonIndex={cancelButtonIndex}
                    onPress={(index) => {
                        if( this.state.grade_list.length > 0 && index != cancelButtonIndex ){
                            let grade = this.state.grade_list[index];
                            this.pageStore.modifyUserInfo(AppStore.Enum_UserInfoType.grade, grade.id);
                        }
                    }}
                />
            )
        }

        renderSubjectActionSheet(){
            let  options = this.state.subject_list.map((subject) =>{ return subject.name})
            let cancelButtonIndex = options.push("取消")-1;
            console.log(options)
            return (
                <ActionSheet
                    ref={o => this.subjectActionSheet = o}
                    title={'選擇擅長科目'}
                    options={options}
                    cancelButtonIndex={cancelButtonIndex}
                    onPress={(index) => {
                        if( this.state.subject_list.length > 0 && index != cancelButtonIndex ){
                            let subject = this.state.subject_list[index];
                            this.pageStore.modifyUserInfo(AppStore.Enum_UserInfoType.subject, subject.id);
                        }
                    }}
                />
            )
        }

}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
})
