import {
    Dimensions,
    Platform,
    NativeModules,
    DeviceInfo
} from 'react-native';

// IPHONE X XS
const X_WIDTH = 375;
const X_HEIGHT = 812;
// IPHONE XR XS_MAX
const XM_WIDTH = 414;
const XM_HEIGHT = 896;

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

const { PlatformConstants = {} } = NativeModules;
const { minor = 0 } = PlatformConstants.reactNativeVersion || {};

module.exports = {
    isIphoneX: function(){
        if (Platform.OS == 'web') return false;
        return (
            Platform.OS == 'ios' &&
            (
                (D_HEIGHT == X_HEIGHT && D_WIDTH == X_WIDTH) ||
                (D_HEIGHT == X_WIDTH && D_WIDTH == X_HEIGHT) ||
                (D_HEIGHT == XM_HEIGHT && D_WIDTH == XM_WIDTH) ||
                (D_HEIGHT == XM_WIDTH && D_WIDTH == XM_HEIGHT) 
            )
        );
    }
};