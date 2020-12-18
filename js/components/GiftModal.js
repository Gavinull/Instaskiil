import React from 'react';
import {
    Modal,
    Animated,
    Dimensions,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

let {width, height} = Dimensions.get("window");

/**
 * 礼物modal
 */
export default class GiftModal extends React.Component {

    constructor() {
        super();
        this.state = {
            height: new Animated.Value(0),
            imageHeight: new Animated.Value(0),
            // top: new Animated.Value(height / 2),
            // bottom: new Animated.Value(height / 2),
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible && (nextProps.visible != this.props.visible)) {
            this.showView()
        }
    }

    showView() {
        // Animated.parallel([
        //     Animated.timing(this.state.top,{toValue: 85,duration: 500}),
        //     Animated.timing( this.state.bottom,{toValue: height - 85,duration:500}),
        //     Animated.timing(this.state.height, {toValue: height - 170, duration: 500,})
        // ]).start();
        Animated.parallel([
            Animated.timing(this.state.height, {
                toValue: height - 170,
                duration: 500,
            }),
            Animated.timing(this.state.imageHeight, {
                toValue: height - 180,
                duration: 500,
            })
        ]).start();
    }

    onRequestClose() {
        // Animated.parallel([
        //     Animated.timing(this.state.top,{toValue: height / 2,duration: 300}),
        //     Animated.timing( this.state.bottom,{toValue: height / 2,duration:300}),
        //     Animated.timing(this.state.height, {toValue: 0, duration: 300,})
        // ]).start(
        //     () => { this.props.onRequestClose() }
        // );
        Animated.parallel([
            Animated.timing(this.state.height, {
                toValue: 0,
                duration: 300,
            }),
            Animated.timing(this.state.imageHeight, {
                toValue: 0,
                duration: 300,
            })
        ]).start(() => {
            this.props.onRequestClose();
        });

    }

    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    this.onRequestClose()
                }}
            >
                <View style={{flex: 1}}>
                    <TouchableOpacity style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    }} activeOpacity={1} onPress={() => this.onRequestClose()}>
                        <Animated.View style={{
                            backgroundColor: 'white',
                            borderRadius: 10,
                            width: width - 60,
                            margin: 30,
                            padding: 5,
                            height: this.state.height
                        }}>
                            <Animated.Image style={{height: this.state.imageHeight, width: width - 70}}
                                   resizeMode={'stretch'}
                                   source={{uri: "https://ws1.sinaimg.cn/large/610dc034ly1fh7hwi9lhzj20u011hqa9.jpg"}}/>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

}