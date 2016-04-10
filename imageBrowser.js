var syncStorage = chrome.storage.sync;

$(document).ready(function() {
	$('#image-container').on('click', '.img-box__image', function(event) {
		// imageUrl = e.src;
		hiddenImageUrl = $('<p>' + event.target.src + '</p>').css({'position': 'absolute', 'left': '-2000px'});
		$('body').append(hiddenImageUrl);
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(hiddenImageUrl[0]);
		selection.removeAllRanges();
		selection.addRange(range);
		document.execCommand('copy');
		hiddenImageUrl.remove();
	});
})

syncStorage.get(null, function(results) {
	for (var itemId in results) {
		var data = results[itemId];

		$('#image-container')
		.append($('<div>', {'class': 'img-box'})
			.append($('<div>', {'class': 'img-box__overlay'}).append(
				$('<h3>', {text: 'Copy Link'}))
			)
			.append($('<img>', {'class': 'img-box__image', 'src': data.imageUrl}))
		);
	}
});
