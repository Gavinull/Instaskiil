import React from 'react';
import {
    Modal,
    Animated,
    Dimensions,
    View,
    Image,
    TouchableOpacity,
    Text,
    TextInput
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

let {width, height} = Dimensions.get("window");


export default class SettingQuestionTiltleModal extends React.Component {

    constructor() {
        super();
        this.state = {
            height: new Animated.Value(0),
            marginBottom:new Animated.Value(height),
            defaultValue:''
        };
        Animated.timing(this.state.marginBottom, {
            toValue: -height,
            duration: 200,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible && (nextProps.visible != this.props.visible)) {
            this.showView();
        }
    }

    

    showView() {
        // Animated.parallel([
        //     Animated.timing(this.state.top,{toValue: 85,duration: 500}),
        //     Animated.timing( this.state.bottom,{toValue: height - 85,duration:500}),
        //     Animated.timing(this.state.height, {toValue: height - 170, duration: 500,})
        // ]).start();
        // Animated.parallel([
        //     Animated.timing(this.state.marginBottom, {
        //         toValue: 0,
        //         duration: 100,
        //     }),
        //     // Animated.timing(this.state.imageHeight, {
        //     //     toValue: 200,
        //     //     duration: 500,
        //     // })
        // ]).start();
    }

    onRequestClose() {
        // Animated.parallel([
        //     Animated.timing(this.state.top,{toValue: height / 2,duration: 300}),
        //     Animated.timing( this.state.bottom,{toValue: height / 2,duration:300}),
        //     Animated.timing(this.state.height, {toValue: 0, duration: 300,})
        // ]).start(
        //     () => { this.props.onRequestClose() }
        // );
        // Animated.parallel([
        //     Animated.timing(this.state.marginBottom, {
        //         toValue: -height,
        //         duration: 100,
        //     }),
        //     // Animated.timing(this.state.imageHeight, {
        //     //     toValue: 150,
        //     //     duration: 200,
        //     // })
        // ]).start(() => {
            this.props.onRequestClose();
        // });

    }

    onStarRatingPress(value) {
        console.log('Rated ' + value + ' stars!');
        if(this.props.onStarRatingPress){
            this.props.onStarRatingPress(value);
        }
    }
    onConfirm(text){
        if(this.props.onConfirm){
            this.props.onConfirm(text);
        }

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
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        position:"absolute",
                        width:width,
                        height:height,
                    }} activeOpacity={1} onPress={() => this.onRequestClose()}/>
                       
                    <Animated.View style={{
                            backgroundColor: 'white',
                            borderRadius: 10,
                            width: width - 60,
                            margin: 30,
                            padding: 5,
                            height: 200,
                            marginBottom: 0,
                        }}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{height:40, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize:17,color:'#4A4A4A'}}>起標題</Text>
                                <View style={{height:1,width:width-60,position:"absolute",bottom:0, backgroundColor:'#F7F9FA'}}/>
                            </View>
                            <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                           
                            <TextInput
                                style={{
                                    flex:1,
                                    color: '#333333',
                                    fontSize: 15,
                                    backgroundColor: '#fff',
                                    padding: 10,
                                    margin:10,
                                    width: width - 60 - 20,

                                }}
                                multiline={true}
                                underlineColorAndroid={'transparent'}
                                placeholderTextColor={'#999999'}
                                placeholder={"輸入標題名稱"}
                                defaultValue={this.state.defaultValue}
                                onChangeText={(txt) => {
                                    this.state.defaultValue = txt;
                                    {/* this.props.onChangeText ? this.props.onChangeText(txt):null; */}
                                }}
                                keyboardType={'default'}
                            />
                            

                            </View>
                        </View>
                        <TouchableOpacity style={{height:40, alignItems: 'center', justifyContent: 'center'}} onPress={()=>{
                            this.onConfirm(this.state.defaultValue);
                            }}>
                            <View style={{height:1,width:width-60, position:"absolute",top:0, backgroundColor:'#F7F9FA'}}/>
                            <Text style={{fontSize:15,color:'#0084FF'}}>確定</Text>
                        </TouchableOpacity>
                    
                     </Animated.View>
                     <KeyboardSpacer/>
                </View>
            </Modal>
        );
    }

}