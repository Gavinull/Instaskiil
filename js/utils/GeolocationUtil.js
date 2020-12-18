export default class GeolocationUtil{

    /*
     * 定位
     * return: latitude,longitude
    */
    static positioning(){
        return  new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                     let latitude = JSON.stringify(position.coords.latitude);//纬度
                     let longitude = JSON.stringify(position.coords.longitude);//经度
                     let result = {latitude, longitude};
                     resolve(result);
                },
                (error) =>{
                     reject(error);
                },
                {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000}
                );
        });  
    }


    /*
     * 高德的地理编码
     * param:  address ,apikey=高德web密钥
    */
    static geocode(address, apikey='b3893e791c7271f185b8d47116d571a9'){
        return  new Promise(function (resolve, reject) {
            fetch(`http://restapi.amap.com/v3/geocode/geo?key=${apikey}&address=${address}`)
            .then((response)=>response.json())
            .then((responseBody)=>{
                if(responseBody.status ==1){
                    console.log(responseBody);
                    let geocodes = responseBody.geocodes;
                    resolve(geocodes);
                }else {
                    resolve(responseBody);
                }
            }).catch((error)=>{
                reject(error);
            });
        });  
    }
     
    /*
     * 高德的反地理编码
     * param:  latitude,longitude,apikey=高德web密钥
    */
    static regeocode(latitude, longitude, apikey='b3893e791c7271f185b8d47116d571a9'){
        return  new Promise(function (resolve, reject) {
            fetch(`http://restapi.amap.com/v3/geocode/regeo?extensions=all&key=${apikey}&location=${longitude},${latitude}`)
            .then((response)=>response.json())
            .then((responseBody)=>{
                if(responseBody.status ==1){
                    console.log(responseBody);
                    let province = responseBody.regeocode.addressComponent.province;
                    let city = responseBody.regeocode.addressComponent.city;
                    let district = responseBody.regeocode.addressComponent.district;
                    let township = responseBody.regeocode.addressComponent.township;
                    let address = responseBody.regeocode.formatted_address;
                    let pois = responseBody.regeocode.pois;
                    let result = {province, city, district, township, address, pois };
                    resolve(result);
                }else {
                    resolve(responseBody.regeocode);
                }
            }).catch((error)=>{
                reject(error);
            });
        });  
    }


    /*
     * 高德的坐标转换
     * param:  latitude,longitude,apikey=高德web密钥
    */
    static changeCoordinate(latitude, longitude, apikey='b3893e791c7271f185b8d47116d571a9'){
        return  new Promise(function (resolve, reject) {
            fetch(`http://restapi.amap.com/v3/assistant/coordinate/convert?coordsys=gps&key=${apikey}&locations=${longitude},${latitude}`)
            .then((response)=>response.json())
            .then((responseBody)=>{
                if(responseBody.status ==1){
                    let locationStr= new Array(); 
                        locationStr = responseBody.locations.split(',');
                        if(locationStr.length==2){
                           let latitude = parseFloat(locationStr[1]);
                           let longitude = parseFloat(locationStr[0]);
                           let result = {latitude, longitude};
                           resolve(result);
                            return;
                        }else{
                            resolve(responseBody);
                        }
                        
                }else {
                    resolve(responseBody);
                }
            }).catch((error)=>{
                reject(error);
            });
        });  
    }
 



  

}