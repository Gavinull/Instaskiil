import React, { Component } from 'react';
import { View, Text,TextInput, StyleSheet,Platform,Dimensions,TouchableOpacity,PanResponder } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Actions } from 'react-native-router-flux';

import RegularUtil from '../../utils/RegularUtil';
import ToastUtil from '../../utils/ToastUtil';

const {width, height} = Dimensions.get('window');

export default class RegisterAccountPage extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            // 0:學生 1:老師
           registerType:1,
           account:"",
           password:"",
           isCanUsedUsername:false
        }
        this.closekeyboard();
        
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

    // 失去焦點
    onCheckUsername(userName){
        
        if(userName.length == 0){ return;}
        this.requestCheckUsername(userName);

    }

    // 驗證賬號可用性
    requestCheckUsername(userName){
        return new Promise(function (resolve, reject) {
            global.FetchUtil.post(global.UrlConst.apiCheckUsername, {params:{username:userName}}).then((result) => {
                if(result.can_use ==  true){
                    resolve(true);
                }else{
                    ToastUtil.showToast("用戶名已被佔用，請使用其他用戶名");
                    reject("用戶名已被佔用，請使用其他用戶名");
                }
            }).catch((error)=>{
                console.log(error);
                reject("未能驗證該賬號是否可用,請重試!");
            });
        });
    }

    _nextStepAction(){


        if(RegularUtil.isAccount(this.state.account) == false){
            ToastUtil.showToast("請輸入正確的賬號")
            return;
        }


        if(RegularUtil.isPassword(this.state.password) == false){
            ToastUtil.showToast("請輸入正確的密碼")
            return;
        }

        
        this.requestCheckUsername(this.state.account).then((isok)=>{
            Actions.RegisterInfoPage({
                registerType:this.state.registerType,
                account:this.state.account,
                password:this.state.password,
           });
        });

        

    }
    
    render() {

        let list = [
            {name:"學生"},
            {name:"老師"},
        ]

        return (
            <View style={styles.container} {...this.pan.panHandlers}>
                
                <View style={{flex:1}}>
                <Text style={{marginLeft:32,marginTop:15,color:"#4A4A4A"}}>選擇身份:</Text>
                <View style={{height:100,marginLeft:32,marginRight:32,flexDirection:'row',alignItems: 'center',justifyContent:"space-between"}}>
                    {/* <View style={{flex:1,flexDirection: 'row',alignItems: 'center',height: 50,}}>
                            <TouchableOpacity style={{flex: 1,backgroundColor: '#0084FF',height: 50,borderRadius: 4,alignItems: 'center',justifyContent: 'center'}}
                                            onPress={() => {

                            }}>
                                <Text style={{color: '#fff',fontSize: 18 }}>學生</Text>
                            </TouchableOpacity>
                    </View>
                    <View style={{width:18}}/>
                    <View style={{flex:1,flexDirection: 'row',alignItems: 'center',height: 50,}}>
                            <TouchableOpacity style={{flex: 1,backgroundColor: '#fff',borderColor:"#979797",borderWidth:1,height: 50,borderRadius: 4,alignItems: 'center',justifyContent: 'center'}}
                                            onPress={() => {

                            }}>
                                <Text style={{color: '#4A4A4A',fontSize: 18 }}>老師</Text>
                            </TouchableOpacity>
                    </View> */}

                    {
                        list.map((item, i)=>{
                            return (
                                <View style={{width:(width-32*2-20)/2,flexDirection: 'row',alignItems: 'center',height: 50,}}>
                                    <TouchableOpacity style={{flex: 1,backgroundColor: this.state.registerType == i+1 ? '#0084FF':'#fff',borderColor:"#979797",borderWidth:this.state.registerType == i+1 ? 0:1,height: 50,borderRadius: 4,alignItems: 'center',justifyContent: 'center'}}
                                                    onPress={() => {
                                                        this.setState({registerType : i+1})

                                    }}>
                                        <Text style={{color: this.state.registerType == i+1 ?'#fff':'#4A4A4A',fontSize: 14 }}>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            );      
                        })
                    }

                </View>
                <Text style={{marginLeft:32,marginTop:15,color:"#4A4A4A"}}>設置賬號: (英文或數字組合,6-20位)</Text>
                <View style={{ backgroundColor: '#fff', alignItems: 'center',height: 100, marginLeft:32,marginRight:32,marginTop:0,borderRadius: 6}}>
                        <View style={{marginTop:26,flexDirection: 'row', alignItems: 'center',borderRadius: 5}}>            
                            <TextInput style={{marginLeft: 0,flex: 1,padding: 0,height: 50,fontSize: 15}} 
                            onChangeText={(text) => {
                                this.setState({account : text})
                            }}
                            onBlur={(event) => {

                                 if(Platform.OS == 'ios'){
                                    this.onCheckUsername(this.state.account);
                                }
                            }}
                            
                            secureTextEntry={false}
                            keyboardType={'default'}
                            maxLength={20}
                            defaultValue={''}
                            placeholder={'請輸入賬號'}
                            placeholderTextColor={'#CCCCCC'}
                            underlineColorAndroid="transparent"/>
                        </View>
                        {/*分割线*/}
                        <View style={{ height: 1, width: width - 32*2, backgroundColor: 'rgba(151,151,151,0.2)'}}/> 
                </View>

                <Text style={{marginLeft:32,marginTop:15,color:"#4A4A4A"}}>設置密碼: (英文或數字組合,6-16位)</Text>
                <View style={{ backgroundColor: '#fff', alignItems: 'center',height: 100, marginLeft:32,marginRight:32,marginTop:0,borderRadius: 6}}>
                        <View style={{marginTop:26,flexDirection: 'row', alignItems: 'center',borderRadius: 5}}>            
                            <TextInput style={{marginLeft: 0,flex: 1,padding: 0,height: 50,fontSize: 15}} 
                            onChangeText={(text) => {
                                this.setState({password : text})
                            }}
                            secureTextEntry={true}
                            keyboardType={'default'}
                            maxLength={16}
                            defaultValue={''}
                            placeholder={'請輸入密碼'}
                            placeholderTextColor={'#CCCCCC'}
                            underlineColorAndroid="transparent"/>
                        </View>
                        {/*分割线*/}
                        <View style={{ height: 1, width: width - 32*2, backgroundColor: 'rgba(151,151,151,0.2)'}}/> 
                </View>
                <KeyboardSpacer/>

                {/*下一步 按钮*/}
                <View style={{flex:1,marginLeft:108,marginRight:108,marginBottom:0,flexDirection: 'row',alignItems: 'center',height: 50,}}>
                        <TouchableOpacity style={{flex: 1,backgroundColor: '#0084FF',height: 50,borderRadius: 25,alignItems: 'center',justifyContent: 'center',marginTop: 20}}
                                          onPress={() => {
                                             this._nextStepAction()

                        }}>
                            <Text style={{color: '#fff',fontSize: 18 }}>下一步</Text>
                        </TouchableOpacity>
                </View>

                </View>

            </View>



        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

