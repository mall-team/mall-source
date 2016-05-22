var $ = require('zepto');
var Bubble = require('common/bubble/bubble');
var Ajax = require('common/ajax/index');
var Util = require('common/util/index');

var ANI_EVT_END = Util.getAniEndName().aniEvtName;

function init() {
	$($('.step')[0]).css('display', 'block');

	addEvent();
	initRadios();
	initMember();
}

function addEvent() {
	var $stepList = $('.step');
	var $nextList = $('.J-next');

	$nextList.on('click', function() {
		var $cur = $(this);
		var $curStep = $cur.parents('.step');
		var order = $curStep.attr('order');
		var $nextStep = $($stepList[order]);

		if (nextValidate($curStep)) {

			$curStep.animate({
				opacity: '0'
			}, 200, 'ease-in', function() {
				$curStep.css('display', 'none');

				$nextStep.css('display', 'block').addClass('animated bounceInRight');
				$nextStep.on(ANI_EVT_END, function() {
					$nextStep.removeClass('animated bounceInRight');
					$nextStep.off(ANI_EVT_END);
				});

				// $nextStep.css('display', 'block').animate({
				// 	translateX: '0'
				// }, 200, 'ease-out');

			});
		} else {
			$cur.addClass('animated bounce');
			$cur.on(ANI_EVT_END, function() {
				$cur.removeClass('animated bounce');
				$cur.off(ANI_EVT_END);
			});
		}
	});

	$('#J-submit').on('click', submit);
}

/**
 * 初始化单选按钮
 */
function initRadios() {
	var $radios = $('.radio');

	$radios.on('click', function() {
		var $cur = $(this);
		var $step = $cur.parents('.step');

		$step.find('.radio').removeClass('active');
		$cur.addClass('active');
		$step.find('.J-radio-val').val($cur.attr('val'));

	});

}


/**
 * 团队成员数量
 */
function initMember() {
	var $member = $('#J-member');

	$member.on('input', function() {
		var val = $member.val();

		if (val === "") {
			return;
		}

		var regArr = val.match(/\d+/);
		var num = regArr ? +regArr[0] : 1;

		if (num < 1) {
			num = 1;
		} else if (num > 10000) {
			num = 10000;
		}
		$member.val(num);
	});

}


/**
 * 下一步验证
 */
function nextValidate($curStep) {
	var $radio = $curStep.find('.J-radio-val');
	var $member = $curStep.find('#J-member');
	var $phone = $curStep.find('#J-phone');
	var $nick = $curStep.find('#J-nick');

	if ($radio.length > 0 && $radio.val() === '') {
		// Bubble.show('请选择');
		return false;
	}

	if ($member.length > 0 && $member.val() === '') {
		// Bubble.show('请输入团队人数（数字）！');
		return false;
	}

	if ($phone.length > 0) {
		if ($phone.val() === '') {
			// Bubble.show('请填写手机号码！');
			return false;
		} else if (!/^\d{11}$/.test($phone.val())) {
			Bubble.show('手机号码格式错误！');
			return false;
		}
	}

	if ($nick.length > 0 && $nick.val() === '') {
		// Bubble.show('请输入您的团队昵称！');
		return false;
	}

	return true;

}

/**
 *  提交
 */
function submit() {
	var $btn = $(this);
	var $form = $('form');

	if (!nextValidate($btn.parents('.step'))) {
		$btn.addClass('animated bounce');
		$btn.on(ANI_EVT_END, function() {
			$btn.removeClass('animated bounce');
			$btn.off(ANI_EVT_END);
		});
		return false;
	}

	new Ajax().send({
		url: $form.attr('action'),
		data: $form.serialize(),
		type: $form.attr('method')
	}, function() {

	});
	return false;
}


init();