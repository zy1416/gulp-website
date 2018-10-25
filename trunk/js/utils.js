var isWeixin = /MicroMessenger/i.test(navigator.userAgent) ? true : false;
var isiOS = (function () {
    var u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
})();


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var q = window.location.pathname.substr(1).match(reg_rewrite);
    if (r != null) {
        return unescape(r[2]);
    } else if (q != null) {
        return unescape(q[2]);
    } else {
        return null;
    }
}

function getBrowerLang() {
    var browserLang = (navigator.language || navigator.browserLanguage).toLowerCase();
    if (browserLang.indexOf('zh') > -1) {
        browserLang = browserLang.indexOf('cn') > -1 ? 'cn' : 'tw';
    } else {
        browserLang = 'en';
    }
    return browserLang;
}

