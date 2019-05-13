// // AJAX call to Mongo for addresses
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


let map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(41.8240,-71.4128),
		// center: new google.maps.LatLng(location),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 8
	});

	let locations = [
		new google.maps.LatLng(41.8240,-71.4128)
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
	'<h1 id="firstHeading" class="firstHeading">Address: </h1>'+
	'<h1 id="firstHeading" class="firstHeading">Date: ' + Date.now().toString() + '</h1>'+
	'<div id="bodyContent">'+
	'<p class="image is-64x64 lazy"><img src="https://bulma.io/images/placeholders/128x128.png" alt="Yard Sale"></p>'+
	'<p>Yard sale info.</p>'+
	'</div>'+
	'</div>';

	let infowindow = new google.maps.InfoWindow({
		content: contentString
	});
}
