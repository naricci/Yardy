var google;
var searchParams = document.getElementById('searchParams');
const findMe = document.getElementById('find-me');
findMe.addEventListener('click', getLocation, { passive: true });

// Get Location
function getLocation() {
	// Check geolocation support
	if (navigator.geolocation) {
		console.log('Geolocation is supported!');
		// Do something with the granted permission.
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	}
	else {
		console.log('Geolocation is not supported for this browser.');
		searchParams.value = 'Geolocation is not supported by this browser.';
	}
}

// show geolocation
function showPosition(position) {
	const lat = position.coords.latitude.toString();
	const lng = position.coords.longitude.toString();
	localStorage.setItem('lat', lat);
	localStorage.setItem('lng', lng);

	// Initialize map of current location
	initMyMap();
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

// Initialize Google Map
function initMyMap() {
	let map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(parseFloat(localStorage.getItem('lat')), parseFloat(localStorage.getItem('lng'))),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 10
	});

	const geocoder = new google.maps.Geocoder;
	const infowindow = new google.maps.InfoWindow;

	geocodeLatLng(geocoder, map, infowindow);
}

// For Reverse Geocoding an Address
function geocodeLatLng(geocoder, map, infowindow) {
	// Grab Lat+Lng using Local Storage
	var input = localStorage.getItem('lat') + ',' + localStorage.getItem('lng');
	var latlngStr = input.split(',', 2);
	var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
	geocoder.geocode({'location': latlng}, (results, status) => {
		if (status === 'OK') {
			if (results[0]) {
				map.setZoom(11);
				var marker = new google.maps.Marker({
					position: latlng,
					map: map
				});
				// Display results address in search bar
				var full_address = results[0].formatted_address;
				searchParams.value = full_address;
				localStorage.setItem('full_address', full_address);

				infowindow.setContent(results[0].formatted_address);
				infowindow.open(map, marker);
			} else {
				window.alert('No results found');
			}
		} else {
			window.alert('Geocoder failed due to: ' + status);
		}
	});
}

// DATE STUFF
// eslint-disable-next-line no-unused-vars
function getFormattedDate() {
	var date = new Date;
	var day = date.getDay() + 1;
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	var today = month + '/' + day + '/' + year;

	return today.toString();
}
