var myMap;
const searchParams = document.getElementById('searchParams');
const findMe = document.getElementById('find-me');
findMe.addEventListener('click', getLocation);

var userLat = localStorage.getItem('lat');
var userLng = localStorage.getItem('lng');
var date = new Date;
var today = date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();


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
	console.log(lat + ', ' + lng);
	localStorage.setItem('lat', lat);
	localStorage.setItem('lng', lng);
	searchParams.value = lat + ', ' + lng;
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

	console.log(`Today is ${today}.`);

	myMap = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(parseFloat(userLat), parseFloat(userLng)),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 10
	});

	let locations = [
		// new google.maps.LatLng(41.8240,-71.4128)
		new google.maps.LatLng(parseFloat(userLat), parseFloat(userLng))
		// and additional coordinates, just add a new item
	];

	locations.forEach(location => {
		var marker = new google.maps.Marker({
			position: location,
			map: myMap,
			title:'Yard Sale'
		});

		marker.addListener('mouseover', () => {
			infoWindow.open(myMap, marker);
		});
	});

	// TODO - Add loop to display all yardsales on the map as markers
	var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading">Address: </h1>'+
		'<h1 id="firstHeading" class="firstHeading">Date: ' + today + '</h1>'+
		'<div id="bodyContent">'+
		'<p class="image is-64x64"><img src="https://bulma.io/images/placeholders/128x128.png" alt="Yard Sale"></p>'+
		'<p>You are here!</p>'+
		'</div>'+
		'</div>';

	var infoWindow = new google.maps.InfoWindow({
		content: contentString
	});
}
