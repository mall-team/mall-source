var $sec = document.getElementById('J-timer');
var $btn = document.getElementById('J-back');

var time = +$sec.innerHTML;

function timer(time, back) {

	$sec.innerHTML = time;
	time--;
	if (time < 0) {
		back();
		return;
	}
	setTimeout(function() {
		timer(time, back);
	}, 1000);
}

if (time && time > 0) {
	timer(time, function() {
		location.href = $btn.getAttribute('href');
	});
}