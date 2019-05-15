// $(document).ready(function() {
// 	// // AJAX call to Mongo for addresses
// 	$.ajax({
// 		dataType: 'jsonp',
// 		data: $('#yardsaleResults').serialize(),
// 		type: 'GET',
// 		url: '/',
// 		// contentType: 'application/json',
// 		// crossDomain: true,
// 		success: function(data) {
// 			console.log('success!', data);
// 			document.getElementById('#yardsaleResults').value = data;
// 		},
// 		error: function(xhr, status, err) {
// 			console.log(err);
// 		}
// 	});
// });

// Set passive event listeners
// document.addEventListener('touchstart', wheel, {passive: true});

let map;
let searchParams = document.getElementById('searchParams');
var today = Date.now();
console.log(today);

function initMap() {
	var userLat = localStorage.getItem('lat');
	var userLng = localStorage.getItem('lng');
	map = new google.maps.Map(document.getElementById('map'), {
		// center: new google.maps.LatLng(41.8240,-71.4128),
		center: new google.maps.LatLng(parseFloat(userLat), parseFloat(userLng)),
		// center: new google.maps.LatLng(location),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 10
	});

	let locations = [
		// new google.maps.LatLng(41.8240,-71.4128)
		new google.maps.LatLng(parseFloat(userLat), parseFloat(userLng))
	// and additional coordinates, just add a new item
	];

	locations.forEach((location) => {
		let marker = new google.maps.Marker({
			position: location,
			map: map,
			title:'Yard Sale'
			// title: 'You are here!'
		});

		marker.addListener('click',() => {
			infowindow.open(map, marker);
		});
	});

	// TODO - Add loop to display all yardsales on the map as markers
	let contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading">Address: </h1>'+
		'<h1 id="firstHeading" class="firstHeading">Date: ' + today + '</h1>'+
		'<div id="bodyContent">'+
		'<p class="image is-64x64 lazy"><images src="https://bulma.io/images/placeholders/128x128.png" alt="Yard Sale"></p>'+
		'<p>Yard sale info.</p>'+
		'</div>'+
		'</div>';

	let infowindow = new google.maps.InfoWindow({
		content: contentString
	});
}

// show geolocation
function showPosition(position) {
	var lat = position.coords.latitude.toString();
	var lng = position.coords.longitude.toString();
	console.log(lat + ', ' + lng);
	// searchParams.value = latlng;
	localStorage.setItem('lat', lat);
	localStorage.setItem('lng', lng);
}

// var infoWindow;
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(showPosition, showError);
	console.log('Geolocation is supported!');
}
else {
	console.log('Geolocation is not supported for this browser.');
	searchParams.value = 'Geolocation is not supported by this browser.';
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

/*
infoWindow = new google.maps.InfoWindow;

// Try HTML5 geolocation.
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition((position) => {
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};

		infoWindow.setPosition(pos);
		infoWindow.setContent('You are here.');
		infoWindow.open(map);
		map.setCenter(pos);
	}, () => {
		handleLocationError(true, infoWindow, map.getCenter());
	});
} else {
	// Browser doesn't support Geolocation
	handleLocationError(false, infoWindow, map.getCenter());
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}
*/

// Geocoder for map
// geocoder.geocode( { 'address': address}, function(results, status) {
// 	if (status === google.maps.GeocoderStatus.OK) {
// 		var latitude = results[0].geometry.location.lat();
// 		var longitude = results[0].geometry.location.lng();
// 		console.log(latitude + ', ' + longitude);
// 	}
// });
