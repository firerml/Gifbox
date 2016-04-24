var triggerPattern = /(?:gb|gifbook)(.+)$|\n/i

function removeContainer() {
	container = $('body').find('#image-container-search');
	if (container.length) { container.remove(); }	
};

function imageSearch(query, callback) {
	chrome.runtime.sendMessage({messageType: 'search', searchQuery: query}, function(responseData) {
		callback(responseData);
	});
};

function displayResults(results) {
	container = $('body').find('#image-container-search');
	containerExists = true;
	if (!container.length) {
		containerExists = false;
		container = $('<div>', {'id': 'image-container-search'});
	} 
	else {
		container.empty();
	}

	results.forEach(function(result) {
		container.append($('<div>', {'class': 'img-box'})
			.append($('<img>', {'class': 'img-box__image', 'src': result.url})));
	});

	if (!containerExists) {
		$('body').prepend(container);
	}
}

var lastSearch = '';

$('body').on('input', 'input', function(event) {
	var text = $(this).val();
	if (text == lastSearch) {
		return;
	}
	var cursorPosition = this.selectionStart;
	var match = triggerPattern.exec(text);
	if (match && match.length) {
		var matchText = match[1].trim();
		imageSearch(matchText, displayResults);
	} else {
		removeContainer();
	}

});

$('body').on('keyup', 'input', function(event) {
	if (!$(this).val()) { removeContainer(); }
});
