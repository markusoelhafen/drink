var secSet;

// COUNTDOWN

function run(){
	countdown(secSet);
	console.log("starting countdown");
}

function stop(){
	clearInterval(timer);
	console.log("stopping countdown");
}

function countdown(sec) {
	timer = setInterval(function() {
		if(sec >= 0) {
			console.log("seconds: " + sec);
		chrome.runtime.sendMessage({seconds: sec});
		} else {
			clearInterval(timer);
			console.log("countdown finished");
		}
		sec--;
	}, 100);
}

// SYNC OPTIONS

function syncOptions() {
	chrome.storage.sync.get({
		secSet: '3600',
		autoStart: false
	}, function(options) {
		secSet = options.secSet;
		console.log("seconds set: " + secSet);
		console.log("auto-start: " + options.autoStart);
	});
}

// LISTEN TO CONTENT

chrome.runtime.onMessage.addListener(function(request){
	if(request.Alarm == 'start') {
		run();
	} else if(request.Alarm == 'stop'){
		stop();
	}
})

// ON LOAD

onload = function() {
	syncOptions();
}