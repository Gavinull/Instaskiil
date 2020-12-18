import React, { Component } from 'react';
import { View, Text, Alert, TextInput, StyleSheet,Platform,Dimensions,TouchableOpacity,PanResponder,ImageBackground,Image,ScrollView,RefreshControl,ListView,Modal } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Actions } from 'react-native-router-flux';
import AppStore from '../../stores/AppStore';
import { isIphoneX } from './../../utils/ScreenUtil';
import {QuestionDetailsPageStore} from '../../stores/CommonStore';
import { observer } from 'mobx-react/native';
import Video from 'react-native-video'
import ActionSheet from 'react-native-actionsheet-api';

import CustomNavBar from './../../components/CustomNavBar';


import StarRatingModal from './../../components/StarRatingModal'
import SettingQuestionTiltleModal from './../../components/SettingQuestionTiltleModal'
import CountDownTimer from './../../components/CountDownReact';


const {width, height} = Dimensions.get('window');
const navHeigth = Platform.OS === 'ios' ? (isIphoneX() ? 88:64): 54;

@observer
export default class QuestionDetailsPage extends Component {
   
    constructor(props) {
        super(props);
        this.pageStore = new QuestionDetailsPageStore();
        this.pageStore.id   = this.props.id;

    }

    componentWillMount(){

        this.pageStore.requstQuestionDetail(true); 

        // this._resetNavigatorBar();
    }

    componentWillUnmount() {
        if(this.pageStore.soundPlayer){
            //  this.pageStore.soundPlayer.release();
        }
    }

    //刷新列表
    _onRefresh = () =>{
        this.pageStore.requstQuestionDetail(true); 
    }

    // _resetNavigatorBar(){
    //     let _this = this
    //     setTimeout(function() {
    //         Actions.refresh({
    //             rightTitle: '. . .',
    //             title:'推薦問答',
    //             renderRightButton:(<Text>Right</Text>),
    //             rightButtonTextStyle:{color:"#141414"},
    //             onRight: () => {
    //                 console.log(11111111111111111111111)

    //             },
    //             onExit:() =>{
    //                 console.log(11111111111111111111111)
    //             }
                
    //         });
    //     }, 1);

    // }

    //navigatorBar
 renderNavigatorBar(){
     let {isRenderRightViewType } = this.pageStore;
     let { is_collected } = this.pageStore.detailData;

    return (
        <CustomNavBar title={"問答詳情"}
        renderRightView={() => {
                if (isRenderRightViewType == 1){
                    return (
                        <TouchableOpacity style={{width:60, height:44, position:"absolute", right:10, bottom:0,height:44, justifyContent:'center', alignItems:"flex-end"}}
                            onPress={() => {
                                this.pageStore.navRightViewAction();
                            }}>
                            <Image style={{width:40, height:30}} source={require("./../../resources/img/nav_more.png")}/>
                        </TouchableOpacity>
                    );
                }
                if (isRenderRightViewType == 2){
                    return (
                        <TouchableOpacity style={{width:60, height:44, position:"absolute", right:10, bottom:0,height:44, justifyContent:'center', alignItems:"flex-end"}}
                            onPress={() => {
                                this.pageStore.navRightViewAction();
                            }}>
                            <Image style={{width:20, height:20, resizeMode:'contain'}} source={ is_collected ?  require("./../../resources/img/nav_is_collected.png"):require("./../../resources/img/nav_un_collected.png")}/>
                        </TouchableOpacity>
                    );
                }
                return null;
            }}
            customBackAction= {() =>{

                let self = this;
                setTimeout(function() {
                    if(self.props.popToName){
                        Actions.popTo(self.props.popToName);
                    }else{
                        Actions.pop();
                    }
                }, 1); 
                

            }}
            />
        );
    }


 
    render() {

        let { 
            detailData,
            questionInfo,
            replyDataSource,
            isRefreshing,
            isShowCountdownTimer,
            soundPlayerCurrentPlayingUrlProgress
        } =  this.pageStore;

        return (
            <View style={styles.container}> 

                {/* 不要删除,用于音频倒计时显示, 我也不懂原理 */}
                <Text style={{fontSize:1, color:"#fff"}}>{ soundPlayerCurrentPlayingUrlProgress }</Text>

                {this.renderNavigatorBar()}

                {questionInfo ? this.renderListView():null}
                {this.renderBottomButton()}
                <Video source={{uri:this.pageStore.playerCurrentUrl}}
                    ref={(player) => {
                        this.pageStore.player = player;
                    }}
                    paused={true}
                >
                </Video> 

                <Video source={{uri:this.pageStore.soundPlayerCurrentPlayingUrl ? this.pageStore.soundPlayerCurrentPlayingUrl:"http://rs.majiawei.com/"}}
                    ref={(soundPlayer) => {
                        this.pageStore.soundPlayer = soundPlayer;
                    }}
                    paused={this.pageStore.soundPlayerPaused}
                    onLoad={this.pageStore.playAudio_onLoad}
                    onProgress={this.pageStore.playAudio_onProgress}//视频播放过程中每个间隔进度单位调用的回调函数
                    onEnd={this.pageStore.playAudio_end}//视频播放结束时的回调函数
                    onFullscreenPlayerDidDismiss={this.pageStore.playAudio_onFullscreenPlayerDidDismiss}  // 全屏停止后的回调
                    repeat={false}
                ></Video>
                
                <StarRatingModal 
                         visible={this.pageStore.isShowStarRatingModal} 
                        onRequestClose={() =>{this.pageStore.isShowStarRatingModal = false;}}
                        rating={this.pageStore.starRating}
                        onStarRatingPress={(star)=>{ this.pageStore.starRating = star;}}
                        onConfirm={()=>{
                            this.pageStore.isShowStarRatingModal = false;
                            this.pageStore.requestEvaluate();
                        }}
                        /> 

                 <SettingQuestionTiltleModal 
                         visible={this.pageStore.isShowSettingTiltleModal} 
                        onRequestClose={() =>{this.pageStore.isShowSettingTiltleModal = false;}}
                        onConfirm={(text)=>{
                            this.pageStore.isShowSettingTiltleModal = false;
                            this.pageStore.requestSettingQuestionTiltle(text);
                        }}
                        />
                  {isShowCountdownTimer?this.renderCountDownTimer():null}                           
            </View>
        );
    }

    //ListView
    renderListView(){

        let { 
            detailData,
            questionInfo,
            replyDataSource,
            isRefreshing,
            isStudentWaitingAnswerTips
        } =  this.pageStore;
        
        let config={};

        config.renderHeader = () => (

                <View style={{flex:1,borderRadius:8,backgroundColor:'#fff',margin:32,marginBottom:5,marginTop:10}}>
                        <View style={{height:40,borderRadius:8,flexDirection:'row',alignItems:'center',backgroundColor:'#fff'}}>
                            <View style={{height:22, alignItems:'center',justifyContent:'center',backgroundColor:questionInfo.grade_color, borderColor:questionInfo.grade_color, borderRadius:11,borderWidth:1,overflow:'hidden',}} >
                                    <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:'#fff'}}>{questionInfo.grade}</Text>
                            </View>
                            <View style={{height:22,marginLeft:12,alignItems:'center',justifyContent:'center',borderColor:questionInfo.subject_color, borderRadius:11,borderWidth:1,overflow:'hidden',}}>
                                    <Text style={{padding:0,paddingLeft:12,paddingRight:12,fontSize:10,color:questionInfo.subject_color}}>{questionInfo.subject}</Text>
                            </View>

                            <Text style={{position:'absolute',right:0,fontSize:10,color:'#4A4A4A'}}>{`${ global.DateUtil.formatTimestamp( parseInt(questionInfo.created_at),  "yyyy年MM月dd日hh:mm") }`}</Text>
                        </View>
                        <Text style={{fontSize:15,marginBottom:12,marginTop:5,color:'#4A4A4A'}}>{detailData.questioner_name}</Text>

                        <Text style={{fontSize:12,marginBottom:12,marginTop:5,color:"#4A4A4A"}}>{questionInfo.content}</Text>

                        {this.renderSourceView({attach_image:questionInfo.attach_image,attach_video:questionInfo.attach_video,attach_audio:questionInfo.attach_audio,attach_audio_time:questionInfo.attach_audio_time})}



                        {/* 是否有老師回答 */}
                        {
                            isStudentWaitingAnswerTips ? (<View style={{height:50,marginTop:20,flexDirection:"row",alignItems:"center"}}>
                                <View style={{height:1,backgroundColor:'rgb(245,245,245)',position:'absolute',top:0,right:0,left:0}}/>
                                <Text style={{flex:1, color:'#4A4A4A',textAlign:"right"}}>{isStudentWaitingAnswerTips}</Text>
                            </View>):null
                        }

                         {
                            detailData.reply.length>0  ? (<View style={{height:1,marginTop: 20,backgroundColor:'rgb(230,230,230)'}}/>):null
                        }

                        
                </View>
        );

        //listView row
        config.renderRow = (rowData,sectionID,rowID) => (
            <View style={{flex:1,borderRadius:8,backgroundColor:'#fff',margin:32,marginBottom:15,marginTop:0}}>
                    <View style={{height:40,borderRadius:8,flexDirection:'row',alignItems:'center',backgroundColor:'#fff'}}>
                            <Text style={{position:'absolute',left:0,fontSize:15,color:'#4A4A4A'}}>{rowData.username}</Text>

                            <Text style={{position:'absolute',right:0,fontSize:10,color:'#4A4A4A'}}>{`${ global.DateUtil.formatTimestamp( parseInt(rowData.created_at),  "yyyy年MM月dd日hh:mm") }`}</Text>
                    </View>
                    <Text style={{fontSize:12,marginBottom:12,color:"#4A4A4A"}}>{rowData.content}</Text>

                    {this.renderSourceView({attach_image:rowData.attach_image,attach_video:rowData.attach_video,attach_audio:rowData.attach_audio,attach_audio_time:rowData.attach_audio_time})}
            </View>
        );
        config.renderSeparator = () => (
            <View style={{height:1,marginLeft:32,marginRight:32,backgroundColor:'rgb(245,245,245)'}}/>
        );
        config.renderFooter = () => (
            <View style={{height:20, backgroundColor:'#fff'}}/>
        );

        config.refreshControl =  (
            <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this._onRefresh}
                tintColor="#333"
                title= {''}
                titleColor="#333"
                colors={['#333', '#333', '#333']}
                progressBackgroundColor="white"/>
        );


        return (
                <ListView  
                    style={{flex:1,backgroundColor:'#fff'}}    
                    enableEmptySections={true}
                    removeClippedSubviews={false}
                    dataSource={replyDataSource} 
                    {...config}
                />
        );
    }

    renderSourceView(source){
        let { 
            attach_image,
            attach_video,
            attach_audio,
            attach_audio_time
        } = source;

        let {
            soundPlayerCurrentPlayingUrl,
            soundPlayerCurrentPlayingUrlProgress
        } = this.pageStore;
        
        let item_width_height = {height:80, width:80};
        let sourceViewW = width-32-32;
        let arr = [attach_image, attach_video, attach_audio].filter((item)=>{ if(item != null || item != ""){return item;}});
        if(arr.length == 2){
            sourceViewW = sourceViewW - item_width_height.width - ((sourceViewW-80*3)/2);
        }

        return(
            <View style={{width:sourceViewW, marginTop:0,flexDirection:'row',flexWrap: 'wrap',alignItems: 'center',justifyContent:"space-between"}}>
                    
                    {/* 图片 */}
                    {
                        attach_image ?
                        (
                            <TouchableOpacity style={{...item_width_height, backgroundColor: '#fff',alignItems: 'center',justifyContent: 'center',borderWidth:0,borderColor:"#979797",borderRadius:3, overflow:"hidden"}}
                                    onPress={() => {
                                        Actions.ImageBrowserView({images:[{uri:attach_image}]})

                            }}>
                                <ImageBackground style={{...item_width_height}} source={require("./../../resources/img/image_background_default_square.png")}>
                                   <Image style={{...item_width_height}} source={{uri:attach_image?attach_image:""}}/>                                    
                                </ImageBackground>
                            </TouchableOpacity>
                        )
                        :null
                    }
                    
                    {/* 视频 */}
                    {
                        attach_video ?
                        (
                            <TouchableOpacity style={{...item_width_height, backgroundColor: '#000',alignItems: 'center',justifyContent: 'center',borderWidth:1,borderColor:"#979797",borderRadius:3, overflow:"hidden"}}
                                    onPress={() => {

                                        if (Platform.OS == "ios"){
                                            this.pageStore.presentFullscreenPlayer(attach_video);
                                        }else{
                                            Actions.VideoPlayPage({url:attach_video});
                                        }
                            }}>
                                <Video style={{flex:1, ...item_width_height}} source={{uri:attach_video?attach_video:"http://rs.majiawei.com/"}}
                                    paused={true}
                                    />
                                    <Image style={{position:"absolute", height:45, width:45}} source={require("./../../resources/img/icon_video_play_beforeImage.png")}/>
                            </TouchableOpacity>
                        )
                        :null
                    }

                     {/* 语音 */}
                     {
                        attach_audio ?
                        (
                            <TouchableOpacity style={{...item_width_height, backgroundColor: '#fff',alignItems: 'center',justifyContent: 'center',borderWidth:1,borderColor:"#979797",borderRadius:3, overflow:"hidden"}}
                                    onPress={() => {

                                        this.pageStore.playAudio(attach_audio);
    
                            }} onLongPress={() => {

                                    if (Platform.OS == "ios"){
                                            this.pageStore.playAudio_onLongPress(attach_audio);
                                        }else{
                                            Actions.VideoPlayPage({url:attach_audio});
                                        }

                            }}>
                                <ImageBackground style={{height:40, width:40}} source={require('../../resources/img/icon_add_audio.png')}/>
                                <Text style={{fontSize:12, color:"#4A4A4A"}}>{ (soundPlayerCurrentPlayingUrl == attach_audio ? soundPlayerCurrentPlayingUrlProgress:(attach_audio_time == 0 ? 1:attach_audio_time)) + "s"}</Text>
                            </TouchableOpacity>
                        )
                        :null
                    }
                       
                </View>
        )
    }

    renderBottomButton(){

         let {
            mianBtnTitle,
            mianBtnBgColor,
            subBtnTitle,
            subBtnBgColor,
         } = this.pageStore;
          
        return (
                <View style={{height:mianBtnTitle?100:0,marginLeft:32,marginRight:32,marginBottom:0,padding:15,flexDirection: 'row',justifyContent:"center"}}>
                    <TouchableOpacity activeOpacity={0.5} style={{width:120,backgroundColor: mianBtnBgColor,height: mianBtnTitle?40:0, borderRadius: 20,alignItems: 'center',justifyContent: 'center'}}
                                        onPress={() => { 
                            this.pageStore.bottomButtonAction(mianBtnTitle);                                                      

                    }}>
                        <Text style={{color: '#fff', fontSize: 14 }}>{mianBtnTitle}</Text>
                    </TouchableOpacity>

        
                    <TouchableOpacity  activeOpacity={0.5} style={{width: subBtnTitle?120:0,marginLeft:subBtnTitle?40:0,backgroundColor: subBtnBgColor,height: 40,borderRadius: 20,alignItems: 'center',justifyContent: 'center'}}
                                        onPress={() => {                                        
                            this.pageStore.bottomButtonAction(subBtnTitle);
                    }}>
                        <Text style={{color: '#fff', fontSize: 14 }}>{subBtnTitle}</Text>
                    </TouchableOpacity>
                </View>
        );          
    }

    renderCountDownTimer(){

        let { 
            detailData,
            questionInfo,
        } =  this.pageStore;
        

        return (
            <View style={{height:26,paddingLeft:10,paddingRight:10,borderRadius:6, backgroundColor:"#F9AA00", flexDirection:'row', alignItems:'center', justifyContent:'center',alignSelf:"center", position:"absolute", top:navHeigth}}>
                                    <Text style={{color:'#fff', fontSize:12, textAlign:'center'}} numberOfLines={1}>
                                        結束:
                                    </Text>
                                    {/* detailData.should_be_finished_at */}
                                    <CountDownTimer 
                                        date={`${new Date((parseInt(detailData.should_be_finished_at ? detailData.should_be_finished_at:0))*1000)}`}
                                        days={{plural: '', singular: ''}}
                                        hours=':'
                                        mins=':'
                                        segs=''
                                        daysStyle={{fontSize:12}}
                                            hoursStyle={styles.cardItemTimeRemainTxt}
                                            minsStyle={styles.cardItemTimeRemainTxt}
                                            secsStyle={styles.cardItemTimeRemainTxt}
                                            firstColonStyle={styles.cardItemTimeRemainTxt}
                                            secondColonStyle={styles.cardItemTimeRemainTxt}
                                            onEnd={() => {
                                                if(detailData.should_be_finished_at){
                                                    let _this = this
                                                        this.timer = setTimeout( () => {
                                                        let msg = detailData.current_user_role == AppStore.Enum_RoleType.students ? detailData.student_timeout_text:detailData.teacher_timeout_text;
                                                        Alert.alert(msg, '', [ {text:'确认', onPress:()=>_this._onRefresh()}], {cancelable:false});
                                                        _this.timer && clearTimeout(_this.timer);
                                                    }, 500);
                                                }                                                   
                                            }}
                                    />
                            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cardItemTimeRemainTxt: {
        fontSize:12,
        color: '#fff'
    },
});

