$(document).ready(function(){
	$('#search').click(function(req, event) {
		var sort = $('option:selected').val();

		if(sort === 'date') {
			all_yardsales_sorted();
		} else {
			all_yardsales();
		}
	});

	function all_yardsales() {
		$.ajax({
			url: '/yardsale',
			type: 'GET',
			success: function (data) {
				console.log('Success Unsorted: ', data);
			}, error: function (errorThrown) {
				console.log('Error: ', errorThrown);
			}
		});
	} 
	
	///if this worked Tom will be the first in the array
	function all_yardsales_sorted() {
		$.ajax({
			url: '/yardsale_by_date',
			type: 'GET',
			success: function (data) {
				console.log('Success Sorted: ', data);
			}, error: function (errorThrown) {
				console.log('Error: ', errorThrown);
			}
		});
	}
});
