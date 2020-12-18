'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    Image
} from 'react-native';

import Swiper from 'react-native-swiper';
import SplashScreen from 'react-native-splash-screen';
import TabBarContainer from '../configs/TabBarContainer';
import StorageManager from '../configs/StorageManager';
import AppStore from '../stores/AppStore';
import LoginPage from '../pages/login/LoginPage'; 
let {width, height} = Dimensions.get('window');

const images = [
    require('./../images/guide_page1.jpg'),
    require('./../images/guide_page2.jpg'),
    require('./../images/guide_page3.jpg')
];

export default class GuidePage extends React.Component {

        constructor(props){
            super(props);
            this.state ={
                isFirstOpen: false
            };
        }

    componentDidMount() {
        StorageManager.loadObjectWithKey("kGuidePage").then((data) => {
            setTimeout(() => {
                SplashScreen.hide();
                this.resetNavComponent();
            }, 1000);
        }).catch((error) => {
            SplashScreen.hide();
            this.setState({
               isFirstOpen: true
            });
        })
    }

        resetNavComponent = () => {
            if(AppStore.userToken.length>0){
                this.props.navigator.resetTo({
                     component: TabBarContainer,
                });
            }else{
                this.props.navigator.resetTo({
                     component: LoginPage,
                });
            }
            
        };

        renderCloseButton(){
            return (
                <TouchableOpacity   style={styles.closeBtn}
                                    activeOpacity={0}
                                    onPress={() => {
                                        StorageManager.saveObject('kGuidePage', {isFirstOpen: false});
                                        this.resetNavComponent();
                                    }}>
                </TouchableOpacity>
            );
        }

        render() {
            return (
                <View style={{flex: 1,}}>
                    {
                        this.state.isFirstOpen ? <Swiper showsButtons={false}
                                                         loop={false}
                                                         showsPagination={false}
                        >
                            {
                                images.map((path, i) => {
                                    return (
                                        <View key={i} style={styles.imageContainer}>
                                            <Image style={{flex:1, resizeMode:'contain'}} source={path}>
                                            </Image>
                                            {
                                               i == images.length-1 ? this.renderCloseButton():null
                                            }
                                        </View>
                                    );
                                })
                            }
                        </Swiper> : <View style={{flex: 1, backgroundColor: 'white'}}/>
                    }
                </View>
            );
        }

}

let styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        overflow:'hidden'
    },
    closeBtn: {
        width:200,
        height:100,
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center'
    }
});
