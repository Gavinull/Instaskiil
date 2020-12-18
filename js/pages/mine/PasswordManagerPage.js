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
} from 'react-native';
import { observer } from 'mobx-react/native';
import { PWManagerPageStore } from '../../stores/UserStore';

const {width, height} = Dimensions.get('window');
@observer
export default class PasswordManagerPage extends React.Component{

        constructor(props){
            super(props);
            this.pageStore = new PWManagerPageStore();
        }

        render() {
            return (
                <View style={styles.container}>
                    { this.renderContentView() }
                </View>
            );
        }



        renderContentView(){


            return (
                <View style={{flex:1, backgroundColor:'#fff', alignItems:'center'}}>
                    <View style={{margin:16, marginTop:0, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                        {/*LOGO*/}
                        <Image style={{borderRadius:20, width:50, height:50, marginTop:30}} source={require('./../../images/mine_password_manager_icon.png')}/>
                         {/*原密码*/}
                        <View style={{flexDirection:'row', alignItems:'center', height:44, marginTop:40, borderWidth:1, borderRadius:5, borderColor:'rgb(245,245,245)'}}>
                            <View style={{flex:1, flexDirection:'row', alignItems:'center', borderRadius:5}}>
                            <Text style={{fontSize:15, margin:8, color:'#333333'}}>原密码 :</Text>
                            <TextInput style={{marginLeft:0, flex:1, padding:0, fontSize:15}}
                                    onChangeText={(text) => { this.pageStore.password = text; }}
                                    keyboardType={'default'}
                                    maxLength={16}  
                                    placeholder={''} 
                                    placeholderTextColor={'#CCCCCC'} 
                                    underlineColorAndroid="transparent"/>
                            </View>
                    </View>
                    {/*密码*/}
                    <View style={{flexDirection:'row', alignItems:'center', height:44, marginTop:10, borderWidth:1, borderRadius:5, borderColor:'rgb(245,245,245)'}}>
                        <View style={{flex:1, flexDirection:'row', alignItems:'center', borderRadius:5}}>
                            <Text style={{fontSize:16, margin:8, color:'#333333'}}>新密码 :</Text>
                            <TextInput style={{marginLeft:0, flex:1, padding:0, fontSize:15}}
                                    onChangeText={(text) => { this.pageStore.new_password = text; }}
                                    keyboardType={'default'}
                                    maxLength={16}  
                                    placeholder={''} 
                                    placeholderTextColor={'#CCCCCC'} 
                                    underlineColorAndroid="transparent"/>
                        </View>
                    </View>
                    {/*提示*/}
                    <View style={{flexDirection:'row', alignItems:'center', height:30, marginTop:0}}>
                        <Text style={{flex:1, marginLeft:0, fontSize:13, color:'#999999'}}>英文或數字組合(6-16位)</Text>
                    </View>
                    {/*确认按钮*/}
                    <View style={{flex:1, flexDirection:'row', alignItems:"flex-end", height:44}}>
                    <TouchableOpacity style={{backgroundColor: '#0084FF', width:150, height: 50,borderRadius: 25,alignItems: 'center',justifyContent: 'center',marginBottom:100}}
                                          onPress={() => { this.pageStore.confirmChangePassword(); }}>
                             <Text style={{ color:'#fff', fontSize:15}}>確認修改</Text>
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
