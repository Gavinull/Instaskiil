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
    ImageBackground,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';
import { observer } from 'mobx-react/native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';

import  * as GlobalConst from '../../../configs/GlobalConst';
import AppStore   from '../../../stores/AppStore';
import { HomePageStore } from '../../../stores/teacher/HomeStore.teacher';
import Banner   from '../../../components/Banner';
import CustomNavBar   from '../../../components/CustomNavBar';

const { width, height } = Dimensions.get('window');
 
@observer
export default class HomePage extends React.Component{

        constructor(props){
            super(props);
            this.state = { currentIndex:1 };
            this.pageStore = new HomePageStore();
        }

        componentDidMount(){
            this._onRefresh();
            //默认要加载邀请的问题列表
            this.pageStore.changeListDataSource(2, true);

       
          //监听是否刷新当前列表
          this.uploadList_Listener = DeviceEventEmitter.addListener(global.KeyConst.KNotification_uploadList, (message)=>{    
            if(message == true){
                this._onRefresh();
            }
          });

        }
        componentWillUnmount(){
            //清除监听
            this.uploadList_Listener.remove();
        }

        //刷新列表
        _onRefresh = () =>{
            this.pageStore.changeListDataSource(this.state.currentIndex, true);
        }


        /*页面回调函数*/
        pageCallbackAction = (actionType, data) =>{
            //刷新列表数据
            if(actionType == 1){
                this.pageStore.changeListDataSource(data);
            }
        }

            
        gotoPage(itemName){

            
        }

        render(){
            return (
                <View style={styles.container}>
                        {this.renderNavigatorBar()}
                        <Banner />
                        { this.renderContentView() }
                </View>
                );
        }

        renderNavigatorBar(){
            let _this = this;
            return (
                <CustomNavBar title={"題目"}
                hideBack
                renderRightView={() => {
                    return (
                             <TouchableOpacity activeOpacity={0.5} style={{width:60, height:44, position:"absolute", right:10, bottom:0,height:44, justifyContent:'center', alignItems:"flex-end"}}
                                 onPress={() => {
                                     Actions.SearchQuestionPage();

                                 }}>
                                 <Text style={{fontSize:15, color:"#0084FF"}}>查找</Text>
                             </TouchableOpacity>
                         );
                    }}
                    />
                );
        }

       
                   
        renderContentView(){
            

            let { allListDataSource, invitationListDataSource, underwayListDataSource, is_all_Refreshing, is_invitation_Refreshing, is_underway_Refreshing} =  this.pageStore;
            let list = [
                {name:'全部', data:allListDataSource, refresh:is_all_Refreshing},
                {name:'邀請', data:invitationListDataSource, refresh:is_invitation_Refreshing},
                {name:'進行中', data:underwayListDataSource, refresh:is_underway_Refreshing},
            ];
            return (
                <ScrollableTabView
                        style={{flex:1,shadowColor:'#0088FF',}}
                        tabBarTextStyle={{fontSize:14,}}
                        tabBarActiveTextColor={'#0084FF'}
                        tabBarInactiveTextColor={'#4A4A4A'}
                        tabBarUnderlineStyle={{width:width/list.length, marginLeft:0,backgroundColor:'#0084FF',height:2}}
                        renderTabBar={(tabBarProps) =>{
                            return (<DefaultTabBar tabStyle={{paddingBottom:0}} style={{backgroundColor:'white',borderWidth: 1,borderColor:'#D8D8D8',}} 
                                    />);
                        }}
                        onChangeTab={(obj) => {
                            this.state.currentIndex = obj.i+1;
                            this.pageStore.changeListDataSource(obj.i+1, false);
                            } }
                            > 
                        {
                            list.map((controller, i)=>{
                                return (
                                        <View key={i} tabLabel={i==1 ? `邀请(${this.pageStore.invitationList.length})`:controller.name} style={{flex:1, backgroundColor:'rgb(245,245,245)'}}>
                                        { this.renderListView(controller.data, i, controller.refresh) }
                                        </View>
                                );      
                            })
                        }
                </ScrollableTabView>
            );
        }
                   

        //ListView
        renderListView(dataSource, i, refresh){

            
            let gotoOrderDetailsPage = (type,orderData) => {
                   
            }; 

      
            let config={};
            //listView row
            config.renderRow = (rowData,sectionID,rowID) => (
                <View style={{backgroundColor:'#fff'}}>
                <View style={{flex:1,backgroundColor:'#fff',margin:15,marginBottom:10,marginTop:rowID == 0 ? 15:5,borderWidth:1, borderColor:"#f0f0f0", borderRadius:10}}>
                <TouchableOpacity activeOpacity={0.5} onPress={()=>{
                        Actions.QuestionDetailsPage({id:rowData.id})
                    }}>
                    <View style={{height:40,marginLeft:12,borderRadius:8,flexDirection:'row',alignItems:'center',backgroundColor:'#fff'}}>
                        <View style={{height:22, alignItems:'center',justifyContent:'center',backgroundColor:rowData.grade_color, borderColor:rowData.grade_color, borderRadius:11,borderWidth:1,overflow:'hidden',}} >
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#fff'}}>{rowData.grade_name}</Text>
                        </View>
                         <View style={{height:22,marginLeft:12,alignItems:'center',justifyContent:'center',borderColor:rowData.subject_color, borderRadius:11,borderWidth:1,overflow:'hidden',}}>
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:rowData.subject_color}}>{rowData.subject_name}</Text>
                        </View>
                          <Text style={{position:'absolute',right:12,fontSize:10,color:'#4A4A4A'}}>{`${ global.DateUtil.formatTimestamp( parseInt(rowData.created_at),  "yyyy年MM月dd日hh:mm") }`}</Text>
                    </View>
                    {
                        rowData.title ? (
                            <Text style={{fontSize:14,fontWeight:"bold",marginLeft:12,marginBottom:8,marginRight:12,color:"#4A4A4A"}}>{rowData.title}</Text>)
                         :null
                    }
                    <Text style={{fontSize:12,marginLeft:12,marginBottom:12,marginRight:12,color:"rgba(70,70,70,0.5)"}}>{rowData.content}</Text>
                </TouchableOpacity>
                </View>
                </View>
            );
            config.renderSeparator = () => (
                <View style={{height:0, backgroundColor:'#fff'}}/>
            );
            config.renderHeader = () => (
                <View style={{height:0, backgroundColor:'#fff'}}/>
            );
            config.renderFooter = () => (
                (dataSource._cachedRowCount == 0 && refresh == false) ? ( 
                <View style={{flex:1,marginTop: 150, alignItems:'center', justifyContent:'center' ,backgroundColor:'#fff'}}>
                    <Image style={{width:60, height:60,borderRadius:30,resizeMode:'contain'}} source={require('./../../../resources/img/home_icon_noorder.png')}/>
                    <Text style={{fontSize:14, color:'#999999', padding:8, paddingTop:4, paddingBottom:4, marginTop:20}}>暫無數據</Text>
                </View>):null
            );

            config.refreshControl =  (
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={this._onRefresh}
                    tintColor="#333"
                    title= {''}
                    titleColor="#333"
                    colors={['#333', '#333', '#333']}
                    progressBackgroundColor="white"/>
            );


            return (
                    <ListView  
                        style={{flex:1,backgroundColor:'#fff'}}    
                        enableEmptySections={true}
                        removeClippedSubviews={false}
                        dataSource={dataSource} 
                        {...config}
                    />
                );
        }


        renderEmptyDataView(){
            return (
                <View style={{flex:1, alignItems:'center', justifyContent:'center' ,backgroundColor:'#F7F9FA'}}>
                    <Image style={{borderRadius:8, width:100, height:100,borderRadius:50,resizeMode:'contain'}} source={require('./../../../images/home_icon_noorder.png')}/>
                    <Text style={{fontSize:14, color:'#999999', padding:8, paddingTop:4, paddingBottom:4, marginTop:20}}>暂无订单,耐心等待,</Text>
                    <Text style={{fontSize:14, color:'#999999', padding:8, paddingTop:4, paddingBottom:4,}}>大波订单正在向你飞来!</Text>
                    <TouchableOpacity style={{width:200,height:40,alignItems:'center', justifyContent:'center', backgroundColor:'#F7B425', borderRadius:20, overflow:'hidden', marginTop:70}} onPress={() => {this.gotoPage('登录'); }}>
                        <Text style={{fontSize:16, color:'#fff', }}>点击刷新</Text>
                    </TouchableOpacity>
                </View>
              );
        }
   
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
