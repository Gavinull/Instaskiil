
import React from 'react';
import {
    Text,
    View,
    Image
} from 'react-native';

const TabIcon = (props) => {
    // console.log(props);
    return(
        <View style={{alignItems:"center"}}>
            <Image
                source={!props.focused ? props.image : props.selectedImage}
                style={[{ height:27,width:27,marginTop:2,tintColor:props.tintColor }]}
            />
            <Text
                style={{color:props.tintColor,marginTop:2,fontSize:10}}
            >
                {props.title}
            </Text>
        </View>
    )
};


export default TabIcon;