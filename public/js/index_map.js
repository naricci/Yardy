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

var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(41.8240,-71.4128),
		// center: new google.maps.LatLng(location),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 8
	});

	var locations = [
		new google.maps.LatLng(41.8240,-71.4128)
		// and additional coordinates, just add a new item
	];

	locations.forEach((location) => {
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			title:'Yard Sale'
		});

		marker.addListener('mouseover',() => {
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

	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});
}
