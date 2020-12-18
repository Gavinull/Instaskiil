import React from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Text,
    Platform,
    TextInput
} from 'react-native';

import AppStore from '../../stores/AppStore';
import StorageManager from './../../configs/StorageManager';
import {ModifyUserInfoPageStore} from '../../stores/UserStore';
import ToastUtils from '../../utils/ToastUtil';
import CustomNavBar from '../../components/CustomNavBar';
import RegularUtil from '../../utils/RegularUtil';

/**
 *  修改用户信息
 */

export default class ModifyUserInfoPage extends React.Component {

    constructor(props) {
        super(props);
        this.pageStore = new ModifyUserInfoPageStore();
        this.state = {
            userInfoType:this.props.userInfoType,
            userInfoName:this.props.userInfoName,
            inputTxt: '',
            userSex:AppStore.userSex
        };
    
    }
    componentDidMount() {

        // this.resetNavigatorBar()
        
    }

    // resetNavigatorBar(){

    //     let _this = this
    //     setTimeout(function() {
    //           Actions.refresh({
    //              title: `修改${_this.state.userInfoName}`,
    //             rightTitle: '提交',
    //             onRight: () => {
    //                 _this._submitModify()
    //             }
    //           });
    //     }, 1);
    // }

    _submitModify(){

        let userInfoType = this.state.userInfoType
        if(userInfoType == AppStore.Enum_UserInfoType.sex){
            this.pageStore.modifyUserInfo(userInfoType,this.state.userSex).then((userInfoType,updateValue)=>{
                Actions.pop()
            })
        }else{
            this.pageStore.modifyUserInfo(userInfoType,this.state.inputTxt).then((userInfoType,updateValue)=>{
                Actions.pop()
            })
        }

    }

    //隐藏键盘
    closeKeyboard() {
        TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
    }

    onChangeTxt(txt) {
        // console.log(txt)
        this.state.inputTxt = txt
        // console.log(this.state.inputTxt)
    }


    render() {
       
        let isModifySex = this.state.userInfoType == AppStore.Enum_UserInfoType.sex

        return (
            <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={() => this.closeKeyboard()}>
                <View style={{flex: 1, backgroundColor: 'rgb(245,245,245)'}}>
                    {this.renderNavigatorBar()}
                    {
                     isModifySex ? this.renderModifySexView() : this.renderCommonInputView()        
                    }
                </View>
            </TouchableOpacity>
        )
    }

    renderNavigatorBar(){
        let _this = this;
        return (
            <CustomNavBar title={`修改${_this.state.userInfoName}`}
            renderRightView={() => {
                    return (
                        <TouchableOpacity style={{width:60, height:44, position:"absolute", right:10, bottom:0,height:44, justifyContent:'center', alignItems:"flex-end"}}
                            onPress={() => {
                                _this._submitModify();
                            }}>
                            <Text style={{fontSize:15, color:"#0084FF"}}>提交</Text>
                        </TouchableOpacity>
                    );
                }}
                />
            );
    }

     // 姓名 電話 郵箱 個性簽名 學校
    renderCommonInputView(){
        let defaultValue = ""
        let placeholder = ""
        let height = 40
        let multiline = false
        let maxLength = 15

        
        
        let userInfoType = this.state.userInfoType
        if(userInfoType == AppStore.Enum_UserInfoType.name){
            defaultValue = AppStore.userName
            this.state.inputTxt = defaultValue
            placeholder = "請輸入姓名"
            maxLength = 15;
        }else if(userInfoType == AppStore.Enum_UserInfoType.signature){
            defaultValue = AppStore.userSignature
            this.state.inputTxt = defaultValue
            placeholder = "請輸入個性簽名"
            height = 200
            multiline = true
            maxLength = 150;
        }else if(userInfoType == AppStore.Enum_UserInfoType.school){
            defaultValue = AppStore.userSchool
            this.state.inputTxt = defaultValue
            placeholder = "請輸入學校名稱";
            maxLength = 20;

        }else if(userInfoType == AppStore.Enum_UserInfoType.phone){
            defaultValue = AppStore.userPhone
            this.state.inputTxt = defaultValue
            placeholder = "請輸入聯繫電話";
            maxLength = 20;

        }else if(userInfoType == AppStore.Enum_UserInfoType.email){
            defaultValue = AppStore.userEmail
            this.state.inputTxt = defaultValue
            placeholder = "請輸入郵箱地址";
            maxLength = 20;

        }

        return (
            <TextInput
                style={{
                    color: '#333333',
                    fontSize: 15,
                    backgroundColor: 'white',
                    padding: 10,
                    margin:10,
                    height: height
                }}
                multiline={multiline}
                maxLength={maxLength}
                underlineColorAndroid={'transparent'}
                placeholderTextColor={'#999999'}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChangeText={(txt) => this.onChangeTxt(txt)}
                keyboardType={'default'}
            />
        )
    }

    // 性別
    renderModifySexView() {
        let sexArr = ['男', '女'];
        return (
            <View style={{flex: 1}}>
                {
                    sexArr.map((item, index) => {
                        return (
                            <TouchableOpacity  activeOpacity={0.5} key={`sexArr${index}`} onPress={() => {
                                    this.setState({userSex:index+1})
                                }}>
                                <View style={{
                                    backgroundColor: 'white',
                                    padding: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                    marginTop: index == 0 ? 10 : 0
                                }}>
                                    <Text>{item}</Text>
                                    <Image style={{width: 20, height: 20, resizeMode: 'contain'}}
                                           source={this.state.userSex == index+1 ? require('../../resources/img/icon_choice_success.png') :null}/>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }


}