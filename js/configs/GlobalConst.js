import React, { Component } from 'react';
import { Dimensions, AsyncStorage, PixelRatio, Platform, Alert } from 'react-native';

// 项目中的图片可以通过Images.xxx 获取
import Images from '../resources/index';
// 统一管理项目中的路由
import { Actions } from "react-native-router-flux";
// teaset中提供的一些常用方法
import { Theme, Toast } from 'teaset';
// 基于react-native-fetch-blob封装的网络请求
// import RTRequest from '../utils/RequestUtil';

import FetchUtil from './../utils/FetchUtil'
import RegularUtil from './../utils/RegularUtil'
import ToastUtil from './../utils/ToastUtil'
import DateUtil from './../utils/DateUtil'


import UrlConst from './UrlConst'
import KeyConst from './KeyConst'
import ScreenUtil from './../utils/ScreenUtil'

// 通过系统API获得屏幕宽高
let { height, width } = Dimensions.get('window');
// 系统是iOS
global.iOS = (Platform.OS === 'ios');
// 系统是安卓
global.Android = (Platform.OS === 'android');
// 获取屏幕宽度
global.SCREEN_WIDTH = width;
// 获取屏幕高度
global.SCREEN_HEIGHT = height;
// 获取屏幕分辨率
global.PixelRatio = PixelRatio.get();
// 最小线宽
global.pixel = 1 / PixelRatio;
// 主题
global.Theme = Theme;
// 网络请求
// global.RTRequest = RTRequest;
// router跳转的方法
global.Actions = Actions;
// 图片加载
global.Images = Images;
// 弹出框
global.Alert = Alert;
// 存储
global.AsyncStorage = AsyncStorage;
// 弹框Toast


global.FetchUtil = FetchUtil;
global.RegularUtil = RegularUtil;
global.ToastUtil = ToastUtil;
global.ScreenUtil = ScreenUtil;
global.DateUtil = DateUtil;


global.UrlConst = UrlConst;
global.KeyConst = KeyConst;



// export const apiHost   = 'http://buddy.xiarikui.cn/U';
// export const imageHost = 'http://buddy.xiarikui.cn';
// export const unConnectError  = '无法连接服务器';
// export const connecError     = '连接服务器出错';
