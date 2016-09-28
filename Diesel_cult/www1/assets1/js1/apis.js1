
function postData(url, parameters, onSuccess) {
    var auth = "";
    window.plugins.spinnerDialog.show(null, "Please wait. . .", true);
    if (url == "auth" || url == "otpByUserDetails" || url=="validateOtp")
        auth = "";
    else
        auth = "Basic " + localStorage.getItem("auth");
   //http://dieselcult.in/
    var finalUrl = "http://dieselcult.in/ril/service/" + url;
    $.ajax({
        type: "POST",
        url: finalUrl,
        data: parameters,
        contentType: "application/xml",
        Authorization: auth,
        dataType: "XML",
        success: function (d) {
            var msg = $(d).find("errorMsg").text();
            if (msg.length === 0) {
                onSuccess(d);
            } else {
                window.plugins.spinnerDialog.hide();
                window.plugins.toast.show($(d).find("errorMsg").text(), 'short', 'bottom');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 409) {
                $(jqXHR.responseText).find("errorMsg").each(function () {
                    window.plugins.spinnerDialog.hide();
                    window.plugins.toast.show($(this).text(), 'short', 'bottom');
                });
            }
            if (jqXHR.status === 0) {
                window.plugins.spinnerDialog.hide();
                window.plugins.toast.show('There is some problem. please try again later.', 'short', 'bottom');
            }
        }});
}

function fetchData(url, onSuccess) {
    var header = null;
    window.plugins.spinnerDialog.show(null, "Please wait. . .", true);

    header = {contentType: "application/xml",
        "Authorization": "Basic " + localStorage.getItem("auth")}
    var finalUrl = "http://dieselcult.in/ril/service/" + url;
    $.ajax({
        type: "GET",
        url: finalUrl,
        dataType: "XML",
        headers: header,
        success: onSuccess,
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 409) {
                $(jqXHR.responseText).find("errorMsg").each(function () {
                    window.plugins.spinnerDialog.hide();
                    window.plugins.toast.show($(this).text(), 'long', 'bottom');
                });
            }
            if (jqXHR.status === 0) {
                window.plugins.spinnerDialog.hide();
                window.plugins.toast.show('There is some problem. please try again later.', 'long', 'bottom');
            }
        }});
}


function logout() {
    navigator.notification.confirm("Are you sure you want to log out.?", onConfirm,
            "Confirmation", ["Yes", "No"]);
}
function onConfirm(buttonIndex) {
    if (buttonIndex == 2)
        return;
    else
        window.plugins.toast.show('Successfully logged out.', 'long', 'bottom', function (a) {
            window.location = "login.html";
        }, function (b) {});
}
