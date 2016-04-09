var syncStorage = chrome.storage.sync;

$(document).ready(function() {
	$('#image-container').on('click', '.single-image', function(event) {
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

		// $('body').append('<img src="' + data.imageUrl + '">');
		$('#image-container').append($('<img>', {'class': 'single-image', 'src': data.imageUrl}));
	}
});
