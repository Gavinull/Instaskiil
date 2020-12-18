
import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Text,
    Image,
    TouchableOpacity,
    TabBarIOS,
    Vibration
} from 'react-native'
import TabNavigator  from 'react-native-tab-navigator';
// import ShopPage      from './../pages/shop/ShopPage';
import MinePage      from './../pages/mine/MinePage';
// import OrderPage     from './../pages/order/OrderPage';

import HomePage     from './../pages/home/HomePage';

const titleSize = 11;
const normalTitleColor = '#ADADAD';
const selectTitleColor = '#0398ff';
const tabBarItems = [
      { 
        title:     "首页", 
        component: HomePage,
        icon: () =>        <Image source={require('./../images/tab_icon_home_normal.png')} style={styles.tabBarIconSize}/> , 
        selectedicon:() => <Image source={require('./../images/tab_icon_home_clik.png')}   style={styles.tabBarIconSize}/>
      },
      { 
        title:     "我的", 
        component: MinePage,
        icon: () =>        <Image source={require('./../images/tab_icon_mine_normal.png')} style={styles.tabBarIconSize}/> ,
        selectedicon:() => <Image source={require('./../images/tab_icon_mine_clik.png')}   style={styles.tabBarIconSize}/>},
]

export default class TabBarContainer extends React.Component {

        constructor(props){
             super(props);
             this.state = {
                 selectedTab:tabBarItems[0].title,
            };
        };

        render() {
              return (
                <View style={styles.container}>
                  { this.renderTabBarView() }
                </View>
              );
        }
         
        renderTabBarView(){

              return (
                   <TabNavigator tabBarStyle={styles.tabBarStyle} tabBarShadowStyle={styles.tabBarShadowStyle}>
                    
                     {
                        tabBarItems.map((controller, i) => {
                            return (                                  
                                  <TabNavigator.Item  key= {i}
                                                      title= {controller.title}
                                                      titleStyle= {{color:normalTitleColor, fontSize:titleSize,marginBottom:5}}
                                                      selected= {this.state.selectedTab === controller.title}
                                                      selectedTitleStyle= {{color:selectTitleColor, fontSize:titleSize,marginBottom:5}}
                                                      renderIcon= {controller.icon}
                                                      renderSelectedIcon = {controller.selectedicon}
                                                      onPress={() => {                                                        
                                                                    this.setState({
                                                                    selectedTab:controller.title,
                                                                  })
                                                            }}
                                                      >
                                        <controller.component {...this.props}/>                                                                                                            
                                  </TabNavigator.Item>
                                )
                          })
                      }

                    </TabNavigator>
              )
           }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarStyle:{
    height:50,
    backgroundColor:'rgb(255,255,255)',
    borderWidth: 0,
    borderColor:'rgb(245,245,245)',
    elevation: 20,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  tabBarShadowStyle:{
    backgroundColor:'rgba(0,0,0,0)',

  },
  tabBarIconSize:{
    width:22,
    height:22,
    resizeMode:'contain',
  }
});


