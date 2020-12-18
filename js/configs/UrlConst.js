const host = "https://b2-api.majiawei.com"

if( __DEV__ ){
    host = "https://b2-api.majiawei.com"
}else{
    host = "https://b2-api.majiawei.com"
}

const sourceHost = "http://rs.majiawei.com/"
const qiniuHost = "http://up-z2.qiniu.com/"

//commom
const apiBannerList = host + "/v1/banner/list";
const apiGetUploadToken = host + "/v1/oss/upload-token"
const apiUpdatePassword = host + "/v1/passport/reset-password"
const apiLogin = host + "/v1/passport/login"
const apiRegister = host + "/v1/passport/register"
const apiCheckUsername = host + "/v1/passport/check-username"

const apiGetUserInfo = host + "/v1/account/profile"
const apiSetUserInfo = host + "/v1/account/edit-profile"

const apiGetGradeList = host + "/v1/grade/all"
const apiGetSubjectList = host + "/v1/subject/all"

const apiGetTeacherList = host + "/v1/teacher/list"
const apiCreateQuestion = host + "/v1/question/create"
const apiGetQuestionDetail = host + "/v1/question/detail"

const apiReplyQuestion = host + "/v1/question/reply"
const apiEvaluateQuestion = host + "/v1/question/evaluate"
const apiRecommendQuestionList = host + "/v1/question/recommend"




//學生關閉提問
const apiCloseQuestion = host + "/v1/question/close"
//刪除提問，只有未被回答的提問可以被刪除
const apiDeleteQuestion = host + "/v1/question/delete"
const apiGetQuestionList = host + "/v1/question/my-list"
const apiGetCollectionnList = host + "/v1/question/my-collection"
const apiCollectQuestion = host + "/v1/question/collect"
const apiSearchQuestion = host + "/v1/question/search"

// 老师
const apiGetTeacherQuestionList = host + "/v1/question/for-teacher"
const apiTeacherAcceptInviteQuestion = host + "/v1/question/accept-invite"
const apiTeacherAcceptQuestion = host + "/v1/question/accept"
const apiTypicalQuestion = host + "/v1/question/update-typical"
const apiUpdateQuestionInfo = host + "/v1/question/update-meta"
const apiUpdateQuestionTitle = host + "/v1/question/update-title"
const apiQuestionRequestHelp = host + "/v1/question/ask-for-help"
const apiGetCanHelpTeacherList = host + "/v1/question/teacher-inviting"
const apiSetGoodSubjectList = host + "/v1/subject/good-subject"



module.exports = {
    host,
    sourceHost,
    qiniuHost,

    apiBannerList,
    apiGetUploadToken,
    apiUpdatePassword,

    apiLogin,
    apiRegister,
    apiCheckUsername,
    apiGetUserInfo,
    apiSetUserInfo,
    apiGetGradeList,
    apiGetSubjectList,
    apiSetGoodSubjectList,
    apiGetTeacherList, 
    apiCreateQuestion,
    apiCloseQuestion,
    apiDeleteQuestion,
    apiGetQuestionDetail,
    apiGetQuestionList,
    apiGetCollectionnList,
    apiReplyQuestion,
    apiEvaluateQuestion,
    apiCollectQuestion,
    apiRecommendQuestionList,
    apiSearchQuestion,


    apiGetTeacherQuestionList,
    apiTeacherAcceptInviteQuestion,
    apiTeacherAcceptQuestion,
    apiTypicalQuestion,
    apiUpdateQuestionInfo,
    apiUpdateQuestionTitle,
    apiQuestionRequestHelp,
    apiGetCanHelpTeacherList

  };