var secSet, autoStart;

// COUNTDOWN

function run(){
	countdown(secSet);
	console.log("starting countdown");
}

function stop(){
	try{
		clearInterval(timer);
	}catch(e){
		console.log(e);
	}
	clearNotification();
	console.log("stopping countdown");
}

function countdown(sec) {
	timer = setInterval(function() {
		if(sec >= 0) {
			console.log("seconds: " + sec);
		chrome.runtime.sendMessage({seconds: sec});
		} else {
			clearInterval(timer);
			timer = false;
			createNotification();
		}
		sec--;
	}, 100);
}

// NOTIFICATIONS

function buttonClicked(notId, button) { // buttonIndex: 0 = ok || 1 = shut up
	if (button == 0) {
		clearInterval(updateLoop);
		clearNotification();
		run();
	}
	else if (button == 1) {
		stop();
	}
}

function createNotification() {
	var opt = {
		type: "basic",
		title: "IT'S TIME TO DRINK!",
		message: "Drink some water now.",
		iconUrl: "../icons/popup_icon.png",
		priority: 2,
		buttons: [{
			title: "Ok, done. Restart."
		}, {
			title: "Shut up!"
		}]
	};
	chrome.notifications.create("popup", opt);
	updateNotification();
}

function updateNotification() { // update every 3 minutes
	updateLoop = setInterval(function() {
		chrome.notifications.update("popup", {priority: 0}, function() {
			chrome.notifications.update("popup", {priority: 2});
		});
	}, 180000);
}

function clearNotification() { // clear all notifications
	chrome.notifications.getAll(function(cb) {
		for(var prop in cb){
			if(cb.hasOwnProperty(prop)) {
				//console.log(prop, cb[prop]);
				chrome.notifications.clear(prop);
			}
		}
	});
}

// SYNC OPTIONS

function syncOptions() {
	chrome.storage.sync.get({
		secSet: '3600',
		autoStart: false
	}, function(options) {
		secSet = options.secSet;
		autoStart = options.autoStart;
		console.log("seconds set: " + secSet);
		console.log("auto-start: " + autoStart);
	});
}

// LISTEN TO CONTENT

chrome.runtime.onMessage.addListener(function(request){
	if(request.Alarm == 'start') {
		run();
	} else if(request.Alarm == 'stop'){
		stop();
		console.log('stopped bg')
	} else if(request.Options == 'saved') {
		syncOptions();
		console.log('synced bg')
	}
})

// ON LOAD

onload = function() {
	syncOptions();
	chrome.notifications.onButtonClicked.addListener(buttonClicked);
}