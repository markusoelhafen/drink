var secondsSet, autoStart, currentSeconds = false;

// COUNTDOWN

function run(){
	countdown(secondsSet);
	chrome.browserAction.setIcon({path: '/icons/icon19_active.png'});
	console.log("starting countdown");
}

function stop(){
	try{
		clearInterval(timer);
	} catch(e){
		console.log("no timer defined..");
	}
	currentSeconds = false;
	clearNotification();
	chrome.browserAction.setIcon({path: '/icons/icon19.png'});
	console.log("stopping countdown");
}

function countdown(seconds) {
	currentSeconds = seconds;
	timer = setInterval(function() {
		if(currentSeconds >= 0) {
			console.log("seconds: " + currentSeconds);
			chrome.runtime.sendMessage({seconds: currentSeconds});
		} else {
			// clearInterval(timer);
			// currentSeconds = false;
			stop();
			createNotification();
			updateNotification();
		}
		currentSeconds--;
	}, 1000);
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
}

function updateNotification() { // update every 60 seconds
	updateLoop = setInterval(function() {
		chrome.notifications.update("popup", {priority: 0}, function() {
			chrome.notifications.update("popup", {priority: 2});
		});
		console.log("updated");
	}, 10000);
}

function clearNotification() { // clear all notifications
	chrome.notifications.getAll(function(cb) {
		for(var prop in cb){
			if(cb.hasOwnProperty(prop)) chrome.notifications.clear(prop);
		}
	});
}

// SYNC OPTIONS

function syncOptions() {
	chrome.storage.sync.get({secondsSet: '3600', autoStart: false}, function(options) {
		secondsSet = options.secondsSet;
		if(options.autoStart) run();
		console.log("seconds set: " + secondsSet);
		console.log("auto-start: " + options.autoStart);
	});
}

// LISTEN TO CONTENT

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.Alarm == 'start') {
		run();
	} else if(request.Alarm == 'stop'){
		stop();
	} else if(request.Alarm == 'state') {
		sendResponse({seconds: currentSeconds});
	} else if(request.Options == 'saved') {
		syncOptions();
	} 
})

// VERSION UPDATE NOTIFICATION

chrome.runtime.onInstalled.addListener(function(installed) {
	//console.log(installed);
	var version = chrome.runtime.getManifest().version
	if(installed.reason == "update") {
		var opt = {
			type: "basic",
			title: "Drink! Update",
			message: "Drink! has been updated to version " + version + ". Get full changelog on chrome webstore.",
			iconUrl: "../icons/popup_icon.png",
			priority: 1
		}
		chrome.notifications.create("update", opt);
	}
});

// ON LOAD

onload = function() {
	syncOptions();
	chrome.notifications.onButtonClicked.addListener(buttonClicked);
}