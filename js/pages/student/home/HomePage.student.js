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
import { HomePageStore } from '../../../stores/student/HomeStore.student';
import Banner   from '../../../components/Banner';
import CustomNavBar   from '../../../components/CustomNavBar';


const { width, height } = Dimensions.get('window');
 
@observer
export default class HomePage extends React.Component{

        constructor(props){
            super(props);
            this.state = { currentIndex:0 };
            this.pageStore = new HomePageStore();
        }

        componentDidMount(){

            this.pageStore.changeListDataSource(this.state.currentIndex, true);

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
            this.pageStore.page = 1;
            this.pageStore.changeListDataSource(this.state.currentIndex, true);
        }

        // _onEndReached = (e) =>{
        //     console.log(e);
        //     if(this.state.currentIndex ==  0){
        //         this.pageStore.page += 1;
        //         this.pageStore.changeListDataSource(0, true);
        //     }
        //     console.log(this.pageStore.page);

        // }

       

        gotoPage(itemName){


        }
            

        render(){
            return (
                <View style={styles.container}>
                    {this.renderNavigatorBar()}
                    <Banner />
                    {this.renderContentView()}
                    { this.renderBottomButton() } 
                </View>
            );
        }

        renderNavigatorBar(){
            let _this = this;
         return (
             <CustomNavBar title={"推薦問答"}
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
            

            let { 
                 recommendListDataSource,
                 waitAnswerListDataSource,
                 answeringListDataSource, 
                 waitEvaluateListDataSource,

                 is_recommend_Refreshing,
                 is_waitAnswer_Refreshing,
                 is_answering_Refreshing,
                 is_waitEvaluate_Refreshing,
                
             } =  this.pageStore;

            let list = [
                {name:'推薦', data:recommendListDataSource, refresh:is_recommend_Refreshing},
                {name:'待解答', data:waitAnswerListDataSource, refresh:is_waitAnswer_Refreshing},
                {name:'解答中', data:answeringListDataSource, refresh:is_answering_Refreshing},
                {name:'待評價', data:waitEvaluateListDataSource, refresh:is_waitEvaluate_Refreshing},
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
                    {
                         rowData.is_typical ? (
                           <View style={{height:22,marginLeft:0,marginRight:12, alignItems:'center',justifyContent:'center',borderColor:'#FF5477',borderRadius:11,borderWidth:1,overflow:'hidden',}}>
                                <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#FF5477'}}>經典</Text>
                            </View>
                        ):null
                      }
                       
                        <View style={{height:22, alignItems:'center',justifyContent:'center',backgroundColor:rowData.grade_color, borderColor:rowData.grade_color, borderRadius:11,borderWidth:1,overflow:'hidden',}} >
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#fff'}}>{rowData.grade_name}</Text>
                        </View>
                         <View style={{height:22,marginLeft:12,alignItems:'center',justifyContent:'center',borderColor:rowData.subject_color, borderRadius:11,borderWidth:1,overflow:'hidden',}}>
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:rowData.subject_color}}>{rowData.subject_name}</Text>
                        </View>
                          <Text style={{position:'absolute',right:12,fontSize:10,color:'#4A4A4A'}}>{(i == 0 || i==1) ? `${ global.DateUtil.formatTimestamp( parseInt(rowData.created_at),  "yyyy年MM月dd日hh:mm") }`:rowData.teacher_in_charge_name}</Text>
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

                   
        // //ListView
        // renderListView(){

        //     let { dataSource } = this.pageStore;
          
        //     let config={};
        //     //listView row
        //     config.renderRow = (rowData,sectionID,rowID) => (
        //         <View style={{backgroundColor:'#fff'}}>
        //         <View style={{flex:1,backgroundColor:'#fff',margin:15,marginBottom:10,marginTop:rowID == 0 ? 15:5,borderWidth:1, borderColor:"#f0f0f0", borderRadius:10}}>
        //         <TouchableOpacity activeOpacity={0.5} onPress={()=>{
        //                 Actions.QuestionDetailsPage({id:rowData.id})
        //             }}>
        //             <View style={{height:40,marginLeft:12,borderRadius:8,flexDirection:'row',alignItems:'center',backgroundColor:'#fff'}}>
        //                {
        //                  rowData.is_typical ? (
        //                     <View style={{height:22,marginLeft:0,marginRight:12, alignItems:'center',justifyContent:'center',borderColor:'#FF5477',borderRadius:11,borderWidth:1,overflow:'hidden',}}>
        //                          <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#FF5477'}}>經典</Text>
        //                     </View>
        //                  ):null
        //                }
                       
        //                 <View style={{height:22, alignItems:'center',justifyContent:'center',backgroundColor:"#FF5477",borderColor:'#FF5477',borderRadius:11,borderWidth:1,overflow:'hidden',}} >
        //                          <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#fff'}}>{rowData.grade_name}</Text>
        //                 </View>
        //                  <View style={{height:22,marginLeft:12,alignItems:'center',justifyContent:'center',borderColor:'#FF5477',borderRadius:11,borderWidth:1,overflow:'hidden',}}>
        //                          <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#FF5477'}}>{rowData.subject_name}</Text>
        //                 </View>
        //                   <Text style={{position:'absolute',right:12,fontSize:10,color:'#4A4A4A'}}>{rowData.teacher_in_charge_name}</Text>
        //             </View>
        //             {
        //                 rowData.title ? (
        //                     <Text style={{fontSize:14,fontWeight:"bold",marginLeft:12,marginBottom:8,marginRight:12,color:"#4A4A4A"}}>{rowData.title}</Text>)
        //                  :null
        //             }
        //             <Text style={{fontSize:12,marginLeft:12,marginBottom:12,marginRight:12,color:"rgba(70,70,70,0.5)"}}>{rowData.content}</Text>
        //         </TouchableOpacity>
        //         </View>
        //         </View>
        //     );
        //     config.renderSeparator = () => (
        //         <View style={{height:0, backgroundColor:'#fff'}}/>
        //     );
        //     config.renderHeader = () => (
        //         <View style={{height:0, backgroundColor:'#fff'}}/>
        //     );
        //     config.renderFooter = () => (
        //         <View style={{height:20, backgroundColor:'#fff'}}/>
        //     );

        //     config.refreshControl =  (                   
        //         <RefreshControl
        //             refreshing={this.pageStore.isRefreshing}
        //             onRefresh={this._onRefresh}
        //             tintColor="#333"
        //             titleColor="#333"
        //             colors={['#333', '#333', '#333']}
        //             progressBackgroundColor="white"/>
        //     );



        //     return (
        //             <ListView  
        //                 style={{flex:1,backgroundColor:'#fff'}}    
        //                 enableEmptySections={true}
        //                 dataSource={dataSource} 
        //                 removeClippedSubviews={false}
        //                 onEndReachedThreshold={20}
        //                 {...config}
        //             />
        //         );
        // }

        renderBottomButton(){
            return (
                <View style={{position:'absolute',bottom:50,right:10,justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity style={{height:56,width:56,borderRadius:28,backgroundColor:"#fff",justifyContent:'center',alignItems:'center'}} 
                    onPress={() => {
                        Actions.ChooseQuestionTypePage({chooseType:AppStore.Enum_ChoosePageType.createQuestion})
                    }}>
                    <Image style={{height:56, width:56}} source={require("./../../../resources/img/icon_ask_questions.png")}/>
                            {/* <Text style={{fontSize:40,backgroundColor:"#0084FF",color:'#fff'}}>Q</Text> */}
                    </TouchableOpacity>
                    <Text style={{fontSize:12,color:'#0084FF', marginTop:-5, backgroundColor:"#fff",borderRadius:2}}>舉手提問</Text>
                 </View>
            );          
        }

        // renderEmptyDataView(){
        //     return (
        //         <View style={{flex:1, alignItems:'center', justifyContent:'center' ,backgroundColor:'#fff'}}>
        //             <Image style={{width:60, height:60,borderRadius:30,resizeMode:'contain'}} source={require('./../../../resources/img/home_icon_noorder.png')}/>
        //             <Text style={{fontSize:14, color:'#999999', padding:8, paddingTop:4, paddingBottom:4, marginTop:20}}>暫無數據</Text>
        //         </View>
        //       );
        // }
   
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
