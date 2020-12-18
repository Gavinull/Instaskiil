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
    RefreshControl
} from 'react-native';
import { observer } from 'mobx-react/native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';

import  * as GlobalConst from '../../../configs/GlobalConst';
import AppStore   from '../../../stores/AppStore';
import { NewMessagePageStore } from '../../../stores/teacher/HomeStore.teacher';

const { width, height } = Dimensions.get('window');
 
@observer
export default class NewMessagePage extends React.Component{

        constructor(props){
            super(props);
            this.pageStore = new NewMessagePageStore();
        }

        componentDidMount(){
            this.pageStore.loadData(true);
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
          
            let config={};
            //listView row
            config.renderRow = (rowData,sectionID,rowID) => (
                <View style={{backgroundColor:'#fff'}}>
                <View style={{flex:1,borderRadius:8,backgroundColor:'#fff',margin:15,marginBottom:5,marginTop:rowID == 0 ? 24:5,shadowColor: '#AFAEAE',elevation: 20,shadowOffset: {width: 0, height: 0},shadowOpacity: 1,shadowRadius: 3}}>
                <TouchableOpacity activeOpacity={0.5} >
                    <View style={{height:40,marginLeft:12,borderRadius:8,flexDirection:'row',alignItems:'center',backgroundColor:'#fff'}}>
                        <TouchableOpacity style={{height:22, alignItems:'center',justifyContent:'center',backgroundColor:"#FF5477",borderColor:'#FF5477',borderRadius:11,borderWidth:1,overflow:'hidden',}} >
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#fff'}}>{rowData.grade}</Text>
                        </TouchableOpacity>
                         <TouchableOpacity style={{height:22,marginLeft:12,alignItems:'center',justifyContent:'center',borderColor:'#FF5477',borderRadius:11,borderWidth:1,overflow:'hidden',}}>
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#FF5477'}}>{rowData.subjects}</Text>
                        </TouchableOpacity>
                          <Text style={{position:'absolute',right:12,fontSize:10,color:'#4A4A4A'}}>{rowData.addtime}</Text>
                    </View>
                    <Text style={{fontSize:12,marginLeft:12,marginBottom:12,marginRight:12,color:"rgba(70,70,70,0.5)"}}>{rowData.problem}</Text>
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
                <View style={{height:0, backgroundColor:'#fff'}}/>
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
                    <ListView  
                                style={{flex:1,backgroundColor:'#fff'}}    
                                enableEmptySections={true}
                                dataSource={dataSource} 
                                {...config}
                    />
                );
        }

        renderBottomButton(){
            return (
                <View style={{position:'absolute',bottom:50,right:10,justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity style={{height:60,width:60,borderRadius:30,backgroundColor:"#0084FF",justifyContent:'center',alignItems:'center'}} 
                                    >
                            <Text style={{fontSize:40,backgroundColor:"#0084FF",color:'#fff'}}>Q</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize:14,color:'#0084FF',marginTop:5}}>舉手提問</Text>
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
