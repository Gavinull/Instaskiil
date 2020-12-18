import React from 'react';
import {BackAndroid, Platform} from 'react-native';
import {Navigator} from "react-native-deprecated-custom-components" 
import LoginPage from '../pages/login/LoginPage'; 

export default class NavBarContainer extends React.Component {

    componentDidMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnMount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    onBackAndroid = ()=> {
        const nav = this.refs['navigator'];
        if (nav === undefined) return false;
        const routers = nav.getCurrentRoutes();
        if (routers.length > 1) {
            nav.pop();
            return true;
        }
        return false;
    };

    render() {

        let {component, store} = this.props;

        return (
            <Navigator ref="navigator"
                       initialRoute={{component: component}}
                       configureScene={(route) => {
                            if (route.type === 'Modal') {
                               return route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.FloatFromBottom;
                            } else {
                               return route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.PushFromRight;
                            }
                       }}
                       renderScene={(route, navigator) => {
                           return (
                                <route.component navigator={navigator} 
                                                 route={route}
                                                 store={store} 
                                                 {...route.passProps} 
                                />
                           );
                       }}
            />
        );
    }
}
