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
    PanResponder,
    ScrollView,
    ImageBackground
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observe  } from 'mobx';
import { RegisterPageStore } from '../../stores/LoginStore';
import ImagePickerUtil from './../../utils/ImagePickerUtil';

const { width, height } = Dimensions.get('window');

import LoginPage from './LoginPage';

@observer
export default class registerPage extends React.Component{
      
        constructor(props){
            super(props);
            this.startObserver();
            // this.state = {
            //     headImageUri:{uri:''},      //头像
            //     positiveIdDCardUri:{uri:''},//正面身份证
            //     negativeIdDCardUri:{uri:''},//反面身份证
            // }
        }

        startObserver(){
            this.pageStore = new RegisterPageStore();
            const disposer = observe(this.pageStore, 'isSuccessRegister', (change) => {
                if(this.pageStore.isSuccessRegister){
                    this.props.navigator.pop();                
                }
            });
        }

        openImagePickerAction = (type) =>{

            ImagePickerUtil.showImagePicker().then((res)=>{
                console.log(res);
                let { source, path } = res;
                if (type === 1){
                    // this.setState({
                    //     headImageUri:source
                    // });
                    this.pageStore.setHeadImageUri(source);
                }
                if (type === 2){
                    //  this.setState({
                    //     positiveIdDCardUri:source
                    // });     
                    this.pageStore.setPositiveIdDCardUri(source);               
                }
                if (type === 3){
                    //  this.setState({
                    //     negativeIdDCardUri:source
                    // });   
                    this.pageStore.setNegativeIdDCardUri(source);                            
                }

            }).catch((err)=>{

            });

        }
        
        render() {
            return (
                <View style={styles.container}>
                     {/*{ this.renderNavigatorBar() }*/}
                     { this.renderMainView() }
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
                            <Text style={{color:'#fff',fontSize:17,fontWeight: 'bold'}}>注册</Text>
                    </View>
                    <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center',alignItems:'flex-end'}} onPress={() => {}}>
                            <Text style={{marginRight:8,fontSize:15}}></Text>
                    </TouchableOpacity>
                </View>
                    );
        }

        renderMainView(){

            let { name, sex, birthday, phone, code, codeText, password } = this.pageStore;
            let { headImageUri, positiveIdDCardUri, negativeIdDCardUri } = this.pageStore;

            return (
                 <ScrollView style={{flex:1,backgroundColor:'#f6f6f6'}}>
                                   
                {/*头像*/}
                    <View style={{width,height:170}}>
                        <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}} onPress={() => {this.openImagePickerAction(1);}}>
                            <Image source={ headImageUri.uri ? headImageUri: require('./../../images/mine_icon_avatar.png')} style={{width:80, height:80, borderRadius:40}}/>
                            <Text style={{color:'#999999',marginLeft:12,fontSize:14,marginTop:20}}>请选择你的头像</Text>
                        </TouchableOpacity>  
                    </View>
                {/*填写信息*/}
                    <View style={{height:34, backgroundColor:'#fff',justifyContent:'center'}}>
                        <Text style={{color:"#333333", marginLeft:12, fontSize:14}}>填写信息</Text>
                        <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:0,right:0}}/>
                    </View>
                {/*姓名*/}
                    <View style={{height:44, backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{flex:1, color:"#666666", marginLeft:12, fontSize:14}}>{`姓名`}</Text>
                        <TextInput style={{width:150,marginRight:12, padding: 0, fontSize:15}} 
                                    onChangeText={(text) => { this.pageStore.setName(text);}}
                                    textAlign={'right'}
                                    placeholder={'您的真实姓名'} 
                                    placeholderTextColor={'#CCCCCC'} 
                                    underlineColorAndroid="transparent"/>
                        <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:0,right:0}}/>                    
                    </View>
                {/*性别*/}
                    <View style={{height:44, backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{flex:1, color:"#666666", marginLeft:12, fontSize:14}}>{`性别`}</Text>
                        <TextInput style={{width:150,marginRight:12, padding: 0, fontSize:15}} 
                                    onChangeText={(text) => { this.pageStore.setSex(text);}}
                                    textAlign={'right'}
                                    placeholder={'您的性别'} 
                                    placeholderTextColor={'#CCCCCC'} 
                                    underlineColorAndroid="transparent"/> 
                        <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:0,right:0}}/>                      
                    </View>
                {/*生日*/}
                    <View style={{height:44, backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{flex:1, color:"#666666", marginLeft:12, fontSize:14}}>{`生日`}</Text>
                        <TextInput style={{width:150,marginRight:12, padding: 0, fontSize:15}} 
                                    onChangeText={(text) => {this.pageStore.setBirthday(text); }}
                                    textAlign={'right'}
                                    placeholder={'您的生日'} 
                                    placeholderTextColor={'#CCCCCC'} 
                                    underlineColorAndroid="transparent"/> 
                        <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:0,right:0}}/>                      
                    </View>
                {/*手机号*/}
                    <View style={{height:44, backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{flex:1, color:"#666666", marginLeft:12, fontSize:14}}>{`手机号`}</Text>
                        <TextInput style={{width:150,marginRight:12, padding: 0, fontSize:15}} 
                                    onChangeText={(text) => {this.pageStore.setPhone(text); }}
                                    keyboardType={Platform.OS === 'ios' ? 'phone-pad':'numeric'}
                                    maxLength={11} 
                                    textAlign={'right'}
                                    placeholder={'您的手机号码'} 
                                    placeholderTextColor={'#CCCCCC'} 
                                    underlineColorAndroid="transparent"/> 
                        <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:0,right:0}}/>                      
                    </View>
                {/*验证码*/}
                    <View style={{height:44, backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{flex:1, color:"#666666", marginLeft:12, fontSize:14}}>{`验证码`}</Text>
                        <TextInput style={{width:150,marginRight:12, padding: 0, fontSize:15}} 
                                    onChangeText={(text) => {this.pageStore.setCode(text); }}
                                    keyboardType={Platform.OS === 'ios' ? 'phone-pad':'numeric'}
                                    maxLength={11} 
                                    textAlign={'right'}
                                    placeholder={'验证码'} 
                                    placeholderTextColor={'#CCCCCC'} 
                                    underlineColorAndroid="transparent"/>
                         <TouchableOpacity style={{width:80, height:26,marginRight:12,borderWidth:1,borderColor:'#1CABEC',borderRadius:3, justifyContent:'center', alignItems:'center'}} onPress={() => {this.pageStore.sendSMS();}}>
                                <Text style={{fontSize:13, color:'#1CABEC'}}>{codeText}</Text>
                        </TouchableOpacity>
                        <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:0,right:0}}/>                      
                    </View>
                {/*密码*/}
                    <View style={{height:44, backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{flex:1, color:"#666666", marginLeft:12, fontSize:14}}>{`设置密码`}</Text>
                        <TextInput style={{width:250,marginRight:12, padding: 0, fontSize:15}} 
                                    onChangeText={(text) => { this.pageStore.setPassword(text);}}
                                    textAlign={'right'}
                                    placeholder={'由6-20位数字、字母组成的密码'} 
                                    placeholderTextColor={'#CCCCCC'} 
                                    underlineColorAndroid="transparent"/> 
                        <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:0,right:0}}/>                      
                    </View>
                {/*分割线*/}
                      <View style={{height:30,backgroundColor:'rgb(245,245,245)'}}/>
                {/*上传身份证*/}
                    <View style={{height:34, backgroundColor:'#fff',justifyContent:'center'}}>
                        <Text style={{color:"#333333", marginLeft:12, fontSize:14}}>上传身份证</Text>
                        <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:0,right:0}}/>
                    </View>
                {/*身份证*/}
                <View style={{width,height:170,flexDirection:'row',backgroundColor:'#fff'}}>
                    <View style={{flex:1}}>
                        <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}} onPress={() => {this.openImagePickerAction(2);}}>
                             <ImageBackground source={positiveIdDCardUri.uri ? positiveIdDCardUri:require('./../../images/btn_add_photos.png')} style={{width:130, height:130,resizeMode:'contain'}}>
                                <Text style={{color:'#999999',fontSize:14,position:'absolute',bottom:15,alignSelf:'center'}}>{positiveIdDCardUri.uri ? '':'身份证正面'}</Text>
                            </ImageBackground>
                        </TouchableOpacity>  
                    </View>
                    <View style={{flex:1}}>
                        <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}} onPress={() => {this.openImagePickerAction(3);}}>
                            <ImageBackground source={negativeIdDCardUri.uri ? negativeIdDCardUri:require('./../../images/btn_add_photos.png')} style={{width:130, height:130,resizeMode:'contain'}}>
                                <Text style={{color:'#999999',marginLeft:12,fontSize:14,position:'absolute',bottom:15,alignSelf:'center',}}>{negativeIdDCardUri.uri ? '':'身份证反面'}</Text>
                            </ImageBackground>
                        </TouchableOpacity>  
                    </View>
                </View>

                {/*提交*/}
                <View style={{width,height:100,justifyContent:'center',}}>
                    <TouchableOpacity style={{backgroundColor:'#1CABEC', height:40, borderRadius:5, alignItems:'center', justifyContent:'center',marginLeft:16,marginRight:16}} 
                                        onPress={() => { this.pageStore.registerAction(); }}>
                        <Text style={{ color:'#fff', fontSize:18}}>提交审核</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

        );
    }
   
    
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
