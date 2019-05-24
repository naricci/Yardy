let map;
const date = new Date;
const today = date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
let userLat = localStorage.getItem('lat');
let userLng = localStorage.getItem('lng');

console.log(`Today is ${today}.`);

// Set passive event listeners
// document.addEventListener('touchstart', ontouchstart, { passive: true });
// document.addEventListener('touchmove', ontouchmove, { passive: true });

// Initialize Google Map
function initMap() {
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

	locations.forEach(location => {
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			title:'Yard Sale'
		});

		marker.addListener('mouseover', () => {
			infoWindow.open(map, marker);
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
