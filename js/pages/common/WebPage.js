import React, { Component } from 'react';
import { View, WebView, Text, StyleSheet, Platform, Dimensions, TouchableOpacity, PanResponder, ImageBackground, Image, RefreshControl, ListView } from 'react-native';

const {width, height} = Dimensions.get('window');

export default class WebPage extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            url:this.props.url
        };
    }

    componentDidMount() {

        
    }
 
    render() {

        return (
            <View style={styles.container}> 
                <WebView style={{width:'100%', height:'100%'}} 
                     source={{uri:this.state.url}}>
    

                </WebView>
               
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

