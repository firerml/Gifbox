var xhr = new XMLHttpRequest();

// var apiUrl = ''
var API_URL = 'http://localhost:3000'

function getOrCreateUser(callback) {
	// callback takes status and responseJSON args.
	chrome.identity.getProfileUserInfo(function(userInfo) {
		if (userInfo.id) {
			xhr.open('POST', API_URL + '/user/', false);
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

// Search
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch (request.messageType) {
		case 'search':
  		var method = 'GET';
  		var url = API_URL + '/image/search/?q=' + request.searchQuery;
  		break;
  	case 'getMyImages':
  		var method = 'GET';
  		var url = API_URL + '/image/?';
  		break;
		case 'deleteImage':
			var method = 'DELETE';
  		var url = API_URL + '/image/?imageId=' + request.imageId;
  		break;
		default:
			return true;
	}
	getChromeId(function(chromeId) {
		url += '&chromeId=' + chromeId;
		// Send request to server.
		xhr.open(method, url, false);
		xhr.send();
		sendResponse(JSON.parse(xhr.responseText));
	});
	return true;
});

// Save image.
function saveImage(imageInfo, tab) {
	var promptedName = prompt('Name this picture');
	promptedName = promptedName.trim();

	// TODO: stop here if promptedName is null.

	getChromeId(function(id) {
		xhr.open('POST', API_URL + '/image/', false);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.send(JSON.stringify({'chromeId': id, 'image': {'name': promptedName, 'url': imageInfo.srcUrl}}));

	})
};

// Add option to right-click menu.
chrome.contextMenus.create({
	title: 'Save Sweet Pic, Bro!',
	contexts: ['image'],
	onclick: saveImage
});
