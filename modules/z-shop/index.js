var Alert = require('common/alert/alert');
var Bubble = require('common/bubble/bubble');

var url = document.body.getAttribute('alert');

window.Bubble = Bubble;

if(url){
	Alert.show(url);
}