// The hub of the app, accessible via the button next to the url bar.

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
	$('#image-container').on('click', '.img-box__bar__copy', function(event) {
		var button = $(event.currentTarget);
		var url = button.closest('.img-box').find('.img-box__image')[0].src;
		copyText(url);
	});

	// Delete picture.
	$('#image-container').on('click', '.img-box__bar__delete', function(event) {
		var button = $(event.currentTarget);
		var imageBox = button.closest('.img-box');
		var imageId = imageBox.attr('id');
		
		chrome.runtime.sendMessage({messageType: 'deleteImage', imageId: imageId}, function(responseData) {
			if (responseData.success) {
				imageBox.animate({opacity: 0}, 300, function() {
					imageBox.remove();
				});
			}
		});
	});
})

// Display each image.
chrome.runtime.sendMessage({messageType: 'getMyImages'}, function(images) {
	images.forEach(function(image) {
		$('#image-container')
		.append($('<div>', {class: 'img-box', id: image._id})
			.append($('<div>', {class: 'img-box__bottom-bar img-box__bar'})
				.append($('<div>', {class: 'img-box__bar__col img-box__bar__delete', text: 'Delete'}))
				.append($('<div>', {class: 'img-box__bar__col img-box__bar__copy', text: 'Copy Link'}))
			)
			.append($('<img>', {class: 'img-box__image', src: image.url}))
		);
	});
});
