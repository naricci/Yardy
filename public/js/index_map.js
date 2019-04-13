let map;
// const imageSource = 'https://s3.amazonaws.com/yardy123/' + yardsale.user.username + '/' + yardsale.imagename;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		// center: new google.maps.LatLng(44.5886,-104.6985),
		center: new google.maps.LatLng(41.8240,-71.4128),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 8
	});
	let locations = [
		// new google.maps.LatLng(41.6617218,-71.5049636),
		// new google.maps.LatLng(44.5886,-104.6985),
		// new google.maps.LatLng(44.0769281,-103.6503378)
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
	// TODO - Add loop to display all yardsales on the map
	let contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading">Address:  </h1>'+
		'<h1 id="firstHeading" class="firstHeading">Date: </h1>'+
		'<div id="bodyContent">'+
		'<p class="image is-64x64"><img src="https://bulma.io/images/placeholders/128x128.png" alt="yard sale"></p>'+
		'<p>Yard sale info.</p>'+
		'</div>'+
		'</div>';

	let infowindow = new google.maps.InfoWindow({
		content: contentString
	});
}
