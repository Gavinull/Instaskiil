import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    Image
} from 'react-native';

let {width, height} = Dimensions.get('window');

export default class LaunchPage extends React.Component {

        render() {
            return (
                <View style={{flex: 1}}>
                    {/* <Image style={styles.image} source={require("./../../resources/img/LaunchScreen.png")}></Image> */}
                </View>
            );
        }

}

let styles = StyleSheet.create({
    image: {
       flex:1, 
       backgroundColor: '#fff',
       resizeMode:'contain',
       width:width,
       height:height
    }
});
