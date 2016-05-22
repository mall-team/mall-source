var $ = require('zepto');
var Bubble = require('common/bubble/bubble');

function gotoplay() {
    Bubble.show('暂未开放');
    // var gourl = "http://pyq001.wuse.com/play";
    // if (Math.random() > 0.6) {
    //     gourl = 'http://mp.weixin.qq.com/s?__biz=MzA3MjM1NTM1MA==&mid=209737832&idx=1&sn=0b1278f1a9fbaec425f66afe63b97476&scene=0#rd';
    // }
    // location.href = gourl;
};

function safetostring(str) {
    return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}
var nickname = '山';
var headimgurl = "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAkfYkySDWhLS0ib8icMw9iazGC9A2qkq6P93Rnib5C7Av6fDGEDXyv453xgAGricQhmx06GST3JB0Fmjw/0";
var user_sex = 1;
if (user_sex == 2) {
    $("#list").html($("#woman").html());
} else {
    $("#list").html($("#man").html());
}
setTimeout(function() {
    $(".data-name").text(safetostring(nickname));
    $(".data-avt").attr("src", headimgurl);
}, 0);

$(document.body).show();
$("#gotoshare").click(function() {
    $("#guide").show();
});

$("#guide").click(function() {
    $(this).hide();
});