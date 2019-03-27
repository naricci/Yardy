var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(44.5886,-104.6985),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 8
	});
	var locations = [
		new google.maps.LatLng(41.6617218,-71.5049636),
		new google.maps.LatLng(44.5886,-104.6985),
		new google.maps.LatLng(44.0769281,-103.6503378)
		// and additional coordinates, just add a new item
	];
	locations.forEach(function (location) {
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			title:"Yard Sale"
		});
		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
	});
	var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading">Address  </h1>'+
		'<h1 id="firstHeading" class="firstHeading">  Date</h1>'+
		'<div id="bodyContent">'+
		'<p class="image is-64x64"><images src="https://bulma.io/images/placeholders/128x128.png"></p>'+
		'<p>Yard sale info.</p>'+
		'</div>'+
		'</div>';
	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});
}
