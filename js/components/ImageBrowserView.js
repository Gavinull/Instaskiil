import React, { Component } from 'react';
import { View, Text,TextInput, StyleSheet,Platform,Dimensions,TouchableOpacity,PanResponder,ImageBackground,Image,ScrollView,RefreshControl,ListView,Modal } from 'react-native';
import { AlbumView } from 'teaset';

export default class ImageBrowserView extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            images:this.props.images
        };
    }

    render(){   
        return (
            <View style={styles.container}> 
                <AlbumView
                    style={{flex:1}}
                    control={true}
                    images={this.state.images}
                />
            </View>
        );
    }    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});

