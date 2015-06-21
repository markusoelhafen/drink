var alarmActive, timer;
var secSet;

// RUN TIMER
function run() {
	document.getElementById('runToggle').className = 'btn btn-stop';
	alarmActive = true;
	chrome.runtime.sendMessage({Alarm: 'start'});
}

function alarm() {
	console.log('drink now');
	stop();
	reset();
}

function stop() {
	clearInterval(timer);
	reset(); 
	alarmActive = false;
	console.log('stopped');
	chrome.runtime.sendMessage({Alarm: 'stop'});
}

function reset() {
	document.getElementById('runToggle').className = 'btn btn-start';
	document.getElementById('timeUnit').innerHTML = 'minutes';
	drawCounter(secSet);
	drawCircle(0);
}

// DRAW COUNTER
function drawCounter(sec) {
	var min = Math.ceil(sec / 60);
	if(sec >= 60) { // if more than 60 seconds –> show minutes
		document.getElementById('counter').innerHTML = min;
		if(min > 1){
				document.getElementById('timeUnit').innerHTML = 'minutes';
		} else {
			document.getElementById('timeUnit').innerHTML = 'minute';
		}
	} else { // else show seconds
		document.getElementById('counter').innerHTML = sec;
		if(sec > 1) {
			document.getElementById('timeUnit').innerHTML = 'seconds';
		} else {
			document.getElementById('timeUnit').innerHTML = 'second';
		}
	}
}

// DRAW CIRCLE
function drawCircle(sec) {
	var path = document.getElementById('progressCircle');
	var pathLength = path.getTotalLength();
	var position = map(sec, secSet, 0, 0, pathLength);

	path.style.transition = path.style.WebkitTransition = 'none';
	path.style.strokeDasharray = pathLength + ' ' + pathLength;
	path.style.strokeDashoffset = position;
	path.getBoundingClientRect();
}

function map(value, start1, stop1, start2, stop2) {
	return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

// LISTEN TO BACKGROUND
chrome.runtime.onMessage.addListener(function(request){
	if(request.seconds) {
		drawCircle(request.seconds);
		drawCounter(request.seconds);
		alarmActive = true;
		document.getElementById('runToggle').className = 'btn btn-stop';
	}
});

// ON STARTUP
onload = function() {

	chrome.storage.sync.get({secSet: '3600'}, function(options) {
		secSet = options.secSet;
		console.log('secSet: ' + secSet);
		reset();
	});

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