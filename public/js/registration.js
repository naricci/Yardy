$(function(){
	$('#register').on('click', function(event){
		event.preventDefault();
		var email         = $('#email').val();
		var username      = $('#username').val();
		var password      = $('#password').val();
		var cpassword     = $('#cpassword').val();
		// var dob        = $("#dob").val();
		// var country    = $("#country").val();
		// var gender     = $('input[name="gender"]:checked').val();
		// var calorie    = $('input[name="calorie"]:checked').val();
		// var salt       = $('input[name="salt"]:checked').val();
		// var terms      = $('input[name="terms"]:checked').val();

		if (!email || !username || !password || !cpassword) {
			$('#msgDiv').show().html('All fields are required.');
		} else if (cpassword != password) {
			$('#msgDiv').show().html('Passwords must match.');
		}
		else {
			$.ajax({
				url: '/signup',
				method: 'POST',
				data: { email: email, username: username, password: password, cpassword: cpassword }
			}).done(function(data) {
				if (data) {
					if (data.status == 'error') {
						var errors = '<ul>';
						$.each( data.message, function( key, value ) {
							errors = errors + '<li>' + value.msg + '</li>';
						});
						errors = errors+ '</ul>';
						$('#msgDiv').html(errors).show();
					} else {
						$('#msgDiv').removeClass('has-text-warning').addClass('has-text-success').html(data.message).show();
					}
				}
			});
		}
	});
});