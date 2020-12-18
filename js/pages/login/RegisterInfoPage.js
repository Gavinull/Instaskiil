import React, { Component } from 'react';
import { View, ScrollView, Text,TextInput, StyleSheet,Platform,Dimensions,TouchableOpacity,PanResponder } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Actions } from 'react-native-router-flux';
import ActionSheet from 'react-native-actionsheet'
import AppStore from '../../stores/AppStore';
import StorageManager from './../../configs/StorageManager';
import RegularUtil from '../../utils/RegularUtil';
import ToastUtil from '../../utils/ToastUtil';
import FetchUtil from '../../utils/FetchUtil';
import {LoginPageStore} from '../../stores/LoginStore';

const {width, height} = Dimensions.get('window');

export default class RegisterInfoPage extends Component {
   
    constructor(props) {
        super(props);
        this.closekeyboard();
        this.state = {
            // 0:學生 1:老師
           registerType:this.props.registerType,
           account:this.props.account,
           password:this.props.password,
           name:"",
           phone:"",
           email:"",
           description:"",
           school:"",
           grade:{id:"",name:""},
           grade_list:[],
           subject:[],
           subject_list:[],
        }
    }

    componentWillMount(){
        this.fetchGradeList();
        this.fetchSubjectList();
    }

    closekeyboard() {
        this.pan = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (e, gestureState) => {
                TextInput
                    .State
                    .blurTextInput(TextInput.State.currentlyFocusedField());
            }
        });
    }

    // 年级列表
    fetchGradeList(){

        FetchUtil.get(global.UrlConst.apiGetGradeList).then((res) => {
           this.setState({grade_list:res.grade_list}) 
           console.log(this.state.grade_list)           
        }).catch((err) => {
            ToastUtil.showToast(err.msg);
        });

    }

     // 擅長科目列表
     fetchSubjectList(){

        FetchUtil.get(global.UrlConst.apiGetSubjectList).then((res) => {
           this.setState({subject_list:res.subject_list}); 
           console.log(this.state.subject_list)           
        }).catch((err) => {
            ToastUtil.showToast(err.msg);
        });

    }

    // 年级 sheet
    renderGradeActionSheet(){
        let  options = this.state.grade_list.map((grade) =>{ return grade.name})
        let cancelButtonIndex = options.push("取消")-1
        console.log(options)
        return (
            <ActionSheet
                ref={o => this.GradeActionSheet = o}
                title={'選擇年級'}
                options={options}
                cancelButtonIndex={cancelButtonIndex}
                onPress={(index) => {
                    if( this.state.grade_list.length > 0 && index != cancelButtonIndex ){
                        this.setState({grade : this.state.grade_list[index]})
                    }
                }}
            />
        )
    }

    //擅長科目 sheet
    renderSubjectActionSheet(){
        let  options = this.state.subject_list.map((subject) =>{ return subject.name})
        let cancelButtonIndex = options.push("取消")-1
        console.log(options)
        return (
            <ActionSheet
                ref={o => this.SubjectActionSheet = o}
                title={'選擇擅長科目'}
                options={options}
                cancelButtonIndex={cancelButtonIndex}
                onPress={(index) => {
                    if( this.state.subject_list.length > 0 && index != cancelButtonIndex ){
                        this.setState({subject : this.state.subject_list[index]})
                    }
                }}
            />
        )
    }

    //选择擅长科目 回调
    chooseSubjectBlock = (subjects) => {

        this.setState({subject : subjects});

        // let  ids = subjects.map((subject) =>{ return subject.id })

    }


    _nextStepAction(){

        if(this.state.registerType == AppStore.Enum_RoleType.students){

            if(this.state.name.length == 0 ){
                ToastUtil.showToast("請輸入你的真實姓名")
                return
            }

            if(this.state.phone.length == 0 ){
                ToastUtil.showToast("請輸入你的電話號碼")
                return
            }
            if(RegularUtil.isMacauPhone(this.state.phone) == false){
                ToastUtil.showToast("請輸入正確格式的電話號碼");
                return
            }

            if(this.state.email.length == 0 ){
                ToastUtil.showToast("請輸入你的郵箱地址")
                return
            }
            if(RegularUtil.isEmail(this.state.email) == false){
                ToastUtil.showToast("請輸入正確格式的郵箱地址");
                return
            }
    
            if(this.state.school.length == 0){
                ToastUtil.showToast("請輸入你的學校名稱")
                return
            }

            if(this.state.grade.id == 0){
                ToastUtil.showToast("請選擇你的所在年級")
                return
            }

        }

        if(this.state.registerType == AppStore.Enum_RoleType.teacher){

            if(this.state.name.length == 0 ){
                ToastUtil.showToast("請輸入你的真實姓名")
                return
            }

            if(this.state.phone.length == 0 ){
                ToastUtil.showToast("請輸入你的電話號碼")
                return
            }
            if(RegularUtil.isMacauPhone(this.state.phone) == false){
                ToastUtil.showToast("請輸入正確格式的電話號碼");
                return
            }

            if(this.state.email.length == 0 ){
                ToastUtil.showToast("請輸入你的郵箱地址")
                return
            }
            if(RegularUtil.isEmail(this.state.email) == false){
                ToastUtil.showToast("請輸入正確格式的郵箱地址");
                return
            }

            if(this.state.subject.length == 0){
                ToastUtil.showToast("請選擇你擅長的科目")
                return
            }
 
        }

        let url = global.UrlConst.apiRegister
        let params = {
            role:this.state.registerType,
            gender:1,
            name:this.state.name,
            phone:this.state.phone,
            email:this.state.email,
            username:this.state.account,
            password:this.state.password,
            school:this.state.school,
            grade:this.state.grade.id,
            subject:this.state.subject.map((subject) =>{ return subject.id; }).join(','),
        }
        FetchUtil.post(url,{params:params}).then((res) => { 
           console.log(res)
           ToastUtil.showToast("註冊成功")
           let _this = this
           setTimeout(function() {
            let  loginPageStore = new LoginPageStore();
            loginPageStore.requstLoginAction(_this.state.account, _this.state.password);


            // StorageManager.setRoleType(_this.state.registerType)
            // Actions.reset( _this.state.registerType == AppStore.Enum_RoleType.students ? "Tabbar_S":"Tabbar_T")   
  
          }, 100);
        }).catch((err) => {
            console.log(err)           
            // ToastUtil.showToast(err.msg);
        });
    }


    
    render() {
        return (
            <View style={styles.container} {...this.pan.panHandlers}>
             {
                 this.state.registerType == AppStore.Enum_RoleType.students ? this.renderStudentView():this.renderTeacherView()
             }   
              {this.renderGradeActionSheet()} 
              {this.renderSubjectActionSheet()} 
              {this.renderNextButton()}

            </View>



        );
    }

    renderStudentView(){

         let gradeName = this.state.grade.name

        return (
            <ScrollView style={{flex:1}}>
               
               <Text style={{marginLeft:32,marginTop:15,color:"#4A4A4A"}}>輸入姓名:</Text>
               <View style={{ backgroundColor: '#fff', alignItems: 'center',height: 70, marginLeft:32,marginRight:32,marginTop:0,borderRadius: 6}}>
                       <View style={{marginTop:5,flexDirection: 'row', alignItems: 'center',borderRadius: 5}}>            
                           <TextInput style={{marginLeft: 0,marginRight:50,flex: 1,padding: 0,height: 50,fontSize: 15}} 
                           onChangeText={(text) => {
                                this.setState({name : text})
                           }}
                           keyboardType={'default'}
                           maxLength={15}
                           defaultValue={''}
                           placeholder={'請輸入姓名'}
                           placeholderTextColor={'#CCCCCC'}
                           underlineColorAndroid="transparent"/>
                       </View>
                       {/*分割线*/}
                       <View style={{ height: 1, width: width - 32*2, backgroundColor: 'rgba(151,151,151,0.2)'}}/> 
               </View>

                {
                  this.renderCommonView()
              }

               <Text style={{marginLeft:32,marginTop:15,color:"#4A4A4A"}}>輸入學校:</Text>
               <View style={{ backgroundColor: '#fff', alignItems: 'center',height: 70, marginLeft:32,marginRight:32,marginTop:0,borderRadius: 6}}>
                       <View style={{marginTop:5,flexDirection: 'row', alignItems: 'center',borderRadius: 5}}>            
                           <TextInput style={{marginLeft: 0,marginRight:50,flex: 1,padding: 0,height: 50,fontSize: 15}} 
                           onChangeText={(text) => {
                            this.setState({school : text})
                           }}
                           keyboardType={'default'}
                           maxLength={20}
                           defaultValue={''}
                           placeholder={'請輸入學校'}
                           placeholderTextColor={'#CCCCCC'}
                           underlineColorAndroid="transparent"/>
                       </View>
                       {/*分割线*/}
                       <View style={{ height: 1, width: width - 32*2, backgroundColor: 'rgba(151,151,151,0.2)'}}/> 
                </View>

                <Text style={{marginLeft:32,marginTop:15,color:"#4A4A4A"}}>選擇年級:</Text>
                <View style={{width:(width-32*2-20)/2,marginLeft:32,marginRight:32,marginTop:15,flexDirection: 'row',alignItems: 'center',height: 50,}}>
                    <TouchableOpacity style={{flex: 1,backgroundColor: gradeName.length > 0 ? '#0084FF':'#fff',borderColor:"#979797",borderWidth:gradeName.length > 0 ? 0:1,height: 40,borderRadius: 10,alignItems: 'center',justifyContent: 'center'}}
                                    onPress={() => {
                         this.GradeActionSheet.show()
                    }}>
                        <Text style={{color: gradeName.length > 0 ?'#fff':'#4A4A4A',fontSize: 15 }}>{gradeName.length > 0 ? gradeName:'點擊選擇'}</Text>
                    </TouchableOpacity>
                </View>

             

               </ScrollView>

        )
    }

    renderTeacherView(){

        let subjectName = this.state.subject.map((subject) =>{ return subject.name; }).join(',');

        return (
            <ScrollView style={{flex:1}}>
               
               <Text style={{marginLeft:32,marginTop:15,color:"#4A4A4A"}}>輸入姓名:</Text>
               <View style={{ backgroundColor: '#fff', alignItems: 'center',height: 70, marginLeft:32,marginRight:32,marginTop:0,borderRadius: 6}}>
                       <View style={{marginTop:5,flexDirection: 'row', alignItems: 'center',borderRadius: 5}}>            
                           <TextInput style={{marginLeft: 0,marginRight:50,flex: 1,padding: 0,height: 50,fontSize: 15}} 
                           onChangeText={(text) => {
                                this.setState({name : text})
                           }}
                           keyboardType={'default'}
                           maxLength={15}
                           defaultValue={''}
                           placeholder={'請輸入姓名'}
                           placeholderTextColor={'#CCCCCC'}
                           underlineColorAndroid="transparent"/>
                       </View>
                       {/*分割线*/}
                       <View style={{ height: 1, width: width - 32*2, backgroundColor: 'rgba(151,151,151,0.2)'}}/> 
               </View>

                   {
                  this.renderCommonView()
              }

               <Text style={{marginLeft:32,marginTop:15,color:"#4A4A4A"}}>選擇擅長科目:</Text>
                <View style={{width:(width-32*2),marginLeft:32,marginRight:32,marginTop:15,flexDirection: 'row',alignItems: 'center',height: 50,}}>
                    <TouchableOpacity style={{flex: 1,backgroundColor: subjectName.length > 0 ? '#0084FF':'#fff',borderColor:"#979797",borderWidth:subjectName.length > 0 ? 0:1,height: 40,borderRadius: 10,alignItems: 'center',justifyContent: 'center'}}
                                    onPress={() => {
                            Actions.ChooseSubjectPage({lastPageStore:this, defaultSubjects:this.state.subject});          
                         {/* this.SubjectActionSheet.show() */}
                    }}>
                        <Text style={{color: subjectName.length > 0 ?'#fff':'#4A4A4A',fontSize: 15 }}>{subjectName.length > 0 ? subjectName:'點擊選擇'}</Text>
                    </TouchableOpacity>
                </View>

               <Text style={{marginLeft:32,marginTop:15,color:"#4A4A4A"}}>輸入簽名:  (自我介紹)</Text>
                   <TextInput multiline style={{padding:10 ,color:"#4A4A4A",fontSize: 15,height:180,marginLeft:32,marginTop:20,marginRight:32,borderColor:"rgba(151,151,151,0.2)",borderWidth:1,borderRadius: 5}} 
                   onChangeText={(text) => {
                        this.setState({description : text})
                   }}
                   keyboardType={'default'}
                   defaultValue={''}
                   maxLength={150}
                   placeholder={'請輸入簽名'}
                   placeholderTextColor={'#CCCCCC'}
                   underlineColorAndroid="transparent"/>

                

               </ScrollView>
            
        )
    }

    renderCommonView(){
        return (
            <View style={{flex:1}}>
               
               <Text style={{marginLeft:32,marginTop:15,color:"#4A4A4A"}}>輸入電話號碼:</Text>
               <View style={{ backgroundColor: '#fff', alignItems: 'center',height: 70, marginLeft:32,marginRight:32,marginTop:0,borderRadius: 6}}>
                       <View style={{marginTop:5,flexDirection: 'row', alignItems: 'center',borderRadius: 5}}>            
                           <TextInput style={{marginLeft: 0,marginRight:50,flex: 1,padding: 0,height: 50,fontSize: 15}} 
                           onChangeText={(text) => {
                                this.setState({phone : text})
                           }}
                           keyboardType={'numeric'}
                           maxLength={20}
                           defaultValue={''}
                           placeholder={'請輸入電話號碼'}
                           placeholderTextColor={'#CCCCCC'}
                           underlineColorAndroid="transparent"/>
                       </View>
                       {/*分割线*/}
                       <View style={{ height: 1, width: width - 32*2, backgroundColor: 'rgba(151,151,151,0.2)'}}/> 
               </View>

                <Text style={{marginLeft:32,marginTop:15,color:"#4A4A4A"}}>輸入郵箱地址:</Text>
               <View style={{ backgroundColor: '#fff', alignItems: 'center',height: 70, marginLeft:32,marginRight:32,marginTop:0,borderRadius: 6}}>
                       <View style={{marginTop:5,flexDirection: 'row', alignItems: 'center',borderRadius: 5}}>            
                           <TextInput style={{marginLeft: 0,marginRight:50,flex: 1,padding: 0,height: 50,fontSize: 15}} 
                           onChangeText={(text) => {
                                this.setState({email : text})
                           }}
                           keyboardType={'email-address'}
                           maxLength={20}
                           defaultValue={''}
                           placeholder={'請輸入郵箱地址'}
                           placeholderTextColor={'#CCCCCC'}
                           underlineColorAndroid="transparent"/>
                       </View>
                       {/*分割线*/}
                       <View style={{ height: 1, width: width - 32*2, backgroundColor: 'rgba(151,151,151,0.2)'}}/> 
               </View>


               </View>
            
        )

    }

    renderNextButton(){
        return (
               <View style={{height:100,marginLeft:108,marginRight:108,marginBottom:0,flexDirection: 'row',alignItems: 'center'}}>
                       <TouchableOpacity style={{flex: 1,backgroundColor: '#0084FF',height: 50,borderRadius: 25,alignItems: 'center',justifyContent: 'center'}}
                                         onPress={() => {
                                          this._nextStepAction()
                       }}>
                           <Text style={{color: '#fff',fontSize: 18 }}>完成註冊</Text>
                       </TouchableOpacity>
               </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

