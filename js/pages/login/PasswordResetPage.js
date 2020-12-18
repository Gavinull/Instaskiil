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
    PanResponder
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observe  } from 'mobx';
import { PFResetStore } from '../../stores/LoginStore';
import LoginPage from './LoginPage';

const { width, height } = Dimensions.get('window');

@observer
export default class ResetPasswordPage extends React.Component{
        
        constructor(props){
            super(props);
            this.startObserver();
            this.closekeyboard();
        }

        startObserver(){
            this.PFResetStore  = new PFResetStore();
            let { navigator, phone} = this.props;
            this.PFResetStore.setPhone(phone);
            const disposer = observe(this.PFResetStore, 'isCheckSuccess', (change) => {
            if(this.PFResetStore.isCheckSuccess){
                this.PFResetStore.setCheckSuccess(false);
                const routes = navigator.getCurrentRoutes();
                const loginRoute = routes.find( (route) => route.id == 'LoginPage');
                loginRoute ? navigator.popToRoute(loginRoute):null;
            }  
           });
        }

        closekeyboard(){
            this.pan = PanResponder.create({
                onStartShouldSetPanResponder: (evt, gestureState) => true,
                onPanResponderGrant: (e, gestureState) => {
                    TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
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
                            <Text style={{color:'#fff',fontSize:17,fontWeight: 'bold'}}>重置密码</Text>
                    </View>
                    <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center',alignItems:'flex-end'}} onPress={() => {}}>
                            <Text style={{marginRight:8,fontSize:15}}></Text>
                    </TouchableOpacity>
                </View>
                    );
        }

        renderContentView(){

            let { password1, password2 } = this.PFResetStore;        

            return (
                <View style={{flex:1, backgroundColor:'#F7F9FA', alignItems:'center'}}>
                    <View style={{margin:16, backgroundColor:'#F7F9FA', alignItems:'center', justifyContent:'center'}}>
                        {/*Buddy LOGO*/}
                         <Image style={{borderRadius:8, width:100, height:100, marginTop:50, resizeMode:'contain'}} source={require('./../../images/login_logo.png')}/>
                        {/*密码*/}
                        <View style={{backgroundColor:'#fff', alignItems:'center', height:100, marginTop:50 ,borderRadius:6}}>
                            <View style={{flex:1, flexDirection:'row', alignItems:'center', borderRadius:5}}>
                                <Image source={require('./../../images/login_icon_password.png')} style={{margin:8,marginLeft:16, width:18, height:18, resizeMode:'contain'}} />
                                <TextInput style={{marginLeft:0, flex:1, padding:0, fontSize:15}} 
                                           onChangeText={(text) => { this.PFResetStore.setPassword1(text); }}
                                           maxLength={20}  
                                           placeholder={'由6-20位数字、字母组成的密码'} 
                                           placeholderTextColor={'#CCCCCC'} 
                                           underlineColorAndroid="transparent"/>
                    
                    </View> 
                  {/*分割线*/}  
                    <View style={{height:1,width:width-16-16-16*2, backgroundColor:'#F7F9FA',marginLeft:16,marginRight:16}}/>
                                               
                        {/*确认密码*/}                       
                            <View style={{flex:1, flexDirection:'row', alignItems:'center', borderRadius:5}}>
                                <Image source={require('./../../images/login_icon_password.png')} style={{margin:8,marginLeft:16, width:18, height:18, resizeMode:'contain'}} />
                                <TextInput style={{marginLeft:0, flex:1, padding:0, fontSize:15}} 
                                           onChangeText={(text) => { this.PFResetStore.setPassword2(text); }}
                                           maxLength={20}   
                                           placeholder={'请再次确认密码'} 
                                           placeholderTextColor={'#CCCCCC'} 
                                           underlineColorAndroid="transparent"/>
                            </View>
                        </View>
                        {/*确认按钮*/}
                        <View style={{flexDirection:'row', alignItems:'center', height:44, marginTop:50}}>
                            <TouchableOpacity style={{flex:1, backgroundColor:'#1CABEC', height:40, borderRadius:5, alignItems:'center', justifyContent:'center'}} onPress={() => { this.PFResetStore.resetPassword(); }}>
                                <Text style={{ color:'#fff', fontSize:18}}>确认</Text>
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
