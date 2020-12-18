    // 是否电话号码
    const isPhoneNumber = (phoneNumber) => {
        const reg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
        return reg.test(phoneNumber);
    };

    // 数字或字母两者组合6-20位
    const isAccount = (account) => {
        const reg = /^[0-9A-Za-z]{6,20}$/;
        return reg.test(account);
    };

    // 数字或字母两者组合6-16位
    const isPassword = (password) => {
        const reg = /^[0-9A-Za-z]{6,16}$/;
        return reg.test(password);
    };

    const isNewPassword = (password) => {
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,14}$/;
        return reg.test(password);
    };

    // 是否含有数字和小数点
    const isFloat = (char) => {
        const reg = /^\d+(.\d+)?$/;
        return reg.test(char);
    };

    // 是否是邮箱
    const isEmail = (char) => {
        const reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        return reg.test(char);
    };

    // 是否是 澳门电话 
    const isMacauPhone = (char) => {
        
        // const reg = /^((((0?)|((00)?))(((\s){0,2})|([-_－—\s]?)))|([+]?))(853)?([]?)([-_－—\s]?)(28[0-9]{2}|((6|8)[0-9]{3}))[-_－—\s]?[0-9]{4}$/;
        const reg = /^[0-9-]*$/;
        return reg.test(char);
    };



module.exports = {
    isPhoneNumber,
    isAccount,
    isPassword,
    isNewPassword,
    isFloat,
    isEmail,
    isMacauPhone
};
