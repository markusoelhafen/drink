var alarmActive, timer, secondsSet;

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
	console.log("function reset: secondsSet" + secondsSet);
	drawCounter(secondsSet);
	drawCircle(secondsSet);
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
	var position = map(sec, secondsSet, 0, 0, pathLength);

	path.style.transition = path.style.WebkitTransition = 'none';
	path.style.strokeDasharray = pathLength + ' ' + pathLength;
	path.style.strokeDashoffset = position;
	path.getBoundingClientRect();
}

function map(value, start1, stop1, start2, stop2) {
	return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

// SAVE OPTIONS
function saveOptions() {
	var min = document.getElementById('minutes').value;
	var auto = document.getElementById('autoStart').checked;

	chrome.storage.sync.set({secondsSet: min * 60, autoStart: auto});
	chrome.runtime.sendMessage({Options: 'saved'});
	stop();
}

function readOptions() {
	chrome.storage.sync.get({secondsSet: '3600', autoStart: false}, function(options) {
		document.getElementById('minutes').value = options.secondsSet / 60;
		document.getElementById('counter').innerHTML = options.secondsSet / 60;
		secondsSet = options.secondsSet;

		if(options.autoStart == true) {
			document.getElementById('autoStart').checked = true;
		}
	});
}

// LISTEN TO BACKGROUND
chrome.runtime.onMessage.addListener(function(response){
	if(response.seconds) {
		drawCircle(response.seconds);
		drawCounter(response.seconds);
		alarmActive = true;
		document.getElementById('runToggle').className = 'btn btn-stop';
	}
});

// ON STARTUP
onload = function() {

	readOptions();

	chrome.runtime.sendMessage({Alarm: 'state'}, function(response) {
		if(response.seconds !== false) {
			drawCircle(response.seconds);
			drawCounter(response.seconds);
			alarmActive = true;
			document.getElementById('runToggle').className = 'btn btn-stop';
		}
	});

	document.getElementById('runToggle').addEventListener('click', function() {
		if (alarmActive == true) stop();
		else run();
	});

	document.getElementById('saveOptions').addEventListener('click', function() {
		saveOptions(); // save settings to local storage
		readOptions(); // restore options set to display changed time on popup
		document.getElementById('main').classList.toggle('slideup');
	});

	document.getElementById('optionsButton').addEventListener('click', function() {
			if(document.getElementById('main').classList.contains('changelog')) {
				document.getElementById('main').classList.remove('changelog', 'slideup');
			} else {
			document.getElementById('main').classList.toggle('slideup');
		}
		
	});

	document.getElementById('new').addEventListener('click', function() {
		document.getElementById('main').classList.toggle('changelog');
	});
}