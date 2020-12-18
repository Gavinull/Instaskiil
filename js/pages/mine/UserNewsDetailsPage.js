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
import TestData from './../../configs/TestData';
import { observer } from 'mobx-react/native';
import { EvaluationPageStore } from '../../stores/UserStore';
import { imageHost } from '../../configs/GlobalConst';
import DateUtil from '../../utils/DateUtil';
 
const {width, height} = Dimensions.get('window');
@observer
export default class UserNewsDetailsPage extends React.Component{

        constructor(props){
            super(props);
            this.listStore = new EvaluationPageStore();
        }

        componentDidMount(){
            this.listStore.loadData();
        }

        render() {
            return (
                <View style={styles.container}>
                { this.renderNavigatorBar() }
                { this.renderMianView() }
                </View>
            );
        }
    
       //navigatorBar
        renderNavigatorBar(){
            return (
                <View style={{height:Platform.OS === 'ios'?64:44, backgroundColor:'#0298FE',flexDirection:'row',alignItems:'flex-end',}}>
                    <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center'}} onPress={() => {this.props.navigator.pop();}}>
                            <Image style={{margin:8,width:26,height:26}} source={require('./../../images/icon_white_back.png')}/>
                    </TouchableOpacity>
                    <View style={{flex:1,height:44,alignItems: 'center',justifyContent:'center'}}>
                            <Text style={{color:'#fff',fontSize:17,fontWeight: 'bold'}}>通知详情</Text>
                    </View>
                    <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center',alignItems:'flex-end'}} onPress={() => {}}>
                            <Text style={{marginRight:8,fontSize:15}}></Text>
                    </TouchableOpacity>
                </View>
            );
        }

        renderMianView(){
            return (
                 <View style={{justifyContent:'center',backgroundColor:'#fff',}} >
                    <View style={{}}>
                        <Text style={{color:'#333333',margin:16,marginBottom:5,fontSize:16,}}>全城疯抢,0元免费洗车</Text>
                        <Text style={{width:80,fontSize:12,color:'#999999',textAlign:'right',marginRight:15,marginBottom:15}}>{DateUtil.formatTimestamp(1400000000, 'yyyy-MM-dd')}</Text>
                        <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:15,right:0}}/>
                    </View>
                    <Text style={{color:'#666666',margin:16,marginTop:10,marginBottom:10,fontSize:14,}} >暑期优惠大派送，千张0元洗车券免费送，关注我们官方傥 信公众号，回复洗车券，即可参加我们的优惠活动．暑期优惠 大派送，千张0元洗车券免费送，关注我们官方傥信公众号， 回复洗车券，即可参加我们的优惠活动。</Text>
                </View>
            );
        }

    
    
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
})
