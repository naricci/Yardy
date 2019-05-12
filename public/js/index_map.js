// AJAX call to Mongo for addresses
// $.ajax({
// 	url: '/',
// 	type: 'GET',
// 	dataType: 'jsonp',
// 	jsonp: 'jsonp',
// 	crossDomain: true,
// 	success: function(data) {
// 		console.log('success!', data);
// 	},
// 	error: function(XMLHttpRequest, textStatus, errorThrown) {
// 		console.log('error', errorThrown);
// 	}
// });

let searchParams = document.getElementById('searchParams');

let location = function getLocation() {
	// Check geolocation support
	if (navigator.geolocation) {
		console.log('Geolocation is supported!');
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		console.log('Geolocation is not supported for this browser.');
		searchParams.innerHTML = 'Geolocation is not supported by this browser.';
	}
};

let map;

function showPosition(position) {
	console.log(position.coords.latitude + ', ' + position.coords.longitude);
	searchParams.value = position.coords.latitude + ',' + position.coords.longitude;
	initMap();
}

// const imageSource = 'https://s3.amazonaws.com/yardy123/' + yardsale.user.username + '/' + yardsale.imagename;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(44.5886,-104.6985),
		// center: new google.maps.LatLng(location),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 9
	});

	let locations = [
		new google.maps.LatLng(location)
		// and additional coordinates, just add a new item
	];

	locations.forEach(function (location) {
		let marker = new google.maps.Marker({
			position: location,
			map: map,
			title:'Yard Sale'
		});

		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
	});

	// TODO - Add loop to display all yardsales on the map as markers
	let contentString = '<div id="content">'+
	'<div id="siteNotice">'+
	'</div>'+
	'<h1 id="firstHeading" class="firstHeading">Address: ' + location + '</h1>'+
	'<h1 id="firstHeading" class="firstHeading">Date: ' + Date.now().toString() + '</h1>'+
	'<div id="bodyContent">'+
	'<p class="image is-64x64 lazy"><img src="https://bulma.io/images/placeholders/128x128.png" alt="yard sale"></p>'+
	'<p>Yard sale info.</p>'+
	'</div>'+
	'</div>';

	let infowindow = new google.maps.InfoWindow({
		content: contentString
	});
}

window.onload = location;
