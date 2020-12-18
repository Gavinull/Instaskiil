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
    TextInput
} from 'react-native';
 
 const {width,height} = Dimensions.get('window');

 export default class NoviceHelpPage extends React.Component{

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
                            <Text style={{color:'#fff',fontSize:17,fontWeight: 'bold'}}>新手帮助</Text>
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
    backgroundColor: 'rgb(245,245,245)',
  },
})
