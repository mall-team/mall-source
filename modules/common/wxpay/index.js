var Bubble = require('common/bubble/bubble');

var jsParams, toUrl;

//调用微信JS api 支付
function jsApiCall() {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', JSON.parse(jsParams),
        function(res) {
            WeixinJSBridge.log(res.err_msg);
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                if (toUrl) {
                    setTimeout(function() {
                        window.location.href = toUrl;
                    }, 500);
                }
            } else {
                if (res.err_msg != "get_brand_wcpay_request:cancel") {
                    Bubble.show(res.err_code + " " + res.err_desc + res.err_msg);
                }
            }
        }
    );
}

function callpay(params, url) {
    if (!params) {
        Bubble.show('无支付参数，无法支付');
        return;
    }

    jsParams = params;
    toUrl = url;

    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
    } else {
        jsApiCall();
    }
}

module.exports = {
    callpay: callpay
};