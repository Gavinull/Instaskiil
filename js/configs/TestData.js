
//洗手商场
var shopGoodList=[
    {
        title:'蜡拖除尘掸子擦车拖把洗车神器软毛刷车刷子清洁工具专用',
        price:0.01,
        isSelect:false,
        selectNumber:0,
        imgurl:'https://img.alicdn.com/imgextra/i3/1123620462/TB23_XzcFXXXXaYXXXXXXXXXXXX-1123620462.jpg'
    },
    {
        title:'洗车刷子长柄伸缩汽车刷软毛蜡拖擦车拖把洗车工具清洁用品车刷',
        price:0.03,
        isSelect:false,
        selectNumber:0,
        imgurl:"https://img.alicdn.com/imgextra/i4/2771670990/TB2eJ1IXMwjyKJjSspeXXXXZXXa_!!2771670990.jpg"
    },
    {
        title:'洗车刷子长柄伸缩软毛刷子纯棉擦车专用工具刷车拖布汽车用品拖把',
        price:0.02,
        isSelect:false,
        selectNumber:0,
        imgurl:"https://img.alicdn.com/bao/uploaded/i1/TB1fi5qQXXXXXctXVXXYXGcGpXX_M2.SS2_145x145xz.jpg"
    }
];


//我的采购(待支付)
var myShopOrder_Pay_List = [
    {
        order_num:2017401234345,
        order_state:1,
        price:'0.09',
        goodList:[
            {
                title:'蜡拖除尘掸子擦车拖把洗车神器软毛刷车刷子清洁工具专用',
                price:'0.01',
                selectNumber:3,
                imgurl:'https://img.alicdn.com/imgextra/i3/1123620462/TB23_XzcFXXXXaYXXXXXXXXXXXX-1123620462.jpg'
            },
            {
                title:'洗车刷子长柄伸缩汽车刷软毛蜡拖擦车拖把洗车工具清洁用品车刷',
                price:'0.03',
                selectNumber:2,
                imgurl:"https://img.alicdn.com/imgextra/i4/2771670990/TB2eJ1IXMwjyKJjSspeXXXXZXXa_!!2771670990.jpg"
            }
        ]
    },
    {
        order_num:2017401234643,
        order_state:1,
        price:'0.02',
        goodList:[
            {
                title:'洗车刷子长柄伸缩软毛刷子纯棉擦车专用工具刷车拖布汽车用品拖把',
                price:'0.02',
                selectNumber:2,
                imgurl:"https://img.alicdn.com/bao/uploaded/i1/TB1fi5qQXXXXXctXVXXYXGcGpXX_M2.SS2_145x145xz.jpg"
            }
        ]
    },
];

//我的采购(送货中)
var myShopOrder_server_List = [
     {
        order_num:2017401234441,
        order_state:2,
        price:'0.04',
        goodList:[
            {
                title:'洗车刷子长柄伸缩软毛刷子纯棉擦车专用工具刷车拖布汽车用品拖把',
                price:'0.02',
                selectNumber:2,
                imgurl:"https://img.alicdn.com/bao/uploaded/i1/TB1fi5qQXXXXXctXVXXYXGcGpXX_M2.SS2_145x145xz.jpg"
            }
        ]
    },
    {
        order_num:2017401234445,
        order_state:2,
        price:'0.09',
        goodList:[
            {
                title:'蜡拖除尘掸子擦车拖把洗车神器软毛刷车刷子清洁工具专用',
                price:'0.01',
                selectNumber:3,
                imgurl:'https://img.alicdn.com/imgextra/i3/1123620462/TB23_XzcFXXXXaYXXXXXXXXXXXX-1123620462.jpg'
            },
            {
                title:'洗车刷子长柄伸缩汽车刷软毛蜡拖擦车拖把洗车工具清洁用品车刷',
                price:'0.03',
                selectNumber:2,
                imgurl:"https://img.alicdn.com/imgextra/i4/2771670990/TB2eJ1IXMwjyKJjSspeXXXXZXXa_!!2771670990.jpg"
            }
        ]
    }, 
];


//我的采购(已完成)
var myShopOrder_completed_List = [
     {
        order_num:2017401234443,
        order_state:3,
        price:'0.04',
        goodList:[
            {
                title:'洗车刷子长柄伸缩软毛刷子纯棉擦车专用工具刷车拖布汽车用品拖把',
                price:'0.02',
                selectNumber:2,
                imgurl:"https://img.alicdn.com/bao/uploaded/i1/TB1fi5qQXXXXXctXVXXYXGcGpXX_M2.SS2_145x145xz.jpg"
            }
        ]
    },
];

//历史订单
var orderHistoryList = [
    {
        order_num:2017401234445,
        order_state:1,
        car_info:'粤C K1687 奥迪 Q8 白色',
        server:'普洗,抛光',
        address:"前山莲塘天大药业"
    },
    {
        order_num:201740123454,
        order_state:1,
        car_info:'粤C KC666 宝马 3系 红色',
        server:'普洗',
        address:"珠海周山路21号协昌大夏"
    }, 
    {
        order_num:201740123852,
        order_state:1,
        car_info:'粤C K1284 法拉利 至尊 黄色',
        server:'抛光',
        address:"香洲总站隔壁"
    }, 
    {
        order_num:201740652349,
        order_state:1,
        car_info:'粤C CB853 日产 轩逸 黑色',
        server:'普洗,抛光',
        address:"翠香路88号豪庭花园"
    },

];

//我的账本
var myBooksList = [
    {
        price:100,
        time:1440045300,
        state:1,
        server:'完成订单',
    },
    {
        price:88,
        time:1430000000,
        state:2,
        server:'提现至支付宝',
    },
    {
        price:200,
        time:1420000000,
        state:1,
        server:'完成订单',
    },
    {
        price:168,
        time:1410000000,
        state:2,
        server:'提现至银行卡',
    },
    {
        price:168,
        time:1400000000,
        state:1,
        server:'完成订单',
    },
    
];


export default {
    shopGoodList:shopGoodList,
    orderHistoryList:orderHistoryList,
    myBooksList:myBooksList,
    myShopOrder_Pay_List:myShopOrder_Pay_List,
    myShopOrder_server_List:myShopOrder_server_List,
    myShopOrder_completed_List:myShopOrder_completed_List,

   
}