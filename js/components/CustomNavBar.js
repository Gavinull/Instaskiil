import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Actions } from 'react-native-router-flux';
import { isIphoneX } from "./../utils/ScreenUtil";

const hideNavBarBackSceneArr = ["_Student_home", "_Teacher_home", "_MinePage"]; 


const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? (isIphoneX() ? 88:64): 54,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
    paddingTop: 20,
  }
});

export default class CustomNavBar extends React.Component {
  constructor(props) {
    super(props);

  }

  componentWillMount(){

  }

  _renderLeft() {
    return (
      <TouchableOpacity onPress={()=>{

        this.props.customBackAction ? this.props.customBackAction():Actions.pop();

        }} style={{position:"absolute", left:10, bottom:0,width:88, height:44,justifyContent:'center'}}>
        <Image style={{ width: 30, height: 50 }} resizeMode="contain" source={require("./../resources/img/nav_black_back.png")} />
      </TouchableOpacity>
    );
  }

  _renderMiddle() {
    return (
      <View style={{position:"absolute", bottom:0, height:44, justifyContent:'center'}}>
        <Text style={{color:'#141414', fontSize:17, fontWeight: 'bold'}}>{this.props.title}</Text>
      </View>
    );
  }


  render() {
    let dinamicStyle = {backgroundColor: '#fff'};
   
    return (
      <View style={[styles.container, dinamicStyle]}>
        {this.props.hideBack ?null:this._renderLeft()}
        {this._renderMiddle()}
        {this.props.renderRightView?this.props.renderRightView():null}
      </View>
    );
  }
}
