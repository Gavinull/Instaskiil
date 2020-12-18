import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
    DeviceEventEmitter,
    PanResponder
} from 'react-native';
import Display from 'react-native-display';
import {LoginPageStore} from '../../stores/LoginStore';
import {observer} from 'mobx-react/native';
import {observe} from 'mobx';
import PasswordForgotPage from './PasswordForgotPage';
import StorageManager from './../../configs/StorageManager';
import AppStore from '../../stores/AppStore';
import LoginApi from '../../apis/LoginApi';
import UserApi from '../../apis/UserApi';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import TabBarContainer from '../../configs/TabBarContainer';
import RegisterPage from './RegisterPage';

import {SegmentedView} from 'teaset';
import storageManager from './../../configs/StorageManager';
import { isIphoneX } from "../../utils/ScreenUtil";

const {width, height} = Dimensions.get('window');

@observer
export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.LoginPageStore = new LoginPageStore();

        // this.startObserver();
        this.closekeyboard();
    }

    closekeyboard() {
        this.pan = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (e, gestureState) => {
                TextInput
                    .State
                    .blurTextInput(TextInput.State.currentlyFocusedField());
            }
        });
    }

    startObserver() {
        this.LoginPageStore = new LoginPageStore();
        // const disposer = observe(this.LoginPageStore, 'isSuccesslogin', (change) => {
        //     if (this.LoginPageStore.isSuccesslogin) {
                
        //         AppStore.getUserInfo().then((userInfo)=>{
        //             if(userInfo.role == AppStore.Enum_RoleType.students){
        //                 Actions.reset("Tabbar_S")
        //             }else if(userInfo.role == AppStore.Enum_RoleType.teacher){
        //                 Actions.reset("Tabbar_T")
        //             }else{
        //                 global.ToastUtil.showToast("登录角色出错")
        //                 storageManager.cleanStorage()
        //             }
        //         })

        //     }
        // });
    }

    //platformType 统一第三方登录类型 --->>>  Wechat  QQ  SinaWeibo
    selectLoginOption(optionName) {
        if (optionName === '验证登录') {
            this
                .LoginPageStore
                .changeLoginType();
        }
        if (optionName === '微信') {
            this
                .LoginPageStore
                .thirdLogin('Wechat');
        }
        if (optionName === 'QQ') {
            this
                .LoginPageStore
                .thirdLogin('QQ');
        }
        if (optionName === '微博') {
            this
                .LoginPageStore
                .thirdLogin('SinaWeibo');
        }

    }

    render() {
        return (
            <View style={styles.container} {...this.pan.panHandlers}>
                {this.renderContentView()}
                {/* <KeyboardSpacer/> */}
                <View style={{alignItems:"center",justifyContent:"flex-end",marginBottom:isIphoneX() ? 34:5}}>
                        <Text style={{fontSize:12, color:'#4A4A4A', backgroundColor:'transparent', marginTop:20}}>聯繫電話: 6243 2521</Text>
                        <Text style={{fontSize:12, color:'#4A4A4A', backgroundColor:'transparent', marginTop:10}}>微信號: unnamed_edu</Text>
                </View>
            </View>
        );
    }

    // //navigatorBar
    // renderNavigatorBar() {
    //     return (
    //         <View
    //             style={{
    //             height: Platform.OS === 'ios'
    //                 ? 64
    //                 : 44,
    //             backgroundColor: '#0298FE',
    //             flexDirection: 'row',
    //             alignItems: 'flex-end'
    //         }}>
    //             <TouchableOpacity
    //                 style={{
    //                 width: 88,
    //                 height: 44,
    //                 marginTop: 20,
    //                 justifyContent: 'center'
    //             }}
    //                 onPress={() => {}}></TouchableOpacity>
    //             <View
    //                 style={{
    //                 flex: 1,
    //                 height: 44,
    //                 alignItems: 'center',
    //                 justifyContent: 'center'
    //             }}>
    //                 <Text
    //                     style={{
    //                     color: '#fff',
    //                     fontSize: 17,
    //                     fontWeight: 'bold'
    //                 }}>登录</Text>
    //             </View>

    //             <TouchableOpacity
    //                 style={{
    //                 width: 88,
    //                 height: 44,
    //                 marginTop: 20,
    //                 justifyContent: 'center',
    //                 alignItems: 'flex-end'
    //             }}
    //                 onPress={() => {}}>
    //                 <Text
    //                     style={{
    //                     marginRight: 8,
    //                     fontSize: 15
    //                 }}></Text>
    //             </TouchableOpacity>
    //         </View>
    //     );
    // }

    renderContentView() {
        let {loginType, phone, password, codeText} = this.LoginPageStore;
        return (
            <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{margin:38, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    {/* LOGO*/}
                    <Image style={{ borderRadius: 8, width: 104, height: 78, resizeMode: 'contain' }} source={require('./../../resources/img/icon_login_logo.png')}/>

                    <Text style={{fontSize:20, fontWeight:'bold', color:'#4A4A4A', backgroundColor:'transparent',marginTop:20}}>秒答</Text>
                    <Text style={{fontSize:14, color:'#4A4A4A', backgroundColor:'transparent',marginTop:10}}>未名教育</Text>

                    {/*账号*/} 
                    <View style={{ backgroundColor: '#fff', alignItems: 'center', height: 100, margin: 20, borderRadius: 6, marginTop:30 }}>
                        
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 5 }}>
                            <Image source={require('./../../images/login_icon_username.png')} style={{ margin: 8, marginLeft: 0, width: 18, height: 18, resizeMode: 'contain' }}/>
                            <TextInput style={{ marginLeft: 0, flex: 1, padding: 0, height: 50, fontSize: 15 }}
                                onChangeText={(text) => {
                                this.LoginPageStore.setPhone(text);
                            }}
                            secureTextEntry={false}
                            keyboardType={'default'}
                            maxLength={20}
                            defaultValue={''}
                            placeholder={'請輸入賬號'}
                            placeholderTextColor={'#CCCCCC'}
                            underlineColorAndroid="transparent"/>
                        </View>

                        {/*分割线*/}
                        <View style={{ height: 2, width: width - 16*2 - 38*2, backgroundColor: '#F7F9FA', marginLeft: 16, marginRight: 16 }}/>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 5 }}>
                            <Image source={loginType === 2 ? require('./../../images/login_icon_password.png') : require('./../../images/login_input_key.png')} style={{ margin: 8, marginLeft: 0, width: 18, height: 18, resizeMode: 'contain' }}/>
                            <TextInput
                                style={{
                                marginLeft: 0,
                                flex: 1,
                                padding: 0,
                                height: 50,
                                fontSize: 15
                            }}
                                onChangeText={(text) => {
                                this.LoginPageStore.setPassword(text);
                            }}
                            secureTextEntry={true}
                                keyboardType={'default'}
                                maxLength={16}
                                defaultValue={''}
                                placeholder={'請輸入密碼'}
                                placeholderTextColor={'#CCCCCC'}
                                underlineColorAndroid="transparent"
                                returnKeyType={'done'}
                                />
                        </View>

                        <View
                            style={{
                            height: 2,
                            width: width - 16*2 - 38*2,
                            backgroundColor: '#F7F9FA',
                            marginLeft: 16,
                            marginRight: 16
                        }}/>
                    </View>

                    {/*登录按钮*/}
                    <View
                        style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 50,
                        marginTop: 20
                    }}>
                        <TouchableOpacity
                            style={{
                            flex: 1,
                            backgroundColor: '#0084FF',
                            height: 50,
                            borderRadius: 25,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 20
                        }}
                            onPress={() => {
                            this.LoginPageStore.requstLoginAction(this.LoginPageStore.phone, this.LoginPageStore.password);
                        }}>
                            <Text
                                style={{
                                color: '#fff',
                                fontSize: 18
                            }}>登 錄</Text>
                        </TouchableOpacity>
                    </View>
                    {/*注册*/}
                    <View
                        style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        height: 70,
                        marginTop: 0
                    }}>
                        <TouchableOpacity
                            style={{
                            flex: 1,
                            height: 50,
                            borderRadius: 25,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: '#0084FF'
                        }}
                            onPress={() => {
                            Actions.RegisterAccountPage()
                        }}>
                            <Text
                                style={{
                                color: '#0084FF',
                                fontSize: 18
                            }}>註 冊</Text>
                        </TouchableOpacity>
                    </View>

                  
                    

                </View>
                
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
