$(function() {
    $("#postYardSale").on('click', function(event) {
        event.preventDefault();
        var firstname         = $("#firstname").val();
        var lastname          = $("#lastname").val();
        var phone             = $("#phone").val();
        var address           = $("#address").val();
        var city              = $("#city").val();
        var state             = $('input[name="state"]:checked').val();
        var zipcode           = $("#zipcode").val();
        var description       = $("#description").val();
        // TODO Check how to select/grab date/time values
        var date              = $('input[name="date"]:checked').val();
        var starttime         = $('input[name="starttime"]:checked').val();
        var endtime           = $('input[name="endtime"]:checked').val();

        if (!firstname || !city || !state || !date || !starttime || !endtime) {
            $("#msgDiv").show().html('Make sure proper fields are filled in.');
        }
        else {
            $.ajax({
                url: '/post_yardsale',
                method: 'POST',
                data: { firstname: firstname, lastname: lastname, phone: phone, address: address, city: city, state: state, zipcode: zipcode, description: description,
                    date: date, starttime: starttime, endtime: endtime }
            }).done(function(data) {
                if (data) {
                    if (data.status == 'error') {
                        var errors = '<ul>';
                        $.each( data.message, function( key, value ) {
                            errors = errors + '<li>' + value.msg + '</li>';
                        });
                        errors = errors+ '</ul>';
                        $("#msgDiv").html(errors).show();
                    } else {
                        $("#msgDiv").removeClass('has-text-warning').addClass('has-text-success').html(data.message).show();
                    }
                }
            });
        }
    });
});