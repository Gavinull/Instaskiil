import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

// import 'es6-symbol/implement';
// import 'core-js/es6/symbol';
// import 'core-js/fn/symbol/iterator';

import React from 'react';
import { AppRegistry, View, AsyncStorage, Navigator, StatusBar, Dimensions, Platform, DeviceEventEmitter } from 'react-native';
import *as GlobalConst from './configs/GlobalConst';
import StorageManager from './configs/StorageManager';
import NavBarContainer from './configs/NavBarContainer';
import TabBarContainer from './configs/TabBarContainer';
import GuidePage from './configs/GuidePage';
import AppStore from './stores/AppStore';
import { isIphoneX } from './utils/ScreenUtil';
import Router from './configs/Router';
import ActionSheet from 'react-native-actionsheet-api';

//状态管理: mobx App级的状态管理器,通过navigator以props传递,也可以直接操作方法和属性(单例)
var store = AppStore;
//数据管理:这里显试初始化全局的数据存取管理器(单例)
var storage = StorageManager;

const {width, height} = Dimensions.get('window');

export default class root extends React.Component{
    
        constructor(props){
            super(props);
        }

        componentDidMount(){

            this.launchScreen()

            //监听是否要退出登录
            this.loginout_Listener = DeviceEventEmitter.addListener(global.KeyConst.KNotification_logout, (message)=>{    
                console.log('退出登录:', message);
                if(message == true){
                     //清空用户数据
                     StorageManager.cleanStorage();
                     Actions.reset("LoginPage")
                }
            })

        }
        componentWillUnmount(){
            //清除监听
            this.loginout_Listener.remove();
        }

        launchScreen(){
            StorageManager.loadObjectWithKey("kUserToken").then((data) => {
                if(AppStore.userToken.length>0){
                   if(AppStore.roleType == AppStore.Enum_RoleType.students){
                        Actions.reset("Tabbar_S")
                   }else{
                        Actions.reset("Tabbar_T")
                   }
                }else{
                    Actions.reset("LoginPage")
                }
            }).catch((error) => {
                Actions.reset("LoginPage")
                // Actions.reset("GuidePage")
            })
        }

        render(){   
            return (
                <View style={{flex: 1,backgroundColor:"#fff"}}>
                    <Router />
                    <ActionSheet/>
                </View>
            );
        }

}
