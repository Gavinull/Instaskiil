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
    ScrollView
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observe  } from 'mobx';

const { width, height } = Dimensions.get('window');


@observer
export default class UserCashChangePage extends React.Component{
      
        constructor(props){
            super(props);
        }

        
        render() {
            return (
                <View style={styles.container}>
                     { this.renderNavigatorBar() }
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
                            <Text style={{color:'#fff',fontSize:17,fontWeight: 'bold'}}>提现</Text>
                    </View>
                    <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center',alignItems:'flex-end'}} onPress={() => {}}>
                            <Text style={{marginRight:8,fontSize:15}}></Text>
                    </TouchableOpacity>
                </View>
                    );
        }

        renderMainView(){

            return (
                <ScrollView style={{flex:1,backgroundColor:'#f6f6f6'}}>
                {/*银行卡提现*/}
                    <TouchableOpacity style={{flexDirection:'column',alignItems:'center'}} onPress={() => {}}>
                        <View style={{flex:1,height:44,backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
                        <Image source={require('./../../images/withdraw_icon_unipay.png')} style={{marginLeft:16,width:24,height:24,resizeMode:'contain'}} />
                        <Text style={{flex:16,marginLeft:8,color:'#1C1C1C'}}>银行卡提现</Text>
                        <Image source={require('./../../images/icon_round_unselect.png')} style={{marginRight:16,width:16,height:16,backgroundColor:'white',alignSelf: 'center',resizeMode:'contain'}} />
                        </View>
                    </TouchableOpacity>
                {/*分割线*/}
                    <View style={{height:10,marginLeft:16,marginRight:16,backgroundColor:'rgb(245,245,245)'}}/>
                {/*支付宝提现*/}
                    <TouchableOpacity style={{flexDirection:'column',alignItems:'center'}} onPress={() => {}}>
                        <View style={{flex:1,height:44,backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
                        <Image source={require('./../../images/withdraw_icon_alipay.png')} style={{marginLeft:16,width:22,height:22,resizeMode:'contain'}} />
                        <Text style={{flex:16,marginLeft:8,color:'#1C1C1C'}}>支付宝提现</Text>
                        <Image source={require('./../../images/icon_round_unselect.png')} style={{marginRight:16,width:16,height:16,backgroundColor:'white',alignSelf: 'center',resizeMode:'contain'}} />
                        </View>
                    </TouchableOpacity>
                {/*分割线*/}
                <View style={{height:10,marginLeft:16,marginRight:16,backgroundColor:'rgb(245,245,245)'}}/>
                {/*账号*/}
                <View style={{height:44, backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                    <Text style={{width:100, color:"#333333", marginLeft:16, fontSize:14}}>支付宝账号</Text>
                    <TextInput  style={{flex:1, marginRight:12, padding: 0, fontSize:15}} 
                                onChangeText={(text) => { }}
                                placeholder={'请输入支付宝账号'} 
                                placeholderTextColor={'#CCCCCC'} 
                                underlineColorAndroid="transparent"/>
                    <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:0,right:0}}/>                    
                </View>
                {/*分割线*/}
                <View style={{height:10,marginLeft:16,marginRight:16,backgroundColor:'rgb(245,245,245)'}}/>
                {/*提现金额*/}
                <View style={{backgroundColor:'#FFF'}}>
                    <Text style={{color:"#333333", marginLeft:16, fontSize:14,marginTop:30}}>提现金额</Text>
                    <View style={{height:80,marginTop:25,flexDirection:'row',alignItems:'center'}}>
                        <Text style={{color:"#333333", marginLeft:16, fontSize:30}}>¥</Text>
                        <TextInput style={{flex:1,marginLeft:8,marginRight:12, padding: 0, fontSize:30}} 
                            onChangeText={(text) => { }}
                            placeholderTextColor={'#CCCCCC'} 
                            underlineColorAndroid="transparent"/>
                        {/*分割线*/}
                        <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:16,right:16}}/>
                    </View>
                </View>
                {/*全部提现*/}
                <View style={{height:50,flexDirection:'row',alignItems:'center',backgroundColor:'#FFF'}}>
                        <Text style={{fontSize:13,marginLeft:16,color:'#666666'}}>{`账户余额¥0.00,`}</Text>
                        <TouchableOpacity style={{flexDirection:'column',alignItems:'center'}} onPress={() => {}}>
                            <Text style={{fontSize:13,marginLeft:8,color:'#38A2FF'}}>全部提现</Text>
                        </TouchableOpacity>
                </View>
                {/*提交*/}
                    <View style={{height:120,backgroundColor:'#fff',justifyContent:'center',}}>
                        <TouchableOpacity style={{backgroundColor:'#1CABEC', height:40, borderRadius:5, alignItems:'center', justifyContent:'center',marginLeft:32,marginRight:32,marginBottom:20}} 
                                            onPress={() => {  }}>
                            <Text style={{ color:'#fff', fontSize:18}}>确认提现</Text>
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
