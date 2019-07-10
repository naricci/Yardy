var address, contentString, geocoder, google, latLong, infoWindow, locations, map, marker;
// let url = 'https://api.mlab.com/api/1/databases/yardy/collections/yardsales?apiKey=9mCElimS5yqDidSAKQzweNrYtfa6hY7C';
// let myHeaders = new Headers();
// myHeaders.set('Content-Type', 'application/json');
// let myInit = { method: 'GET',
// 	headers: myHeaders,
// 	mode: 'cors',
// 	credentials: 'include',
// 	cache: 'default'
// };
// let myRequest = new Request(url, myInit);

// Initialize Google Map
// eslint-disable-next-line no-unused-vars
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(39.8283, -98.5795),
		// center: new google.maps.LatLng(location),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 4
	});

	// geocoder = new google.maps.Geocoder();

	// fetch(myRequest)
	// 	.then(response => {
	// 		let contentType = response.headers.get('content-type');
	// 		if(contentType && contentType.includes('application/json')) {
	// 			return response.json();
	// 			//- return response.text();
	// 		}
	// 		throw new TypeError('Oops, we haven\' got JSON!');
	// 	})
	// 	.then(json => {
	// 		locations = [];

	// 		for (let i = 0; i < json.length; i++) {
	// 			address = json[i].address + ' ' + json[i].city + ', ' + json[i].state + ', ' + json[i].zipcode;
	// 			// console.log(address);
	// 			// latLong = geocodeAddress(address);
	// 			// locations.push(latLong);
	// 		}
	// 		// console.log(locations);
	// 		return locations;
	// 	})
	// 	.then(locations => {

	// 		// for (var s = 0; s < locations.length; s++) {
	// 		// 	marker = new google.maps.Marker({
	// 		// 		position: locations[s],
	// 		// 		map: map,
	// 		// 		title: 'Yard Sale'
	// 		// 	});
	// 		// }

	// 		// marker.addListener('click', () => {
	// 		// 	infoWindow.open(map, marker);
	// 		// });

	// 		// TODO - Add loop to display all yardsales on the map as markers
	// 		for (var x = 0; x < locations.length; x++) {
	// 			contentString = '<div id="content">'+
	// 			'<div id="siteNotice">'+
	// 			'</div>'+
	// 			'<h1 id="firstHeading" class="firstHeading">Address: ' + locations[x] + '</h1>'+
	// 			'<h1 id="firstHeading" class="firstHeading">Date: </h1>'+
	// 			'<div id="bodyContent">'+
	// 			'<p class="image is-64x64"><img src="#" alt="Yard Sale"></p>'+
	// 			'<p>Yard Sale</p>'+
	// 			'</div>'+
	// 			'</div>';
	// 		}

	// 		infoWindow = new google.maps.InfoWindow({
	// 			content: contentString
	// 		});
	// 	})
	// 	.catch(err => {
	// 		console.error(err);
	// 	});
}

// function geocodeAddress(address) {

// 	geocoder.geocode({ 'address' : address }, function(results, status) {
// 		if (status === 'OK') {
// 			var lat = results[0].geometry.location.lat;
// 			var lng = results[0].geometry.location.lng;
// 			// var loc = results[0].formatted_address;
// 			// 	  lat = loc.$a,
// 			// 	  long = loc.$b;
// 			// return lat + ', ' + long;
// 			// console.log(lat + ', ' + lng);
// 			return lat + ', ' + lng;
// 		} else {
// 			alert('Geocode was not successful for the following reason: ' + status);
// 		}
// 	});
// }
