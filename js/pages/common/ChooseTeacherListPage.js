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
import { ChooseTeacherListPageStore } from '../../stores/CommonStore';

import CustomNavBar   from '../../components/CustomNavBar';
import { Actions } from 'react-native-router-flux';


const { width, height } = Dimensions.get('window');
 
@observer
export default class ChooseTeacherListPage extends React.Component{

        constructor(props){
            super(props);
            
            this.pageStore = new ChooseTeacherListPageStore();
            this.pageStore.chooseType = this.props.chooseType?this.props.chooseType:1, // 默認1:單選 2:多選
            this.pageStore.question_id = this.props.question_id;
            this.pageStore.subject_id = this.props.subject_id;
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

            let teachers = this.pageStore.list.filter((item)=>item.is_choose);
            console.log(teachers);
            if(teachers.length==0){
                global.ToastUtil.showToast("請選擇老師");
                return;
            }

            if(chooseType == 2){
                this.lastPageStore.chooseTeacherBlock(teachers);
             }else{
                this.lastPageStore.chooseTeacherBlock(teachers.shift());
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
                <CustomNavBar title={"選擇老師"}
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
                    <View style={{height:130, flexDirection:'column',backgroundColor:'#fff'}}>

                         <View style={{flexDirection:"row",alignItems: 'center',height:60}}>
                            <ImageBackground style={{height:50,width:50,borderWidth:0,borderColor:"#cccccc",borderRadius:25, overflow:"hidden"}} source={require('../../resources/img/mine_icon_avatar.png')}>
                             <Image style={{height:50,width:50,borderRadius:25}} source={{uri:rowData.avatar?rowData.avatar:'https://'}}></Image>
                            </ImageBackground>
                            <View style={{flexDirection:"column"}}>
                                <Text style={{marginLeft:12,fontSize:14,color:'#4A4A4A'}}>{rowData.name}</Text>
                                <Text style={{marginTop:5,marginLeft:12,fontSize:14,color:'#4A4A4A'}}>{`評分: ${rowData.rating}分`}</Text>
                            </View>
                         </View>
                         <Text numberOfLines={5} style={{fontSize:14,marginBottom:0,marginRight:0,color:rowData.description ? "#4A4A4A":"#9A9A9A"}}>{rowData.description?rowData.description:"無簡介..."}</Text>
                    </View>
                    <View style={{flex:1,top:0,bottom:0,left:0,right:0, position:"absolute", borderWidth:rowData.is_choose ? 1:0, borderColor:"#0084FF", borderRadius:10}}/>
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
                    <Text style={{fontSize:14, color:'#999999', padding:8, paddingTop:4, paddingBottom:4, marginTop:20}}>暫無擅長當前科目的老師</Text>
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
