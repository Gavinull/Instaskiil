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
import { MineQuestionsPageStore } from '../../../stores/student/UserStore.student';
import { Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get('window');
 
@observer
export default class MineQuestionsPage extends React.Component{

        constructor(props){
            super(props);
            this.state = { currentIndex:0 };
            this.pageStore = new MineQuestionsPageStore();
        }

        componentDidMount(){
            this._onRefresh();
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
                    { this.renderContentView() }
                </View>
                )
        }


                   
        renderContentView(){
            

            let { 
                waitAnswerListDataSource,
                 answeringListDataSource , 
                 waitEvaluateListDataSource,
                 evaluateListDataSource,

                 is_waitAnswer_Refreshing,
                 is_answering_Refreshing,
                 is_waitEvaluate_Refreshing,
                 is_evaluate_Refreshing
             } =  this.pageStore;

            let list = [
                {name:'待解答', data:waitAnswerListDataSource, refresh:is_waitAnswer_Refreshing},
                {name:'解答中', data:answeringListDataSource, refresh:is_answering_Refreshing},
                {name:'待評價', data:waitEvaluateListDataSource, refresh:is_waitEvaluate_Refreshing},
                {name:'已評價', data:evaluateListDataSource, refresh:is_evaluate_Refreshing},  
            ];
            return (
                <ScrollableTabView
                        style={{flex:1,shadowColor:'#0088FF',}}
                        tabBarTextStyle={{fontSize:14,}}
                        tabBarActiveTextColor={'#0084FF'}
                        tabBarInactiveTextColor={'#4A4A4A'}
                        tabBarUnderlineStyle={{width:width/4,marginLeft:0,backgroundColor:'#0084FF',height:2}}
                        renderTabBar={(tabBarProps) =>{
                            return (<DefaultTabBar tabStyle={{paddingBottom:0}} style={{backgroundColor:'white',borderWidth: 1,borderColor:'#D8D8D8',}} 
                                    />);
                        }}
                        onChangeTab={(obj) => {
                            this.state.currentIndex = obj.i;
                            this.pageStore.changeListDataSource(obj.i, false);} 
                        }> 
                        {
                            list.map((controller, i)=>{
                                return (
                                        <View key={i} tabLabel={controller.name} style={{flex:1,backgroundColor:'rgb(245,245,245)'}}>
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
                        Actions.QuestionDetailsPage({id:rowData.id});
                    }}>
                    <View style={{height:40,marginLeft:12,borderRadius:8,flexDirection:'row',alignItems:'center',backgroundColor:'#fff'}}>
                        <View style={{height:22, alignItems:'center',justifyContent:'center',backgroundColor:rowData.grade_color, borderColor:rowData.grade_color, borderRadius:11,borderWidth:1,overflow:'hidden',}} >
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#fff'}}>{rowData.grade_name}</Text>
                        </View>
                         <View style={{height:22,marginLeft:12,alignItems:'center',justifyContent:'center',borderColor:rowData.subject_color, borderRadius:11,borderWidth:1,overflow:'hidden',}}>
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:rowData.subject_color}}>{rowData.subject_name}</Text>
                        </View>
                          <Text style={{position:'absolute',right:12,fontSize:10,color:'#4A4A4A'}}>{i == 0 ? `${ global.DateUtil.formatTimestamp( parseInt(rowData.created_at),  "yyyy年MM月dd日hh:mm") }`:rowData.teacher_in_charge_name}</Text>
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
                    onRefresh={this._onRefresh}  //不要调用,会循环渲染!!! */}
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
