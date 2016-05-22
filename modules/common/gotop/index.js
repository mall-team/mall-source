var $ = require('zepto');
var tmpl = __inline('index.tmpl')();

var win = window,
	$win = $(win),
	$body = $(document.body);

var winHei = $win.height();
var $gotop;
var isShow = false;

$win.on('scroll', _onscroll);

function _onscroll() {
	var scrollY = win.scrollY;

	if (scrollY / winHei >= 1.5) {

		if (!$gotop) {
			$body.append($(tmpl));

			$gotop = $('#J-gotop');

			$gotop.on('click', function() {
				win.scroll(0, 0);
				hidden();
			});;
		}

		show();

	} else {
		if (isShow) {
			hidden();
		}
	}
}

function show() {
	if(isShow){
		return;
	}
	isShow = true;
	$gotop.css('display', 'block').animate({
		'opacity': 1
	}, 1000, 'ease-in');
}

function hidden() {
	if(!isShow){
		return;
	}
	isShow = false;
	$gotop.animate({
		'opacity': 0
	}, 1000, 'ease-in', function() {
		$gotop.css('display', 'none');
	});
}

function BackTop(btnId) {
	var btn = document.getElementById(btnId);
	var d = document.documentElement;
	window.onscroll = set;
	btn.onclick = function() {
		btn.style.display = "none";
		window.onscroll = null;
		this.timer = setInterval(function() {
			d.scrollTop -= Math.ceil(d.scrollTop * 0.1);
			if (d.scrollTop == 0) clearInterval(btn.timer, window.onscroll = set);
		}, 10);
	};

	function set() {
		btn.style.display = d.scrollTop ? 'block' : "none"
	}
};