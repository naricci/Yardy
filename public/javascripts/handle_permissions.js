function handlePermission() {
	navigator.permissions.query({name:'geolocation'}).then(function(result) {
		if (result.state === 'granted') {
			report(result.state);
			geoBtn.style.display = 'none';
		} else if (result.state === 'prompt') {
			report(result.state);
			geoBtn.style.display = 'none';
			navigator.geolocation.getCurrentPosition(revealPosition,positionDenied,geoSettings);
		} else if (result.state === 'denied') {
			report(result.state);
			geoBtn.style.display = 'inline';
		}
		result.onchange = function() {
			report(result.state);
		}
	});
}

function report(state) {
	console.log('Permission ' + state);
}

handlePermission();
