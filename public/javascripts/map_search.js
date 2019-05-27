var submit = document.getElementById('submit');
var google;
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		// center: {lat: 39.8283, lng: -98.5795} // Center of USA
		// center: {lat: 43.9654, lng: -70.8227}
	});
	var geocoder = new google.maps.Geocoder();

	submit.addEventListener('click', function() {
		geocodeAddress(geocoder, map);
	});
}

function geocodeAddress(geocoder, resultsMap) {
	var address = document.getElementById('searchParams').value;
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === 'OK') {
			resultsMap.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: resultsMap,
				position: results[0].geometry.location
			});
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}
