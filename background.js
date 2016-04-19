var xhr = new XMLHttpRequest();

// var apiUrl = ''
var API_URL = 'http://localhost:3000/'

function getOrCreateUser(callback) {
	// callback takes status and responseJSON args.
	chrome.identity.getProfileUserInfo(function(userInfo) {
		if (userInfo.id) {
			xhr.open('POST', API_URL + 'user/', false);
			xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
			xhr.send(JSON.stringify({'chromeId': userInfo.id, 'email': userInfo.email}));
			return callback(xhr.status, JSON.parse(xhr.responseText));
		}
	});
}

function getChromeId(callback) {
	chrome.storage.local.get('id', function(userData) {
		if (Object.keys(userData).length) {
			callback(userData.id);
			// TODO: If runtime.lastError, alert user of error.
		} else {
			getOrCreateUser(function(status, responseJSON) {
				// TODO: Do something for non 200/201 statuses?
				var userId = responseJSON.chromeId;
				chrome.storage.local.set({'id': userId});
				callback(userId);
			});
		}
	})
}

function savePic(imageInfo, tab) {
	var promptedName = prompt('Name this picture');
	promptedName = promptedName.trim();

	// TODO: stop here if promptedName is null.

	getChromeId(function(id) {
		xhr.open('POST', API_URL + 'image/', false);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.send(JSON.stringify({'chromeId': id, 'image': {'name': promptedName, 'url': imageInfo.srcUrl}}));
		return callback(xhr.status, JSON.parse(xhr.responseText));


	})
};

// Add option to right-click menu.
chrome.contextMenus.create({
	title: 'Save Sweet Pic, Bro!',
	contexts: ['image'],
	onclick: savePic
});
