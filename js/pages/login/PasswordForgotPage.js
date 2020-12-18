import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
    DeviceEventEmitter,
    PanResponder
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observe  } from 'mobx';
import PasswordResetPage from './PasswordResetPage';
import { PFCheckStore } from '../../stores/LoginStore';

const { width, height } = Dimensions.get('window');

import LoginPage from './LoginPage';

@observer
export default class ForgotpasswordPage extends React.Component{
      
        constructor(props){
            super(props);
            this.startObserver();
            this.closekeyboard();
        }

        closekeyboard(){
            this.pan = PanResponder.create({
                onStartShouldSetPanResponder: (evt, gestureState) => true,
                onPanResponderGrant: (e, gestureState) => {
                    TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
                }
             });
        }

        startObserver(){
            this.PFCheckStore  = new PFCheckStore();        
            const disposer = observe(this.PFCheckStore, 'isCheckSuccess', (change) => {
                if(this.PFCheckStore.isCheckSuccess){
                    this.PFCheckStore.setCheckSuccess(false);
                    this.props.navigator.push({
                        component:PasswordResetPage,
                        passProps:{
                            phone:this.PFCheckStore.phone
                        }
                    });
                }
            });
        }

        render() {
            return (
                <View style={styles.container} {...this.pan.panHandlers}>
                     { this.renderNavigatorBar() }
                     { this.renderContentView() }
                </View>
            );
        }
        
        renderNavigatorBar(){
            return (
                <View style={{height:Platform.OS === 'ios'?64:44, backgroundColor:'#0298FE',flexDirection:'row',alignItems:'flex-end',}}>
                    <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center'}} onPress={() => {this.props.navigator.pop();}}>
                            <Image style={{margin:8,width:26,height:26}} source={require('./../../images/icon_white_back.png')}/>
                    </TouchableOpacity>
                    <View style={{flex:1,height:44,alignItems: 'center',justifyContent:'center'}}>
                            <Text style={{color:'#fff',fontSize:17,fontWeight: 'bold'}}>忘记密码</Text>
                    </View>
                    <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center',alignItems:'flex-end'}} onPress={() => {}}>
                            <Text style={{marginRight:8,fontSize:15}}></Text>
                    </TouchableOpacity>
                </View>
                    );
        }

        renderContentView(){

            let { phone, code, codeText} = this.PFCheckStore;        

            return (
                <View style={{flex:1, backgroundColor:'#F7F9FA', alignItems:'center'}}>
                    <View style={{margin:16, backgroundColor:'#F7F9FA', alignItems:'center', justifyContent:'center'}}>
                         {/*Buddy LOGO*/}
                            <Image style={{borderRadius:8, width:100, height:100, marginTop:50 ,resizeMode:'contain'}} source={require('./../../images/login_logo.png')}/>                                      
                         {/*手机号*/}
                        <View style={{backgroundColor:'#fff', alignItems:'center', height:100, marginTop:50 ,borderRadius:6}}>
                         <View style={{flex:1, flexDirection:'row', alignItems:'center', borderRadius:5}}>
                            <Image source={require('./../../images/login_icon_username.png')} style={{margin:8,marginLeft:16,  width:18, height:18, resizeMode:'contain'}} />
                            <TextInput style={{marginLeft:0, flex:1, padding:0, fontSize:15 }} 
                                       onChangeText={(text) => { this.PFCheckStore.setPhone(text); }}
                                       keyboardType={Platform.OS === 'ios' ? 'phone-pad':'numeric'}
                                       maxLength={11}
                                       placeholder={'手机号'} 
                                       placeholderTextColor={'#CCCCCC'} 
                                       underlineColorAndroid="transparent"/>
                        </View>
                     {/*分割线*/}  
                    <View style={{height:1,width:width-16-16-16*2, backgroundColor:'#F7F9FA',marginLeft:16,marginRight:16}}/>
                                              
                        {/*验证码*/}                       
                            <View style={{flex:1, flexDirection:'row', alignItems:'center', borderRadius:5}}>
                                <Image source={require('./../../images/login_icon_password.png')} style={{margin:8,marginLeft:16,  width:18, height:18, resizeMode:'contain'}} />
                                <TextInput style={{marginLeft:0, flex:1, padding:0, fontSize:15 }} 
                                           onChangeText={(text) => { this.PFCheckStore.setCode(text); }}
                                           keyboardType={Platform.OS === 'ios' ? 'phone-pad':'numeric'}
                                           maxLength={4} 
                                           placeholder={'请输入验证码'} 
                                           placeholderTextColor={'#CCCCCC'} 
                                           underlineColorAndroid="transparent"/>
                        
                        <View style={{width:1, height:16, backgroundColor:'rgb(245,245,245)'}}></View>
                            <TouchableOpacity style={{width:100, height:44, marginLeft:4, justifyContent:'center', alignItems:'center'}} onPress={() => { this.PFCheckStore.sendSMS(); }}>
                                <Text style={{fontSize:13, color:'#1CABEC'}}>{ codeText }</Text>
                            </TouchableOpacity>
                        <View style={{height:1, backgroundColor:'rgb(245,245,245)', position:'absolute', bottom:0, left:0, right:0}}/>
                        </View> 
                        </View> 
                        {/*下一步按钮*/}
                        <View style={{flexDirection:'row', alignItems:'center', height:44, marginTop:50}}>
                            <TouchableOpacity style={{flex:1, backgroundColor:'#1CABEC', height:40, borderRadius:5, alignItems:'center', justifyContent:'center'}} 
                                              onPress={() => { this.PFCheckStore.checkSMSCode(); }}
                                              >
                                <Text style={{ color:'#fff', fontSize:18}}>下一步</Text>
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
