import React, { Component } from 'react';
import { View, Text, Keyboard,TextInput, StyleSheet,Platform,Dimensions,TouchableOpacity,PanResponder,ImageBackground,Image } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Actions } from 'react-native-router-flux';
import AppStore from '../../stores/AppStore';
import { isIphoneX } from './../../utils/ScreenUtil';
import {EditorQuestionPageStore} from '../../stores/CommonStore';
import { observer } from 'mobx-react/native';
import RandomUtil from '../../utils/RandomUtil';
import ActionSheet from 'react-native-actionsheet-api';
import Spinner from 'react-native-loading-spinner-overlay';
//录音组件
import {AudioRecorder, AudioUtils} from 'react-native-audio';
// 播放声音组件
import Sound from 'react-native-sound'; 
import Video from 'react-native-video'

import CustomNavBar   from '../../components/CustomNavBar';

const {width, height} = Dimensions.get('window');

@observer
export default class EditorQuestionPage extends Component {
   
    constructor(props) {
        super(props);
        this.closekeyboard();
        this.pageStore = new EditorQuestionPageStore();
        this.pageStore.editorType   = this.props.editorType 
        this.pageStore.questionID   = this.props.id
        this.pageStore.lastPageStore = this.props.lastPageStore 
        this.pageStore.subjectsType = this.props.subjectsType       
        this.pageStore.gradeType    = this.props.gradeType 

        if(AppStore.roleType == AppStore.Enum_RoleType.students){
            if(this.pageStore.editorType == AppStore.Enum_EidtorQuestionType.create){
                this.pageStore.navTiltle = "添加提問內容";
                this.pageStore.submitButtonName = "發佈";
                this.pageStore.bottomTipsText = "請描述你的提問內容...";

            }
            if(this.pageStore.editorType == AppStore.Enum_EidtorQuestionType.eidtor){
                this.pageStore.navTiltle = "添加追問內容";
                this.pageStore.submitButtonName = "提交";
                this.pageStore.bottomTipsText = "請描述你的追問內容...";
            }
        }

        if(AppStore.roleType == AppStore.Enum_RoleType.teacher){
            this.pageStore.navTiltle = "添加回答內容";
            this.pageStore.submitButtonName = "提交";
            this.pageStore.bottomTipsText = "請描述你的回答內容...";

        }

        console.log(this);
        console.log(this.pageStore);

        
        
    }

    closekeyboard() {
        this.pan = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (e, gestureState) => {
                TextInput
                    .State
                    .blurTextInput(TextInput.State.currentlyFocusedField());
            }
        });
    }

    componentDidMount() {

        // this._resetNavigatorBar()
        AudioRecorder.requestAuthorization((data)=>{
            console.log(data)
        }).catch((error)=>{
            console.log(error)
        })
        
    }

    componentWillUnmount() {
        if(this.pageStore.soundPlayer){
             this.pageStore.soundPlayer.release();
        }
        if(this.pageStore.isAudioRecording == true || this.pageStore.isAudioRecordPause==true){
            AudioRecorder.stopRecording();
        }

    }

    componentWillReceiveProps(nextProps) {
        console.log("nextProps:",nextProps)
        if(nextProps.videoFilePath) {
            this.pageStore.videoFilePath = nextProps.videoFilePath
            console.log("videoFilePath:", this.pageStore.videoFilePath)
        }

        if(nextProps.chooseTeacher) {
            this.pageStore.chooseTeacher = nextProps.chooseTeacher
            console.log("chooseTeacher:", this.pageStore.chooseTeacher)

        }

        
    }
   
    // _resetNavigatorBar(){
    //     let _this = this
    //     setTimeout(function() {
    //         Actions.refresh({
    //             rightTitle: '发布',
    //             rightButtonTextStyle:{color:"#0084FF"},
    //             onRight: () => {
    //                 _this.pageStore.submitQuestionAction()
    //                 // Actions.QuestionDetailsPage()
    //             }
    //         });
    //     }, 1);

    // }

    render() {

    //    var reducer = function add(sumSoFar, item) { return parseFloat(sumSoFar) + parseFloat(item); };
    //    let  Total =  this.pageStore.uploadProgressTotalArr.reduce(reducer, 0.0);
    //    console.log("Total:", Total);
    //    let  Written =  this.pageStore.uploadProgressWrittenArr.reduce(reducer, 0.0);
    //    console.log("Written:", Written);

        // console.log(this.pageStore.editorType);
        return (
            <View style={styles.container} {...this.pan.panHandlers}>
                {this.renderNavigatorBar()}
                {this.renderInputView()}
                {this.renderSourceView()}
                {
                    this.pageStore.editorType == AppStore.Enum_EidtorQuestionType.create ? this.renderChooseTeacherView():null
                }
                {/* {this.renderBottomView()} */}
                <Spinner
                    visible={this.pageStore.loading}
                    textContent={this.pageStore.uploadProgressText}
                    textStyle={{color:"#FFF", fontSize:15}}
                    />
            </View>
        );
    }

    renderNavigatorBar(){
        let _this = this;
        return (
            <CustomNavBar title={this.pageStore.navTiltle}
            renderRightView={() => {
                    return (
                        <TouchableOpacity style={{width:60, height:44, position:"absolute", right:10, bottom:0,height:44, justifyContent:'center', alignItems:"flex-end"}}
                            onPress={() => {
                                Keyboard.dismiss();
                                _this.pageStore.submitQuestionAction();
                            }}>
                            <Text style={{fontSize:15, color:"#0084FF"}}>{this.pageStore.submitButtonName}</Text>
                        </TouchableOpacity>
                    );
                }}
                />
            );
    }

    renderInputView(){
        return(
            <View>
                <TextInput
                    style={{
                        color: '#333333',
                        fontSize: 15,
                        backgroundColor: 'white',
                        paddingVertical: 0,
                        padding: 10,
                        margin:10,
                        height: 150
                    }}
                    onChangeText={(text) => {
                        this.pageStore.questionText = text;
                    }}
                    multiline={true}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor={'#999999'}
                    placeholder={"輸入內容"}
                    defaultValue={""}
                    keyboardType={'default'}
                />
                <View style={{ height: 1,marginLeft:20,marginRight:20, backgroundColor: 'rgba(151,151,151,0.2)'}}/> 
            </View>
        )
    }

    renderSourceView(){

        let { imageFilePath, videoFilePath, audioFilePath ,isAudioRecording,isAudioRecordPause,audioRecordCurrentTime} = this.pageStore

        let item_width_height = {height:80, width:80};

        return(
                 <View style={{marginTop:20,marginLeft:20,marginRight:20,flexDirection:'row',flexWrap: 'wrap',alignItems: 'center',justifyContent:"space-between"}}>
                    
                    {/* 图片 */}
                    <TouchableOpacity style={{backgroundColor: '#fff',alignItems: 'center',justifyContent: 'center',borderRadius:3, overflow:"hidden"}}
                    onPress={() => {
                        this.pageStore.crteateQuestionImage()
                    }}>
                        <ImageBackground style={{...item_width_height}} source={require('../../resources/img/icon_add_image.png')}>
                        {
                            imageFilePath ? (<Image style={{...item_width_height}} source={{uri:imageFilePath}}/>):null
                        }
                        </ImageBackground>
                    </TouchableOpacity>
    
                    {/* 视频 */}
                    <TouchableOpacity style={{...item_width_height, backgroundColor: videoFilePath ? '#000':"#fff",alignItems: 'center',justifyContent: 'center',borderWidth:videoFilePath?1:0,borderColor:"#979797",borderRadius:3, overflow:"hidden"}}
                    onPress={() => {
                        this.pageStore.crteateQuestionVideo();
                    }}>
                        {
                            videoFilePath ? (
                                <Video style={{...item_width_height, backgroundColor: '#000'}} source={{uri:videoFilePath?videoFilePath:"http://rs.majiawei.com/"}}
                                    ref={(ref) => {
                                        this.pageStore.videoPlayer = ref
                                    }}
                                    paused={true}
                                    playInBackground = { false }
                                    />
                            ):(
                                <ImageBackground style={{height:videoFilePath?40:item_width_height.width, width:videoFilePath?40:item_width_height.height}} source={require('../../resources/img/icon_add_video.png')}/>
                            )
                        }
                        {
                            videoFilePath ? (
                                <Image style={{position:"absolute", height:45, width:45}} source={require("../../resources/img/icon_video_play_beforeImage.png")}/>
                            ):null
                        }

                    </TouchableOpacity>
    
                    {/* 录音 */}
                    <TouchableOpacity style={{...item_width_height, backgroundColor: '#fff',alignItems: 'center',justifyContent: 'center',borderWidth:(audioFilePath || isAudioRecording || isAudioRecordPause)?1:0,borderColor:"#979797",borderRadius:3, overflow:"hidden"}}
                    onPress={() => {
                        this.pageStore.crteateQuestionAudio()
                    }}>
                        <ImageBackground style={{height:(audioFilePath || isAudioRecording || isAudioRecordPause)?40:item_width_height.height, width:(audioFilePath || isAudioRecording || isAudioRecordPause)?40:item_width_height.width}} source={require('../../resources/img/icon_add_audio.png')}/>
                        {
                            
                            (audioFilePath || isAudioRecording || isAudioRecordPause) ? (<Text style={{fontSize:12,color:"#4A4A4A"}}>{audioRecordCurrentTime + "s"}</Text>):null
    
                        }
                    </TouchableOpacity>
                                    
                </View>

        )
    }

    renderChooseTeacherView(){
        return(
            <TouchableOpacity style={{height:52,marginTop:20,flexDirection:'column', alignItems:'center'}} activeOpacity={0.4} onPress={() => {
                     Actions.ChooseTeacherListPage({lastPageStore:this.pageStore, subject_id:this.pageStore.subjectsType})
                 }}>
                    <View style={{flex:1, backgroundColor:'white', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{flex:1, marginLeft:20, color:'rgb(28,28,28)'}}>{this.pageStore.chooseTeacher.id?this.pageStore.chooseTeacher.name:"邀請老師來回答"}</Text>
        
                        <Image source={require('../../resources/img/icon_arrow.png')} style={{width:14, height:14, resizeMode:'contain', marginRight:20, backgroundColor:'white', alignSelf: 'center', }} />
                        
                    </View>
                    <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',bottom:0,left:20,right:20}}/>
             </TouchableOpacity>
        )
    }

    renderBottomView(){

        return(
             <View style={{position:'absolute',width:width,height:50,bottom:isIphoneX() ? 30:0,flexDirection:"row",alignItems:"center"}}>
                    <View style={{height:1,width:width,backgroundColor:'rgb(245,245,245)',position:'absolute',top:0}}/>
                    <Text style={{flex:1, marginLeft:20, color:'#4A4A4A'}}>{this.pageStore.bottomTipsText}</Text>
              </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

