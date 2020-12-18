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
 import UserCashChangePage from './UserCashChangePage';
 import AppStore  from '../../stores/AppStore';
import { observer } from 'mobx-react/native';
import { BalancePageStore } from '../../stores/UserStore';
import  DateUtil from '../../utils/DateUtil';

const {width, height} = Dimensions.get('window');
@observer
 export default class UserBalancePage extends React.Component{

        constructor(props){
            super(props);
            this.listStore = new BalancePageStore();
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
                        <Text style={{color:'#fff', fontSize:17, fontWeight: 'bold'}}>我的账本</Text>
                    </View>
                    <TouchableOpacity onPress={() => {}}>
                      <View style={{width:88, height:44, marginTop:20, alignItems:'flex-end', justifyContent:'center'}}>
                          <Image source={require('./../../images/nav_problem.png')} style={{width:18, height:18, resizeMode:'contain',marginRight:16}}/>
                       </View>
                   </TouchableOpacity>
                </View>
            );
        }

        //ListView
            renderListView(){
                 let { dataSource } = this.listStore;                       
                 let config={};
                let gotoUserBalanceRechargePage = () => {
                    this.props.navigator.push({
                                id:'UserBalanceRechargePage',
                                component:UserCashChangePage,
                                passProps: {},
                        });
                }; 




                        config.renderHeader = () => (
                                <View style={{width:Dimensions.get('window').width,height:120,backgroundColor:'#fff',justifyContent:'center'}}>

                                       <View style={{marginLeft:16,height:40,flexDirection:'row',alignItems:'center',}}>
                                          <Image style={{width:24,height:24}} source={require('./../../images/mine_list_balance.png')}/>
                                          <View style={{marginLeft:8,height:22,justifyContent:'center',}}>
                                             <Text style={{color:'#666666',fontSize:12}}>账户余额</Text>
                                             <Text style={{color:'#666666',fontSize:10}}>{`${ DateUtil.formatTimestamp( Date.parse(new Date())/ 1000,  "yyyy-M-d") }`}</Text>
                                          </View>  
                                       </View>

                                       <View style={{marginLeft:16,height:40,flexDirection:'row',alignItems:'center',}}>
                                           <View style={{flex:1,flexDirection:'row',alignItems:'flex-end',}}>
                                             <Text style={{color:'#000',fontSize:15,marginLeft:32,marginBottom:5}}>¥</Text>
                                             <Text style={{color:'#000',fontSize:25}}>{`${AppStore.userMoney}`}</Text>
                                           </View>
                                           <TouchableOpacity style={{width:65,height:25,alignItems:'center',justifyContent:'center',borderColor:'#0298FF',borderRadius:3,borderWidth:0.5,overflow:'hidden',marginLeft:16,marginRight:16}} onPress={() => gotoUserBalanceRechargePage()}> 
                                               <Text style={{padding:2,paddingLeft:8,paddingRight:8,fontSize:13,fontWeight:'bold',color:'#0398FF'}}>提现</Text>
                                           </TouchableOpacity>

                                       </View>

                                       {/*分割线*/}
                                      <View style={{width,height:10,backgroundColor:'#F7F9FA',position:'absolute',bottom:0}}/>
         
                                        
                                </View>
                        );
                        {/*ListView的分组头部*/}
                        config.renderSectionHeader = (sectionData,sectionID) =>(
                            <View style={{flex:1,height:44,backgroundColor:'#fff',flexDirection:'row'}}> 
                                        {
                                            ['详情','金额','时间'].map((title,i)=>{
                                                return (
                                                        <Text key={i} style={{flex:1,textAlign:'center',alignSelf:'center',color:'#666666'}}>
                                                        {title}
                                                        </Text>
                                                );
                                            })
                                        }
                                {/*分割线*/}
                                <View style={{width,height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0}}/>
         
                            </View>
                        );
                        //列表每一行
                        config.renderRow = (rowData,sectionID,rowID) => {
                            let money = rowData.price;
                            if (rowData.state == 1 ){
                                money = '+' + money;
                            }
                            if (rowData.state == 2 ){
                                money = '-' + money;
                            }
                            return (
                                <View style={{flex:1,height:80,backgroundColor:'#fff',justifyContent:'center'}}>
                                    <Text style={{color:rowData.state == 1? '#f83232':'#0398FF',fontSize:16,marginLeft:16}}>{rowData.state == 1? '收入':"提现"}</Text>
                                    <View style={{flexDirection:'row',alignItems:'flex-end',marginTop:10}}>
                                        <Text style={{flex:1,color:'#333333',fontSize:14,textAlign:'left',alignSelf:'center',marginLeft:16}} numberOfLines={1}>{`${rowData.server}`}</Text>
                                        <Text style={{flex:1,color:'#333333',fontSize:14,textAlign:'center',alignSelf:'center',marginLeft:-16}}>{money}</Text>
                                       <Text style={{flex:1,color:'#333333',fontSize:14,textAlign:'center',alignSelf:'center',}}>{DateUtil.formatTimestamp(rowData.time, 'yyyy-MM-dd')}</Text>
                                    </View>

                                </View>
                            )};
                        //分割线
                        config.renderSeparator = () => (
                            <View style={{height:1,backgroundColor:'rgb(245,245,245)'}}/>
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
