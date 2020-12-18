
import { Platform } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ToastUtil from './ToastUtil';

export default class ImagePickerUtil {

    //单选图片
    static  showImagePicker(){

         let options = {
            title: '請選擇圖片',
            cancelButtonTitle: '取消',
            chooseFromLibraryButtonTitle: '相冊',
            takePhotoButtonTitle: '拍照',
            allowsEditing: false,
            quality: 0.8,
            maxWidth: 1080,
           maxHeight: 1080,
            mediaType: 'photo',
            noData:false
        };

        return new Promise((resolve, reject) => {

            ImagePicker.showImagePicker(options, (res) => {
                    console.log(res);
                    if (res.didCancel) {
                        // ToastUtil.showToast('已取消选择');
                        reject('已取消选择');
                    } else if (res.error) {
                        ToastUtil.showToast('选择图片错误');
                        reject('选择图片错误');
                    } else if (res.customButton) {

                    } else {
                        console.log(parseFloat( res.data.length / (1024*1024) )+"M");
                        let source = '';
                        let path = '';
                        if (Platform.OS === 'ios') {
                            source = {uri: res.uri.replace('file://', ''), isStatic: true};
                            path = res.uri.replace('file://', '');
                        } else {
                            source = {uri: res.uri, isStatic: true};
                            path = res.path;
                        }
                        resolve({source, path});
                       
                    }

                });
            });

    }

    //選擇 視頻
    //videoQuality will be "low", "medium" or "high"
    static  showVideoPicker(){

        const options = {
            title: '選擇視頻',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '錄製視頻',
            chooseFromLibraryButtonTitle: '選擇視頻',
            mediaType: 'video',
            videoQuality: 'high',
            durationLimit:15,
            allowsEditing:true,
            noData:true
        };

       return new Promise((resolve, reject) => {

           ImagePicker.showImagePicker(options, (res) => {
               console.log("ffgfhfhfhfh", res);
                   if (res.didCancel) {
                       // ToastUtil.showToast('已取消选择');
                       reject('已取消選擇');
                   } else if (res.error) {
                       ToastUtil.showToast('錄製視頻出錯了');
                       reject('錄製視頻出錯了');
                   } else if (res.customButton) {

                   } else {
                       
                    let path = '';
                    if (Platform.OS === 'ios') {
                        path = res.uri.replace('file://', '');
                        resolve(path);
                    } else {
                        if(res.path.search(".mp4") != -1){
                            path = res.path;
                            resolve(path);

                        }else{
                            ToastUtil.showToast('请选择正确格式的视频!');
                            reject(path);
                        }
                    }
                      
                   }

               });
           });

   } 

}
