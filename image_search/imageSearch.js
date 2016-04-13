var syncStorage = chrome.storage.sync;

var triggerPattern = new RegExp("^<gifbox .+>")

function imageSearch(query, callback) {
	syncStorage.get(null, function(data) {
		var nameIndex = data['-1'];
		// No images saved.
		if (nameIndex === undefined) { return callback(null); }
		var queryWords = query.split(' ');
		var results = nameIndex[queryWords[0]];
		// No results.
		if (results === undefined) { return callback(null); }
		results = new Set(results);
		queryWords.slice(1).forEach(function(word) {
			var wordResults = nameIndex[word];
			// No results for any one word means no results at all.
			if (wordResults === undefined) { return callback(null); }
			wordResults.forEach(function(itemId) {
				if (!(itemId in results)) {
					results.delete(itemId);
				}
			});
		});
		if (results.size == 0) { return callback(null); }
		var final_results = [];
		results.forEach(function(itemId) {
			final_results.push(data[itemId]);
		});
		return callback(final_results);
	});
}

function displayResults(results) {
	container = $('body').find('#image-container-search');
	containerExists = true;
	if (!container.length) {
		containerExists = false;
		container = $('<div>', {'id': 'image-container-search'});
	} 
	else {
		container.empty();
		results.forEach(function(result) {
			container.append($('<div>', {'class': 'img-box'})
				.append($('<img>', {'class': 'img-box__image', 'src': result.imageUrl})));
		});
	}

	if (!containerExists) {
		$('body').prepend(container);
	}


	

// 	{imageName: "star gate"
// imageUrl
// :
// "http://i.imgur.com/7Jef2Jmb.jpg"}

	// if (!results) {
		// console.log("No results, you bad bad bear.");
	// } else {
		// console.log(results)
	// }
}

var lastSearch = '';

$('body').on('keyup', 'input', function(event) {
	var text = $(this).val();
	if (text == lastSearch) {
		return;
	}
	var cursorPosition = this.selectionStart;
	var match = triggerPattern.exec(text);
	if (match != null) {
		var startIndex = match.index;
		var triggerText = match[0];
		var endIndex = match.index + triggerText.length;
		if (startIndex < cursorPosition && cursorPosition <= endIndex) {
			searchQuery = triggerText.slice(8, -1);
			imageSearch(searchQuery, displayResults);
		}
	}
});
