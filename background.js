var syncStorage = chrome.storage.sync;

function savePic(info, tab) {
	var promptedName = prompt('Name this picture');
	promptedName = promptedName.trim();
	// TODO: stop here if promptedName is null.
	syncStorage.get(null, function(results) {
		var highestId = 0
		for (var itemId in results) {
			if (itemId > highestId) {
				highestId = itemId;
			}
		}

		var newItemId = Number(highestId) + 1;
		var saveObj = {};
		saveObj[newItemId] = {
			'imageName': promptedName,
			'imageUrl': info.srcUrl,
			'tags': []
		};

		syncStorage.set(saveObj, function() {
			// TODO: If runtime.lastError, alert user of error.
			return;
		});	
	});
};

chrome.contextMenus.create({
	title: 'Save Sweet Pic, Bro!',
	contexts: ['image'],
	onclick: savePic
});
