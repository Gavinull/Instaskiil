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
import { MineCollectionPageStore } from '../../../stores/student/UserStore.student';

const { width, height } = Dimensions.get('window');
 
@observer
export default class MineCollectionPage extends React.Component{

        constructor(props){
            super(props);
            this.pageStore = new MineCollectionPageStore();
        }

        componentDidMount(){
            this.pageStore.loadData(true);
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
            this.pageStore.loadData(true);
        }
       

        gotoPage(itemName){


        }
            

        render(){
            return (
                    <View style={styles.container}>
                        {this.renderListView()}
                    </View>
                )
        }

                   
        //ListView
        renderListView(){

            let { dataSource } = this.pageStore;
            console.log(dataSource);
          
            let config={};
            //listView row
            config.renderRow = (rowData,sectionID,rowID) => (
                <View style={{backgroundColor:'#fff'}}>
                <View style={{flex:1,backgroundColor:'#fff',margin:15,marginBottom:10,marginTop:rowID == 0 ? 15:5,borderWidth:1, borderColor:"#f0f0f0", borderRadius:10}}>
                <TouchableOpacity activeOpacity={0.5} onPress={()=>{Actions.QuestionDetailsPage({id:rowData.id});}}>
                    <View style={{height:40,marginLeft:12,borderRadius:8,flexDirection:'row',alignItems:'center',backgroundColor:'#fff'}}>
                        <View style={{height:22, alignItems:'center',justifyContent:'center',backgroundColor:rowData.grade_color, borderColor:rowData.grade_color, borderRadius:11,borderWidth:1,overflow:'hidden',}} >
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#fff'}}>{rowData.grade_name}</Text>
                        </View>
                         <View style={{height:22,marginLeft:12,alignItems:'center',justifyContent:'center',borderColor:rowData.subject_color, borderRadius:11,borderWidth:1,overflow:'hidden',}}>
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:rowData.subject_color}}>{rowData.subject_name}</Text>
                        </View>
                          <Text style={{position:'absolute',right:12,fontSize:10,color:'#4A4A4A'}}>{rowData.teacher_in_charge_name}</Text>
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
                (dataSource._cachedRowCount == 0 && this.pageStore.isRefreshing == false) ? ( 
                <View style={{flex:1,marginTop: 150, alignItems:'center', justifyContent:'center' ,backgroundColor:'#fff'}}>
                    <Image style={{width:60, height:60,borderRadius:30,resizeMode:'contain'}} source={require('./../../../resources/img/home_icon_noorder.png')}/>
                    <Text style={{fontSize:14, color:'#999999', padding:8, paddingTop:4, paddingBottom:4, marginTop:20}}>暫無數據</Text>
                </View>):null
            );

            config.refreshControl =  (                   
                <RefreshControl
                    refreshing={this.pageStore.isRefreshing}
                    onRefresh={this._onRefresh}
                    tintColor="#333"
                    titleColor="#333"
                    colors={['#333', '#333', '#333']}
                    progressBackgroundColor="white"/>
            );



            return (
                    <View style={{flex:1}}>
                        {
                            1 ? (
                                <ListView  
                                    style={{flex:1, backgroundColor:'#fff'}}    
                                    enableEmptySections={true}
                                    dataSource={dataSource}
                                    {...config}
                            />
                            ):
                            (this.renderEmptyDataView())
                        }
                        
                    </View>
                );
        }

        // renderEmptyDataView(){
        //     return (
        //         <View style={{flex:1,height:height-300, alignItems:'center', justifyContent:'center' ,backgroundColor:'#fff'}}>
        //             <Image style={{borderRadius:8, width:100, height:100,borderRadius:50,resizeMode:'contain'}} source={require('./../../../resources/img/home_icon_noorder.png')}/>
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
