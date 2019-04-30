$('#loginBtn').click(() => {
	$.ajax({
		url: '/',
		type: 'POST',
		cache: false,
		data: {
			username: $('#username').val(),
			email: $('#email').val(),
			password: $('#password').val(),
			cpassword: $('#cpassword').val(),
		},
		success: function () {
			$('#error-group').css('display', 'none');
			alert('Your submission was successful');
		},
		error: function (data) {
			console.log(data);
			$('#error-group').css('display', 'block');
			var errors = JSON.parse(data.responseText);
			var errorsContainer = $('#errors');
			errorsContainer.innerHTML = '';
			var errorsList = '';

			for (let i = 0; i < errors.length; i++) {
				errorsList += '<li>' + errors[i].msg + '</li>';
			}
			errorsContainer.html(errorsList);
		}
	});
});
