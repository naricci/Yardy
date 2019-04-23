var searchParams = document.getElementById('searchParams');

function getLocation() {
	// Check geolocation support
	if (navigator.geolocation) {
		console.log('Geolocation is supported!');
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		console.log('Geolocation is not supported for this browser.');
		searchParams.innerHTML = 'Geolocation is not supported by this browser.';
	}
}

function showPosition(position) {
	console.log(position.coords.latitude + ', ' + position.coords.longitude);
	searchParams.value = position.coords.latitude + ', ' + position.coords.longitude;
}
