import React from 'react';
import {
    StyleSheet,
    View,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    Text,
    Image,
    Dimensions,
    Navigator,
    Platform,
    ScrollView
} from 'react-native';
import ActionSheet from 'react-native-actionsheet'
import { observer }       from 'mobx-react/native';

import LoginPage          from '../../login/LoginPage';
import AppStore           from '../../../stores/AppStore';
import {LoginPageStore}   from '../../../stores/LoginStore';
import * as GlobalConst   from '../../../configs/GlobalConst';

import StorageManager from '../../../configs/StorageManager';

import RandomUtil from'../../../utils/RandomUtil'

const { width, height} = Dimensions.get('window');

@observer
export default class MinePage extends React.Component{
     
        constructor(props) {
             super(props);

             let items = [];
             if(AppStore.roleType == AppStore.Enum_RoleType.teacher){
                items = [
                            { name:"我的提問", image:""},
                            { name:"我的收藏", image:""},
                        ];
             }else{
                items = [
                        { name:"我的回答", image:""},
                        ];
             }

             this.state = {
                items:items
             };
        }

        componentDidMount() {
            AppStore.getUserInfo()
          
            this._resetNavigatorBar()
        }

        _resetNavigatorBar(){
            let _this = this
            setTimeout(function() {
                Actions.refresh({
                    back:true,
                    backButtonImage:"./../../../resources/img/icon_back.png",
                    rightTitle: '. . . ',
                    rightButtonTextStyle:{color:"#141414"},
                    onRight: () => {
                        _this.ActionSheet.show()
                    }
                });
            }, 1);

        }


        gotoPage(itemName){

            if (itemName == "编辑资料"){
                Actions.MineInfoPage()
            }

            if (itemName == '退出登錄'){
                Actions.reset("LoginPage")
                StorageManager.cleanStorage();
            }

            if (itemName == '修改密碼'){
                Actions.PasswordManagerPage()
            }

            if (itemName == '我的收藏'){
                Actions.MineCollectionPage()
            }

            if (itemName == '我的提問'){
                Actions.MineQuestionsPage()
            }

            if (itemName == '我的回答'){
                Actions.MineAnswerQuestionPage()
            }

        }

        render() {
            return (
                <View style={styles.container}>
                { this.renderMianView() }
                { this.renderSettingActionSheet() }
               </View>
            );
        }

        renderSettingActionSheet(){
            return (
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'當前補習社版本為 v1.0'}
                    options={['修改密碼', '退出登錄','取消']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => {
                        if(index == 1){
                            this.gotoPage("退出登錄")
                        }
                        if(index == 0){
                             this.gotoPage("修改密碼")
                        }
                    }}
                />
            )
        }

       
        renderMianView(){

            let isStudent = AppStore.roleType == AppStore.Enum_RoleType.students;
            let countLeftTitle = isStudent ? "提問次數":"回答次數";
            let countLeftValue = isStudent ? AppStore.userQuestionCount:AppStore.userReplyCount;

            let countRightTitle = isStudent ? "老師回答":"評分";
            let countRightValue = isStudent ? AppStore.userSolvedCount:AppStore.setUserRatingCount;

            return (
                <ScrollView style={{flex:1,backgroundColor:"#fff"}}>
                    <View style={{height:330}}>
                    <View style={{flex:1,borderRadius:8,backgroundColor:'#fff',margin:20,shadowColor: '#AFAEAE',elevation: 20,shadowOffset: {width: 0, height: 0},shadowOpacity: 1,shadowRadius: 5}}>
                            <TouchableOpacity style={{height:110,flexDirection:'row',alignItems:'center'}} onPress={() => { this.gotoPage('用户信息'); }}>
                                <Image source={ !AppStore.userHeader  ? require('./../../../images/storefront01.png') : {uri: AppStore.userHeader}} style={{width:93, height:93, borderRadius:10, marginLeft:14}}/>
                                <View style={{flex:1,height:85,flexDirection: 'column',justifyContent: 'space-between',marginLeft:15}}>
                                    <Text style={{fontSize:17, color:'#333333', backgroundColor:'transparent'}}>
                                        {AppStore.userToken ? (AppStore.userName ? AppStore.userName:'昵称'):'登录/注册'}
                                    </Text>
                                    <View style={{flex:1, flexDirection:"row"}}>
                                      <View style={{flex:isStudent ? 1:0,justifyContent:"center"}}>
                                        <Text numberOfLines={1} style={{marginBottom:10,fontSize:14, fontWeight:'bold',color:'rgba(74,74,74,0.5)',textAlign:'left'}}>
                                                {AppStore.userSchool}
                                        </Text>
                                        <Text numberOfLines={1} style={{fontSize:14, fontWeight:'bold',color:'rgba(74,74,74,0.5)',textAlign:'left'}}>
                                            {AppStore.userGrade}
                                        </Text>
                                        </View>
                                        <View style={{justifyContent:"flex-end"}}>
                                            <TouchableOpacity style={{height:22,width:70,marginRight:14,alignItems:'center',justifyContent:'center',borderColor:'#0084FF',borderRadius:11,borderWidth:1,overflow:'hidden'}} onPress={() => { this.gotoPage('编辑资料');}}>
                                                <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#0084FF'}}>编辑资料</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{marginBottom:0,height:70, marginLeft:14,marginRight:14,flexDirection:"row",alignItems:'center'}}>
                            <Text numberOfLines={3} style={{fontSize:14, fontWeight:'bold',color:'rgba(74,74,74,0.5)',textAlign:'left'}}>
                                {AppStore.userSignature}
                            </Text>
                            </View>
                            <View style={{height:110,flexDirection:"row",alignItems:'center'}}>
                                     <View style={{position:'absolute',top:0,height:1,left:14,right:14,backgroundColor:'rgb(245,245,245)'}}/>
                                  <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                      <Text style={{marginBottom:15,color:'#4A4A4A',fontSize:14}}>{countLeftTitle}</Text>
                                       <Text style={{color:'#4A4A4A',fontWeight:'bold',fontSize:26}}>{countLeftValue}</Text>
                                  </View>
                                      <View style={{height:90,width:1,backgroundColor:'rgb(245,245,245)'}}/>
                                   <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                      <Text style={{marginBottom:15,color:'#4A4A4A',fontSize:14}}>{countRightTitle}</Text>
                                       <Text style={{color:'#4A4A4A',fontWeight:'bold',fontSize:26}}>{countRightValue}</Text>
                                  </View>
                            </View>

                        </View>
                    </View>
                    <View style={{height:5,backgroundColor:'rgb(240,240,240)'}}/>


                    {
                        this.state.items.map((rowData,i)=>{
                            return (
                                 <TouchableOpacity key={i} style={{flexDirection:'column', alignItems:'center'}} activeOpacity={0.4} onPress={() => {this.gotoPage(rowData.name);}}>
                                    <View style={{flex:1, height:52, backgroundColor:'white', flexDirection:'row', alignItems:'center'}}>
                                        <Image source={rowData.image} style={{width:0, height:0, resizeMode:'contain', marginLeft:0}} />
                                        <Text style={{flex:1, marginLeft:20, color:'rgb(28,28,28)'}}>{rowData.name}</Text>
                        
                                            <Image source={require('./../../../images/icon_arrow.png')} style={{width:14, height:14, resizeMode:'contain', marginRight:20, backgroundColor:'white', alignSelf: 'center', }} />
                                        
                                    </View>
                                    <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:0,right:0}}/>
                                </TouchableOpacity>
                            );

                        })
                    }
                 <View style={{height:5,backgroundColor:'rgb(240,240,240)'}}/>
                 <View style={{flex:1,height:300,alignItems:'center',justifyContent:'center'}}>
                     <Text style={{fontSize:14,color:"#141414",marginBottom:30}}>App如果遇到问题请联系</Text>
                     <Text style={{fontSize:14,color:"#141414",marginBottom:30}}>+28-2803-2138-32</Text>
                 </View>
                </ScrollView>
            );
        }


}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
  },
});