$(document).ready(function() {
	loadHomePage();
});

function loadHomePage() {
	$.get("ajax/home.html", function(data) {
		var body = $('body');
		body.empty();
		body.append(data);
	});
}
