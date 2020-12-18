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
import { observer } from 'mobx-react/native';
import TestData from './../../configs/TestData';
import { CollectPageStore } from '../../stores/UserStore';
import  * as GlobalConst from '../../configs/GlobalConst';

// import OrderDetailsPage from './../order/OrderDetailsPage';


const {width, height} = Dimensions.get('window');

@observer
export default class UserCollectionPage extends React.Component{

        constructor(props){
            super(props);
            this.listStore = new CollectPageStore();
        }

        componentDidMount(){
            this.listStore.loadData();
        }

        render() {
            return (
                <View style={styles.container}>
                    { this.renderNavigatorBar() }
                    { this.renderListView() }
                </View>
            );
        }

        //navigatorBar
        renderNavigatorBar(){
            return (
                <View style={{height:Platform.OS === 'ios'?64:44, backgroundColor:'#0298FE', flexDirection:'row', alignItems:'flex-end'}}>
                    <TouchableOpacity style={{width:88, height:44, marginTop:20, justifyContent:'center'}} onPress={() => {this.props.navigator.pop();}}>
                        <Image style={{margin:8, width:26, height:26}} source={require('./../../images/icon_white_back.png')}/>
                    </TouchableOpacity>
                    <View style={{flex:1, height:44, alignItems: 'center', justifyContent:'center'}}>
                        <Text style={{color:'#fff', fontSize:17, fontWeight: 'bold'}}>历史订单</Text>
                    </View>
                    <TouchableOpacity style={{width:88, height:44, marginTop:20, justifyContent:'center', alignItems:'flex-end'}} onPress={() => {}}>
                        <Text style={{marginRight:8, fontSize:15}}></Text>
                    </TouchableOpacity>
                </View>
            );
        }

        //ListView
        renderListView(){
            let { dataSource } = this.listStore;
            //to商家主页
            let gotoOrderDetailsPage = () => {
                    // this.props.navigator.push({
                    //     id:'OrderDetailsPage',
                    //     component:OrderDetailsPage,
                    //     passProps: {
                             
                    //     },
                    // });
            };
            let config={};
                config.renderRow = (rowData,sectionID,rowID) => (
                <View >
                <TouchableOpacity activeOpacity={0.6} style={{width,height:40+110+30,backgroundColor:'#fff',margin:16,marginBottom:0,borderRadius:5,shadowColor: 'black',elevation: 20,shadowOffset: {width: 0, height: 0},shadowOpacity: 0.15,shadowRadius: 5}}  onPress={() => {gotoOrderDetailsPage();}}>
                    <View style={{height:40,flexDirection:'row',alignItems:'center',}}>
                            <Text style={{flex:1,color:'#333333',margin:12,fontSize:14,}} numberOfLines={1}>{`订单号:${rowData.order_num}`}</Text>
                            <Text style={{width:60,color:'#38A2FF',margin:12,fontSize:14,textAlign:'right'}}>已完成</Text>
                    </View>
                    <View style={{flex:1,marginLeft:12,marginRight:12,marginBottom:20,flexDirection:'row',alignItems:'center',backgroundColor:'#F1F3F3'}} onPress={() => {}}>
                                    <Image  style={{marginLeft:24,width:80,height:80,resizeMode:'contain',backgroundColor:'rgba(0,0,0,0)',alignItems:'center',justifyContent:'center'}} source={require('./../../images/home_bg_information.png')}>                                            
                                                    <Text style={{color:'#fff',fontSize:11,marginBottom:5}} numberOfLines={1}>{`粤C k1680`}</Text>
                                                    <Text style={{color:'#fff',fontSize:11,}} numberOfLines={1}>{`宝马 3系 红色`}</Text>
                                    </Image>
                                    <View style={{flex:1,marginLeft:12,marginRight:12,justifyContent:'center'}}>
                                            <Text style={{color:'#333333',fontSize:15,}} numberOfLines={1}>{`${rowData.server}`}</Text>
                                            <View style={{flexDirection:'row',alignItems:'center',marginTop:6}}>
                                                <Image source={require('./../../images/home_icon_positioning.png')} style={{width:12,height:12,resizeMode:'contain'}}/>
                                                <Text style={{color:'#666666',fontSize:12,marginLeft:2}} numberOfLines={1}>{`${rowData.address}`}</Text>
                                            </View>
                                    </View>                                                             
                    </View>
                </TouchableOpacity>
                </View>
            );
          
            config.renderFooter = () => (
                <View style={{height:16, backgroundColor:'#F7F9FA'}}/>
            );

                return (
                        <ListView style={{backgroundColor:'#F7F9FA'}}
                                    dataSource={dataSource} 
                                    enableEmptySections={true}
                                    {...config}
                        />
                    );
            }

}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
})
