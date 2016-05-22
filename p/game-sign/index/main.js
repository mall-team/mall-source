	var Ajax = require('common/ajax/index');

	var prizeDeg = [360, 318, 278, 238, 200, 159, 119, 80, 40];
	var prizeDes = [
		'恭喜您获得荣事达咖啡机，请回复消息“#欢乐颂荣事达咖啡机#+中奖人姓名+手机号+收货地址”到铂涛会官方微信，我们将以此作为寄送奖品时的收货信息。',
		'恭喜您获得10元抵用券,我们会在48小时内将奖品存入您账户，届时请注意查收。',
		'恭喜您获得100积分,我们会在48小时内将奖品存入您账户，届时请注意查收。',
		'恭喜您获得免费房法宝，我们会在48小时内将奖品存入您账户，届时请注意查收。',
		'恭喜您获得20积分,我们会在48小时内将奖品存入您账户，届时请注意查收。',
		'恭喜您抽中伊莱克斯电饭煲，请回复消息“#欢乐颂伊莱克斯电饭煲#+中奖人姓名+手机号+收货地址”到铂涛会官方微信，我们将以此作为寄送奖品时的收货信息。',
		'恭喜您抽中梦百合记忆枕，请回复消息“#欢乐颂梦百合记忆枕#+中奖人姓名+手机号+收货地址”到铂涛会官方微信，我们将以此作为寄送奖品时的收货信息。',
		'谢谢您的参与',
		'恭喜您获得50积分,我们会在48小时内将奖品存入您账户，届时请注意查收。'
	];

	init();

	function init() {
		addEvent();
	}

	function addEvent() {
		$('.signin-btn').on('click', sign);
		$("#prizestar").on('click', start);
	}

	/**
	 * 签到
	 * @return {[type]} [description]
	 */
	function sign() {
		var $cur = $(this);

		if ($cur.hasClass('disabled')) {
			return;
		}

		$.ajax({
			url: ' /Game/LotteryDraw/sign',
			dataType: "json",
			type: "POST",
			success: function(data) {

				console.log(data);

				$cur.addClass('disabled').text('已签到');
			}
		});
	}

	/**
	 * 开始抽奖
	 * @return {[type]} [description]
	 */
	function start() {
		$.ajax({
			url: '/Game/LotteryDraw/startLucky',
			dataType: "json",
			type: "POST",
			success: function(data) {

				rotateFunc(prizeDeg[2], prizeDes[0]);

			}
		});

	}

	function rotateFunc(angle, text) { //angle:奖项对应的角度
		var Deg = 360 * 2; //指针旋转圈数。
		angle = angle + Deg; //angle是图片上各奖项对应的角度，
		$('#rotatebg').stopRotate();
		$("#rotatebg").rotate({
			angle: 0,
			duration: 10000,
			animateTo: angle,
			callback: function() {

				//             $('#prizestar').attr('src', '/image/signin/activity-prize2.png');
				webh5v2.showWindow("<span>" + text + "</span>", {
					title: "提示",
					width: 280,
					height: 80,
					modal: true,
					actions: [{
						name: "确定",
						callback: function() {
							webh5v2.hideWindow();
						}
					}]
				});
				//             $('.number').text(that.number);
			}

		});
	}