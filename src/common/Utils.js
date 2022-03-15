import cookie from "react-cookies";

let Utils = {
  setProfile: function (profile) {
    cookie.save("profile", JSON.stringify(profile), { path: "/" });
  },
  getProfile: function () {
    return JSON.parse(cookie.load("profile", { path: "/" }));
  },
  setToken: function (token) {
    cookie.save("token", token, { path: "/" });
  },
  getToken: function () {
    return cookie.load("token", { path: "/" });
  },
  rmToken: function () {
    cookie.remove("token", { path: "/" });
  },
  cSharpDateToJsData(csDate) {
    return new Date(Date.parse(csDate));
  },
  //创建时间格式化显示
  dateFtt: function (fmt, date) {
    //author: meizz
    let o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  },
  crtTimeFtt: function () {
    let crtTime = new Date();
    return this.dateFtt("yyyy-MM-dd hh:mm:ss", crtTime);
  },
  crtTimeMs: function () {
    let crtTime = new Date();
    return this.dateFtt("hh-mm-ss-S", crtTime);
  },
  crtTimeDate: function () {
    let crtTime = new Date();
    return this.dateFtt("yyyy-MM-dd", crtTime);
  },
  getDomain: function () {
    if (process.env.NODE_ENV === "development") {
      return "";
    } else {
      return "https://msapi.azurewebsites.net/";
    }
  },
};

export default Utils;
