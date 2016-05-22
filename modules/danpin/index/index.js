var $ = require('zepto');
var Ajax = require('common/ajax/index');
var JAjax = require('common/j-ajax/index');
var Guide = require('common/guide/guide');
var Alert = require('common/alert/alert');
var Timer = require('common/timer/timer');
var Util = require('common/util/index');
var JDisabled = require('common/j-disabled/index');
var Bullet = require('common/bullet/index');
var CommentSection = require('common/comment-section/index');

var productId = $('#J-product-id').val();
var firRank = true; //首次进入排队流程

init();

function init() {
	addEvent();
	initPreTimer();

	CommentSection.init({
		id: productId,
		name: $('#J-product-name').val()
	});

	JAjax.init();
	JDisabled.init();
	new Guide('#J-invite-btn', 'guide-klj', '邀请好友来参与活动吧～<br/><i>怎么邀请？你懂得！</i>');

	if ($(document.body).attr('is-over') == 1) {
		remindOver(1);
	}
}

function addEvent() {
	$('.J-remind-btn').on('click', function(){remindOver(2)}); //开抢提醒
	$('#J-award-guide').on('click', function() {
		$(this).remove();
	});
	$('.J-quick-buy').on('click', quickBuy);
}

/**
 * 购买
 * @return {[type]} [description]
 */
function quickBuy(evt) {
	evt.preventDefault();

	var $el = $(this),
		$form = $('#' + $el.attr('form'));

	$el.trigger('disabled:click');
	buyRank(function() {

		new Ajax().send({
			url: $form.attr('action'),
			type: $form.attr('method'),
			data: $form.serialize()
		}, function(result) {

		}, function() { //购买异常
			$el.trigger('disabled:ok');
		});

	}, function() {
		$el.trigger('disabled:ok');
	});
}

/**
 * 购买排队
 * @return {[type]} [description]
 */
function buyRank(sucBack, errorBack) {
	new Ajax().send({
		url: '/Activity/DanPin/addQueue'
	}, function(result) {
		if (result == 0) { //进入购买流程
			sucBack && sucBack();
		} else { //进入排队流程
			if (firRank) {
				Alert.show(__inline('rank-alert.tmpl')(), false, 'rank-alert');
				firRank = false;
			}

			setTimeout(function() {
				buyRank(sucBack, errorBack);
			}, 1000);
		}
	}, function() { //接口异常
		errorBack && errorBack();
	});
}

/**
 * 结束提醒
 * @param type 1 结束没有关闭按钮，2预约有关闭按钮
 * @return {[type]} [description]
 */
function remindOver(type) {
	var $bulletContainer;
	var closeBut = (type == 1) ? false : true;
	Alert.show($('#J-remind-over').html(), closeBut, 'remind-over');

	$bulletContainer = $('#J-bullet-screen').css('top', '-' + $('#J-alert-content-wrap').css('margin-top'));
	// new Bullet($bulletContainer, ['123', '4556']).start();
	// return;

	//获取评论第二页数据
	new Ajax().send({
		url: '/Mall/Goods/moreComment',
		data: {
			g: productId,
			page: 2
		}
	}, function(result) {
		var list = result.commentlist.data;

		if (!list || list.length <= 0) {
			return;
		}
		new Bullet($bulletContainer, list.map(function(item, i) {
			return item['customer_name'] + '：' + item['comment_content'];
		})).start();
	});

	new Guide('#J-share-friend', 'guide-klj', '邀请好友来参与活动吧～<br/><i>怎么邀请？你懂得！</i>');
}

/**
 * 开抢提醒
 * @return {[type]} [description]
 */
function remind() {
	new Ajax().send({
		url: '/Activity/DanPin/subscribeQrCode',
		data: {
			pid: Util.getParam('pid'),
			did: Util.getParam('did'),
			recommend: Util.getParam('recommend')
		}
	}, function(result) {

		Alert.show(__inline('remind-alert.tmpl')({
			qrcode: result.url
		}), true, 'remind-alert');

	});
}

/**
 * 初始化预热倒计时
 * @return {[type]} [description]
 */
function initPreTimer() {
	var isPre = $(document.body).hasClass('pre');

	if (!isPre) {
		start();
		return;
	}
	var timer = new Timer('#J-pre-timer', function() {
		var self = this;
		return (self.day > 0 ? (Timer.addZero(self.day) + '天 ') : '') + Timer.addZero(self.hour) + ':' + Timer.addZero(self.min) + ':' + Timer.addZero(self.sec);
	});
	timer.start().end(function() {
		location.reload();
	});
}

/**
 * 启动获取红包数据定时器
 * @return {[type]} [description]
 */
function start() {
	rendSendMoney();
	setTimeout(start, 5000);
}

/**
 * 渲染已发送红包数额
 * @param  {[type]} back [description]
 * @return {[type]}      [description]
 */
function rendSendMoney(back) {
	new Ajax().send({
		url: '/Activity/DanPin/alreadySendRedPackage'
	}, function(result) {
		var $money = $('#J-send-money');

		if (result.redPackage != $money.text()) {
			$money.html(result.redPackage).addClass('money-ani');
			setTimeout(function() {
				$('#J-send-money').removeClass('money-ani');
			}, 1000);
		}
		back && back();
	});
}