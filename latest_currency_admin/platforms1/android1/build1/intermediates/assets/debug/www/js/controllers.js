var app = angular.module('starter.controllers', [])
app.controller('AppCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $ionicPopover) {
    $scope.logout = function (isLogout) {
        if (isLogout == "Log-out") {
            localStorage.removeItem("isLoggedIn");
            $scope.login_logout = "Login";
        }
        $scope.popover.hide();
        $state.go("login");
    }

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function (popover) {
        $scope.popover = popover;

        var isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn == undefined) {
            $scope.login_logout = "Login";
        } else {
            $scope.login_logout = "Log-out";
        }
    });
    $scope.$on('popover_text', function (events) {
        var isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn == undefined)
            $scope.login_logout = "Login";
        else
            $scope.login_logout = "Log-out";
    });
});

app.controller('LoginCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast) {
    $scope.loginData = [];
    $scope.login = function () {
        if (($scope.loginData.email == undefined || $scope.loginData.email == "")
                && ($scope.loginData.password == undefined || $scope.loginData.password == ""))
            $cordovaToast.show('Fields cannot be blank.', 'short', 'bottom');
        else if ($scope.loginData.email == "" || $scope.loginData.email == undefined)
            $cordovaToast.show('Please enter email id', 'short', 'bottom');
        else if (isValidMail($scope.loginData.email) == false && $scope.loginData.email != "")
            $cordovaToast.show('Invalid email id.', 'short', 'bottom');
        else if ($scope.loginData.password == "" || $scope.loginData.password == undefined)
            $cordovaToast.show('Please enter password', 'short', 'bottom');
        else {
            var deviceID = localStorage.getItem("admindeviceID");

            $ionicLoading.show({
                template: 'Loading...'
            });
            var param = "function=login&email=" + $scope.loginData.email + "&password="
                    + $scope.loginData.password + "&andriod_id=" + deviceID;
            postData(param, function (data, status) {
                if (data.status == "true") {
                    $ionicLoading.hide();
                    $cordovaToast.show('Successfully logged in.', 'short', 'bottom');
                    $rootScope.$broadcast('popover_text');
                    localStorage.setItem("isLoggedIn", "true");
                    $state.go("welcome.home");
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.show(data.message, 'short', 'bottom');
                }
            }, function () {
                $cordovaToast.show('Internal Error', 'short', 'bottom');
                $ionicLoading.hide();
            });
        }
    }
});
app.controller('HomeCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $ionicHistory) {
    $ionicHistory.clearHistory();
    $scope.onServiceClick = function (serviceName) {
        if (serviceName === "ads")
            $state.go("welcome." + serviceName);
        else if (serviceName === "iraqimarket")
            $state.go("welcome." + serviceName);
        else if (serviceName === "showCurrency")
            $state.go("welcome." + serviceName);
        else if (serviceName == "manageUserOptions")
            $state.go("welcome." + serviceName);
    }
});

app.controller('AdsCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $ionicHistory) {
    $scope.ads;
    $scope.updatedata;
    var param = "function=displayAdds";
    $ionicLoading.show({
        template: 'Loading...'
    });
    getData(param, function (result, status) {
        $scope.ads = result.data;
        $ionicLoading.hide();
    });
    $scope.doRefreshAds = function () {
        getData(param, function (result, status) {
            $scope.ads = result.data;
            $scope.$broadcast('scroll.refreshComplete');
        }, function () {
            $cordovaToast.show('Internal Error', 'short', 'bottom');
            $ionicLoading.hide();
        });
    };

    $scope.save = function () {
        $state.go("welcome.add", {dataObject: null, isSave: true});
    }
    $scope.update = function (item) {
        $state.go("welcome.add", {dataObject: item, isSave: false});
    }
    $scope.delete = function (item) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete AD',
            template: 'Are you sure you want to delete this ad?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    template: 'Loading...'
                });
                var param = "function=deleteAdds&id=" + item.id;
                postData(param, function (result, status) {
                    var index = $scope.ads.indexOf(item)
                    $scope.ads.splice(index, 1);
                    $ionicLoading.hide();
                    $cordovaToast.show(result.message, 'short', 'bottom');
                }, function () {
                    $cordovaToast.show('Internal Error', 'short', 'bottom');
                    $ionicLoading.hide();
                });
            }
        });
    }
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
});

app.controller('AddCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $cordovaCamera, $cordovaDatePicker, $ionicHistory) {
    var imageBase64 = "";
    var publish_date = "";
    if ($stateParams.isSave) {
        $scope.pageTitle = "Add New";
        $scope.buttonText = "SAVE";
    } else {
        $scope.updatedata = $stateParams.dataObject;
        $scope.pageTitle = $scope.updatedata.name;
        $scope.buttonText = "UPDATE";
    }

    var options = {
        quality: 90,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true
    };
    var dateOptions = {
        date: new Date(),
        mode: 'date',
        minDate: (new Date()).valueOf(),
        allowOldDates: false,
        allowFutureDates: false,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F2F3F4',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000'
    };
    $scope.chooseImage = function () {
        var myPopup = $ionicPopup.show({
            template: '',
            title: 'Please select Image source',
            scope: $scope,
            buttons: [
                {text: 'Gallery',
                    onTap: function (e) {
                        options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                    }},
                {text: 'Camera',
                    onTap: function (e) {
                        options.sourceType = Camera.PictureSourceType.CAMERA;
                    }
                }
            ]
        });
        myPopup.then(function (res) {
            console.log('Tapped!', res);
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var image = document.getElementById('image');

                image.src = "data:image/jpeg;base64," + imageData;
                imageBase64 = imageData;
                var img = document.getElementById("imgage");
                img.src = "data:image/jpeg;base64," + imageData;
                console.log(imageData);
            }, function (err) {
                alert(err);
            });
        });
    }

    $scope.openDatePicker = function (selector) {
        if (selector.match("publish_date")) {
            $cordovaDatePicker.show(dateOptions).then(function (date) {
                publish_date = dateFormat(date);
                document.getElementById("publish_date").value = publish_date;
            });
        } else if (selector.match("expiry_date")) {
            if (publish_date !== "") {
                dateOptions.date = new Date(publish_date.replace(/-/g, " "));
                dateOptions.minDate = (new Date(publish_date.replace(/-/g, " ")).valueOf());
                $cordovaDatePicker.show(dateOptions).then(function (date) {
                    document.getElementById("expiry_date").value = dateFormat(date);
                });
            } else
                $cordovaToast.show("Please select Publish Date first.", 'short', 'bottom')
        }
    }

    $scope.submitButton = function () {
        var add_id = "";
        var submitButtonName = document.getElementById("submitButton").innerHTML;
        if (submitButtonName.match("UPDATE")) {
            add_id = document.getElementById("add_id").innerHTML;
        }
        var compnayName = document.getElementById("company_name").value;
        var publish_date = document.getElementById("publish_date").value;
        var expiry_date = document.getElementById("expiry_date").value;
        if (compnayName == "" && publish_date == "" && expiry_date == "" && imageBase64 == undefined)
            $cordovaToast.show('Fields cannot be empty.', 'short', 'bottom');
        else if (submitButtonName.match("SAVE") && (imageBase64 == undefined || imageBase64 == ""))
            $cordovaToast.show('Please Select an image.', 'short', 'bottom');
        else if (compnayName == "")
            $cordovaToast.show('Please enter the company name.', 'short', 'bottom');
        else if (publish_date == "")
            $cordovaToast.show('Please enter publish date.', 'short', 'bottom');
        else if (expiry_date == "")
            $cordovaToast.show('Please enter expiry date.', 'short', 'bottom');
        else {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var param = "function=addAdds&title=&name=" + compnayName + "&publish_date=" + publish_date + "&expiry_date=" + expiry_date + "&image=" + imageBase64 + "&id=" + add_id;
            postData(param, function (result, status) {
                $ionicLoading.hide();
                $state.go("welcome.ads", {reload: true});
                console.log(result);
                $cordovaToast.show(result.message, 'short', 'bottom');
            }, function () {
                $cordovaToast.show('Internal Error', 'short', 'bottom');
                $ionicLoading.hide();
            });
        }
    }
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
});
app.controller("MarketCtrl", function ($scope, $ionicModal, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $ionicHistory) {
    var param = "function=displayMarkets";
    $ionicLoading.show({
        template: 'Loading...'
    });
    getData(param, function (result, status) {
		console.log("iraqii");
        $scope.markets = result.data;
        $ionicLoading.hide();
    }, function () {
        $cordovaToast.show('Internal Error', 'short', 'bottom');
        $ionicLoading.hide();
    });
    $scope.save = function () {
        $state.go("welcome.marketadd", {dataObject: null, isSave: true});
    }
    $scope.update = function (item) {
        $state.go("welcome.marketadd", {marketdataObject: item, isSave: false});
    }
    $scope.doRefreshMarkets = function () {
        getData(param, function (result, status) {
            $scope.markets = result.data;
            $scope.$broadcast('scroll.refreshComplete');
        }, function () {
            $cordovaToast.show('Internal Error', 'short', 'bottom');
            $ionicLoading.hide();
        });

    };
    $scope.showPopup = function (isAsk) {
        $scope.data = {};
        var title, isAskorBid = 1;
        if (isAsk == true)
            title = "Ask Value";
        else {
            title = "Bid Value";
            isAskorBid = 2;
        }
        var confirmPopup = $ionicPopup.confirm({
            title: title,
            scope: $scope,
            template: '<div class="search"><div class="icon_bg plus_minus" >\n\
                        <button class="button button-light  button-block  custom-button-save" ng-click="inc_dec(true)">+</button>\n\
                        <input style="color: #339900" type="text" id="incr" data-ng-model="data.value">\n\
                    <button class="button button-light  button-block  custom-button-save"  ng-click="inc_dec(false)">-</button></div> </div>',
            buttons: [{text: 'Cancel'}, {text: '<b>Update All</b>',
                    onTap: function (e) {
                        if (!$scope.data.value) {
                            $cordovaToast.show('Please enter the amount first.', 'short', 'bottom');
                            e.preventDefault();
                        } else {
                            $ionicLoading.show({
                                template: 'Loading...'
                            });
                            var params = "function=updateAllMarkets&amount=" + $scope.data.value + "&isask=" + isAskorBid;
//                                                     alert(params);
                            postData(params, function (result, status) {
                                $ionicLoading.hide();
                                console.log(result);
                                $scope.markets = result.data;
                            }, function () {
                                $cordovaToast.show('Internal Error', 'short', 'bottom');
                                $ionicLoading.hide();
                            });
                        }
                    }}]
        });
        $scope.inc_dec = function (isIncre) {
            var value = document.getElementById("incr").value;
            if (isIncre) {
                if (value === undefined)
                    value = 0;
                value = (value * 10 + 0.5 * 10) / 10;
            } else
            {
                if (value === undefined)
                    value = 0;
                value = (value * 10 - 0.5 * 10) / 10;

            }
            document.getElementById("incr").value = value;
            $scope.data.value = value;
        }
    }
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
});
app.controller('MarketAddCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $cordovaCamera, $cordovaDatePicker, $ionicHistory) {
    if ($stateParams.isSave) {
        $scope.pageTitle = "Add New";
        $scope.buttonText = "SAVE";
    } else {
        $scope.updatedata = $stateParams.marketdataObject;
        $scope.pageTitle = "Iraqi Borsa";
        $scope.buttonText = "UPDATE";
    }
    $scope.showPopup = function (isAsk) {
        $scope.data = {};


        var title;
        if (isAsk == true) {
            title = "Ask Value";
            $scope.data.value = $('#ask').val();
        } else {
            title = "Bid Value";
            $scope.data.value = $('#bid').val();
        }
        var confirmPopup = $ionicPopup.confirm({
            title: title,
            scope: $scope,
            template: '<div class="search"><div class="icon_bg plus_minus" >\n\
                        <button class="button button-light  button-block  custom-button-save" ng-click="inc_dec(true)">+</button>\n\
                        <input style="color: #339900" type="text" id="incr" data-ng-model="data.value">\n\
                    <button class="button button-light  button-block  custom-button-save"  ng-click="inc_dec(false)">-</button></div> </div>'
        });

        confirmPopup.then(function (res) {
            if (res) {
                if (isAsk == true)
                    $('#ask').val($scope.data.value);
                else
                    $('#bid').val($scope.data.value);
                console.log('You are sure');
            }
        });

        $scope.inc_dec = function (isIncre) {
            var value = document.getElementById("incr").value;
            if (isIncre) {
                if (value === undefined)
                    value = 0;
                value = (value * 10 + 0.5 * 10) / 10;
            } else
            {
                if (value === undefined)
                    value = 0;
                value = (value * 10 - 0.5 * 10) / 10;

            }
            document.getElementById("incr").value = value;
            $scope.data.value = value;
        }
    }


    $scope.delete = function (id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete ',
            template: 'Are you sure you want to delete this market?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    template: 'Loading...'
                });
                var param = "function=deleteMarkets&id=" + id;
                postData(param, function (result, status) {
                    $ionicLoading.hide();
                    $state.go("welcome.iraqimarket");
                    $cordovaToast.show(result.message, 'short', 'bottom');
                }, function () {
                    $cordovaToast.show('Internal Error', 'short', 'bottom');
                    $ionicLoading.hide();
                });
            }
        });


    }

    $scope.inc_dec = function (isIncre) {
        var value = document.getElementById("ask").value;


        if (isIncre) {
            if (value === undefined)
                value = 0;

            value = (value * 10 + 0.5 * 10) / 10;
        } else
        {
            if (value === undefined)
                value = 0;

            value = (value * 10 - 0.5 * 10) / 10;
        }
        document.getElementById("ask").value = value;
    }
    $scope.bid_inc_dec = function (isIncre) {
        var value = document.getElementById("bid").value;


        if (isIncre) {
            if (value === undefined)
                value = 0;

            value = (value * 10 + 0.5 * 10) / 10;
        } else
        {
            if (value === undefined)
                value = 0;

            value = (value * 10 - 0.5 * 10) / 10;
        }
        document.getElementById("bid").value = value;
    }

    $scope.submitButton = function () {
        var market_id = "";
        var submitButtonName = document.getElementById("submitButton").innerHTML;
        if (submitButtonName.match("UPDATE")) {
            market_id = document.getElementById("market_id").innerHTML;
        }
        var market_title = document.getElementById("title").value;
        var arabic_title = document.getElementById("arabic_title").value;
        var kurdish_title = document.getElementById("kurdish_title").value;
        var ask = document.getElementById("ask").value;
        var bid = document.getElementById("bid").value;
        if (market_title == "" && arabic_title == "" && kurdish_title == "" && ask == "" && bid == "")
            $cordovaToast.show('Fields cannot be empty.', 'short', 'bottom');
        else if (arabic_title == "")
            $cordovaToast.show('Please enter the arabic title.', 'short', 'bottom');
        else if (kurdish_title == "")
            $cordovaToast.show('Please enter the kurdish title.', 'short', 'bottom');
        else if (market_title == "")
            $cordovaToast.show('Please enter the title.', 'short', 'bottom');
        else if (ask == "")
            $cordovaToast.show('Please enter the ask value.', 'short', 'bottom');
        else if (bid == "")
            $cordovaToast.show('Please enter the bid value.', 'short', 'bottom');

        else {
            $ionicLoading.show({
                template: 'Loading...'
            });
            
            var param = "function=addMarkets&name=&title=" + market_title + "&arabic_title=" + arabic_title + "&kurdish_title=" + kurdish_title +  "&ask=" + ask + "&bid=" + bid + "&id=" + market_id;
            console.log(param)
            postData(param, function (result, status) {
				console.log(result);
                $ionicLoading.hide();
                $state.go("welcome.iraqimarket");
                $cordovaToast.show(result.message, 'short', 'bottom');
            }, function () {
                $cordovaToast.show('Internal Error', 'short', 'bottom');
                $ionicLoading.hide();
            });
        }
    }
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };

});

app.controller('CurrencyrateCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $cordovaDatePicker, $ionicHistory) {
    $scope.currency_from = [];
    $ionicLoading.show({
        template: 'Loading...'
    });
    setTimeout(function () {
        $scope.currency_from = $rootScope.currencyData;
        $ionicLoading.hide();
    }, 1000);

    $scope.addCurrencyrate = {};

    var dateOptions = {
        date: new Date(),
        mode: 'date',
        minDate: new Date() - 10000,
        allowOldDates: true,
        allowFutureDates: false,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F2F3F4',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000'
    };
    $scope.select = {};
    if ($stateParams.isSave) {
        $scope.pageTitle = "Add New";
        $scope.buttonText = "SAVE";
    } else {
        $scope.addCurrencyrate = $stateParams.dataObject;
        console.log($stateParams.dataObject.from_currency_id);
        var date = $stateParams.dataObject.date.split("-");
        $scope.select.from_currency = $stateParams.dataObject.from_currency_id;
        $scope.select.to_currency = $stateParams.dataObject.to_currency_id;
        $scope.addCurrencyrate.currency_from = $scope.select.from_currency;
        $scope.pageTitle = "Update Currency";
        $scope.buttonText = "UPDATE";
    }


    $scope.delete = function (id) {
        var param = "function=deleteCurrencies&id=" + id;
        console.log(param);
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete ',
            template: 'Are you sure you want to delete this currency?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    template: 'Loading...'
                });
                postData(param, function (result, status) {
                    $ionicLoading.hide();
                    $state.go("welcome.showCurrency");
                    $cordovaToast.show(result.message, 'short', 'bottom');
                }, function () {
                    $cordovaToast.show('Internal Error', 'short', 'bottom');
                    $ionicLoading.hide();
                });
            }
        });
    }

    $scope.inc_dec = function (isIncre) {
        var value = document.getElementById("curreny_ask").value;


        if (isIncre) {
            if (value === undefined)
                value = 0;

            value = (value * 10 + 0.5 * 10) / 10;
        } else
        {
            if (value === undefined)
                value = 0;

            value = (value * 10 - 0.5 * 10) / 10;
        }
        document.getElementById("curreny_ask").value = value;
    }
    $scope.bid_inc_dec = function (isIncre) {
        var value = document.getElementById("curreny_bid").value;


        if (isIncre) {
            if (value === undefined)
                value = 0;

            value = (value * 10 + 0.5 * 10) / 10;
        } else
        {
            if (value === undefined)
                value = 0;

            value = (value * 10 - 0.5 * 10) / 10;
        }
        document.getElementById("curreny_bid").value = value;
    }
    $scope.showPopup = function (isAsk) {
        $scope.data = {};
        var title;
        if (isAsk == true) {
            title = "Ask Value";
            $scope.data.value = $('#curreny_ask').val();
        } else {
            title = "Bid Value";
            $scope.data.value = $('#curreny_bid').val();
        }
        var confirmPopup = $ionicPopup.confirm({
            title: title,
            scope: $scope,
            template: '<div class="search"><div class="icon_bg plus_minus" >\n\
                        <button class="button button-light  button-block  custom-button-save" ng-click="inc_dec(true)">+</button>\n\
                        <input style="color: #339900" type="text" id="incr" data-ng-model="data.value">\n\
                        <button class="button button-light  button-block  custom-button-save"  ng-click="inc_dec(false)">-</button></div> </div>'
        });

        confirmPopup.then(function (res) {
            if (res) {
                if (isAsk == true)
                    $('#curreny_ask').val($scope.data.value);
                else
                    $('#curreny_bid').val($scope.data.value);
                console.log('You are sure');
            }
        });

        $scope.inc_dec = function (isIncre) {
            var value = document.getElementById("incr").value;
            if (isIncre) {
                if (value === undefined)
                    value = 0;
                value = (value * 10 + 0.5 * 10) / 10;
            } else
            {
                if (value === undefined)
                    value = 0;
                value = (value * 10 - 0.5 * 10) / 10;

            }
//            alert(value);
            document.getElementById("incr").value = value;
            $scope.data.value = value;
        }
    }
    $scope.openDateOrTimePicker = function (selector) {
        if (selector.match("date")) {
            dateOptions.mode = 'date';
            $cordovaDatePicker.show(dateOptions).then(function (date) {
                document.getElementById("currency_date").value = dateFormat(date);
            });
        } else if (selector.match("time")) {
            dateOptions.mode = 'time';
            $cordovaDatePicker.show(dateOptions).then(function (time) {
                document.getElementById("currency_time").value = timeFormat(time);
            });
        }

    }
    $scope.addCurrencyrateForm = function () {
        var currency_id = "";
        var submitButtonName = document.getElementById("currencySubmitButton").innerHTML;
        if (submitButtonName.match("UPDATE")) {
            currency_id = document.getElementById("currency_id").innerHTML;
        }
        var from_currency_id = $scope.addCurrencyrate.currency_from;
        var bid = document.getElementById("curreny_bid").value;
        var ask = document.getElementById("curreny_ask").value;

        var to_currency_id = $scope.addCurrencyrate.currency_to;
        var date = document.getElementById("currency_date").value;
        var time = document.getElementById("currency_time").value;
        var title = '';
        var to_id = $scope.addCurrencyrate.to_currency_id;
        if (to_id !== undefined && to_currency_id == undefined) {
            to_currency_id = to_id;
        } else {
            to_currency_id = $scope.addCurrencyrate.currency_to;
        }
        console.log($scope.addCurrencyrate.from_currency_id);
        console.log($scope.addCurrencyrate.to_currency_id);
        console.log(date);
        console.log(time);
        if (from_currency_id == undefined && ask == undefined && bid == undefined
                && to_currency_id == undefined && date == undefined && time == undefined)
            $cordovaToast.show('Fields cannot be empty.', 'short', 'bottom');
        else if (from_currency_id == undefined)
            $cordovaToast.show('Please select from currency.', 'short', 'bottom');
        else if (ask == undefined)
            $cordovaToast.show('Please enter the ask value.', 'short', 'bottom');
        else if (bid == undefined)
            $cordovaToast.show('Please enter the bid value.', 'short', 'bottom');
        else if (to_currency_id == undefined)
            $cordovaToast.show('Please select to currency.', 'short', 'bottom');
        else if (date == undefined || date == "")
            $cordovaToast.show('Please enter date.', 'short', 'bottom');
        else if (time == undefined || time == "")
            $cordovaToast.show('Please enter time.', 'short', 'bottom');
        else {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var param = "function=addCurrencies&from_currency_id=" + from_currency_id + "&ask=" + ask + "&to_currency_id=" + to_currency_id
                    + "&date=" + date + "&time=" + time + "&title=" + title + "&id=" + currency_id + "&bid=" + bid;
//            alert(param);
            console.log(param);
            postData(param, function (result, status) {
                $ionicLoading.hide();
                console.log(result);
                $state.go("welcome.showCurrency");
                $cordovaToast.show(result.message, 'short', 'bottom');
            }, function () {
                $cordovaToast.show('Internal Error', 'short', 'bottom');
                $ionicLoading.hide();
            });
        }
    }

    $scope.goBack = function () {
        $ionicHistory.goBack();
    };

});
app.controller('ShowCurrencyDetailsCtrl', function ($scope, $ionicModal, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $ionicHistory) {


    $ionicLoading.show({
        template: 'Loading...'
    });
    var param = 'function=displayCurrencies';
    getData(param, function (result, status) {
        $scope.currencyRecords = result.data;
        $rootScope.currencyData = result.country;
        $ionicLoading.hide();
    }, function () {
        $cordovaToast.show('Internal Error', 'short', 'bottom');
        $ionicLoading.hide();
    });

    $scope.doRefreshCurrencies = function () {
        getData(param, function (result, status) {
            $scope.currencyRecords = result.data;
            $scope.$broadcast('scroll.refreshComplete');
        }, function () {
            $cordovaToast.show('Internal Error', 'short', 'bottom');
            $ionicLoading.hide();
        });
    };

    $scope.save = function () {
        $state.go("welcome.currencyrate", {dataObject: null, isSave: true});
    }
    $scope.update = function (item) {
        console.log(item);
        $state.go("welcome.currencyrate", {dataObject: item, isSave: false});
    }
    $scope.showPopup = function (isAsk) {
        $scope.data = {};
        var title, isAskorBid = 1;
        if (isAsk == true)
            title = "Ask Value";
        else {
            title = "Bid Value";
            isAskorBid = 2;
        }
        var confirmPopup = $ionicPopup.confirm({
            title: title,
            scope: $scope,
            template: '<div class="search"><div class="icon_bg plus_minus" >\n\
                        <button class="button button-light  button-block  custom-button-save" ng-click="inc_dec(true)">+</button>\n\
                        <input style="color: #339900" type="text" id="incr" data-ng-model="data.value">\n\
                    <button class="button button-light  button-block  custom-button-save"  ng-click="inc_dec(false)">-</button></div> </div>',
            buttons: [{text: 'Cancel'}, {text: '<b>Update All</b>',
                    onTap: function (e) {
                        if (!$scope.data.value) {
                            $cordovaToast.show('Please enter the amount first.', 'short', 'bottom');
                            e.preventDefault();
                        } else {
                            $ionicLoading.show({
                                template: 'Loading...'
                            });
                            var params = "function=updateAllCurrencies&amount=" + $scope.data.value + "&isask=" + isAskorBid;
                            postData(params, function (result, status) {
                                $ionicLoading.hide();
                                $scope.currencyRecords = result.data;
                            }, function () {
                                $cordovaToast.show('Internal Error', 'short', 'bottom');
                                $ionicLoading.hide();
                            });

                        }
                    }}]
        });

        $scope.inc_dec = function (isIncre) {
            var value = document.getElementById("incr").value;
            if (isIncre) {
                if (value === undefined)
                    value = 0;
                value = (value * 10 + 0.5 * 10) / 10;
            } else
            {
                if (value === undefined)
                    value = 0;
                value = (value * 10 - 0.5 * 10) / 10;

            }
            document.getElementById("incr").value = value;
            $scope.data.value = value;
        }
    }
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
});
app.controller('ManageUserOptionsCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $ionicHistory) {

    $scope.manageUser = function (isUser) {
        if (isUser)
            $state.go("welcome.manageUser");
        else
            $state.go("welcome.manageCompany");
    }
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
});
app.controller('ManageUserCtrl', function ($scope, $rootScope, $http, $ionicModal, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $ionicHistory) {
    
    console.log("ManageUserCtrl");
    
    $scope.reverse = true;
    $scope.propertyName = 'is_active';

    $ionicLoading.show({
        template: 'Loading...'
    });
    var param = "function=displayUsers&type=cust";
    getData(param, function (result, status) {
		
		var dateMatch = new Array();	
		angular.forEach(result.data, function(value, key) {
			console.log(value);				
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();
			if(dd<10) {	dd='0'+dd	} 
			if(mm<10) {	mm='0'+mm	} 
			var currentDate = yyyy+'-'+mm+'-'+dd;
			var expired = value.expired ;			
			if((currentDate >= expired  && expired != '') || (value.is_active == '0')){	var color = "red";	}else{	var color = "white"	}	
			//if(currentDate >= expired  && expired != ''){	var color = "red";	}else{	var color = "white"	}	
					
			dateMatch.push({"address": value.address,"company_name": value.company_name,"contact": value.contact,"expired": value.expired,"first_name": value.first_name,"id": value.id,"image": value.image,"is_active": value.is_active,"label": value.label,"last_name": value.last_name,"password": value.password,"show": value.show,"username": value.username, "mycolor": color});		
		}); 	
		
		console.log(dateMatch);
        $scope.manageUserData = dateMatch;
        $ionicLoading.hide();
        //console.log(result.data);
    }, function () {
        $cordovaToast.show('Internal Error', 'short', 'bottom');
        $ionicLoading.hide();
    });
    $scope.doRefreshUsers = function () {
        getData(param, function (result, status) {
			
			var dateMatch = new Array();	
				angular.forEach(result.data, function(value, key) {
				console.log(value);				
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear();
				if(dd<10) {	dd='0'+dd	} 
				if(mm<10) {	mm='0'+mm	} 
				var currentDate = yyyy+'-'+mm+'-'+dd;
				var expired = value.expired ;			
				if((currentDate >= expired  && expired != '') || (value.is_active == '0')){	var color = "red";	}else{	var color = "white"	}	
				//if(currentDate >= expired  && expired != ''){	var color = "red";	}else{	var color = "white"	}	
					
				dateMatch.push({"address": value.address,"company_name": value.company_name,"contact": value.contact,"expired": value.expired,"first_name": value.first_name,"id": value.id,"image": value.image,"is_active": value.is_active,"label": value.label,"last_name": value.last_name,"password": value.password,"show": value.show,"username": value.username, "mycolor": color});		
			}); 	
			
			//dateMatch.sort();
			
			//console.log("sort");
			//console.log(dateMatch);
			
			$scope.manageUserData = dateMatch;
            //$scope.manageUserData = result.data;
            $scope.$broadcast('scroll.refreshComplete');
        }, function () {
            $cordovaToast.show('Internal Error', 'short', 'bottom');
            $ionicLoading.hide();
        });
    };

    $ionicModal.fromTemplateUrl('templates/search.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.$on('modal.removed', function () {
        $ionicModal.fromTemplateUrl('templates/search.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
    });

    $scope.save = function () {
        $state.go("welcome.addManageUser", {dataObject: null, isSave: true});
    }
    $scope.update = function (item) {
        $state.go("welcome.addManageUser", {dataObject: item, isSave: false});
    }
    $scope.delete = function (item) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Customer',
            template: 'Are you sure you want to delete this customer.?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    template: 'Loading...'
                });
                var param = "function=deleteUsers&id=" + item.id;
                postData(param, function (result, status) {
                    var index = $scope.manageUserData.indexOf(item)
                    $scope.manageUserData.splice(index, 1);
                    $ionicLoading.hide();
                    $cordovaToast.show(result.message, 'short', 'bottom');
                }, function () {
                    $cordovaToast.show('Internal Error', 'short', 'bottom');
                    $ionicLoading.hide();
                });
            }
        });
    }
    $scope.searchlocations = function () {
        $(".inputclass").autocomplete({
            source: function (request, response) {
                var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                response($.grep($scope.manageUserData, function (value) {
                    return matcher.test(value.label)
                            || matcher.test(value.contact);
                }));
            },
            appendTo: "#menu-list",
            select: function (event, ui) {
                $(".inputclass").val(ui.item.label);
                $scope.modal.remove();
                $state.go("welcome.addManageUser", {dataObject: ui.item, isSave: false});
            }
        });
    };
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };

	  $scope.sortBy = function (propertyName) {
		  console.log(propertyName);
			$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
			$scope.propertyName = propertyName;
		};
});



app.controller('AddManageUserCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $cordovaCamera, $cordovaDatePicker, $ionicHistory) {
    var imageBase64 = "";
    $scope.updatedata = [];
    if ($stateParams.isSave) {
        $scope.pageTitle = "Add New Customer";
        $scope.buttonText = "SAVE";
    } else {
        $scope.updatedata = $stateParams.dataObject;
        if ($scope.updatedata.is_active == 1)
            $scope.updatedata.is_active = true;
        else
            $scope.updatedata.is_active = false;
        $scope.pageTitle = $scope.updatedata.username;
        $scope.buttonText = "UPDATE";
    }


    var options = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 320,
        targetHeight: 120,
        correctOrientation: true
    };

    var dateOptions = {
        date: new Date(),
        mode: 'date',
        minDate: (new Date()).valueOf(),
        allowOldDates: false,
        allowFutureDates: false,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F2F3F4',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000'
    };
    $scope.openDatePicker = function (selector) {

        $cordovaDatePicker.show(dateOptions).then(function (date) {
            document.getElementById("user_expiry_date").value = dateFormat(date);
        });

    }
    $scope.chooseImage = function () {
        var myPopup = $ionicPopup.show({
            template: '',
            title: 'Please select Image source',
            scope: $scope,
            buttons: [
                {text: 'Gallery',
                    onTap: function (e) {
                        options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                    }},
                {text: 'Camera',
                    onTap: function (e) {
                        options.sourceType = Camera.PictureSourceType.CAMERA;
                    }
                }
            ]
        });
        myPopup.then(function (res) {
            console.log('Tapped!', res);
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var image = document.getElementById('image');
                image.src = "data:image/jpeg;base64," + imageData;
                imageBase64 = imageData;
                console.log(imageData);
            }, function (err) {
                alert(err);
            });
        });
    }


    $scope.submitButton = function () {
        var is_active = $scope.updatedata.is_active;
        if (is_active)
            is_active = 1;
        else
            is_active = 0;
        var add_id = "";
        var submitButtonName = document.getElementById("submitButton").innerHTML;
        if (submitButtonName.match("UPDATE")) {
            add_id = document.getElementById("add_id").innerHTML;
        }
        var user_type = $scope.updatedata.show;
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
//        var first_name = document.getElementById("first_name").value;
//        var last_name = document.getElementById("last_name").value;
        var contact = document.getElementById("contact").value;
//        var address = document.getElementById("address").value;
        var expiry_date = document.getElementById("user_expiry_date").value;
        if (username == "" && password == "" && contact == "" && imageBase64 == undefined && expiry_date == "")
            $cordovaToast.show('Fields cannot be empty.', 'short', 'bottom');
        else if (submitButtonName.match("SAVE") && (imageBase64 == undefined || imageBase64 == ""))
            $cordovaToast.show('Please Select an image.', 'short', 'bottom');
        else if (username == "")
            $cordovaToast.show('Please enter the user name.', 'short', 'bottom');
        else if (password == "")
            $cordovaToast.show('Please enter the password.', 'short', 'bottom');
//        else if (first_name == "")
//            $cordovaToast.show('Please enter the first name.', 'short', 'bottom');
//        else if (last_name == "")
//            $cordovaToast.show('Please enter the last name.', 'short', 'bottom');
        else if (contact == "")
            $cordovaToast.show('Please enter the contact number.', 'short', 'bottom');
//        else if (address == "")
//            $cordovaToast.show('Please enter the address', 'short', 'bottom');
        else if (expiry_date == "")
            $cordovaToast.show('Please enter the expire date', 'short', 'bottom');
        else if (user_type == "")
            $cordovaToast.show('Please select the user type.', 'short', 'bottom');

        else {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var param = "function=addUsers&type=cust&first_name=&last_name=&username=" + username
                    + "&password=" + password + "&contact=" + contact + "&address=&image="
                    + imageBase64 + "&company_name=&id=" + add_id + "&expired=" + expiry_date + "&is_active=" + is_active + "&show=" + user_type;
            console.log(param);
            postData(param, function (result, status) {
                $ionicLoading.hide();
                $state.go("welcome.manageUser", {reload: true});
                console.log(result);
                $cordovaToast.show(result.message, 'short', 'bottom');
            }, function () {
                $cordovaToast.show('Internal Error', 'short', 'bottom');
                $ionicLoading.hide();
            });
        }
    }
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
});
app.controller('ManageCompanyCtrl', function ($scope, $rootScope, $ionicModal, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $ionicHistory) {
    $scope.reverse = true;
    $scope.propertyName = 'is_active';
    $ionicLoading.show({
        template: 'Loading...'
    });
    var param = "function=displayUsers&type=comp";
    getData(param, function (result, status) {
		
		var dateMatch = new Array();	
		angular.forEach(result.data, function(value, key) {
			console.log(value);				
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();
			if(dd<10) {	dd='0'+dd	} 
			if(mm<10) {	mm='0'+mm	} 
			var currentDate = yyyy+'-'+mm+'-'+dd;
			var expired = value.expired ;			
			if((currentDate >= expired  && expired != '') || (value.is_active == '0')){	var color = "red";	}else{	var color = "white"	}	
					
			dateMatch.push({"address": value.address,"company_name": value.company_name,"contact": value.contact,"expired": value.expired,"first_name": value.first_name,"id": value.id,"image": value.image,"is_active": value.is_active,"label": value.label,"last_name": value.last_name,"password": value.password,"show": value.show,"username": value.username, "mycolor": color});		
		}); 	
		
		console.log(dateMatch);
        $scope.manageCompanyData = dateMatch;
		
       // $scope.manageCompanyData = result.data;
//        $rootScope.searchList = result.data;
        $ionicLoading.hide();
    }, function () {
        $cordovaToast.show('Internal Error', 'short', 'bottom');
        $ionicLoading.hide();
    });
    $scope.doRefreshCompanies = function () {
        getData(param, function (result, status) {
			
			var dateMatch = new Array();	
		angular.forEach(result.data, function(value, key) {
			console.log(value);				
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();
			if(dd<10) {	dd='0'+dd	} 
			if(mm<10) {	mm='0'+mm	} 
			var currentDate = yyyy+'-'+mm+'-'+dd;
			var expired = value.expired ;			
			if((currentDate >= expired  && expired != '') || (value.is_active == '0')){	var color = "red";	}else{	var color = "white"	}	
					
			dateMatch.push({"address": value.address,"company_name": value.company_name,"contact": value.contact,"expired": value.expired,"first_name": value.first_name,"id": value.id,"image": value.image,"is_active": value.is_active,"label": value.label,"last_name": value.last_name,"password": value.password,"show": value.show,"username": value.username, "mycolor": color});		
		}); 	
		
		console.log(dateMatch);
        $scope.manageCompanyData = dateMatch;
        
           // $scope.manageCompanyData = result.data;
            $scope.$broadcast('scroll.refreshComplete');
        }, function () {
            $cordovaToast.show('Internal Error', 'short', 'bottom');
            $ionicLoading.hide();
        });
    };
    $scope.save = function () {
        $state.go("welcome.addManageCompany", {dataObject: null, isSave: true});
    }
    $scope.update = function (item) {
        $state.go("welcome.addManageCompany", {dataObject: item, isSave: false});
    }
    $scope.delete = function (item) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Company',
            template: 'Are you sure you want to delete this company?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    template: 'Loading...'
                });
                var param = "function=deleteUsers&id=" + item.id;
                postData(param, function (result, status) {
                    var index = $scope.manageCompanyData.indexOf(item)
                    $scope.manageCompanyData.splice(index, 1);
                    $ionicLoading.hide();
                    $cordovaToast.show(result.message, 'short', 'bottom');
                }, function () {
                    $cordovaToast.show('Internal Error', 'short', 'bottom');
                    $ionicLoading.hide();
                });
            }
        });
    }

    $ionicModal.fromTemplateUrl('templates/search.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.$on('modal.removed', function () {
        $ionicModal.fromTemplateUrl('templates/search.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
    });
    $scope.searchlocations = function () {
        $(".inputclass").autocomplete({
            source: function (request, response) {
                var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                response($.grep($scope.manageCompanyData, function (value) {
                    return matcher.test(value.label)
                            || matcher.test(value.contact);
                }));
            },
            appendTo: "#menu-list",
            select: function (event, ui) {
                $(".inputclass").val(ui.item.label);
                $scope.modal.remove();
                $state.go("welcome.addManageCompany", {dataObject: ui.item, isSave: false});
            }
        });
    };
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };

    $scope.sortBy = function (propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
});
app.controller('AddManageCompanyCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $cordovaCamera, $cordovaDatePicker, $ionicHistory) {
    var imageBase64 = "";
    $scope.updatedata = [];
    if ($stateParams.isSave) {
        $scope.pageTitle = "Add New Company";
        $scope.buttonText = "SAVE";
    } else {
        $scope.updatedata = $stateParams.dataObject;
        if ($scope.updatedata.is_active == 1)
            $scope.updatedata.is_active = true;
        else
            $scope.updatedata.is_active = false;
        $scope.pageTitle = $scope.updatedata.company_name;
        $scope.buttonText = "UPDATE";
    }

    var options = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 320,
        targetHeight: 120,
        correctOrientation: true
    };
    $scope.chooseImage = function () {
        var myPopup = $ionicPopup.show({
            template: '',
            title: 'Please select Image source',
            scope: $scope,
            buttons: [
                {text: 'Gallery',
                    onTap: function (e) {
                        options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                    }},
                {text: 'Camera',
                    onTap: function (e) {
                        options.sourceType = Camera.PictureSourceType.CAMERA;
                    }
                }
            ]
        });
        myPopup.then(function (res) {
            console.log('Tapped!', res);
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var image = document.getElementById('image');
                image.src = "data:image/jpeg;base64," + imageData;
                imageBase64 = imageData;
                console.log(imageData);
            }, function (err) {
                alert(err);
            });
        });
    }
    var dateOptions = {
        date: new Date(),
        mode: 'date',
        minDate: (new Date()).valueOf(),
        allowOldDates: false,
        allowFutureDates: false,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F2F3F4',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000'
    };
    $scope.openDatePicker = function (selector) {

        $cordovaDatePicker.show(dateOptions).then(function (date) {
            document.getElementById("company_expiry_date").value = dateFormat(date);
        });

    }

    $scope.submitButton = function () {
        var is_active = $scope.updatedata.is_active;
        if (is_active)
            is_active = 1;
        else
            is_active = 0;
        var add_id = "";
        var submitButtonName = document.getElementById("submitButton").innerHTML;
        if (submitButtonName.match("UPDATE")) {
            add_id = document.getElementById("add_id").innerHTML;
        }
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var first_name = document.getElementById("first_name").value;
        var last_name = document.getElementById("last_name").value;
        var contact = document.getElementById("contact").value;
        var address = document.getElementById("address").value;
        var company_name = document.getElementById("company_name").value;
        var expiry_date = document.getElementById("company_expiry_date").value
        if (username == "" && password == "" && contact == "" && company_name == ""
                && imageBase64 == undefined && expiry_date == "" && first_name == ""
                && last_name == "" && address == "")
            $cordovaToast.show('Fields cannot be empty.', 'short', 'bottom');
        else if (submitButtonName.match("SAVE") && (imageBase64 == undefined || imageBase64 == ""))
            $cordovaToast.show('Please Select an image.', 'short', 'bottom');
        else if (username == "")
            $cordovaToast.show('Please enter the user name.', 'short', 'bottom');
        else if (password == "")
            $cordovaToast.show('Please enter the password.', 'short', 'bottom');
        else if (first_name == "")
            $cordovaToast.show('Please enter the first name.', 'short', 'bottom');
        else if (last_name == "")
            $cordovaToast.show('Please enter the last name.', 'short', 'bottom');
        else if (contact == "")
            $cordovaToast.show('Please enter the contact number.', 'short', 'bottom');
        else if (address == "")
            $cordovaToast.show('Please enter the address', 'short', 'bottom');
        else if (company_name == "")
            $cordovaToast.show('Please enter the company name.', 'short', 'bottom');
        else if (expiry_date == "")
            $cordovaToast.show('Please enter the expire date', 'short', 'bottom');
        else {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var param = "function=addUsers&type=comp&first_name=" + first_name + "&last_name=" + last_name + "&username=" + username
                    + "&password=" + password + "&contact=" + contact + "&address=" + address + "&company_name=" + company_name
                    + "&image=" + imageBase64 + "&id=" + add_id + "&expired=" + expiry_date + "&is_active=" + is_active;
            postData(param, function (result, status) {
                $ionicLoading.hide();
                $state.go("welcome.manageCompany", {reload: true});
                console.log(result);
                $cordovaToast.show(result.message, 'short', 'bottom');
            }, function () {
                $cordovaToast.show('Internal Error', 'short', 'bottom');
                $ionicLoading.hide();
            });
        }
    }
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
});
app.controller('NotificationCtrl', function ($scope, $ionicLoading, $cordovaToast, $ionicHistory) {

    $scope.notification = [];
    $ionicLoading.show({
        template: 'Loading...'
    });
    var param = "function=displayUsers&type=cust";
    getData(param, function (result, status) {
        $scope.notification.users = result.data;
        console.log(result.data);
        $ionicLoading.hide();
    }, function () {
        $cordovaToast.show('Internal Error', 'short', 'bottom');
        $ionicLoading.hide();
    });

    $scope.submitButton = function (isAll) {
        var isDone = false;
        var title = $scope.notification.title;
        var message = $scope.notification.message;
        var sound = $scope.notification.sound;
        if ((title == "" && message == "") || (title == undefined && message == undefined))
            $cordovaToast.show("Fileds cannot be blank.", 'short', 'bottom');
        else if (title == "" || title == undefined)
            $cordovaToast.show("Please type the title.", 'short', 'bottom');
        else if (message == "" || message == undefined)
            $cordovaToast.show("Please type the message.", 'short', 'bottom');
        else {
            var param;
            if (isAll) {
                param = "function=sendNotification&title=" + title + "&message=" + message + "&sound=" + sound + "&is_all=true&users=";
                isDone = true;
            } else {
                var users = $scope.notification.selectedUsers;
                if (users == undefined || users == "") {
                    $cordovaToast.show("Please select users.", 'short', 'bottom');
                } else {
                    param = "function=sendNotification&title=" + title + "&message=" + message + "&sound=" + sound + "&is_all=false&users=" + users;
                    isDone = true;
                }
            }
            if (isDone) {
                $ionicLoading.show({
                    template: 'Loading...'
                });
                postData(param, function (result, status) {
                    $ionicLoading.hide();
                    console.log(result);
                    if (result.status == "true")
                        $cordovaToast.show("Notification has been successfully sent.", 'short', 'bottom');
                    else
                        $cordovaToast.show("Internal Error. Please try again after some time", 'short', 'bottom');
                }, function () {
                    $cordovaToast.show('Internal Error', 'short', 'bottom');
                    $ionicLoading.hide();
                });
            }
        }
    }
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
});

app.controller('SettingsCtrl', function ($scope, $ionicLoading, $cordovaToast, $ionicHistory) {
    $scope.settings = [];

    $ionicLoading.show({
        template: 'Loading...'
    });
    var param = "function=getSettings";
    getData(param, function (result, status) {

        if (result.data[0].is_signup == "1")
            $scope.settings.is_signup_option = true;
        if (result.data[0].is_login_required == "1")
            $scope.settings.is_login_required = true;

        $scope.settings.manage_contacts = result.data[0].contact;
        $scope.settings.manage_info = result.data[0].info;
        $ionicLoading.hide();
        console.log(result);
    }, function () {
        $cordovaToast.show('Internal Error', 'short', 'bottom');
        $ionicLoading.hide();
    });
    $scope.saveSettingBtn = function () {
        var is_signup = 0;
        var is_Login_Required = 0;
        if ($scope.settings.is_signup_option == true)
            is_signup = 1;
        if ($scope.settings.is_login_required == true)
            is_Login_Required = 1;
        $ionicLoading.show({
            template: 'Loading...'
        });
        var param = "function=settings&is_signup=" + is_signup + "&is_login_required=" + is_Login_Required
                + "&info=" + $scope.settings.manage_info + "&contact=" + $scope.settings.manage_contacts;
        postData(param, function (result, status) {
            $ionicLoading.hide();
            $cordovaToast.show(result.message, 'short', 'bottom');
        }, function () {
            $cordovaToast.show('Internal Error', 'short', 'bottom');
            $ionicLoading.hide();
        });
    }
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
});

app.controller('InfoCtrl', function ($scope, $ionicLoading, $cordovaToast, $ionicHistory) {
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
});


function dateFormat(date) {
    var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}

function timeFormat(time) {
    var d = new Date(time),
            hh = d.getHours(),
            mm = d.getMinutes(),
            ss = "00";
    return [hh, mm, ss].join(':');
}
