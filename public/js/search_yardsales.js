$(document).ready(function(){
	$('#search').click(function(event) {
		event.preventDefault();
		all_yardsales();
	});

	function all_yardsales() {
		$.ajax({
			url: '/yardsales',
			type: 'GET',
			success: function (data) {
				console.log('Success: ', data);
			}, error: function (errorThrown) {
				console.log('Error: ', errorThrown);
			}
		});
	}
});
