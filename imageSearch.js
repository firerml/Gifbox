var syncStorage = chrome.storage.sync;

var triggerPattern = new RegExp("^<gifbox .+>")

function imageSearch(query, callback) {
	syncStorage.get(null, function(data) {
		// No images saved.
		var nameIndex = data['-1'];
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
		return callback(results);
	});
}

$('body').on('keyup', 'input', function(event) {
	var text = $(this).val();
	var cursorPosition = this.selectionStart;
	var match = triggerPattern.exec(text);
	if (match != null) {
		var startIndex = match.index;
		var triggerText = match[0];
		var endIndex = match.index + triggerText.length;
		if (startIndex < cursorPosition && cursorPosition <= endIndex) {
			searchQuery = triggerText.slice(8, -1);
			imageSearch(searchQuery, function(results) {
				console.log(results)
				// if (!results) {
					// console.log("No results, you bad bad bear.");
				// } else {
					// console.log(results)
				// }
			});
		}
	}
});

// "hello there <gifbox wassup> friend"
// 		// $(function() {
// 		//     var triggerWords = ['foobar', 'barfoo'];
// 		//     $('#password').keyup(function() {
// 		//         for (var i = 0; i < triggerWords.length; i++) {
// 		//             if ($(this).val().toLowerCase() == triggerWords[i]) {
// 		//                 alert('Alert!');
// 		//             }
// 		//         }
// 		//     });
// 		// });