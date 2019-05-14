let searchParams = document.getElementById('searchParams');

function getLocation() {
	// Check geolocation support
	if (navigator.geolocation) {
		console.log('Geolocation is supported!');
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	} else {
		console.log('Geolocation is not supported for this browser.');
		searchParams.value = 'Geolocation is not supported by this browser.';
	}
}

// show geolocation
function showPosition(position) {
	// var latlon = position.coords.latitude + "," + position.coords.longitude;
	// var img_url = 'https://maps.googleapis.com/maps/api/staticmap?center='+latlon+'&zoom=14&size=400x300&sensor=false&key='+process.env.MAPS_API_KEY;
	searchParams.value = position.coords.latitude + ',' + position.coords.longitude;
	// document.getElementById('#myLocation').src = img_url;
	console.log(position.coords.latitude + ', ' + position.coords.longitude);
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
