import DateUtil from'./DateUtil'
import Md5Util from'./Md5Util'

export default class RandomUtil{

    static randomNum(n=5){
        var rnd="";
        for(var i=0;i<n;i++){
            rnd+=Math.floor(Math.random()*10);
        }
        return rnd;
    }

    static randomFileName(fileSuffix){
        let  timeStamp = parseInt(new Date().getTime()/1000)
        let  randomNum = RandomUtil.randomNum(5)
        let  md5Str = Md5Util.hexMD5(String(timeStamp+randomNum))
        return md5Str + fileSuffix
    }

    static randomUploadFilePath(folder,fileSuffix){
        let  fleName = RandomUtil.randomFileName(fileSuffix)
        let  timeStamp = parseInt(new Date().getTime()/1000)
        console.log("timeStamp111111111111111111",timeStamp)
        let  deteStr = DateUtil.formatTimestamp(timeStamp,"yyyyMMdd");
        let path = folder + "/" + deteStr + "/" + fleName
        return path
    }



}