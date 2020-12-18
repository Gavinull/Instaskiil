import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    Image
} from 'react-native';

import Swiper from 'react-native-swiper';
import { Actions } from 'react-native-router-flux';

let {width, height} = Dimensions.get('window');

export default class Banner extends React.Component {

        constructor(props){
            super(props);
            this.state = {
                imageModels:[],
            };

        }

        componentDidMount(){

            global.FetchUtil.get(global.UrlConst.apiBannerList).then((result) => {
                
                this.setState({
                    imageModels:result.banners            
               });
            }).catch((err) => {

            });
        }

        _onDidCheckImage(model){
            if(model.url){
                Actions.WebPage({url:model.url});
            }
        }

        render() {
            console.log("asansajnakn",this.state.imageModels);
            return (
                <View style={{height:this.state.imageModels.length ? (width*(150/375)):0, backgroundColor:"#f0f0f0"}} {...this.props}>
                    
                    {
                        this.state.imageModels ? 
                    
                        (<Swiper autoplay={true} 
                                loop={true}
                                showsPagination={true}
                                autoplayTimeout={3}
                                paginationStyle={{bottom: 10}}
                                dotColor={"#fff"}
                                activeDotColor={"#0084FF"}
                                >
                                    {
                                        this.state.imageModels.map((model, i) => {
                                            return (
                                                <TouchableOpacity key={i} activeOpacity={1} style={styles.imageContainer} onPress={()=>{ this._onDidCheckImage(model);}}>
                                                    <Image style={{flex:1, width:width, height:150, resizeMode:'contain'}} source={{uri:model.image}}>
                                                    </Image>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                        </Swiper>):null
                    }
                </View>
            );
        }

}

let styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        overflow:'hidden'
    }
});
