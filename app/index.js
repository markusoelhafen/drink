var alarmActive, timer;
var minSet = 1;
var secSet = minSet * 60;

///// RUN TIMER /////
function run() {
	countdown(secSet);
	document.getElementById('runToggle').className = 'btn btn-stop';
	console.log('starting');
	alarmActive = true;
}

function alarm() {
	console.log('drink now');
	stop();
	reset();
}

function stop() {
	clearInterval(timer); 
	alarmActive = false;
	document.getElementById('runToggle').className = 'btn btn-start';
	console.log('stopped');
}

function reset() {
	document.getElementById('counter').innerHTML = minSet;
	document.getElementById('timeUnit').innerHTML = 'minutes';
	drawCircle(secSet);
}

///// DRAW TIMER /////
function countdown(sec) {
	var min;

	timer = setInterval(function() {
		min = Math.ceil(sec / 60);
		if(sec >= 0) {
			if(sec >= 60){
				document.getElementById('counter').innerHTML = min;
				console.log(min);
				console.log(sec);
				if(min > 1){
					document.getElementById('timeUnit').innerHTML = 'minutes';
				} else {
					document.getElementById('timeUnit').innerHTML = 'minute';
				}
			} else {
				document.getElementById('counter').innerHTML = sec;
				if(sec > 1) {
					document.getElementById('timeUnit').innerHTML = 'seconds';
				} else {
					document.getElementById('timeUnit').innerHTML = 'second';
				}
				
			}
		} else {
			clearInterval(timer);
			alarm();
		}
		drawCircle(sec);
		sec--;
	}, 100);
}

function drawCircle(time) {
	var path = document.getElementById('progressCircle');
	var pathLength = path.getTotalLength();
	var position = map(time, secSet, 0, 0, pathLength);
	if (position < 0) position = 0;

	path.style.transition = path.style.WebkitTransition = 'none';

	path.style.strokeDasharray = pathLength + ' ' + pathLength;
	path.style.strokeDashoffset = position;

	path.getBoundingClientRect();
}

function map(value, start1, stop1, start2, stop2) {
	return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

// ON STARTUP
onload = function() {
	reset();

	document.getElementById('runToggle').addEventListener('click', function() {
		if (alarmActive == true) stop();
		else run();
	});

	document.getElementById('saveOptions').addEventListener('click', function() {
		document.getElementById('main').classList.toggle('slideup');
	});

	document.getElementById('optionsButton').addEventListener('click', function() {
		document.getElementById('main').classList.toggle('slideup');
	});
}