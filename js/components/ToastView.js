
import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Text,
    Image,
    TouchableOpacity,
    TabBarIOS,
    Vibration,
    DeviceEventEmitter,
    Dimensions,
    Animated
} from 'react-native';
const { width, height} = Dimensions.get('window');

const showID = 'baddy_toast_show_message';
const hideID = 'baddy_toast_hide_message';


let instance = null;

class ToastUtil {

    constructor(){
        if(!instance){  
            instance = this;  
        }
        return instance;
    }

    show(message){
         DeviceEventEmitter.emit(showID, message);   
    }

    hide(){
        DeviceEventEmitter.emit(hideID, false);   
    }

}
const Toast =  new ToastUtil();
export { Toast };

export default class ToastView extends React.Component {

        constructor(props){
             super(props);            
             this.state = {
                 opacity: new Animated.Value(0),
                 show:true,
                 message:''
             };          
        }

        componentDidMount(){
            this.showListener = DeviceEventEmitter.addListener(showID, (message)=>{    
                    console.log(message);
                    this.setState({
                        show:true,
                        message:message
                    });
                    Animated.timing(this.state.opacity, {
                        toValue: 5,
                        duration: 5000,
                     }).start(({finished}) => {
                          var totalsmstime=1;
                         this.timer=setInterval(() => { 
                         --totalsmstime;
                         if(totalsmstime===0){
                              this.setState({ show:false});
                               clearInterval(this.timer);
                            }
                         }, 1000);
                         
                     });
                   
            }); 
            this.hideListener = DeviceEventEmitter.addListener(hideID, (hide)=>{    
                    console.log(hide);
                    this.setState({
                        show:hide,
                    });
            });  
        }
        
        componentWillUnmount(){
            this.showListener.remove();
            this.hideListener.remove();
        }


        render() {
              return (
                 <Animated.View style={{backgroundColor:'rgba(50,50,50,0.5)', opacity:this.state.opacity, borderRadius:5, position:'absolute', alignSelf:'center', marginTop:height/2-50}}>
                      <Text style={{color:'#fff', textAlign:'center', backgroundColor:'transparent', padding:4, paddingLeft:8, paddingRight:8}}>{ this.state.message }</Text>
                 </Animated.View>
              );
          }
         
     

}



