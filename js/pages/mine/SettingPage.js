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
import PasswordManagerPage from './PasswordManagerPage';
import FeedBackPage from './FeedBackPage';
import NoviceHelpPage from './NoviceHelpPage';
import AboutUsPage from './AboutUsPage';
import LoginApi from './../../apis/LoginApi';
import AppStore from './../../stores/AppStore';
import StorageManager from './../../configs/StorageManager';
import LoginPage from '../../pages/login/LoginPage'; 

 const { width, height } = Dimensions.get('window');

 export default class SettingPage extends React.Component{

     constructor(props){
         super(props);

        const items = {
            'section1':[ 
                {name:"密码管理"},
                {name:"清楚缓存"},
            ],
            'section2':[
                {name:"意见反馈"},
             ],
            'section3':[
                {name:"新手帮助"},
                {name:"关于我们"},
             ],
        };
        var dataSource = new ListView.DataSource( {rowHasChanged:(r1, r2) => r1!==r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2} );
        this.state = {
            dataSource: dataSource.cloneWithRowsAndSections(items),
        };

        this.renderListView = this.renderListView.bind(this);
        this.renderListSectionHeader = this.renderListSectionHeader.bind(this);
        this.renderListItem = this.renderListItem.bind(this);

      }
       gotoListChildPage(itemName){

          let { navigator } = this.props;

          if (itemName === '密码管理'){
              navigator.push({
                id:'PasswordManagerPage',
                component:PasswordManagerPage,
                passProps: {},
             });
          }

         if (itemName === '意见反馈'){
               navigator.push({
                id:'FeedBackPage',
                component:FeedBackPage,
                passProps: {},
             });
         }

         if (itemName === '新手帮助'){
               navigator.push({
                id:'NoviceHelpPage',
                component:NoviceHelpPage,
                passProps: {},
             });
         }
        
         if (itemName === '关于我们'){
               navigator.push({
                id:'AboutUsPage',
                component:AboutUsPage,
                passProps: {},
             });
         }

       }


       loginOut(){
            this.props.navigator.resetTo({
                     component: LoginPage,
            });
            LoginApi.loginOut(AppStore.userToken).then((ret)=>{                    
                    
            }).catch((err)=>{
            
            });
             StorageManager.cleanStorage();
       }



//navigatorBar
 renderNavigatorBar(){
            return (
                <View style={{height:Platform.OS === 'ios'?64:44, backgroundColor:'#0298FE', flexDirection:'row', alignItems:'flex-end', }}>
                    <TouchableOpacity style={{width:88, height:44, marginTop:20, justifyContent:'center'}} onPress={() => {this.props.navigator.pop();}}>
                            <Image style={{margin:8, width:26, height:26}} source={require('./../../images/icon_white_back.png')}/>
                    </TouchableOpacity>
                    <View style={{flex:1, height:44, alignItems: 'center', justifyContent:'center'}}>
                            <Text style={{color:'#fff', fontSize:17, fontWeight: 'bold'}}>设置</Text>
                    </View>
                    <TouchableOpacity style={{width:88, height:44, marginTop:20, justifyContent:'center', alignItems:'flex-end'}} onPress={() => {}}>
                            <Text style={{marginRight:8, fontSize:15}}></Text>
                    </TouchableOpacity>
                </View>
                    );
        }
renderListSectionHeader(sectionData, sectionID){
        return (
          <View style={{width:Dimensions.get('window').width, height:10, backgroundColor:'rgb(245,245,245)'}}/>
        );
    }
renderListItem(rowData, sectionID, rowID){
        return (
            <TouchableOpacity style={{flexDirection:'column', alignItems:'center'}} activeOpacity={0.4} onPress={() => { this.gotoListChildPage(rowData.name); }}>
                <View style={{flex:1, height:44, backgroundColor:'white', flexDirection:'row', alignItems:'center'}}>
                    <Text style={{flex:1, marginLeft:15, color:'rgb(28,28,28)'}}>{rowData.name}</Text>
                    {(sectionID=='section1' && rowID==1) ? <Text style={{width:50, color:'#999999', textAlign:'right', marginRight:4}}>1.00M</Text> : null}
                    <Image source={require('./../../images/icon_arrow.png')} style={{width:14, height:14, resizeMode:'contain', marginRight:8, backgroundColor:'white', alignSelf: 'center', }} />
                    </View>
                <View style={{width:Dimensions.get('window').width, height:0.5, backgroundColor:'rgb(239,239,244)', alignSelf:'flex-end'}}/>

            </TouchableOpacity>
            

        );
}
renderListFooterView(){
         return (
             <View style={{height:50, flexDirection:'row', alignItems:'flex-end'}}>
             <TouchableOpacity style={{flex:1, backgroundColor:'#fff', height:40, alignItems:'center', justifyContent:'center'}} onPress={() => { this.loginOut(); }}>
                      <Text style={{ color:'#1F1F1F', fontSize:16}}>退出登录</Text>
            </TouchableOpacity>
             </View>

         );
     }    
renderListView(){
         return (
             <ListView style={{backgroundColor:'rgb(245,245,245)'}}
                       dataSource={this.state.dataSource}
                       stickySectionHeadersEnabled={false} 
                       renderFooter={() => this.renderListFooterView()}
                       renderSectionHeader={(sectionData, sectionID) => this.renderListSectionHeader(sectionData, sectionID)}
                       renderRow={(rowData, sectionID, rowID) => this.renderListItem(rowData, sectionID, rowID)} />
                       );
 }
render() {
        return (
            <View style={styles.container}>
             { this.renderNavigatorBar() }
             { this.renderListView() }
            </View>
        );
    }
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: 'rgb(245,245,245)',
  },
});
