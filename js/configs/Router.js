/**
 * Created by Rabbit on 2017/11/3.
 */

import React from 'react';
import { StyleSheet, Text, View,Image, BackHandler, StatusBar, DeviceEventEmitter,TouchableOpacity } from 'react-native';
import CardStackStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';

import {
    Scene,
    Router,
    Actions,
    Reducer,
    ActionConst,
    Overlay,
    Tabs,
    Modal,
    Drawer,
    Stack,
    Lightbox,
} from 'react-native-router-flux';

import { Theme } from 'teaset';
import TabIcon from '../components/TabIcon';
import CustomNavBar from '../components/CustomNavBar';


import { Images } from '../resources/index';
import AppStore from '../stores/AppStore';

import ImageBrowserView from './../components/ImageBrowserView';




// Common
import LaunchPage from '../pages/common/LaunchPage'
import GuidePage from '../pages/common/GuidePage'
import ChooseQuestionTypePage from '../pages/common/ChooseQuestionTypePage'
import ChooseTeacherListPage from '../pages/common/ChooseTeacherListPage'
import VideoPlayPage from '../pages/common/VideoPlayPage';


import EditorQuestionPage from '../pages/common/EditorQuestionPage'
import QuestionDetailsPage from '../pages/common/QuestionDetailsPage'
import CameraRecordPage from '../pages/common/CameraRecordPage'

import WebPage from '../pages/common/WebPage'
import SearchQuestionPage from '../pages/common/SearchQuestionPage'
import ChooseSubjectPage from '../pages/common/ChooseSubjectPage'





import LoginPage from '../pages/login/LoginPage'
import RegisterAccountPage from '../pages/login/RegisterAccountPage'
import RegisterInfoPage from '../pages/login/RegisterInfoPage'


import MinePage from '../pages/mine/MinePage'
import MineInfoPage from '../pages/mine/MineInfoPage'
import ModifyUserInfoPage from '../pages/mine/ModifyUserInfoPage'
import PasswordManagerPage from '../pages/mine/PasswordManagerPage'


// import HomePage from '../pages/home/HomePage'
// import MinePage from '../pages/mine/MinePage'

// teacher
import Teacher_home from '../pages/teacher/home/HomePage.teacher'
import NewMessagePage from '../pages/teacher/home/NewMessagePage.teacher'
import Teacher_mine from '../pages/teacher/mine/MinePage.teacher'
import MineAnswerQuestionPage from '../pages/teacher/mine/MineAnswerQuestionPage'


// student
import Student_home from '../pages/student/home/HomePage.student'
import Student_mine from '../pages/student/mine/MinePage.student'
import MineCollectionPage from '../pages/student/mine/MineCollectionPage.student'
import MineQuestionsPage from '../pages/student/mine/MineQuestionsPage'



const reducerCreate = params => {
    const defaultReducer = new Reducer(params);
    return (state, action) => {
        // console.log('ACTION:',action,Actions.currentScene)
        // console.log('Actions:', Actions);
        return defaultReducer(state, action);
    };
};

const getSceneStyle = () => ({
    backgroundColor: "#fff",
    // shadowOpacity: 1,
    // shadowRadius: 3,
});

const onBackPress = () => {
    console.log(Actions.state);
    if (Actions.state.index !== 0) {
        return false
    }
    Actions.pop()
    return true
}

export default class RouterManager extends React.Component {

    render() {
        return (
            <Router createReducer={reducerCreate}
                    getSceneStyle={getSceneStyle}
                    backAndroidHandler={onBackPress}
            >
                <Modal hideNavBar transitionConfig={() => ({ screenInterpolator: CardStackStyleInterpolator.forFadeFromBottomAndroid })}>
                    <Scene initial={true} key="LaunchPage" component={LaunchPage} title='启动页'/>
                    <Scene key="GuidePage" component={GuidePage}  title='引导页'/>
                    { this.renderStudentTabsStack() }
                    { this.renderTeacherTabsStack() }
                    { this.renderLoginStack() }
                </Modal>
            </Router>
        );
    }

    // 學生端 tabs
    renderStudentTabsStack(){
        return (
                  <Stack headerMode='screen' 
                   key="Tabbar_S"  
                   backTitle=" "
                   backButtonTintColor={"#000"}
                   navigationBarStyle={{borderBottomColor:"#fff"}}
                   navBar={CustomNavBar}
             >
                   
                <Tabs
                    key="Tabbar"        // 唯一标识
                    wrap={true}         // 自动使用自己的导航栏包装每个场景
                    showLabel={false}   // 显示文字
                    tabBarStyle={styles.tabBarStyle} // tabBar的样式
                    swipeEnabled={false}// 是否可以滑动
                    headerMode='screen' // 页面切换方式
                    icon={TabIcon}      // 自定义Icon显示方式
                    lazy={true}         // 是否默认渲染tabbar
                    tabBarPosition={'bottom'}       // tabbar在顶部还是底部，iOS默认顶部，安卓默认顶部
                    activeBackgroundColor='white'   // 选中tabbar的背景色
                    inactiveBackgroundColor='white' // 未选中tabbar的背景色
                    activeTintColor='#0084FF'       // 选中tabbar图标的颜色
                    inactiveTintColor='#909090'        // 未选中tabbar图标的颜色
                    hideNavBar

                >
                    <Scene key="Student_home"
                           title={'主頁'}
                           image={Images.tab_icon_home_default}
                           selectedImage={Images.tab_icon_home_seleted}
                           navigationBarStyle={{borderBottomColor:"#fff"}}
                           component={Student_home}
                           hideNavBar
                    >
                        {/*<Scene component={HomePage} key="HomePage"/>*/}
                    </Scene>
                    <Scene key="MinePage"
                           title={"我的"} 
                           image={Images.tab_icon_mine_default}
                           selectedImage={Images.tab_icon_mine_seleted}
                           navigationBarStyle={{borderBottomColor:"#fff"}}
                           backTitle=" "
                           backButtonTintColor={"#000"}
                           component={MinePage}
                           hideNavBar
                     />       
                </Tabs>
            <Scene component={ImageBrowserView} key="ImageBrowserView" title='瀏覽'/>
            <Scene component={WebPage} key="WebPage" title=''/>
            <Scene component={VideoPlayPage} key="VideoPlayPage" title='播放1' hideNavBar/>

            


            <Scene component={MineInfoPage} key="MineInfoPage" title='编辑资料'/>
            <Scene component={ModifyUserInfoPage} key="ModifyUserInfoPage" title='编辑资料' hideNavBar/>
            <Scene component={PasswordManagerPage} key="PasswordManagerPage" title='修改密碼'/>
            <Scene component={SearchQuestionPage} key="SearchQuestionPage" title='查找題目'/>
            <Scene component={MineCollectionPage} key="MineCollectionPage" title='我的收藏'/>
            <Scene component={MineQuestionsPage} key="MineQuestionsPage" title='我的提問'/>
            <Scene component={ChooseQuestionTypePage} key="ChooseQuestionTypePage" title='選擇類別'/>
            <Scene component={ChooseTeacherListPage} key="ChooseTeacherListPage" title='選擇老師' hideNavBar/>
            <Scene component={EditorQuestionPage} key="EditorQuestionPage" title='編輯問題' hideNavBar/>
            <Scene component={QuestionDetailsPage} key="QuestionDetailsPage" title='問答詳情' hideNavBar/>
            <Scene component={CameraRecordPage} key="CameraRecordPage" title=''/>
            

            </Stack>

        )
    }


    // 老師端 tabs
    renderTeacherTabsStack(){
        return (
                  <Stack headerMode='screen' 
                   key="Tabbar_T"  
                   backTitle=" "
                   backButtonTintColor={"#000"}
                   navigationBarStyle={{borderBottomColor:"#fff"}}
                   navBar={CustomNavBar}
                   >
                <Tabs
                    key="Tabbar"        // 唯一标识
                    wrap={true}         // 自动使用自己的导航栏包装每个场景
                    showLabel={false}   // 显示文字
                    tabBarStyle={styles.tabBarStyle} // tabBar的样式
                    swipeEnabled={false}// 是否可以滑动
                    headerMode='screen' // 页面切换方式
                    icon={TabIcon}      // 自定义Icon显示方式
                    lazy={true}         // 是否默认渲染tabbar
                    tabBarPosition={'bottom'}       // tabbar在顶部还是底部，iOS默认顶部，安卓默认顶部
                    activeBackgroundColor='white'   // 选中tabbar的背景色
                    inactiveBackgroundColor='white' // 未选中tabbar的背景色
                    activeTintColor='#0084FF'       // 选中tabbar图标的颜色
                    inactiveTintColor='#909090'        // 未选中tabbar图标的颜色
                    hideNavBar
                >
                    <Scene key="Teacher_home"
                           title={'主頁'}
                           image={Images.tab_icon_home_default}
                           selectedImage={Images.tab_icon_home_seleted}
                           navigationBarStyle={{borderBottomColor:"#fff"}}
                           component={Teacher_home}
                           hideNavBar
                    >
                    </Scene>
                    <Scene key="MinePage"
                           title={"我的"} 
                           image={Images.tab_icon_mine_default}
                           selectedImage={Images.tab_icon_mine_seleted}
                           navigationBarStyle={{borderBottomColor:"#fff"}}
                           backTitle=" "
                           backButtonTintColor={"#000"}
                           component={MinePage}
                           hideNavBar
                     />       
                </Tabs>
                <Scene component={ImageBrowserView} key="ImageBrowserView" title='瀏覽'/>
                <Scene component={WebPage} key="WebPage" title=''/>
                <Scene component={VideoPlayPage} key="VideoPlayPage" title='播放1' hideNavBar/>


                <Scene component={MineInfoPage} key="MineInfoPage" title='编辑资料'/>
                <Scene component={ModifyUserInfoPage} key="ModifyUserInfoPage" title='编辑资料' hideNavBar/>
                <Scene component={PasswordManagerPage} key="PasswordManagerPage" title='修改密碼'/>
                <Scene component={NewMessagePage} key="NewMessagePage" title='新消息'/>
                <Scene component={MineAnswerQuestionPage} key="MineAnswerQuestionPage" title='我的回答'/>
                <Scene component={ChooseTeacherListPage} key="ChooseTeacherListPage" title='選擇老師' hideNavBar/>
                <Scene component={ChooseQuestionTypePage} key="ChooseQuestionTypePage" title='選擇類別'/>
                <Scene component={EditorQuestionPage} key="EditorQuestionPage" title='編輯問題' hideNavBar/>
                <Scene component={QuestionDetailsPage} key="QuestionDetailsPage" title='問答詳情' hideNavBar/>
                <Scene component={CameraRecordPage} key="CameraRecordPage" title='' modal={true}/>
                <Scene component={SearchQuestionPage} key="SearchQuestionPage" title='查找題目'/>
                <Scene component={ChooseSubjectPage} key="ChooseSubjectPage" title='选择科目'hideNavBar/>

                
                
            </Stack>

        )
    }



    renderLoginStack(){
        return (
            <Stack navBar={CustomNavBar} gesturesEnabled={false}  key="LoginPage" backButtonTintColor={"#000"} navigationBarStyle={{borderBottomColor:"#fff"}}>
                <Scene
                    title='登錄'
                    key="LoginPage"
                    component={LoginPage}
                    gesturesEnabled={false}
                    onExit={() => console.log('onExit')}
                    onLeft={Actions.pop}
                    hideNavBar={true}
                />
                 <Scene
                    title='註冊'
                    key="RegisterAccountPage"
                    component={RegisterAccountPage}
                    gesturesEnabled={false}
                    onExit={() => console.log('onExit')}
                    onLeft={Actions.pop}
                    hideNavBar={false}
                />

                <Scene
                    title='填寫個人信息'
                    key="RegisterInfoPage"
                    component={RegisterInfoPage}
                    gesturesEnabled={false}
                    onExit={() => console.log('onExit')}
                    onLeft={Actions.pop}
                    hideNavBar={false}
                />

                <Scene component={ChooseSubjectPage} key="ChooseSubjectPage" title='选择科目'hideNavBar/>   
                      
            </Stack>
        )
    }

}

 



const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: '#fff',
        height:49,
    },
});