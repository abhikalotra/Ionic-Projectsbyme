function postData(parameters, success, error) {
    var url = "http://kurdistanborsa.com/currency_exchange/webservices.php?"
    $.ajax({
        type: "POST",
        url: url,
        data: parameters,
        contentType: "application/x-www-form-urlencoded",
        dataType: "JSON",
        success: function (data, status) {
            success(data, status);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            error();
        }
    });
}


function getData(parameter, success, error) {
    var url = "http://kurdistanborsa.com/currency_exchange/webservices.php?" + parameter;
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/x-www-form-urlencoded",
        dataType: "JSON",
        timeout:9000,
        success: function (data, status) {
            success(data, status);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            error();
        }
    });
}


function isValidMail(email) {
    var mailPattern = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return mailPattern.test(email)
}