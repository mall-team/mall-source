 (function() {
     var ua = navigator.userAgent,
         ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
         ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
         iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);


     function isAndroid() {
         return ua.match(/(Android);?[\s\/]+([\d.]+)?/);
     }

     function isIos() {
         return iphone || ipad || ipod;
     }

     function getVersion() {
         var version = '';

         if (iphone && !ipod) version = iphone[2].replace(/_/g, '.');
         if (ipad) version = ipad[2].replace(/_/g, '.');
         if (ipod) version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
         return version;
     }

     window.detect = {
         isAndroid: isAndroid,
         isIos: isIos,
         getVersion: getVersion
     };
 })();


 var guideBtn, $androidBtn, $iosBtn;
 var $pos_all, $close, $container;
 var guidePanel;

 if (isWeiXin()) {
     guideBtn = getEle('J-download-guide');
     guidePanel = getEle('J-guide');

     guideBtn.style.display = 'block';
     guideBtn.onclick = function(evt) {
         guidePanel.style.display = 'block';

     };
     guidePanel.onclick = function() {
         guidePanel.style.display = 'none';
     };
 } else if (detect.isAndroid()) {
     $androidBtn = getEle('J-download-android');
     $androidBtn.style.display = 'block';
 } else if (detect.isIos()) {
     $container = getEle('J-container');
     $iosBtn = getEle('J-download-ios');
     $pos_all = getEle('pos_all');
     $close = getEle('close_ios9');

     $iosBtn.style.display = 'block';

     // $iosBtn.onclick = function() {
     if (detect.getVersion() >= 9) {
         $pos_all.style.display = 'block';
         $container.setAttribute('class', 'wrap pos_inherit');
     }
     // };

     $close.onclick = function() {
         $pos_all.style.display = 'none';
         $container.setAttribute('class', 'wrap');
     };

 } else {
     location.href = "http://www.taojinzi.com";
 }

 if (location.search.indexOf('tjzfrom=wemall') > -1) {
     getEle('J-suc-msg').style.display = 'block';
     getEle('J-nav').style.display = 'block';
 }

 function getEle(id) {
     return document.getElementById(id);
 }

 function isWeiXin() {
     return navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
 }