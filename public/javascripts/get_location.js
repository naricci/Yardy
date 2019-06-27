/**
 *  Geocoding API Request Format
 *  https://maps.googleapis.com/maps/api/geocode/outputFormat?parameters
 */

var google;
var searchParams = document.getElementById('searchParams');
const findMe = document.getElementById('find-me');
findMe.addEventListener('click', getLocation, { passive: true });

const userLat = localStorage.getItem('lat');
const userLng = localStorage.getItem('lng');
// const userLatLng = userLat + ', ' + userLng;

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
	searchParams.value = lat + ', ' + lng;
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

	var geocoder = new google.maps.Geocoder;
	var infowindow = new google.maps.InfoWindow;

	geocodeLatLng(geocoder, myMap, infowindow);

	// let locations = [
	// 	new google.maps.LatLng(parseFloat(userLat), parseFloat(userLng))
	// ];
	//
	// locations.forEach(location => {
	// 	let marker = new google.maps.Marker({
	// 		position: location,
	// 		map: myMap,
	// 		title:'Yard Sale'
	// 	});

	// 	marker.addListener('mouseover', () => {
	// 		infoWindow.open(myMap, marker);
	// 	},
	// 	{ passive: true });
	// });
	//
	// // TODO - Add loop to display all yardsales on the map as markers
	// let contentString =
	// 	'<div id="content">' +
	// 	'<center>YOU ARE HERE!</center>' +
	// 	'<br>' +
	// 	'<p>Lat: ' + userLat + '</p>' +
	// 	'<p>Long: ' + userLng + '</p>' +
	// 	'</div>';
	//
	// let infoWindow = new google.maps.InfoWindow({
	// 	content: contentString
	// });
}

// For Reverse Geocoding
// function initMap() {
// 	var myMap = new google.maps.Map(document.getElementById('map'), {
// 		zoom: 8,
// 		center: {lat: 40.731, lng: -73.997}
// 	});
// 	var geocoder = new google.maps.Geocoder;
// 	var infowindow = new google.maps.InfoWindow;
//
// 	document.getElementById('submit').addEventListener('click', function() {
// 		geocodeLatLng(geocoder, myMap, infowindow);
// 	});
// }

function geocodeLatLng(geocoder, map, infowindow) {
	// var input = document.getElementById('latlng').value;
	var input = document.getElementById('searchParams').value;
	var latlngStr = input.split(',', 2);
	var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
	geocoder.geocode({'location': latlng}, function(results, status) {
		if (status === 'OK') {
			if (results[0]) {
				map.setZoom(11);
				var marker = new google.maps.Marker({
					position: latlng,
					map: map
				});
				// Display results address in search bar
				searchParams.value = results[0].formatted_address;

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
