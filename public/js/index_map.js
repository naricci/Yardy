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
// var infoWindow;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(41.8240,-71.4128),
		// center: new google.maps.LatLng(location),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 10
	});

	let locations = [
		new google.maps.LatLng(41.8240,-71.4128)
	// and additional coordinates, just add a new item
	];

	locations.forEach((location) => {
		let marker = new google.maps.Marker({
			position: location,
			map: map,
			title:'Yard Sale'
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
		'<h1 id="firstHeading" class="firstHeading">Date: </h1>'+
		'<div id="bodyContent">'+
		'<p class="image is-64x64 lazy"><img src="https://bulma.io/images/placeholders/128x128.png" alt="Yard Sale"></p>'+
		'<p>Yard sale info.</p>'+
		'</div>'+
		'</div>';

	let infowindow = new google.maps.InfoWindow({
		content: contentString
	});
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
