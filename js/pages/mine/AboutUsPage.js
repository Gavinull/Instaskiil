import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView
} from 'react-native';
 
 const {width,height} = Dimensions.get('window');

 export default class AboutUsPage extends React.Component{

     constructor(props){
         super(props);
      }

      

//navigatorBar
 renderNavigatorBar(){
            return (
                <View style={{height:Platform.OS === 'ios'?64:44, backgroundColor:'#0298FE',flexDirection:'row',alignItems:'flex-end',}}>
                    <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center'}} onPress={() => {this.props.navigator.pop();}}>
                            <Image style={{margin:8,width:26,height:26}} source={require('./../../images/icon_white_back.png')}/>
                    </TouchableOpacity>
                    <View style={{flex:1,height:44,alignItems: 'center',justifyContent:'center'}}>
                            <Text style={{color:'#fff',fontSize:17,fontWeight: 'bold'}}>关于我们</Text>
                    </View>
                    <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center',alignItems:'flex-end'}} onPress={() => {}}>
                            <Text style={{marginRight:8,fontSize:15}}></Text>
                    </TouchableOpacity>
                </View>
                    );
}

renderContentView(){
    return (
        <View style={{flex:1}}>
            <View style={{flex:6,alignItems:'center',justifyContent:'center',}}>
            
              <Image style={{marginTop:30,borderRadius:8,width:60,height:60}} source={require('./../../images/tflscorner.png')}/>
            <Text style={{fontSize:17,color:'#39C0F3',marginTop:5}}>Baddy v1.0</Text>
            <Text style={{color:'#666666',margin:32,marginTop:10}}>巴迪汽车服务APP,为用户提供—站式高品质上门服务。到目前已开通了70多个主要城市，提供的服务涵盖了家政、按摩、维修、搬家、丽人、洗衣 、养车、医护等数十个品类，入驻服务商超过2万家连接各行各业逾百万专业服务人员。
              </Text>

            </View>
            <View style={{flex:4,alignItems:'center',justifyContent:'flex-end'}}>
            <Text style={{fontSize:12,color:'#999999',marginBottom:20}}>Copyright 2014-2017 巴迪版权所有 粤ICP备 00000000号</Text>
            </View>
        </View>
    );

}

    
    render() {
        return (
            <View style={styles.container}>
             {this.renderNavigatorBar()}
             {this.renderContentView()}
           </View>

        )
    }
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
