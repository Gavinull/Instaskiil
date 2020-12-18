import React from 'react';
import {
    Modal,
    Animated,
    Dimensions,
    View,
    Image,
    TouchableOpacity,
    Text
} from 'react-native';

import StarRating from './StarRating';

let {width, height} = Dimensions.get("window");


export default class StarRatingModal extends React.Component {

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
                toValue: 200,
                duration: 500,
            }),
            Animated.timing(this.state.imageHeight, {
                toValue: 200,
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
                toValue: 150,
                duration: 200,
            }),
            Animated.timing(this.state.imageHeight, {
                toValue: 150,
                duration: 200,
            })
        ]).start(() => {
            this.props.onRequestClose();
        });

    }

    onStarRatingPress(value) {
        console.log('Rated ' + value + ' stars!');
        if(this.props.onStarRatingPress){
            this.props.onStarRatingPress(value);
        }
    }
    onConfirm(){
        if(this.props.onConfirm){
            this.props.onConfirm();
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
                            height: this.state.height
                        }}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{height:40, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize:17,color:'#4A4A4A'}}>選擇星星</Text>
                                <View style={{height:1,width:width-60,position:"absolute",bottom:0, backgroundColor:'#F7F9FA'}}/>
                            </View>
                            <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                            <StarRating
                                maxStars={5}
                                rating={this.props.rating?this.props.rating:3}
                                disabled={false}
                                starSize={30}
                                onStarChange={(value) => this.onStarRatingPress(value)}
                            />

                            </View>
                        </View>
                        <TouchableOpacity style={{height:40, alignItems: 'center', justifyContent: 'center'}} onPress={()=>{
                            this.onConfirm();
                            }}>
                            <View style={{height:1,width:width-60,position:"absolute",top:0, backgroundColor:'#F7F9FA'}}/>
                            <Text style={{fontSize:15,color:'#0084FF'}}>確定</Text>
                        </TouchableOpacity>
                    
                     </Animated.View>
                </View>
            </Modal>
        );
    }

}