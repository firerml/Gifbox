// The hub of the app, accessible via the button next to the url bar.

var syncStorage = chrome.storage.sync;

function copyText(text) {
	// Create a hidden p tag offscreen containing the text so it can be selected and copied.
	hiddenTag = $('<p>' + text + '</p>').css({'position': 'absolute', 'left': '-2000px'});
	$('body').append(hiddenTag);
	var selection = window.getSelection();
	var range = document.createRange();
	range.selectNodeContents(hiddenTag[0]);
	selection.removeAllRanges();
	selection.addRange(range);
	document.execCommand('copy');
	hiddenTag.remove();
}

$(document).ready(function() {
	// Copy images when they're clicked on.
	$('#image-container').on('click', '.img-box', function(event) {
		copyText(event.currentTarget.children[1].src)
	});
})

// Display each image.
syncStorage.get(null, function(results) {
	for (var itemId in results) {
		var data = results[itemId];
		$('#image-container')
		.append($('<div>', {'class': 'img-box'})
			.append($('<div>', {'class': 'img-box__overlay'})
				.append($('<h3>', {text: 'Copy Link'})))
			.append($('<img>', {'class': 'img-box__image', 'src': data.imageUrl}))
		);
	}
});
