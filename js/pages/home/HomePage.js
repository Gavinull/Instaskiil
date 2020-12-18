import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView,
    ImageBackground
} from 'react-native';
import AppStore   from './../../stores/AppStore';
import LoginPage  from './../login/LoginPage';
import { observer } from 'mobx-react/native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import { ShopOrderPageStore } from './../../stores/ShopStore';
import  * as GlobalConst from './../../configs/GlobalConst';

const { width, height } = Dimensions.get('window');


const imgs = [require('./../../images/shop_pic_a.png'),
           require('./../../images/shop_pic_b.png'),
           require('./../../images/shop_pic_c.png'),
           require('./../../images/shop_pic_d.png')
]    
@observer
export default class ShopOrderPage extends React.Component{

        constructor(props){
            super(props);
            this.state = {
                tab:0,
            };
            this.pageStore = new ShopOrderPageStore();
            this.pageStore.changeListDataSource(1);

        }

        gotoPage(itemName){

            let { navigator } = this.props;
            if (!AppStore.userToken){
                navigator.push({
                    type:'Modal',
                    id:'LoginPage',
                    component:LoginPage,
                    passProps: {
                             popBack:() =>{

                             },
                        
                    },
                });
                return;
            }
            let component;
            switch (itemName) {
                case "订单支付":
                    component = OrderPayPage;
                    break;                
                case "订单详情":
                    component = ShopOrderDetailsPage;
                    break;            
                default:
                    component = null;
                    break;
            }
            if (component){
                navigator.push({
                    component:component,
                });
            }
        }

render(){
    return (
            <View style={styles.container}>
             {/*{ this.renderNavigatorBar() }*/}
             { this.renderContentView() }
           </View>
           )
}

//navigatorBar
renderNavigatorBar(){
        return (
            <View style={{height:Platform.OS === 'ios'?64:44, backgroundColor:'#fff',flexDirection:'row',alignItems:'flex-end',}}>
               <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center'}} onPress={() => {this.props.navigator.pop();}}>
                        <Image style={{margin:8,width:26,height:26}} source={require('./../../images/icon_white_back.png')}/>
                    </TouchableOpacity>

                <View style={{flex:1,height:44,alignItems: 'center',justifyContent:'center'}}>
                        <Text style={{color:'#000',fontSize:17,fontWeight: 'bold'}}>题目</Text>
                </View>
                <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center',alignItems:'flex-end'}} onPress={() => {}}>
                        <Text style={{marginRight:8,fontSize:15}}></Text>
                </TouchableOpacity>
            </View>
        );
}


                   
renderContentView(){
            
            {/* 当前的 tab */}
            let setTabState = (i) => {
                this.setState({
                     tab:i
                   });

            }
            let { payListDataSource, serviceDataSource, completeListDataSource } =  this.pageStore;
            let list = [
                {name:'全部', data:payListDataSource},
                {name:'邀请', data:serviceDataSource},
            ];
            return (
                      <ScrollableTabView
                                style={{flex:1,shadowColor:'#0088FF',}}
                                tabBarTextStyle={{fontSize:14,}}
                                tabBarActiveTextColor={'#0084FF'}
                                tabBarInactiveTextColor={'#D8D8D8'}
                                tabBarUnderlineStyle={{width:width/2,marginLeft:0,backgroundColor:'#0084FF',height:2}}
                                renderTabBar={(tabBarProps) =>{
                                    return (<DefaultTabBar tabStyle={{paddingBottom:0}} style={{backgroundColor:'white',borderWidth: 1,borderColor:'#D8D8D8',}} 
                                            />);
                                }}
                                 onChangeTab={(obj) => {this.pageStore.changeListDataSource(obj.i+1);} }> 
                                        {
                                            list.map((controller, i)=>{
                                                return (
                                                        <View key={i} tabLabel={controller.name} style={{flex:1,backgroundColor:'rgb(245,245,245)'}}>
                                                           {this.renderListView(controller.data, i)}
                                                        </View>
                                                );      
                                            })
                                       }
                            </ScrollableTabView>
            );
        }
                   

        //ListView
        renderListView(dataSource,i){

            let gotoOrderPayPage = () => {
                        // this.props.navigator.push({
                        //         id:'ShopOrderDetailsPage',
                        //         component:ShopOrderDetailsPage,
                        //         passProps: {},
                        //     });
            }

            
            let gotoOrderDetailsPage = (type,orderData) => {
                    // this.props.navigator.push({
                    //         id:'ShopOrderDetailsPage',
                    //         component:ShopOrderDetailsPage,
                    //         passProps: {
                    //             type,
                    //             orderData
                    //         },
                    //     });
                }; 

    

                let getOrderStateString = (type) => {
                    let state;
                    switch (type) {
                        case 1:
                            state = '待付款';
                            break;
                        case 2:
                            state = '送货中';
                        break;
                        case 3:
                            state = '已完成';
                        break;
                        default:
                            break;
                    }
                    return state;
                };

                let getPayStateString = (type) => {
                    let state;
                    switch (type) {
                        case 1:
                            state = '立即支付';
                            break;
                        case 2:
                            state = '确认完成';
                        break;
                        case 3:
                            state = '已完成';
                        break;
                        default:
                            break;
                    }
                    return state;
                };

                let gotoPage = (type, order) => {
                    // let { navigator } = this.props;
                    // if (type == 1){
                    //     if(!order){return;}
                    //     navigator.push({
                    //             id:'ShopOrderDetailsPage',
                    //             component:ShopOrderDetailsPage,
                    //             passProps: {
                    //                 order_id:order.order_id,
                    //                 pay_amount:order.total_amount,
                    //                 pay_remaining_time:order.add_time,
                    //                 shop_name:order.shop_name
                    //             },
                    //         });
                    // }

                    // if (type == 2){
                    //     navigator.push({
                    //             id:'ShopOrderDetailsPage',
                    //             component:ShopOrderDetailsPage,
                    //             passProps: {
                    //                 order_id:order.order_id,
                    //             },
                    //         });
                    // }

                    // if (type == 3){
                    //     // navigator.push({
                    //     //         id:'CheckQRcodepPage',
                    //     //         component:CheckQRcodepPage,
                    //     //         passProps: {},
                    //     //     });
                    // }
                    
                };
            
             let  goodList=[{goods_name:'汽车禅子刷车拖把摇车扫灰除尘丁 具车用洗车神器蜡拖清洁用品',shop_price:'40.00'},{goods_name:'具车用洗车神器蜡拖清洁用品,汽车禅子刷车拖把摇车扫灰除尘丁',shop_price:'28.00'}]
        
            let config={};
            //listView row
            config.renderRow = (rowData,sectionID,rowID) => (
                <View style={{backgroundColor:'#fff'}}>
                <View style={{flex:1,borderRadius:8,backgroundColor:'#fff',margin:15,marginBottom:5,marginTop:rowID == 0 ? 24:5,shadowColor: '#AFAEAE',elevation: 20,shadowOffset: {width: 0, height: 0},shadowOpacity: 1,shadowRadius: 3}}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => gotoOrderDetailsPage(rowData.order_state,rowData)}>
                    <View style={{height:40,marginLeft:12,borderRadius:8,flexDirection:'row',alignItems:'center',backgroundColor:'#fff'}}>
                        <TouchableOpacity style={{height:22, alignItems:'center',justifyContent:'center',backgroundColor:"#FF5477",borderColor:'#FF5477',borderRadius:11,borderWidth:1,overflow:'hidden',}} >
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#fff'}}>五年级</Text>
                        </TouchableOpacity>
                         <TouchableOpacity style={{height:22,marginLeft:12,alignItems:'center',justifyContent:'center',borderColor:'#FF5477',borderRadius:11,borderWidth:1,overflow:'hidden',}}>
                                 <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#FF5477'}}>数学</Text>
                        </TouchableOpacity>
                          <Text style={{position:'absolute',right:12,fontSize:10,color:'#4A4A4A'}}>10月5日12:00</Text>
                    </View>
                    <Text style={{fontSize:12,marginLeft:12,marginBottom:12,marginRight:12,color:"rgba(70,70,70,0.5)"}}>老师请您看一下这道题，我不太明白鸡兔同笼是什么意思，这类问题有没有比较快的解决方案。老师请您看一下这道题，我不太明白鸡兔同笼是什么意思，这类问题有没有…</Text>
                </TouchableOpacity>
                </View>
                </View>
            );
            config.renderSeparator = () => (
                <View style={{height:0, backgroundColor:'#fff'}}/>
            );
            config.renderHeader = () => (
                <View style={{height:0, backgroundColor:'#fff'}}/>
            );
            config.renderFooter = () => (
                <View style={{height:0, backgroundColor:'#fff'}}/>
            );



            return (
                    <ListView  
                                style={{flex:1,backgroundColor:'#fff'}}    
                                enableEmptySections={true}
                                dataSource={dataSource} 
                                {...config}
                    />
                );
        }

        renderEmptyDataView(){
            return (
                <View style={{flex:1, alignItems:'center', justifyContent:'center' ,backgroundColor:'#F7F9FA'}}>
                    <Image style={{borderRadius:8, width:100, height:100,borderRadius:50,resizeMode:'contain'}} source={require('./../../images/home_icon_noorder.png')}/>
                    <Text style={{fontSize:14, color:'#999999', padding:8, paddingTop:4, paddingBottom:4, marginTop:20}}>暂无订单,耐心等待,</Text>
                    <Text style={{fontSize:14, color:'#999999', padding:8, paddingTop:4, paddingBottom:4,}}>大波订单正在向你飞来!</Text>
                    <TouchableOpacity style={{width:200,height:40,alignItems:'center', justifyContent:'center', backgroundColor:'#F7B425', borderRadius:20, overflow:'hidden', marginTop:70}} onPress={() => {this.gotoPage('登录'); }}>
                        <Text style={{fontSize:16, color:'#fff', }}>点击刷新</Text>
                    </TouchableOpacity>
                </View>
              );
        }
   
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
