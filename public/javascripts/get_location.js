const searchParams = document.getElementById('searchParams');

function getLocation() {
	// Check geolocation support
	if (navigator.geolocation) {
		console.log('Geolocation is supported!');
		// Notification.requestPermission().then(function(result) {
		// 	if (result === 'denied') {
		// 		console.log('Permission wasn\'t granted. Allow a retry.');
		// 		return;
		// 	}
		// 	if (result === 'default') {
		// 		console.log('The permission request was dismissed.');
		// 		return;
		// 	}
			// Do something with the granted permission.
			navigator.geolocation.getCurrentPosition(showPosition, showError);
		// });
	}
	else {
		console.log('Geolocation is not supported for this browser.');
		searchParams.value = 'Geolocation is not supported by this browser.';
	}
}


// show geolocation
// function showPosition(position) {
// 	const latlng = position.coords.latitude + ',' + position.coords.longitude;
// 	console.log(latlng);
// 	searchParams.value = latlng;
// 	// localStorage.setItem('latlng', latlng);
// }


// show geolocation
function showPosition(position) {
	const lat = position.coords.latitude.toString();
	const lng = position.coords.longitude.toString();
	console.log(lat + ', ' + lng);
	localStorage.setItem('lat', lat);
	localStorage.setItem('lng', lng);
	searchParams.value = lat + ', ' + lng;
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

// export { searchParams, getLocation, showPosition, showError };
// module.exports = get_location;
