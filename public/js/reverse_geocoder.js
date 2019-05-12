var gMap;
function initMap() {
	gMap = new google.maps.Map(document.getElementById('map'), {
		// center: new google.maps.LatLng(41.8240,-71.4128),
		// mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 9,
		center: {lat: 41.8240, lng: -71.4128}
	});
	let geocoder = new google.maps.Geocoder;
	let infowindow = new google.maps.InfoWindow;

	document.getElementById('submit').addEventListener('click', function() {
		geocodeLatLng(geocoder, gMap, infowindow);
	});
}

function geocodeLatLng(geocoder, map, infowindow) {
	let input = document.getElementById('searchParams').value;
	let latlngStr = input.split(',', 2);
	let latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
	geocoder.geocode({'location': latlng}, function(results, status) {
		if (status === 'OK') {
			if (results[0]) {
				map.setZoom(11);
				let marker = new google.maps.Marker({
					position: latlng,
					map: map
				});
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
