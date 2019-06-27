var google;
const searchParams = document.getElementById('searchParams');
const findMe = document.getElementById('find-me');
findMe.addEventListener('click', getLocation, { passive: true });

/**
 *  Geocoding API Request Format
 *  https://maps.googleapis.com/maps/api/geocode/outputFormat?parameters
 */

const userLat = localStorage.getItem('lat');
const userLng = localStorage.getItem('lng');

// DATE STUFF
// var date = new Date;
// var day = date.getDay() + 1;
// var month = date.getMonth() + 1;
// var year = date.getFullYear();
// var today = month + '/' + day + '/' + year;

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
	initMyMap();
	const lat = position.coords.latitude.toString();
	const lng = position.coords.longitude.toString();
	// console.log(lat + ', ' + lng);
	localStorage.setItem('lat', lat);
	localStorage.setItem('lng', lng);
	// searchParams.value = lat + ', ' + lng;
	// TODO - Add address to search bar
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
	let myMap = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(parseFloat(userLat), parseFloat(userLng)),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 10
	});

	let locations = [
		new google.maps.LatLng(parseFloat(userLat), parseFloat(userLng))
	];

	locations.forEach(location => {
		let marker = new google.maps.Marker({
			position: location,
			map: myMap,
			title:'Yard Sale'
		});

		marker.addListener('mouseover', () => {
			infoWindow.open(myMap, marker);
		},
		{ passive: true });
	});

	// TODO - Add loop to display all yardsales on the map as markers
	let contentString =
		'<div id="content">' +
		'<p>You are here!</p>' +
		'</div>';

	let infoWindow = new google.maps.InfoWindow({
		content: contentString
	});
}
