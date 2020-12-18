import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView,
    TextInput
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import ToastUtil from '../../utils/ToastUtil';
import {FeedbackPageStore} from '../../stores/UserStore';
import ImagePickerUtil from './../../utils/ImagePickerUtil';

 const {width,height} = Dimensions.get('window');

 export default class FeedBackPage extends React.Component{

     constructor(props){
         super(props);
         this.state = {
             uploadImg: [1],
             content: '',
             mobile: ''
         };
         this.FeedbackPageStore = new FeedbackPageStore();
      }
// 选择图片
     choiceImage() {


        //  let options = {
        //      compressImageQuality: 0.25,
        //      compressImageMaxWidth: 480,
        //      compressImageMaxHeight: 800,
        //      multiple: true,
        //      mediaType: 'photo'
        //  };
        //  ImagePicker.openPicker(options).then((imageList) => {
        //      // console.log('--------', images);
        //      let images = this.state.images;
        //      if (images.length > 8) {
        //          ToastUtil.show("最多上传8张图片");
        //          return;
        //      }
        //      for (let i = 0; i < images.length; i++) {
        //          for (let j = 0; j < imageList.length; j++) {
        //              if (images[i] == imageList[j]) {
        //                  images.splice(i, 1);
        //                  break;
        //              }
        //          }
        //      }
        //      images = images.concat(imageList);
        //      if (images.length > 9) {
        //          images.splice(9, images.length - 9);
        //      }
        //      this.setState({
        //          images
        //      })
        //  }).catch((error) => {
        //      if (error.message == 'User cancelled image selection') {
        //          ToastUtil.show('已取消选择');
        //      } else if (error.message == 'Invalid image selected') {
        //          ToastUtil.show('选择图片无效，请重新选择');
        //      } else {

        //      }
        //  });


        // ImagePickerUtil.showImagePicker().then((res)=>{
        //         console.log(res);
        //         let { source, path } = res;

        //     let uploadImg = this.state.uploadImg;
        //      if (uploadImg.length > 8) {
        //          ToastUtil.show("最多上传8张图片");
        //          return;
        //      }

        //     //  for (let i = 0; i < images.length; i++) {
        //     //      for (let j = 0; j < imageList.length; j++) {
        //     //          if (images[i] == imageList[j]) {
        //     //              images.splice(i, 1);
        //     //              break;
        //     //          }
        //     //      }
        //     //  }

        //      uploadImg = uploadImg.push(source);
        //      if (uploadImg.length > 9) {
        //          uploadImg.splice(9, images.length - 9);
        //      }
        //      this.setState({
        //          uploadImg
        //      })
               

        //     }).catch((err)=>{

        //     });




     }
//上传图片
     async uploadImg(image) {
         try {
             let json = await this.FeedbackPageStore.uploadFeedbackPic(image);
             console.log("json-------", json);
             return json;
         } catch (error) {
             console.log("error-------", error);
         }
     }
 //确认反馈
     async onSubmitPress() {
         let {content, mobile, uploadImg} = this.state;
         if (!content || content.replace(/(^s*)|(s*$)/g, "").length == 0) {
             ToastUtil.show('请输入反馈内容');
             return;
         }
         if (mobile.length > 11) {
             ToastUtil.show('请输入正确的手机号');
             return;
         }
         let uploadImgList = '';
         for (let i = 0; i < uploadImg.length; i++) {
             if (i === 0) {
                 continue;
             }
             let path = '';
             if (Platform.OS === 'ios') {
                 path = images[i].path.replace('file://', '');
             } else {
                 path = images[i].path;
             }
             let json = await this.uploadImg(path);
             if (json && json.code === 200) {
                 let imgUrl = json.result.urlpath;
                 if (imgUrl) {
                     if (uploadImgList) {
                         uploadImgList = uploadImgList + ';' + imgUrl;
                     } else {
                         uploadImgList = imgUrl;
                     }
                 }
             }
         }
         this.FeedbackPageStore.feedback(mobile, content, uploadImgList).then((json) => {
             // console.log("json-------", json)
             this.props.navigator.pop();
         }).catch((error) => {
             console.log("error-------", error)
         })
     }

//navigatorBar
 renderNavigatorBar(){
            return (
                <View style={{height:Platform.OS === 'ios'?64:44, backgroundColor:'#0298FE',flexDirection:'row',alignItems:'flex-end',}}>
                    <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center'}} onPress={() => {this.props.navigator.pop();}}>
                            <Image style={{margin:8,width:26,height:26}} source={require('./../../images/icon_white_back.png')}/>
                    </TouchableOpacity>
                    <View style={{flex:1,height:44,alignItems: 'center',justifyContent:'center'}}>
                            <Text style={{color:'#fff',fontSize:17,fontWeight: 'bold'}}>意见反馈</Text>
                    </View>
                    <TouchableOpacity style={{width:88,height:44,marginTop:20,justifyContent:'center',alignItems:'flex-end'}} onPress={() => {}}>
                            <Text style={{marginRight:8,fontSize:15}}></Text>
                    </TouchableOpacity>
                </View>
                    );
}
//添加意见反馈图片
renderUploadImgView() {
    let itemWidth = (width - 90) / 4;
    let imgViews = [];
    for (let i = 0; i < this.state.uploadImg.length; i ++){
        if (i >= 7) {
            break;
        }
        if (i === 0){
            imgViews.push(
                <TouchableOpacity key={`uploadImg${i}`} style={{backgroundColor:'#fff',marginLeft:10,alignItems:'center',justifyContent:'center',marginBottom: 10}} onPress={() => this.choiceImage()}>
                    <Image style={{height:itemWidth,width:itemWidth,resizeMode:'contain'}} source={require('./../../images/btn_add_photos.png')}/>
                </TouchableOpacity>
            )
        } else {
            let item = this.state.uploadImg[i];
            let source = '';
            if (Platform.OS === 'ios') {
                source = {uri: item.replace('file://', ''), isStatic: true};
            } else {
                source = {uri: item, isStatic: true};
            }
            imgViews.push(<Image key={`uploadImg${i}`} style={{height:itemWidth,width:itemWidth,marginLeft:10,resizeMode:'cover',marginBottom: 10}} source={source}/>)
        }
    }
    return (
        <View style={{flexDirection:'row',alignItems:'center',flexWrap: 'wrap'}}>
            {imgViews}
        </View>
    )
}

renderContentView(){
    return (
        <View style={{flex:1}}>
                <View style={{margin:16,backgroundColor:'#fff',justifyContent:'flex-end',borderRadius:5,borderWidth:0.5,borderColor:'rgba(200,200,200,0.5)'}}>
                          <TextInput style={{height: 100,fontSize:15,margin:8,textAlignVertical: 'top'}} onChangeText={(txt) => this.setState({content: txt})} multiline={true} placeholder={'请输入您的宝贵意见,我们将第一时间关注,不断优化改进...'} placeholderTextColor={'#999999'} underlineColorAndroid="transparent"/>
                          {this.renderUploadImgView()}
                </View>
                <View style={{height:20,marginLeft:16,flexDirection:'row'}}>
                   <Text style={{color:'#666666'}}>您的联系方式</Text>
                   <Text style={{color:'#999999',fontSize:12}}>  (选填)</Text>
                </View>
                <View style={{height:40,margin:16,marginTop:4,flexDirection:'row',borderRadius:5,borderWidth:0.5,borderColor:'rgba(200,200,200,0.5)',backgroundColor:'#fff'}}>
                        <TextInput style={{flex:1,margin:4,fontSize:15,}} placeholder={'请输入'} onChangeText={(txt) => this.setState({mobile: txt})} placeholderTextColor={'white'} underlineColorAndroid="transparent"/>
                </View>
                <TouchableOpacity style={{backgroundColor:'#0298FE',height:40,borderRadius:5,alignItems:'center',justifyContent:'center',margin:16,marginTop:20}} onPress={() => this.onSubmitPress()}>
                      <Text style={{ color:'#fff',fontSize:15}}>确认提交</Text>
                </TouchableOpacity>
        </View>
    );
}


    render() {
        return (
            <View style={styles.container}>
             {this.renderNavigatorBar()}
             {this.renderContentView()}
           </View>

        )
    }
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: 'rgb(245,245,245)',
  },
})
