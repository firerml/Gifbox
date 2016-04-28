var triggerPattern = /\/(?:gb|gifbook)(.+)$|\n/i

function removeContainer() {
	container = $('body').find('#image-container-search');
	if (container.length) { container.remove(); }	
};

function imageSearch(inputElement, query, callback) {
	chrome.runtime.sendMessage({messageType: 'search', searchQuery: query}, function(responseData) {
		callback(inputElement, responseData);
	});
};

function displayResults(inputElement, results) {
	var container = $('body').find('#image-container-search');
	var inputHeight = inputElement.height();
	var inputOffset = inputElement.offset();
	var imageContainerTop = inputOffset.top + inputHeight;
	var imageContainerLeft = inputOffset.left;
	var existingOOCUrl = $('.img-box__out-of-content').attr('src');
	var containerExists = true;
	if (!container.length) {
		containerExists = false;
		container = $('<div>', {'id': 'image-container-search'}).css({'top': imageContainerTop+'px', 'left': imageContainerLeft+'px'});
	} 
	else {
		container.empty();
	}

	if (results.length) {
		results.forEach(function(result) {
		container.append($('<div>', {'class': 'img-box'})
			.append($('<img>', {'class': 'img-box__image', 'src': result.url})));
		});
	} else {
		if (existingOOCUrl) {
			var oocUrl = existingOOCUrl;
		} else {
			var oocUrl = chrome.extension.getURL('/images/ooc' + Math.floor(Math.random()*2) + '.jpg');
		}
		container.append($('<div>', {'class': 'img-box'})
			.append($('<img>', {'class': 'img-box__image img-box__out-of-content', 'src': oocUrl}))
			.append($('<p>', {'class': 'img-box__out-of-content-p'}).text('No results, braw!'))
		);
	}

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
	var match = triggerPattern.exec(text);
	if (match && match.length) {
		var matchText = match[1].trim();
		if (matchText) {
			imageSearch($(this), matchText, displayResults);
		}
	} else {
		removeContainer();
	}
});

$('body').on('keyup', 'input', function(event) {
	if (!$(this).val()) { removeContainer(); }
});

$('body').on('click', '.img-box__image', function(event) {
	var imgUrl = event.target.src;
	var inputBoxes = $('input');
	for (var i = 0; i < inputBoxes.length; i++) {
		var inputValue = inputBoxes[i].value;
		var match = triggerPattern.exec(inputValue);
		if (match && match.length) {
			inputBoxes[i].value = inputValue.replace(match[0], imgUrl);
			$('#image-container-search').remove();
		}
	}
});
