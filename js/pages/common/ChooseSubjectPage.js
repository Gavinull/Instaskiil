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

import  * as GlobalConst from '../../configs/GlobalConst';
import AppStore   from '../../stores/AppStore';
import { ChooseSubjectPageStore } from '../../stores/CommonStore';

import CustomNavBar   from '../../components/CustomNavBar';
import { Actions } from 'react-native-router-flux';


const { width, height } = Dimensions.get('window');
 
@observer
export default class ChooseSubjectPage extends React.Component{

        constructor(props){
            super(props);
            this.pageStore = new ChooseSubjectPageStore();
            this.pageStore.chooseType = this.props.chooseType?this.props.chooseType:2, // 1:單選 默認2:多選
            this.pageStore.defaultSubjects = this.props.defaultSubjects ? this.props.defaultSubjects:[];
            this.lastPageStore = this.props.lastPageStore;
        }

        componentDidMount(){
            this.pageStore.loadData(true);
        }

        //刷新列表
        _onRefresh = () =>{
            this.pageStore.loadData(true);
        }
       
        confirmAction(){
            let { chooseType } = this.pageStore;

            let subjects = this.pageStore.list.filter((item)=>item.is_choose);
            console.log(subjects);
            if(subjects.length==0){
                global.ToastUtil.showToast("請選擇科目");
                return;
            }

            if(chooseType == 2){
                this.lastPageStore.chooseSubjectBlock(subjects);
             }else{
                this.lastPageStore.chooseSubjectBlock(subjects.shift());
            }
            Actions.pop();
        }
            
        render(){
            return (
                    <View style={styles.container}>
                        {this.renderNavigatorBar()}
                        {this.renderListView()}
                    </View>
                );
        }

        renderNavigatorBar(){
            let _this = this;
            return (
                <CustomNavBar title={"选择科目"}
                renderRightView={() => {
                        return (
                            <TouchableOpacity style={{width:60, height:44, position:"absolute", right:10, bottom:0,height:44, justifyContent:'center', alignItems:"flex-end"}}
                                onPress={() => {
                                    _this.confirmAction();
                                }}>
                                <Text style={{fontSize:15, color:"#0084FF"}}>確定</Text>
                            </TouchableOpacity>
                        );
                    }}
                    />
                );
        }

                   
        //ListView
        renderListView(){

            let { dataSource, list, chooseType} = this.pageStore;
          
            let config={};
            //listView row
            config.renderRow = (rowData, sectionID, rowID) => (
                <TouchableOpacity activeOpacity={1} style={{flex:1,flexDirection:'row',margin:10,padding:10,marginBottom:5,marginTop:5,overflow:'hidden'}} onPress={()=>{

                        if(chooseType == 2){
                            //多選
                            list[rowID].is_choose = !list[rowID].is_choose;
                            this.pageStore.list = list.slice();
                            console.log(list.slice());
                         }else{
                             //單選
                            let l = list.map((item)=>{ item.is_choose = false;return item;});
                            l[rowID].is_choose = true;
                            this.pageStore.list = l;
                        }
                      
                    }}>
                    <View style={{height:40,flex:1, flexDirection:'row',backgroundColor:'#fff', alignItems:"center", justifyContent: 'space-between'}}>
                            <Text style={{marginLeft:12,fontSize:15,color:'#333333'}}>{rowData.name}</Text>
                            <Image style={{width: 20, height: 20, resizeMode: 'contain'}}
                                           source={rowData.is_choose ? require('./../../resources/img/icon_choice_success.png') :null}/>
                    </View>
                    {/* <View style={{flex:1,top:0,bottom:0,left:0,right:0, position:"absolute", borderWidth:rowData.is_choose ? 1:0, borderColor:"#0084FF", borderRadius:10}}/> */}
                </TouchableOpacity>
            );
            config.renderSeparator = () => (
                <View style={{height:1, backgroundColor:'#f0f0f0'}}/>
            );
            config.renderHeader = () => (
                <View style={{height:0, backgroundColor:'#fff'}}/>
            );
            config.renderFooter = () => (
                (dataSource._cachedRowCount == 0 && this.pageStore.isRefreshing == false) ? ( 
                <View style={{flex:1,marginTop: 150, alignItems:'center', justifyContent:'center' ,backgroundColor:'#fff'}}>
                    <Image style={{width:60, height:60,borderRadius:30,resizeMode:'contain'}} source={require('../../resources/img/home_icon_noorder.png')}/>
                    <Text style={{fontSize:14, color:'#999999', padding:8, paddingTop:4, paddingBottom:4, marginTop:20}}>暫無可選科目</Text>
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
                    <ListView  
                            style={{flex:1,backgroundColor:'#fff'}}    
                            enableEmptySections={true}
                            dataSource={dataSource} 
                            {...config}
                    />
                );
        }

    
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
