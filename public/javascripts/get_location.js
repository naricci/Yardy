var searchParams = document.getElementById('searchParams');

function getLocation() {
	// Check geolocation support
	if (navigator.geolocation) {
		console.log('Geolocation is supported!');
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	}
	else {
		console.log('Geolocation is not supported for this browser.');
		searchParams.value = 'Geolocation is not supported by this browser.';
	}
}

// show geolocation
function showPosition(position) {
	var latlng = position.coords.latitude + ',' + position.coords.longitude;
	console.log(latlng);
	searchParams.value = latlng;
	// localStorage.setItem('latlng', latlng);
}

// show geolocation error
function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			searchParams.value = 'User denied the request for Geolocation.';
			console.log('User denied the request for Geolocation.');
			break;
		case error.POSITION_UNAVAILABLE:
			searchParams.value = 'Location information is unavailable.';
			console.log('Location information is unavailable.');
			break;
		case error.TIMEOUT:
			searchParams.value = 'The request to get user location timed out.';
			console.log('The request to get user location timed out.');
			break;
		case error.UNKNOWN_ERROR:
			searchParams.value = 'An unknown error occurred.';
			console.log('An unknown error occurred.');
			break;
	}
}
