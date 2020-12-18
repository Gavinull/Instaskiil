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
    DeviceEventEmitter,
    TextInput
} from 'react-native';
import { observer } from 'mobx-react/native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';

import  * as GlobalConst from '../../configs/GlobalConst';
import AppStore   from '../../stores/AppStore';
import { SearchQuestionPageStore } from '../../stores/student/UserStore.student';
import ActionSheet from 'react-native-actionsheet'
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';

const { width, height } = Dimensions.get('window');
 
@observer
export default class SearchQuestionPage extends React.Component{

        constructor(props){
            super(props);
            this.pageStore = new SearchQuestionPageStore();
        }

        componentDidMount(){
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
            
            this.pageStore.fetchSearchQuestionList(true);
        }
       


        renderGradeActionSheet(){
            let  options = this.pageStore.grade_list.map((grade) =>{ return grade.name;});
            let cancelButtonIndex = options.push("取消")-1;
            return (
                <ActionSheet
                    ref={o => this.gradeActionSheet = o}
                    title={'選擇年級'}
                    options={options}
                    cancelButtonIndex={cancelButtonIndex}
                    onPress={(index) => {
                        if( this.pageStore.grade_list.length > 0 && index != cancelButtonIndex ){
                            this.pageStore.grade = this.pageStore.grade_list[index];
                            this.pageStore.fetchSearchQuestionList(true);
                        }
                    }}
                />
            );
        }

        renderSubjectActionSheet(){
            let  options = this.pageStore.subject_list.map((subject) =>{ return subject.name})
            let cancelButtonIndex = options.push("取消")-1;
            return (
                <ActionSheet
                    ref={o => this.subjectActionSheet = o}
                    title={'選擇科目'}
                    options={options}
                    cancelButtonIndex={cancelButtonIndex}
                    onPress={(index) => {
                        if( this.pageStore.subject_list.length > 0 && index != cancelButtonIndex ){
                            this.pageStore.subject = this.pageStore.subject_list[index];
                            this.pageStore.fetchSearchQuestionList(true);
                        }
                    }}
                />
            );
        }

            

        render(){
            return (
                    <View style={styles.container}>
                        {this.renderChooseItem()}
                        {this.renderListView()}
                        {this.renderGradeActionSheet()}  
                        {this.renderSubjectActionSheet()} 
                    </View>
                )
        }

        renderChooseItem(){
            let {
                grade,
                subject,
                start_dateStr,
                start_dateTimeStamp,
                end_dateStr,
                end_dateTimeStamp,
                keyword
                
            } = this.pageStore;
            return (
                <View style={{marginLeft:15,marginRight:15,flexDirection:'row',flexWrap: 'wrap',alignItems: 'center',justifyContent:"space-between"}}>
                   
                        <View style={{width:(width-15-15), height:36, borderWidth:1, borderColor:"#0084FF",borderRadius: 20,alignItems: 'center', justifyContent: 'center'}}>
                        
                        <TextInput
                                style={{
                                flex: 1,
                                width:(width-15-15-10-10),
                                marginLeft:10,
                                marginRight:10,
                                padding: 0,
                                height: 36,
                                fontSize: 15,
                                textAlign:"center",
                                color:'#0084FF'
                            }}
                                onChangeText={(text) => {
                                this.pageStore.keyword = text;
                            }}
                            onSubmitEditing = {(event) => {

{/* if(Platform.OS == 'ios'){ */}
this.pageStore.fetchSearchQuestionList(true);
{/* } */}
}}
                            onBlur={(event) => {

                            {/* if(Platform.OS == 'ios'){ */}
                            this.pageStore.fetchSearchQuestionList(true);
                            {/* } */}
                            }}

                                keyboardType={'default'}
                                defaultValue={''}
                                placeholder={'請輸入提問標題或提問內容關鍵字'}
                                placeholderTextColor={'#0084FF'}
                                underlineColorAndroid="transparent"
                                returnKeyType={'search'}
                                />

                        </View>

                        <TouchableOpacity activeOpacity={0.5} style={{width:(width-15-15-10)/2, height:36,marginTop:10, backgroundColor:'#fff', borderColor:"#0084FF", borderWidth:1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => {
                                this.gradeActionSheet.show();

                        }}>
                            <Text style={{color:"#0084FF", fontSize: 14}}>{grade.name}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.5} style={{width:(width-15-15-10)/2, height:36,marginTop:10, backgroundColor:'#fff', marginLeft:10, borderColor:"#0084FF", borderWidth:1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => {
                                this.subjectActionSheet.show();
                        }}>
                            <Text style={{color:"#0084FF", fontSize: 14}}>{subject.name}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.5} style={{width:(width-15-15-10)/2, height:36,marginTop:0, backgroundColor:'#fff', borderColor:"#0084FF", borderWidth:1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => {

                        }}>
                            <DatePicker
                                style={{}}
                                date={start_dateTimeStamp?start_dateStr:""}
                                mode="date"
                                placeholder={start_dateStr}
                                format="YYYY-MM-DD"
                                minDate="1900-01-01"
                                maxDate = {end_dateTimeStamp?end_dateStr:Moment(new Date()).format('YYYY-MM-DD')}
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        borderWidth:0,
                                    },
                                    dateText:{
                                        color:"#0084FF",
                                    },
                                    placeholderText:{
                                        color:"#0084FF",
                                    },
                                    btnTextConfirm:{
                                        color:"#0084FF",
                                    },
                                    datePicker:{
                                            borderTopWidth:0,
                                            elevation: 1,
                                            shadowOffset: {width: 0, height: 0},
                                            shadowOpacity: 0.1,
                                            shadowRadius: 5
                                    }
                                }}
                                onDateChange={(date) => {
                                    this.pageStore.start_dateStr = date;
                                    this.pageStore.start_dateTimeStamp = Date.parse(new Date(date))/1000;
                                    this.pageStore.fetchSearchQuestionList(true);
                                    console.log( Date.parse(new Date(date)));
                                }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.5} style={{width:(width-15-15-10)/2, height:36,marginTop:0, backgroundColor:'#fff', marginLeft:10, borderColor:"#0084FF", borderWidth:1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => {

                        }}>
                            <DatePicker
                                style={{}}
                                date={end_dateTimeStamp?end_dateStr:""}
                                mode="date"
                                placeholder={end_dateStr}
                                format="YYYY-MM-DD"
                                minDate={start_dateTimeStamp?start_dateStr:"1900-01-01"}
                                maxDate = { Moment(new Date()).format('YYYY-MM-DD') }
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        borderWidth:0,
                                    },
                                    dateText:{
                                        color:"#0084FF",
                                    },
                                    placeholderText:{
                                        color:"#0084FF",
                                    },
                                    btnTextConfirm:{
                                        color:"#0084FF",
                                    },
                                    datePicker:{
                                            borderTopWidth:0,
                                            elevation: 1,
                                            shadowOffset: {width: 0, height: 0},
                                            shadowOpacity: 0.1,
                                            shadowRadius: 5
                                    }
                                }}
                                onDateChange={(date) => {
                                    this.pageStore.end_dateStr = date;
                                    this.pageStore.end_dateTimeStamp = Date.parse(new Date(date))/1000;
                                    this.pageStore.fetchSearchQuestionList(true);
                                    console.log( Date.parse(new Date(date)));
                                }}
                            />
                        </TouchableOpacity>
                        

                </View>
            );
        }

                   
        //ListView
        renderListView(){

            let { dataSource } = this.pageStore;
          
            let config={};
            //listView row
            config.renderRow = (rowData,sectionID,rowID) => (
                <View style={{backgroundColor:'#fff'}}>
                <View style={{flex:1,backgroundColor:'#fff',margin:15,marginBottom:10,marginTop:rowID == 0 ? 15:5,borderWidth:1, borderColor:"#f0f0f0", borderRadius:10}}>
                <TouchableOpacity activeOpacity={0.5} onPress={()=>{Actions.QuestionDetailsPage({id:rowData.id});}}>
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
                    <Image style={{width:60, height:60,borderRadius:30,resizeMode:'contain'}} source={require('./../../resources/img/home_icon_noorder.png')}/>
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
