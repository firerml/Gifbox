var syncStorage = chrome.storage.sync;

function savePic(imageInfo, tab) {
	var promptedName = prompt('Name this picture');
	promptedName = promptedName.trim();
	// TODO: stop here if promptedName is null.
	syncStorage.get(null, function(results) {
		// Get the new image's ID.
		var highestId = 0;
		for (var itemId in results) {
			if (itemId > highestId) {
				highestId = itemId;
			};
			if (itemId === '-1') {
				var nameIndex = results['-1'];
			};
		}
		var newItemId = Number(highestId) + 1;

		var newImageData = {};
		newImageData[newItemId] = {
			'imageName': promptedName,
			'imageUrl': imageInfo.srcUrl
		};

		// Update name index with words in name.
		if (nameIndex === undefined) {
			nameIndex = {};
		}
		var nameWords = promptedName.toLowerCase().split(' ');
		for (var i in nameWords) {
			var nameWord = nameWords[i].toLowerCase().trim();
			if (nameIndex[nameWord] === undefined) {
				nameIndex[nameWord] = [newItemId];
			} else {
				nameIndex[nameWord].push(newItemId);
			}
		}
		syncStorage.set({'-1': nameIndex});

		// Save the image URL.
		syncStorage.set(newImageData, function() {
			// TODO: If runtime.lastError, alert user of error.
			return;
		});	
	});
};

// Add option to right-click menu.
chrome.contextMenus.create({
	title: 'Save Sweet Pic, Bro!',
	contexts: ['image'],
	onclick: savePic
});
