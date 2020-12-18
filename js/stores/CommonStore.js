import { observable, computed, action, runInAction, useStrict } from 'mobx';
import { NativeModules, Platform,ListView, Alert} from 'react-native';
import LoginApi from '../apis/LoginApi';
import AppApi   from '../apis/AppApi';
import UserApi  from '../apis/UserApi';
import StorageManager from './../configs/StorageManager';
import ToastUtil from './../utils/ToastUtil';
import FetchUtil from './../utils/FetchUtil';
import ImagePickerUtil from './../utils/ImagePickerUtil';

import RandomUtil from './../utils/RandomUtil';
import storageManager from './../configs/StorageManager';
import AppStore   from './../stores/AppStore';
import ImagePicker from 'react-native-image-picker';
//录音组件
import {AudioRecorder, AudioUtils} from 'react-native-audio';
// 播放声音组件
import Sound from 'react-native-sound'; 
import ActionSheet from 'react-native-actionsheet-api';
import RNCompress from 'react-native-compress';
import RNFetchBlob from 'rn-fetch-blob'

export class ChooseQuestionTypePageStore {


    @observable chooseType = null;
    @observable subjectsType = 0;
    @observable gradeType = 0;
    @observable subjectsList = [];
    @observable gradeList = [];
    
    constructor() {
        this.fetchSubjectsList()
        this.fetchGradeList()
    }
  
    @action('科目列表') fetchSubjectsList = () => {
        StorageManager.loadObjectWithKey("subjectsList").then((res)=>{
            this.subjectsList = res;
            this.subjectsType = res.shift().id;
        });
        global.FetchUtil.get(global.UrlConst.apiGetSubjectList).then((res) => {
            this.subjectsList = res.subject_list;
            this.subjectsType = res.subject_list.shift().id;
            StorageManager.saveObject("subjectsList", res.subject_list);
         }).catch((err) => {

         });
    }

    @action('年級列表') fetchGradeList = () => {
        StorageManager.loadObjectWithKey("gradeList").then((res)=>{
            this.gradeList = res;
            this.gradeType = res.shift().id;
        });
        global.FetchUtil.get(global.UrlConst.apiGetGradeList).then((res) => {
            this.gradeList = res.grade_list;
            this.gradeType = res.grade_list.shift().id;
            StorageManager.saveObject("gradeList", res.grade_list);
         }).catch((err) => {

         });
    }
 
}

// 選擇老師
export class ChooseTeacherListPageStore {

    @observable list = [];
    @observable page = 1;
    @observable limit = 20;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable isRefreshing = false;

    //選擇類型 1:單選(提问老师 subject_id) 2:多選(老師請求幫助-- 帶 question_id)
    @observable chooseType = 1;
    @observable question_id = 0;
    @observable subject_id = 0;

    

    constructor() {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
    }

    @computed get dataSource() {
        return this.ds.cloneWithRowsAndSections({section1:this.list.slice()});
    }

    @action loadData = (isRefreshHub) => {
        this.isRefreshing = isRefreshHub;
        let url = this.chooseType == 2 ? global.UrlConst.apiGetCanHelpTeacherList:global.UrlConst.apiGetTeacherList;
        let params = this.chooseType == 2 ? {question_id:this.question_id, subject_id:this.subject_id}:{subject_id:this.subject_id};
        FetchUtil.get(url, {params:params}).then(action((result) => {
            this.list = result.teachers;            
            this.isRefreshing = false;
        })).catch((err) => {
            this.isRefreshing = false;
        });
    }

}

// 選擇科目 (修改擅长科目)
export class ChooseSubjectPageStore {

    @observable list = [];
    @observable page = 1;
    @observable limit = 20;
    @observable allPage = 1;
    @observable isMore = true;
    @observable errorMsg = '';
    @observable loading = false;
    @observable isRefreshing = false;

    //選擇類型 1:單選 2:多選
    @observable chooseType = 2;
    @observable defaultSubjects = [];

    

    constructor() {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
    }

    @computed get dataSource() {
        return this.ds.cloneWithRowsAndSections({section1:this.list.slice()});
    }

    @action loadData = (isRefreshHub) => {
        this.isRefreshing = isRefreshHub;
        FetchUtil.get(global.UrlConst.apiGetSubjectList).then(action((result) => {
            var subjects = result.subject_list;
            if(this.defaultSubjects.slice().length > 0){
                let defaultSubjects_ids = this.defaultSubjects.map((subject) =>{ return subject.id; });
                subjects = result.subject_list.map((subject) =>{
                    if (defaultSubjects_ids.indexOf(subject.id) != -1){
                        subject.is_choose = true;
                    }
                    return subject;
                });
            }
            this.list = subjects;
            this.isRefreshing = false;
        })).catch((err) => {
            this.isRefreshing = false;
        });
    }

}


//
export class EditorQuestionPageStore {

    @observable loading = false;

    
    @observable editorType = AppStore.Enum_EidtorQuestionType.create;
    @observable questionID = null;
    @observable lastPageStore = null;
    
    // id (subjectsType, gradeType)
    @observable subjectsType = 0;
    @observable gradeType = 0;
    @observable questionText = "";
    @observable teacherID = 0;

    //text
    @observable navTiltle = "";
    @observable submitButtonName = '';
    @observable bottomTipsText = '';

    // 上传七牛后获得key
    @observable imageUrl = '';
    @observable videoUrl = '';
    @observable audioUrl = '';

    //本地資源path
    @observable imageFilePath = '';
    @observable videoFilePath = '';
    @observable audioFilePath = '';

    // 錄音
    @observable soundPlayer = null;
    @observable isAudioRecording = false;
    @observable isAudioRecordPause = false;
    @observable audioRecordCurrentTime = '0';
    @observable audioRecordCurrentAudioPath = 'file://';

    //視頻
    @observable videoPlayer = null;
    @observable isPlayingVideo = false;

    @observable chooseTeacher = {avatar:"",description:"",id:0,name:""};

    //上傳進度
    @observable uploadProgressText = "提交中...";

    
    @observable uploadProgressTotalArr = [0.0, 0.0, 0.0];
    @observable uploadProgressWrittenArr = [0.0, 0.0, 0.0];


    constructor() {

    }

    @action('发布提问') submitQuestionAction = () => {

        if(this.questionText.length == 0){
            global.ToastUtil.showToast("請輸入內容");
            return;
        }
        this.loading = true;
        this.uploadProgressText = "提交中...";


        let params = {
            question_id:this.questionID,
            subject_id:this.subjectsType,
            grade_id:this.gradeType,
            content:this.questionText,
            invited_teacher_id:this.chooseTeacher.id,
            attach_audio_time:this.audioRecordCurrentTime,
        };

        let isUploadfile =  this.imageFilePath.length>0 || this.videoFilePath.length>0 || this.audioFilePath.length>0;
        if(isUploadfile){

            global.FetchUtil.get(global.UrlConst.apiGetUploadToken).then((result) => {
                let upload_token = result.upload_token;
                // *******方法上传*******
                let _this = this;
                let uploadData = (type, filePath, upload_token) => {
                    let fileName = "";
                    let uploadPath = "";
                   if(type == "image"){
                       fileName = RandomUtil.randomFileName(".jpg");
                       uploadPath = RandomUtil.randomUploadFilePath("questionImage", ".jpg");
                   }
                   if(type == "video"){
                        fileName = RandomUtil.randomFileName(".mp4");
                        uploadPath = RandomUtil.randomUploadFilePath("questionVideo", ".mp4");
                    }
                    if(type == "audio"){
                        fileName = RandomUtil.randomFileName(".aac");
                        uploadPath = RandomUtil.randomUploadFilePath("questionAudio", ".aac");
                    }
    
                   return new Promise(function (resolve, reject) {
                        if(filePath.length>0){
                            _this.uploadProgressText = "提交中...";
                            let body = [{name:'token', data:upload_token}, {name:'key', data:uploadPath}, {name: 'file', filename:fileName, data: RNFetchBlob.wrap(filePath)}];
                            RNFetchBlob.fetch('POST', global.UrlConst.qiniuHost, {'Content-Type' : 'multipart/form-data'}, body).uploadProgress({ interval : 250 }, (written, total) => {
                           
                                if(type == "image"){
                                    _this.uploadProgressText = `上傳圖片${parseInt(written/total*100)}%...`;
                                    console.log('上傳圖片:', `${written/1024/1024}m`, `${total/1024/1024}m`, total/1024/1024, `${parseInt(written/total*100)}%`);
                                }
                                if(type == "video"){
                                    _this.uploadProgressText = `上傳視頻${parseInt(written/total*100)}%...`;
                                    console.log('上傳視頻:', `${written/1024/1024}m`, `${total/1024/1024}m`, total/1024/1024, `${parseInt(written/total*100)}%`);

                                 }
                                 if(type == "audio"){
                                    _this.uploadProgressText = `上傳語音${parseInt(written/total*100)}%...`;
                                    console.log('上傳語音:', `${written/1024/1024}m`, `${total/1024/1024}m`, `${parseInt(written/total*100)}%`);
                                 }
    
                            }).then((response)=>{
                                if (response.respInfo.status === 200){
                                    return response.json();
                                }else {
                                    return reject(response);
                                }
                            }).then((result)=>{
                                console.log(result);
                                resolve(result.key);
                            }).catch((error)=>{
                                console.log(error);
                                reject(error);
                            });
    
                        }else{
                            resolve("");
                        }
                   });
                };
                // *******方法上传*******

                // *******上传串联(没辙了)*******
                let sourceHost = global.UrlConst.sourceHost;
                uploadData("image", this.imageFilePath, upload_token).then((key)=>{
                      params.attach_image = key.length > 0 ? (sourceHost+key):"";
                    uploadData("video", this.videoFilePath, upload_token).then((key)=>{
                        params.attach_video = key.length > 0 ? (sourceHost+key):"";
                        uploadData("audio", this.audioFilePath, upload_token).then((key)=>{
                            params.attach_audio = key.length > 0 ? (sourceHost+key):"";
                            // 上传文件完成,发布问题
                            this.uploadProgressText = "提交中...";
                            // this.loading = false;

                            this.requstQuestion(params);
                        }).catch((err)=>{
                            console.log(err);
                            this.loading = false;
                            global.ToastUtil.showToast("上传音频失败,请重试!");
                        });

                    }).catch((err)=>{
                        console.log(err);
                        this.loading = false;
                        global.ToastUtil.showToast("上传视频失败,请重试!");
                    });

                }).catch((err)=>{
                    console.log(err);
                    this.loading = false;
                    global.ToastUtil.showToast("上传图片失败,请重试!");

                });
               // *******上传串连*******

                

            }).catch((err)=>{
                console.log(err);
                this.loading = false;
                global.ToastUtil.showToast("上传文件出错,请重试!");
            });

        }else{
            // 有bug  和 alert.shouw()
            this.loading = false;

            // 发布问题
           this.requstQuestion(params);
        }

        
    }
  

    // @action('发布提问') submitQuestionAction = () => {

    //     if(this.questionText.length == 0){
    //         global.ToastUtil.showToast("請輸入內容");
    //         return;
    //     }
    //     this.loading = true;

    //     global.FetchUtil.get(global.UrlConst.apiGetUploadToken).then((result) => {
    //         let upload_token = result.upload_token
            
    //         let requestPromiseArr = []
    //         if(this.imageFilePath.length>0){
    //             let filePath = this.imageFilePath
    //             let fileName = RandomUtil.randomFileName(".jpg")
    //             let uploadPath = RandomUtil.randomUploadFilePath("questionImage",".jpg")

    //             let body = [{name:'token', data:upload_token}, {name:'key', data:uploadPath}, {name: 'file', filename:'file', data: RNFetchBlob.wrap(filePath)}];
    //             let promise = RNFetchBlob.fetch('POST', global.UrlConst.qiniuHost, {'Content-Type' : 'multipart/form-data'}, body);
    //             requestPromiseArr.push(promise);

    //         }
    //         if(this.videoFilePath.length>0){
    //             let filePath = this.videoFilePath
    //             let fileName = RandomUtil.randomFileName(".mp4")
    //             let uploadPath = RandomUtil.randomUploadFilePath("questionVideo",".mp4")
    //             let body = [{name:'token', data:upload_token}, {name:'key', data:uploadPath}, {name: 'file', filename:'file', data: RNFetchBlob.wrap(filePath)}];
    //             RNFetchBlob.fetch('POST', global.UrlConst.qiniuHost, {'Content-Type' : 'multipart/form-data'}, body).uploadProgress({ interval : 250 },(written, total) => {
    //                 // this.uploadProgressTotalArr[1] = total;
    //                 // this.uploadProgressWrittenArr[1] = written;
    //                 console.log('uploaded1', written, total)
    //                 console.log('uploaded1', written / total)
    //             }).then((res)=>{}); 
                
    //             let uploadPath2 = RandomUtil.randomUploadFilePath("questionVideo",".mp4")
    //             let body2 = [{name:'token', data:upload_token}, {name:'key', data:uploadPath2}, {name: 'file', filename:'file', data: RNFetchBlob.wrap(filePath)}];

    //             RNFetchBlob.fetch('POST', global.UrlConst.qiniuHost, {'Content-Type' : 'multipart/form-data'}, body2).uploadProgress({ interval : 250 },(written, total) => {
    //                 // this.uploadProgressTotalArr[1] = total;
    //                 // this.uploadProgressWrittenArr[1] = written;
    //                 console.log('uploaded2', written, total)
    //                console.log('uploaded2', written / total)
    //             }).then((res)=>{}); 

    //             //  requestPromiseArr.push(promise);

    //         }
    //         if(this.audioFilePath.length>0){
    //             let filePath = this.audioFilePath
    //             let fileName = RandomUtil.randomFileName(".aac")
    //             let uploadPath = RandomUtil.randomUploadFilePath("questionAudio",".aac")
    //             let body = [{name:'token', data:upload_token}, {name:'key', data:uploadPath}, {name: 'file', filename:'file', data: RNFetchBlob.wrap(filePath)}];
    //             let promise = RNFetchBlob.fetch('POST', global.UrlConst.qiniuHost, {'Content-Type' : 'multipart/form-data'}, body);
    //             requestPromiseArr.push(promise);

    //         }

    //         let params = {
    //             question_id:this.questionID,
    //             subject_id:this.subjectsType,
    //             grade_id:this.gradeType,
    //             content:this.questionText,
    //             invited_teacher_id:this.chooseTeacher.id,
    //             attach_audio_time:this.audioRecordCurrentTime,
    //         }
    //         if(requestPromiseArr.length>0){
    //             Promise.all(requestPromiseArr).then((result)=>{
    //                 console.log(result)
    //                 // let host = global.UrlConst.sourceHost
    //                 // let imageData = result.find(item => item.key.search(/.jpg/) != -1)
    //                 // let videoData = result.find(item => item.key.search(/.mp4/) != -1)
    //                 // let audioData = result.find(item => item.key.search(/.aac/) != -1)
    //                 // this.imageUrl = imageData ? (host+imageData.key):""
    //                 // this.videoUrl = videoData ? (host+videoData.key):""
    //                 // this.audioUrl = audioData ? (host+audioData.key):""
    //                 // params.attach_image = this.imageUrl
    //                 // params.attach_video = this.videoUrl
    //                 // params.attach_audio = this.audioUrl
    //                 // console.log(params);

    //                 // this.requstQuestion(params);
    //                 this.loading = false;

    //             }).catch((error)=>{
    //                 this.loading = false;
    //                 console.log(error)
    //             })

    //         }else{
    //         //    this.requstQuestion(params);
    //         }
    //     })
    // }
  
    // @action('发布提问') submitQuestionAction = () => {

    //     if(this.questionText.length == 0){
    //         global.ToastUtil.showToast("請輸入內容");
    //         return;
    //     }
    //     this.loading = true;

    //     global.FetchUtil.get(global.UrlConst.apiGetUploadToken).then((result) => {
    //         let upload_token = result.upload_token
            
    //         let requestPromiseArr = []
    //         if(this.imageFilePath.length>0){
    //             let filePath = this.imageFilePath
    //             let fileName = RandomUtil.randomFileName(".jpg")
    //             let uploadPath = RandomUtil.randomUploadFilePath("questionImage",".jpg")
    //             let promise = global.FetchUtil.postImage(global.UrlConst.qiniuHost,{params:{token:upload_token,key:uploadPath}},{uri:filePath,fileName:"file",name:fileName,mime:'image/jpg'})
    //             requestPromiseArr.push(promise)
    //         }
    //         if(this.videoFilePath.length>0){
    //             let filePath = this.videoFilePath
    //             let fileName = RandomUtil.randomFileName(".mp4")
    //             let uploadPath = RandomUtil.randomUploadFilePath("questionVideo",".mp4")
    //             let promise =  global.FetchUtil.postImage(global.UrlConst.qiniuHost,{params:{token:upload_token,key:uploadPath}},{uri:filePath,fileName:"file",name:fileName,mime:'video/mp4'})
    //             requestPromiseArr.push(promise)
    //         }
    //         if(this.audioFilePath.length>0){
    //             let filePath = this.audioFilePath
    //             let fileName = RandomUtil.randomFileName(".aac")
    //             let uploadPath = RandomUtil.randomUploadFilePath("questionAudio",".aac")
    //             let promise = global.FetchUtil.postImage(global.UrlConst.qiniuHost,{params:{token:upload_token,key:uploadPath}},{uri:filePath,fileName:"file",name:fileName,mime:'audio/aac'})
    //             requestPromiseArr.push(promise)
    //         }

    //         let params = {
    //             question_id:this.questionID,
    //             subject_id:this.subjectsType,
    //             grade_id:this.gradeType,
    //             content:this.questionText,
    //             invited_teacher_id:this.chooseTeacher.id,
    //             attach_audio_time:this.audioRecordCurrentTime,
    //         }
    //         if(requestPromiseArr.length>0){
    //             Promise.all(requestPromiseArr).then((result)=>{
    //                 console.log(result)
    //                 let host = global.UrlConst.sourceHost
    //                 let imageData = result.find(item => item.key.search(/.jpg/) != -1)
    //                 let videoData = result.find(item => item.key.search(/.mp4/) != -1)
    //                 let audioData = result.find(item => item.key.search(/.aac/) != -1)
    //                 this.imageUrl = imageData ? (host+imageData.key):""
    //                 this.videoUrl = videoData ? (host+videoData.key):""
    //                 this.audioUrl = audioData ? (host+audioData.key):""
    //                 params.attach_image = this.imageUrl
    //                 params.attach_video = this.videoUrl
    //                 params.attach_audio = this.audioUrl
    //                 console.log(params);

    //                 this.requstQuestion(params);

    //             }).catch((error)=>{
    //                 this.loading = false;
    //                 console.log(error)
    //             })

    //         }else{
    //            this.requstQuestion(params);
    //         }
    //     })
    // }

    @action('問題請求類型') requstQuestion = (params) => {
        if(this.editorType == AppStore.Enum_EidtorQuestionType.eidtor && this.questionID){
           this.requstEditorQuestion(params);
        }else{
            this.requstCrteateQuestion(params);
        }

    }


    @action('創建問題') requstCrteateQuestion = (params) => {
        global.FetchUtil.post(global.UrlConst.apiCreateQuestion, {params:params}).then((res) => {
        
            Actions.QuestionDetailsPage({id:res.question_id, popToName:"_Student_home"});            
            this.loading = false;
        }).catch((err) => {
            this.loading = false;
        });

    }

    @action('編輯問題') requstEditorQuestion = (params) => {

        global.FetchUtil.post(global.UrlConst.apiReplyQuestion, {params:params}).then((res) => {
            this.loading = false;
            // Actions.QuestionDetailsPage({id:res.question_id})
            this.lastPageStore.requstQuestionDetail(true);
            Actions.pop();
        }).catch((err) => {
            console.log("啊哈哈SDK江安河", err);
            this.lastPageStore.requstQuestionDetail(true);
            this.loading = false;
        });
    }

    

    @action('创建问题图片') crteateQuestionImage = () => {

        let showImagePicker = () => {
            ImagePickerUtil.showImagePicker().then((imageData)=>{
                console.log(imageData)
                if(Platform.OS == "ios"){
                    this.imageFilePath = imageData.path
                }else{
                    this.imageFilePath = imageData.source.uri
                }
            }).catch((errorMsg)=>{

            });
        }

        if(this.imageFilePath.length>0){
            let options = ['更換', '刪除','取消']
            global.ActionSheet.showActionSheetWithOptions({
                title: '請選擇操作',
                options: options,
                cancelButtonIndex: 2,
            },
            (buttonIndex) => {
                if(options[buttonIndex] == '更換'){
                    showImagePicker()
                }
                if(options[buttonIndex] == '刪除'){
                    this.imageFilePath = ""
                }
            }
            );

        }else{
            showImagePicker()

        }

    }

    @action('创建问题视频') crteateQuestionVideo = () => {
       

        let toRecordVideoPage = () => {
            Actions.CameraRecordPage({})
        }

        let showImagePicker = () => {
            ImagePickerUtil.showVideoPicker().then((path)=>{
                console.log(path);

                 //quality will be "low", "medium" or "high"
                RNCompress.compressVideo(path, 'high').then((result) => {
                    console.log('New video path', result);
                    if(Platform.OS == "ios"){
                        this.videoFilePath = result.path;
                    }else{
                        this.videoFilePath = "file://" + result.path;
                    }
                
                });
                
            }).catch((errorMsg)=>{

            });
        }

        if(this.videoFilePath.length>0){
            let options = ['取消','播放','更換', '刪除']
            global.ActionSheet.showActionSheetWithOptions({
                title: '請選擇操作',
                options: options,
                cancelButtonIndex: 0,
            },(buttonIndex) => {
                if(options[buttonIndex] == '播放'){

                    if (Platform.OS == "ios"){
                        this.videoPlayer.seek(0);
                        this.videoPlayer.presentFullscreenPlayer();
                    }else{
                        Actions.VideoPlayPage({url:this.videoFilePath});
                    }
                   
                }
                if(options[buttonIndex] == '更換'){
                    showImagePicker()
                }
                if(options[buttonIndex] == '刪除'){
                    this.videoFilePath = ""
                }
            }
            );

        }else{
            showImagePicker()
        }


    }

    @action('创建问题录音')  crteateQuestionAudio = async(event) => {
        

        if((this.isAudioRecording == false) &&(this.isAudioRecordPause == false)){
            Sound.setCategory("Record");

            console.log('開始錄音')
            this.isAudioRecording = true
            this.isAudioRecordPause = false
            this.audioRecordCurrentTime = '0'
            let fileName = RandomUtil.randomFileName(".aac")
            let audioPath = AudioUtils.DocumentDirectoryPath + "/" + fileName;
            this.audioRecordCurrentAudioPath = fileName
            this.audioFilePath = audioPath
            console.log(audioPath)
            AudioRecorder.prepareRecordingAtPath(audioPath, {
                SampleRate: 44100.0,
                Channels: 2,
                AudioQuality: "Low", //录音质量
                AudioEncoding: "aac", //录音格式
                AudioEncodingBitRate: 64000, //比特率
                MeasurementMode:true,
            });
            try {
                const filePath = await AudioRecorder.startRecording();
                console.log(filePath)
              } catch (error) {
                console.error(error);
            }
    
            AudioRecorder.onProgress = async (data) => {
                console.log(data)
                this.audioRecordCurrentTime = Math.ceil(data.currentTime);

                if(this.audioRecordCurrentTime >= 60){
                    global.ToastUtil.showToast(`语音最多可以录制60秒`);

                    Sound.setCategory("Ambient");
                    this.isAudioRecording = false
                    this.isAudioRecordPause = true
                    try {
                        if(Platform.OS == 'ios'){
                            const filePath = await AudioRecorder.pauseRecording();
                            console.log(filePath)
                        }else{
                            const filePath = await AudioRecorder.stopRecording();
                            console.log(filePath)
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            
            };
            
            AudioRecorder.onFinished = (data) => {
                console.log(data)
                if(data.status && (this.isAudioRecording == true ||  this.isAudioRecordPause== true)){
                    let filePath = data.audioFileURL
                    this.audioFilePath = filePath
                }
            };

        }else if((this.isAudioRecording == true) &&(this.isAudioRecordPause == false)){
            console.log('暫停錄音')
            Sound.setCategory("Ambient");
            this.isAudioRecording = false
            this.isAudioRecordPause = true
            try {
                if(Platform.OS == 'ios'){
                    const filePath = await AudioRecorder.pauseRecording();
                    console.log(filePath)
                }else{
                    const filePath = await AudioRecorder.stopRecording();
                    console.log(filePath)
                }
              } catch (error) {
                console.error(error);
            }

        }else if((this.isAudioRecording == false) &&(this.isAudioRecordPause == true)){

            let options = null;
            if(Platform.OS == 'ios'){
                options = ['取消','繼續錄音','播放','刪除'];
            }else{
                options = ['取消', '播放','刪除'];
            }
            global.ActionSheet.showActionSheetWithOptions({
                title: '請選擇操作',
                options: options,
                cancelButtonIndex: 0,
            },async (buttonIndex) => {
                if(options[buttonIndex] == '繼續錄音'){
                    Sound.setCategory("Record");

                    console.log('繼續錄音')
                    this.isAudioRecording = true
                    this.isAudioRecordPause = false
                    const filePath = await AudioRecorder.startRecording();
                    console.log(filePath)
                }
                if(options[buttonIndex] == '播放'){
                    Sound.setCategory("Ambient");

                    this.isAudioRecording = false
                    this.isAudioRecordPause = true
                    console.log('播放錄音')
                    let audioPath = "";
                    if(Platform.OS == 'ios'){
                        audioPath = this.audioRecordCurrentAudioPath;
                    }else{
                        audioPath = this.audioFilePath.replace('file://', '');
                    }

                    // Sound.setActive(true);
                    this.soundPlayer = new Sound(audioPath, Sound.DOCUMENT, (error) => {
                        if (error) {
                          console.log('播放失败', error);
                          return;
                        }
                        this.soundPlayer.setVolume(1);
                        this.soundPlayer.play(() => this.soundPlayer.release());
                        console.log('播放: ' + this.soundPlayer.getDuration() + 'number of channels: ' + this.soundPlayer.getNumberOfChannels());
                      });
                }
                if(options[buttonIndex] == '刪除'){
                    console.log('刪除錄音')
                    try {
                        if(Platform.OS == 'ios'){
                            const filePath = await AudioRecorder.stopRecording();
                            console.log(filePath);
                        }
                      } catch (error) {
                        console.error(error);
                    }
                    this.isAudioRecording = false
                    this.isAudioRecordPause = false
                    this.audioRecordCurrentAudioPath = ''
                    this.audioRecordCurrentTime = '0'
                    this.audioFilePath = ""
                }
            }
            );

        }
        
    }

    @action('邀请其他老师回答') chooseTeacherBlock = (teacher) => {
        this.chooseTeacher = teacher;
    }
    
}

export class QuestionDetailsPageStore {

    @observable isRefreshing = false;

    //問題數據
    @observable id = 0;
    @observable detailData = {};
    @observable questionInfo = null;
    @observable replyList = [];


    //音頻
    @observable soundPlayer = null;
    @observable soundPlayerCurrentPlayingUrl = null;
    @observable soundPlayerPaused = true;
    @observable soundPlayerCurrentPlayingUrlProgress = 0;
    @observable isSoundPlayerPresentFullscreenPlayer = false;

    
    
    
    

    //視頻播放
    @observable player = null;
    @observable playerCurrentUrl = 'http://rs.majiawei.com/';

    // 底部按钮
    @observable mianBtnTitle = '';
    @observable mianBtnBgColor = "#0084FF";
    @observable subBtnTitle = '';
    @observable subBtnBgColor = "#FF5477";
    //評分
    @observable isShowStarRatingModal = false;
    @observable starRating = 3;

    //導航欄右邊view //1:更多 2:收藏
    @observable isRenderRightViewType = 0;

    //學生-待解答-提示語
    @observable isStudentWaitingAnswerTips = "";
    //修改设置题目view
    @observable isShowSettingTiltleModal = false;

    //是否显示倒计时
    @observable isShowCountdownTimer = false;


    constructor() {
        this.replyList_ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged:(s1, s2) => s1!==s2 });
    }

    @computed get replyDataSource() {
        return this.replyList_ds.cloneWithRowsAndSections({section1:this.replyList.slice()});
    }
  
    @action('問題詳情') requstQuestionDetail = (isRefreshHub) => {
        this.isRefreshing = isRefreshHub;
        global.FetchUtil.get(global.UrlConst.apiGetQuestionDetail,{params:{id:this.id}}).then((result) => {
            this.detailData = result
            this.questionInfo = result.question
            this.replyList = result.reply
            this.renderBottomButtonStyle();
            this.stopRefreshing();
        }).catch((err) => {
            this.stopRefreshing();
        });
    }

    @action stopRefreshing = () => {
        let self = this;
        // setTimeout(function() {
            self.isRefreshing = false;
    //    }, 800);  
    }

    @action('全屏播放视频') presentFullscreenPlayer = (url) => {
        this.playerCurrentUrl = url ? url:'http://rs.majiawei.com/'
        let _this = this
        setTimeout(function() {
            _this.player.seek(0)
            _this.player.presentFullscreenPlayer()
      }, 100);
        
    }

    @action('播放播放音频开始') playAudio_onLoad = (data) => {
        console.log('播放播放音频开始');

    }
    @action('播放播放音频进度') playAudio_onProgress = (data) => {
        console.log('播放播放音频进度', data);
        this.soundPlayerCurrentPlayingUrlProgress = Math.ceil(data.currentTime);
    }

    @action('播放音频 全屏关闭') playAudio_onFullscreenPlayerDidDismiss = (data) => {
         this.isSoundPlayerPresentFullscreenPlayer = false;
    }


    @action('播放播放音频结束') playAudio_end = () => {
        console.log('播放播放音频结束');
        this.soundPlayerPaused = true;
        if( this.isSoundPlayerPresentFullscreenPlayer == false) {
          this.soundPlayerCurrentPlayingUrl = "http://rs.majiawei.com/";
        }
        this.soundPlayerCurrentPlayingUrlProgress = 0;
    }

    @action('播放音频_长按全屏播放视频') playAudio_onLongPress = (url) => {

        this.soundPlayerCurrentPlayingUrl = url ? url:'http://rs.majiawei.com/'
        let _this = this
        setTimeout(function() {
            _this.isSoundPlayerPresentFullscreenPlayer = true;
            _this.soundPlayer.presentFullscreenPlayer();
        }, 100);
    }

    @action('播放音频') playAudio = (url) => {

        if(this.soundPlayerCurrentPlayingUrl == url && this.soundPlayerPaused == false){
            this.soundPlayerPaused = true;
        }else if (this.soundPlayerCurrentPlayingUrl == url && this.soundPlayerPaused == true){
            this.soundPlayerPaused = false;
        }else{
            this.soundPlayerCurrentPlayingUrlProgress = 0;
            this.soundPlayerCurrentPlayingUrl = url ? url:'http://rs.majiawei.com/'
            this.soundPlayerPaused = false;
            this.soundPlayer.seek(0);
    }

    















    //     if(this.soundPlayer && this.soundPlayerCurrentPlayingUrl == url){
    //         this.soundPlayer.release();
    //         this.soundPlayer = null;
    //         this.soundPlayerCurrentPlayingUrl = null;
    //    }else{
    //         if(this.soundPlayer){this.soundPlayer.release();}
    //         this.soundPlayerCurrentPlayingUrl = url;
    //         this.soundPlayer = new Sound(url, null, (error) => {
    //             if (error) {
    //             console.log('播放失败', error);
    //             return;
    //             }
    //             this.soundPlayer.setVolume(1);
    //             this.soundPlayer.play(() => {
    //                 this.soundPlayer.release();
    //                 this.soundPlayerCurrentPlayingUrl == null;
    //             });
    //             this.soundPlayer.getCurrentTime((i, j) => {
    //                 console.log('播放: ' + i);
    //                 console.log('播放: ' + j);

    //             });
                
    //             console.log('播放: ' + this.soundPlayer.getDuration() + 'number of channels: ' + this.soundPlayer.getNumberOfChannels());
    //         });

    //    }

    }

    @action('評價老師') requestEvaluate = () => {
        global.FetchUtil.post(global.UrlConst.apiEvaluateQuestion, {params:{question_id:this.questionInfo.id, rating:this.starRating}}).then((result) => {
            this.requstQuestionDetail(true);
            AppStore.uploadQuestionList(true);
         }).catch((err) => {
             
         });
        
    }

    @action('起標題') requestSettingQuestionTiltle = (tiltle) => {
        global.FetchUtil.post(global.UrlConst.apiUpdateQuestionTitle, {params:{question_id:this.questionInfo.id, title:tiltle}}).then((result) => {
            global.ToastUtil.showToast(`設置標題成功`);
            this.requstQuestionDetail(true);
            AppStore.uploadQuestionList(true);
         }).catch((err) => {
             
         });
        
    }

    //status: 0:新創建 1:教師解答中 2:待評價 3:已評價
    @action('更新底部按钮/導航欄按鈕样式') renderBottomButtonStyle = () => {
       let {
        status,
        current_user_role,
        is_questioner,
        is_timeout,

        answerable,
        can_accept_question,
        can_accept_invite,
        is_in_charge_teacher,
        teacher_in_charge_name,
        reply
        } = this.detailData;

        
        let {
            id,
            rating,
        } = this.questionInfo;

        // 置空
        this.mianBtnTitle = "";
        this.subBtnTitle = "";
        this.isRenderRightViewType = 0;
        this.isStudentWaitingAnswerTips = "";
        this.isShowCountdownTimer = false;


        // 公共 問題超時處理

        //倒计时
        if( status==1 && (is_questioner==true  || answerable==true) && is_timeout==false){
            this.isShowCountdownTimer=true;
        }


        if( ((is_questioner==true && status==1) || (is_in_charge_teacher==true))  && is_timeout==true){
            Alert.alert("由於老師回答問題已超過10分鐘,該提問已被強制結束", '', [ {text:'好的,我知道了'}], {cancelable:false});
        }


        // 学生
        // 剛創建-問題
        if(status==0 && current_user_role==1 && is_questioner==true  && is_timeout==false){
            this.isRenderRightViewType = 1;
            this.isStudentWaitingAnswerTips = "暫時還沒有老師回答噢!";
        }

        // 已回答-追問 未超時
        if(status==1 && current_user_role==1 && is_questioner==true && is_timeout==false){
            this.mianBtnTitle = "繼續追問";
            this.subBtnTitle = "我懂了";
            this.isStudentWaitingAnswerTips = reply.length>0 ? "":(teacher_in_charge_name+"準備回答你的問題!");

        }

        // 已回答-追問 已超時
        if(status==1 && current_user_role==1 && is_questioner==true && is_timeout==true){
            this.mianBtnTitle = "完成提問";
            this.mianBtnBgColor = "#FF5477";
        }

        // 已回答-評價
        if(status==2 && current_user_role==1 && is_questioner==true ){
            this.mianBtnTitle = "評價老師";
            this.subBtnTitle = "";
            this.isRenderRightViewType = 2;
        }
        // 已回答-已評價
        if(status==3 && current_user_role==1 && is_questioner==true ){
            this.mianBtnTitle = rating ? (rating + " 星"):("0" + " 星");
            this.mianBtnBgColor = "#4A4A4A";
            this.subBtnTitle = "";
            this.isRenderRightViewType = 2;
        }

        // 收藏
        if((status==2 || status==3)&& current_user_role==1 ){
           
            this.isRenderRightViewType = 2;
        }


        //老师
        //搶答
        if(status==0 && current_user_role==2 && is_in_charge_teacher==false && is_timeout==false && answerable==false && can_accept_question==true){
            this.mianBtnTitle = "回答該題目";
            this.subBtnTitle = "";
        }
        // 接受邀請回答
        if(status==0 && current_user_role==2 && is_in_charge_teacher==false &&  is_timeout==false && answerable==false && can_accept_invite==true ){
            this.mianBtnTitle = "回答該題目";
            this.subBtnTitle = "";
        }

        //繼續回答 是 當前主要回答的老師
        if(status==1 && current_user_role==2 && is_in_charge_teacher==true &&  is_timeout==false && answerable==true){
            this.mianBtnTitle = "繼續回答";
            this.subBtnTitle = "邀请其他老师";
        }

        //繼續回答 不是 當前主要回答的老師
        if(status==1 && current_user_role==2 && is_in_charge_teacher==false &&  is_timeout==false && answerable==true){
            this.mianBtnTitle = "繼續回答";
        }

         //問答 -(解答中,待評價||已評價) && 可 回答的老師
        if((status==1 || status==2 ||status==3)  && current_user_role==2  && answerable==true){
            this.isRenderRightViewType = 1;
        }

         //問答未結束 && 不是-當前主要回答的老師 && 可-接受邀請
         if(status==1 && current_user_role==2 && is_in_charge_teacher==false &&  is_timeout==false && answerable==false &&  can_accept_invite== true){
            this.mianBtnTitle = "接受邀請";
        }

         //問答未結束 && 不是-當前主要回答的老師 && 不可-接受邀請
        if(status==1 && current_user_role==2 && is_in_charge_teacher==false &&  is_timeout==false && answerable==false &&  can_accept_invite== false){
            this.mianBtnTitle = "其他老師正在回答";
            this.mianBtnBgColor = "#4A4A4A";
        }
    }

    @action('底部按钮事件') bottomButtonAction = (actionName) => {
        let {
            status,
            current_user_role,
            is_questioner,
            is_timeout,
    
            answerable,
            can_accept_question,
            can_accept_invite,
            is_in_charge_teacher
    
            } = this.detailData;

            let {
                id,
                subject_id
            } = this.questionInfo;

        


         

        //********* 學生 ***********/

        // 學生-繼續追問
        if(actionName == "繼續追問" && is_questioner==true && is_timeout==false){
            Actions.EditorQuestionPage({editorType:AppStore.Enum_EidtorQuestionType.eidtor, id:id,lastPageStore:this});
        }

        // 學生-關閉提問
        if(actionName == "我懂了" && is_questioner==true){
            global.FetchUtil.post(global.UrlConst.apiCloseQuestion, {params:{question_id:id}}).then((result) => {
               this.requstQuestionDetail(true);
               AppStore.uploadQuestionList(true);
            }).catch((err) => {
                
            });
        }
        // 已回答-追問 已超時
        if(actionName == "完成提問" && is_questioner==true){
            global.FetchUtil.post(global.UrlConst.apiCloseQuestion, {params:{question_id:id}}).then((result) => {
                this.requstQuestionDetail(true);
                AppStore.uploadQuestionList(true);
             }).catch((err) => {
                 
             });
        }

        // 學生-評價老師
        if(actionName == "評價老師" && is_questioner==true){
           this.isShowStarRatingModal = true;
        }




        //********* 老師 ***********/

        // 老師-搶答
        if(actionName == "回答該題目" && can_accept_question==true && is_timeout==false){
            global.FetchUtil.post(global.UrlConst.apiTeacherAcceptQuestion, {params:{id:id}}).then((result) => {
                this.requstQuestionDetail(false);
                AppStore.uploadQuestionList(true);
                Actions.EditorQuestionPage({editorType:AppStore.Enum_EidtorQuestionType.eidtor, id:id,lastPageStore:this});
            }).catch((err) => {
                
            });
        }
        
        // 是-當前主要-老師-接受邀請
        if(actionName == "回答該題目" && can_accept_invite==true && is_in_charge_teacher ==true && is_timeout==false){
            global.FetchUtil.post(global.UrlConst.apiTeacherAcceptInviteQuestion, {params:{question_id:id}}).then((result) => {
                this.requstQuestionDetail(false);
                AppStore.uploadQuestionList(true);
                Actions.EditorQuestionPage({editorType:AppStore.Enum_EidtorQuestionType.eidtor, id:id,lastPageStore:this});
            }).catch((err) => {
                
            });
        }

         // 不是-當前主要-老師-接受邀請
         if(actionName == "接受邀請" && can_accept_invite==true && is_in_charge_teacher ==false && is_timeout==false){
            global.FetchUtil.post(global.UrlConst.apiTeacherAcceptInviteQuestion, {params:{question_id:id}}).then((result) => {
                this.requstQuestionDetail(false);
                AppStore.uploadQuestionList(true);
                Actions.EditorQuestionPage({editorType:AppStore.Enum_EidtorQuestionType.eidtor, id:id,lastPageStore:this});
            }).catch((err) => {
                
            });
        }


        // 老師-繼續回答
        if(actionName == "繼續回答" && answerable==true && is_timeout==false){
            Actions.EditorQuestionPage({editorType:AppStore.Enum_EidtorQuestionType.eidtor, id:id,lastPageStore:this});
        }

        // 老師-邀请其他老师
        if(actionName == "邀请其他老师" && answerable==true && is_timeout==false){
            Actions.ChooseTeacherListPage({lastPageStore:this, chooseType:2, question_id:id, subject_id:subject_id});
        }

    }

    @action('導航欄右邊按钮事件') navRightViewAction = (actionName) => {

        let {
            status,
            current_user_role,
            is_questioner,
            is_timeout,
    
            answerable,
            can_accept_question,
            can_accept_invite,

            is_collected,
            } = this.detailData;

            let {
                id,
                is_typical,
            } = this.questionInfo;

            let {
                isRenderRightViewType,
            } = this;


        //********* 學生 ***********/

        // 可-刪除問題
        if(isRenderRightViewType == 1 && status==0 && current_user_role==1 && is_questioner==true  && is_timeout==false){
            let options = ['取消', '刪除問答'];
            global.ActionSheet.showActionSheetWithOptions({
                title: '請選擇操作',
                options: options,
                cancelButtonIndex: 0,
            }, async (buttonIndex) => {
                    if(options[buttonIndex] == '刪除問答'){
                        global.FetchUtil.post(global.UrlConst.apiDeleteQuestion, {params:{question_id:id}}).then((result) => {
                            Actions.pop();
                            AppStore.uploadQuestionList(true);
                         }).catch((err) => {
                             
                         });

                    }
                }
            );
            
        }

        // 可-收藏
        if(isRenderRightViewType == 2 && (status==2 || status==3)  && current_user_role==1){
            let collectedState = !is_collected;
            global.FetchUtil.post(global.UrlConst.apiCollectQuestion, {params:{question_id:id,is_collect:collectedState}}).then((result) => {
                this.detailData.is_collected = collectedState;
                AppStore.uploadQuestionList(true);
            }).catch((err) => {
                
            });
        }

        //********* 老師 ***********/

         //問題-已關閉(待評價||已評價) 可編輯/標記經典
        if(isRenderRightViewType == 1 && (status==1 || status==2 ||status==3)  && current_user_role==2 && answerable==true){

            let options = ['取消', '為題目起標題', '更改題目屬性', is_typical ? '取消標記為經典':"標記題目為經典"]
            global.ActionSheet.showActionSheetWithOptions({
                title: '請選擇操作',
                options: options,
                cancelButtonIndex: 0,
            },async (buttonIndex) => {
                    if(options[buttonIndex] == '為題目起標題'){
                        this.isShowSettingTiltleModal = true;

                    }
                    if(options[buttonIndex] == '更改題目屬性'){
                        Actions.ChooseQuestionTypePage({lastPageStore:this});                  
                    }
                    if((options[buttonIndex] == '標記題目為經典') || (options[buttonIndex] == '取消標記為經典')){
                        
                        global.FetchUtil.post(global.UrlConst.apiTypicalQuestion, {params:{question_id:id}}).then((result) => {
                            this.questionInfo.is_typical = result.is_typical;
                            AppStore.uploadQuestionList(true);
                        }).catch((err) => {
                            
                        });
                    }
                    
                }
            );
            
        }

    }


    @action('邀请其他老师回答 - 選擇老師回調') chooseTeacherBlock = (teachers = Array) => {
        let { id } = this.questionInfo;
        let idStr = teachers.map((item)=>item.id).join(",");
        global.FetchUtil.post(global.UrlConst.apiQuestionRequestHelp, {params:{question_id:id, teacher_ids:idStr}}).then((result) => {
            global.ToastUtil.showToast(`已成功發出邀請`);
        }).catch((err) => {
            
        });        
    }

    @action('更改題目屬性 - 選擇題目屬性回調') chooseQuestionTypeBlock = (questionTypeInfo) => {
        let { subjectsType, gradeType} = questionTypeInfo;
        let { id } = this.questionInfo;
        global.FetchUtil.post(global.UrlConst.apiUpdateQuestionInfo, {params:{question_id:id, subject_id:subjectsType, grade_id:gradeType}}).then((result) => {
            this.requstQuestionDetail(false);
            global.ToastUtil.showToast(`更改題目屬性成功`);
            AppStore.uploadQuestionList(true);
        }).catch((err) => {
            
        });        
    }

    
}




