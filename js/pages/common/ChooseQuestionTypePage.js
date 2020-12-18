import React, { Component } from 'react';
import { View, Text,TextInput, StyleSheet,Platform,Dimensions,TouchableOpacity,PanResponder } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Actions } from 'react-native-router-flux';
import AppStore from '../../stores/AppStore';

import {ChooseQuestionTypePageStore} from '../../stores/CommonStore';
import { observer } from 'mobx-react/native';

const {width, height} = Dimensions.get('window');

@observer
export default class ChooseQuestionTypePage extends Component {
   
    constructor(props) {
        super(props);  
        this.pageStore = new ChooseQuestionTypePageStore()
        // this.pageStore.chooseType = this.props.chooseType
        this.lastPageStore = this.props.lastPageStore;
    }
 
    render() {

        let subjectsList  = this.pageStore.subjectsList
        let gradeList     = this.pageStore.gradeList
        let  subjectsType = this.pageStore.subjectsType
        let  gradeType    = this.pageStore.gradeType

        return (
            <View style={styles.container}>
                
                <View style={{flex:1}}>
                <Text style={{marginLeft:32,marginTop:15,marginBottom:25,color:"#4A4A4A",fontSize:14}}>選擇科目:</Text>
                <View style={{marginLeft:32,marginRight:32,flexDirection:'row',flexWrap: 'wrap',alignItems: 'center',justifyContent:"space-between"}}>
                    {
                        subjectsList.map((item, i)=>{
                            return (
                                <View  key={i} style={{width:(width-32*2-20)/2,flexDirection: 'row',alignItems: 'center',height: 50,marginTop:15}}>
                                    <TouchableOpacity  activeOpacity={0.5} style={{flex: 1,backgroundColor: subjectsType == item.id ? '#0084FF':'#fff',borderColor:"#979797",borderWidth:subjectsType == item.id ? 0:1,height: 50,borderRadius: 4,alignItems: 'center',justifyContent: 'center'}}
                                                    onPress={() => {
                                                        this.pageStore.subjectsType = item.id

                                    }}>
                                        <Text style={{color: subjectsType == item.id ?'#fff':'#4A4A4A',fontSize: 14 }}>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            );      
                        })
                    }

                </View>

                <Text style={{marginLeft:32,marginTop:40,marginBottom:25,color:"#4A4A4A",fontSize:14}}>選擇年級:</Text>
                <View style={{marginLeft:32,marginRight:32,flexDirection:'row',flexWrap: 'wrap',alignItems: 'center',justifyContent:"space-between"}}>
                    {
                        gradeList.map((item, i)=>{
                            return (
                                <View key={i} style={{width:(width-32*2-20)/2,flexDirection: 'row',alignItems: 'center',height: 50,marginTop:15}}>
                                    <TouchableOpacity  activeOpacity={0.5} style={{flex: 1,backgroundColor: gradeType == item.id ? '#0084FF':'#fff',borderColor:"#979797",borderWidth:gradeType == item.id ? 0:1,height: 50,borderRadius: 4,alignItems: 'center',justifyContent: 'center'}}
                                                    onPress={() => {
                                                this.pageStore.gradeType = item.id

                                    }}>
                                        <Text style={{color: gradeType == item.id ?'#fff':'#4A4A4A',fontSize: 14 }}>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            );      
                        })
                    }

                </View>
                

                {/*下一步  || 完成  按钮*/}
                <View style={{flex:1,marginLeft:108,marginRight:108,marginBottom:0,flexDirection: 'row',alignItems: 'center',height: 50,}}>
                        <TouchableOpacity  activeOpacity={0.5} style={{flex: 1,backgroundColor: '#FF5477',height: 50,borderRadius: 25,alignItems: 'center',justifyContent: 'center',marginTop: 20}}
                                          onPress={() => {
                            let info = {subjectsType:subjectsType, gradeType:gradeType};
                            if(this.lastPageStore){
                                this.lastPageStore.chooseQuestionTypeBlock(info);
                                Actions.pop();
                            }else{
                                Actions.EditorQuestionPage({...info, editorType:AppStore.Enum_EidtorQuestionType.create});
                            }

                        }}>
                            <Text style={{color: '#fff',fontSize: 18 }}>{this.lastPageStore ? "完成":"下一步"}</Text>
                        </TouchableOpacity>
                </View>

                </View>

            </View>



        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

