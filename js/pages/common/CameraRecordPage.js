import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNCompress from 'react-native-compress';
import RandomUtil from './../../utils/RandomUtil';


export default class cameraRecordScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            camera:null,
            isFlashOn:false,        //闪光灯
            isRecording:false,      //是否在录像
        };

    }

    componentWillUnmount(){
        if(this.state.camera){
            this.stopRecord(this.state.camera);
        }
    }

    toggleFlash(){
        this.setState( {isFlashOn:!this.state.isFlashOn} );
    }

    isFlashOn(){
        if (this.state.isFlashOn===false){
            return(
                <TouchableOpacity  onPress={()=>{this.toggleFlash()}}>
                    <Text style={{fontSize:30,color:'black'}}>&#xe633;</Text>
                </TouchableOpacity>

            )
        } else {
            return(
                <TouchableOpacity  onPress={()=>{this.toggleFlash()}}>
                    <Text style={{fontSize:30,color:'white'}}>&#xe633;</Text>
                </TouchableOpacity>

            )
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    style={styles.preview}
                    /*前置或者后置摄像头*/
                    type={RNCamera.Constants.Type.back}
                    /*闪光灯是否开启*/
                    flashMode={this.state.isFlashOn===true ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                >
                    {({ camera, status }) => {
                        console.log(status);
                        this.state.camera = camera;
                        return (
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                                {/* <View style={{position:'absolute',top:30,left:-40}}>{this.isFlashOn()}</View> */}
                                {this.recordBtn(camera)}
                            </View>
                        );
                    }}
                </RNCamera>
            </View>
        );
    }

    recordBtn(camera){
        if (this.state.isRecording===false){
            return(
                <TouchableOpacity onPress={() => this.takeRecord(camera)} style={styles.capture}>
                    <Text style={{ fontSize: 12 }}> 摄像 </Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.stopRecord(camera)} style={styles.capture}>
                    <Text style={{ fontSize: 12 }}> 停止 </Text>
                </TouchableOpacity>
            )
        }
    }
    //开始录像
     takeRecord= async function(camera){
        this.setState({isRecording:true});
        const options = { quality:RNCamera.Constants.VideoQuality["480p"], maxFileSize:(100*1024*1024) };
        const data = await camera.recordAsync(options);
        console.log(data);

        //quality will be "low", "medium" or "high"
        RNCompress.compressVideo(data.uri, 'medium').then((result) => {
            console.log('New video path', result);
            let path = result.path
            Actions.pop({refresh:({"videoFilePath":path})})

            // global.FetchUtil.get(global.UrlConst.apiGetUploadToken).then((result) => {
            //     let token = result.upload_token
            //     let name = RandomUtil.randomFileName(".mp4")
            //     let key = RandomUtil.randomUploadFilePath("questionVideo",".mp4")

            //     global.FetchUtil.postImage("http://up-z2.qiniu.com/",{params:{token:token,key:key}},{uri:path,fileName:"file",name:name,mime:'video/mp4'}).then((result) => {

            //     })

            // })
          
        });



    };
    //停止录像
    stopRecord(camera){
        this.setState({isRecording:false});
        camera.stopRecording();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        height:70,
        width:70,
        backgroundColor: '#fff',
        borderRadius: 35,
        padding: 0,
        paddingHorizontal: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        margin: 20,
    },
});

