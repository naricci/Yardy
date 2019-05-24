let map;
let url = 'https://api.mlab.com/api/1/databases/yardy/collections/yardsales?apiKey=9mCElimS5yqDidSAKQzweNrYtfa6hY7C';
let myHeaders = new Headers();
myHeaders.set('Content-Type', 'application/json');
let myInit = { method: 'GET',
	headers: myHeaders,
	mode: 'cors',
	credentials: 'include',
	cache: 'default'
};

let myRequest = new Request(url, myInit);

fetch( myRequest ).then(function(response) {
	let contentType = response.headers.get('content-type');
	if(contentType && contentType.includes('application/json')) {
		return response.text();
	}

	throw new TypeError('Oops, we haven\' got JSON!');

}).then(function(response, jsonText) {
	response.value = jsonText;
}).catch(function(err) {
	console.log(err);
});


// Initialize Google Map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(41.8240,-71.4128),
		// center: new google.maps.LatLng(parseFloat(userLat), parseFloat(userLng)),
		// center: new google.maps.LatLng(location),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 7
	});

	let locations = [
		new google.maps.LatLng(41.8240,-71.4128)
		// new google.maps.LatLng(parseFloat(userLat), parseFloat(userLng))
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
		'<h1 id="firstHeading" class="firstHeading">Date: </h1>'+
		'<div id="bodyContent">'+
		'<p class="image is-64x64"><img src="https://bulma.io/images/placeholders/128x128.png" alt="Yard Sale"></p>'+
		'<p>You are here!</p>'+
		'</div>'+
		'</div>';

	var infoWindow = new google.maps.InfoWindow({
		content: contentString
	});
}
