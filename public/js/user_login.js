// $(document).ready(function() {
// 	if (document.body.onerror) {
// 		$('input').addClass('has-text-danger');
// 	}
// });
$('#loginBtn').click(function () {
	$.ajax({
		url: '/users',
		type: 'POST',
		cache: false,
		data: {
			username: $('#username').val(),
			password: $('#password').val(),
		},
		success: function () {
			$('#error-group').css('display', 'none');
			alert('Your submission was successful');
		},
		error: function (data) {
			$('#error-group').css('display', 'block');
			var errors = JSON.parse(data.responseText);
			var errorsContainer = $('#errors');
			errorsContainer.innerHTML = '';
			var errorsList = '';

			for (var i = 0; i < errors.length; i++) {
				errorsList += '<li>' + errors[i].msg + '</li>';
			}
			errorsContainer.html(errorsList);
		}
	});
});
