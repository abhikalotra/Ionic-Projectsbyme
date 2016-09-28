Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};
Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    
    return value && JSON.parse(value);
};
var pageHeading = "borsa";

var app = angular.module('starter.controllers', []);

app.controller('AppCtrl', function ($scope, $rootScope, $http, $ionicSlideBoxDelegate, $cordovaNetwork, $state, $ionicLoading, $ionicPopup, $cordovaToast, $ionicPopover, $translate) {
	 		
	 		
	 		
	 		
	 		
    $scope.hasAds = [];
    var param = "function=displayAdds";
    getData(param, function (result, status) {
        $scope.ads = result.data;
        localStorage.setObject("ads", result.data);
        $ionicSlideBoxDelegate.update();
        $scope.hasAds = true;
    }, function () {
        $cordovaToast.show('Internal Error', 'short', 'bottom');
    });

    $scope.logout = function (isLogout) {
		console.log(isLogout);
       if (isLogout == "Log-Out" || isLogout == "تسجيل الدخول" || isLogout == "تسجيل الدخول" || isLogout == "چوونەژوورەوە" || isLogout == "Derkeve") {
             
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_type");
            localStorage.removeItem("isExpired");
            localStorage.removeItem("both_screen");
            localStorage.removeItem("borsa_screen");
            localStorage.removeItem("market_screen");
            localStorage.removeItem("market_loggedIn");
            $scope.login_logout = $translate.instant("LOGIN");
            $cordovaToast.show('Successfully logged out.', 'short', 'bottom');
            if (pageHeading == "Kurdistan Market"){
               $state.go("welcome.showCurrencylogin");                
            }else{            
                $state.go("welcome.login");}
        } else
           $state.go("welcome.login");
           // $state.go("welcome.showCurrencylogin");
            
        $scope.popover.hide();
    }
    
    
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function (popover) {
		console.log(popover);
        $scope.popover = popover;
        var isLoggedIn = localStorage.getItem("isLoggedIn");
       
       var user_idGet = localStorage.getItem("user_id");        
		var idPopUp = $(".Login").html();			
        console.log(user_idGet);
        console.log(idPopUp);
        if (isLoggedIn == undefined){
			
			if(user_idGet !=''){	
				
				$scope.login_logout = $translate.instant("LOGOUT"); 
				}else{
					$scope.login_logout = $translate.instant("LOGIN");
				}
			
       } else{
		    $scope.login_logout = $translate.instant("LOGOUT");
		    }
    });
    $scope.$on('popover_text', function (events) {
		console.log(events)
        var isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn == undefined){
			  $scope.login_logout = $translate.instant("LOGIN");
        }else{
			$scope.login_logout = $translate.instant("LOGOUT");}
    });
    
    
   /* $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function (popover) {
		console.log(popover);
        $scope.popover = popover;
        var isLoggedIn = localStorage.getItem("isLoggedIn");
        
        if (isLoggedIn == undefined){
			$scope.login_logout = $translate.instant("LOGIN");
       } else{
		    $scope.login_logout = $translate.instant("LOGOUT");}
    });
    
    $scope.$on('popover_text', function (events) {
		console.log(events)
        var isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn == undefined){
			  $scope.login_logout = $translate.instant("LOGIN");
        }else{
			$scope.login_logout = $translate.instant("LOGOUT");}
    });*/

});

app.controller('LoginCtrl', function ($scope, $rootScope, $http, $state, $ionicModal, $ionicLoading, $ionicPopup, $cordovaToast, $cordovaDevice, $translate, $cordovaNetwork) {
     
    var pageTitle = $(".login_heading").html();
    $scope.loginData = [];
    $scope.signup = [];
    var user_id = localStorage.getItem("user_id");
    if (user_id === "null" || user_id === undefined || user_id === null)
        user_id = "";
    var param = "function=getSettings&user_id=" + user_id;
    $ionicLoading.show({
        template: 'Loading...'
    });
    getData(param, function (result, status) {
        $scope.loginData = result.data[0];
        localStorage.setItem("is_login_required", result.data[0].is_login_required);
        localStorage.setItem("is_signup", result.data[0].is_signup);
        $scope.loginData.signup_option = result.data[0].is_signup;

        if (pageTitle == "Kurdistan Market" && result.data[0].is_login_required == "0")
            $state.go("welcome.showCurrency");
        else if (result.data[0].show == "1") {
            localStorage.removeItem("both_screen");
            localStorage.removeItem("market_screen");
            localStorage.removeItem("market_loggedIn");
        } else if (result.data[0].show == "2") {
            localStorage.removeItem("is_login_required");
            localStorage.removeItem("both_screen");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("borsa_screen");
        } else if (result.data[0].show == "3") {
            localStorage.removeItem("is_login_required");
        }
        $ionicLoading.hide();
    }, function () {
        $cordovaToast.show('Internal Error', 'short', 'bottom');
        $ionicLoading.hide();
    });
    $scope.login = function () {
        var pageTitle = $(".login_heading").html();
        pageHeading = pageTitle;

        if (($scope.loginData.username == undefined || $scope.loginData.username == "")
                && ($scope.loginData.password == undefined || $scope.loginData.password == ""))
            $cordovaToast.show('Fields cannot be blank.', 'short', 'bottom');
        else if ($scope.loginData.username == "" || $scope.loginData.username == undefined)
            $cordovaToast.show('Please enter the username', 'short', 'bottom');
        else if ($scope.loginData.password == "" || $scope.loginData.password == undefined)
            $cordovaToast.show('Please enter password', 'short', 'bottom');
        else {
            var show = "1";
            if (pageTitle == "Kurdistan Market")
                show = "2";
            $ionicLoading.show({
                template: 'Loading...'
            });
            var deviceID = localStorage.getItem("deviceID");
            var uuid = localStorage.getItem("uuid");
            var param = "function=userLogin&username=" + $scope.loginData.username
                    + "&password=" + $scope.loginData.password + "&andriod_id=" + deviceID + "&uuid=" + uuid + "&show=" + show;
            postData(param, function (result, status) {
                if (result.status == "true") {
                    $ionicLoading.hide();
                    $cordovaToast.show('Successfully logged in.', 'short', 'bottom');
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("user_id", result.data.id);
                    localStorage.setItem("user_type", result.data.type);
                    $rootScope.$broadcast('popover_text');

                    if (result.data.show == "1") {
                        localStorage.setItem("borsa_screen", result.data.show);
                        localStorage.removeItem("both_screen");
                        localStorage.removeItem("market_screen");
                        localStorage.removeItem("market_loggedIn");
                        $state.go("welcome.iraqimarket");
                    } else if (result.data.show == "2") {
                        localStorage.setItem("market_screen", result.data.show);
                        localStorage.setItem("market_loggedIn", "true");
                        localStorage.removeItem("is_login_required");
                        localStorage.removeItem("both_screen");
                        localStorage.removeItem("isLoggedIn");
                        localStorage.removeItem("borsa_screen");
                        $state.go("welcome.showCurrency");
                    } else if (result.data.show == "3") {
                        localStorage.setItem("both_screen", result.data.show);
                        localStorage.setItem("market_screen", "2");

                        localStorage.removeItem("is_login_required");
                        if (pageTitle == "Kurdistan Market")
                            $state.go("welcome.showCurrency");
                        else
                            $state.go("welcome.iraqimarket");
                    }
                   //$rootScope.$broadcast('popover_text');
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.show(result.message, 'short', 'bottom');
                }
            }, function () {
                $cordovaToast.show('Internal Error', 'short', 'bottom');
                $ionicLoading.hide();
            });
        }
    }
    $scope.forgot = function () {
        $scope.data = {};
        var myPopup = $ionicPopup.show({
            template: '<div class="search"><label>{{"EMAIL"| translate}}</label><div class="icon_bg"><input style="color:#339900;" type="email"  ng-model="data.email"/></div>',
            scope: $scope,
            buttons: [
                {text: $translate.instant("CANCEL")},
                {
                    text: $translate.instant("SUBMIT"),
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.email) {
                            $cordovaToast.show("Invalid email id.", 'short', 'bottom');
                            e.preventDefault();
                        } else {
                            $ionicLoading.show({
                                template: 'Loading...'
                            });
                            var param = "function=forgot&email=" + $scope.data.email;
                            postData(param, function (data, status) {
                                $ionicLoading.hide();
                                if (data.status == "true") {
                                    $cordovaToast.show(data.message, 'short', 'bottom');
                                } else {
                                    $cordovaToast.show(data.message, 'short', 'bottom');
                                }
                            }, function () {
                                $cordovaToast.show('Internal Error', 'short', 'bottom');
                                $ionicLoading.hide();
                            });
                        }
                    }
                }
            ]
        });
        myPopup.style.display = none;
        myPopup.then(function (res) {
            console.log('Tapped!', res);
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

    $scope.submitSignUp = function () {

        var pageTitle = $(".login_heading").html();
      
        var username = $scope.signup.username;
        var password = $scope.signup.password;
        var mobile = $scope.signup.mobile;
        
         if(pageTitle == "Iraqi Borsa"){
			 var isUserOrCompany = "comp";
			}else{
			var isUserOrCompany = "cust";
				}
        //var isUserOrCompany = $scope.signup.isuserorcompany;
        			
        if (username == undefined || username == "")
            $cordovaToast.show('Please enter the username.', 'short', 'bottom');
        else if (password == undefined || password == "")
            $cordovaToast.show('Please enter the password.', 'short', 'bottom');
        else if (mobile == undefined || mobile == "")
            $cordovaToast.show('Please enter the mobile number.', 'short', 'bottom');
        else if (isUserOrCompany == undefined || isUserOrCompany == "")
            $cordovaToast.show('Please select user type.', 'short', 'bottom');
        else {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var show = "1";
            if (pageTitle == "Kurdistan Market")
                show = "2";
            var androidID = localStorage.getItem("uuid");
            var param = "function=userSignup&username=" + username + "&password=" + password + "&contact=" + mobile
                    + "&uuid=" + androidID + "&type=" + isUserOrCompany + "&show=" + show;
            //console.log(param);
            postData(param, function (data, status) {
                $ionicLoading.hide();
                if (data.status == "true") {
                    $scope.modal.remove();
                    $scope.signup = [];
                }
                $cordovaToast.show(data.message, 'short', 'bottom');
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
        if (serviceName === "iraqi_borsa")
            $state.go("welcome.iraqimarket");
        else if (serviceName === "kurdistan_market")
            $state.go("welcome.showCurrency");
    }
});

app.controller('ShowCurrencyDetailsCtrl', function ($scope, $ionicSlideBoxDelegate, $rootScope, $cordovaNetwork, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $cordovaDevice, $ionicHistory, $cordovaPushV5) {
 
 
	 var selectedLanguage = localStorage.getItem("selected_Language");
	  if(selectedLanguage == 'ku'){
		 $scope.selectedLanguage = 'ku';
		 console.log(selectedLanguage);
		  }
	//  console.log(selectedLanguage);
 
    var hasNetwork = $cordovaNetwork.getNetwork();
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
    var isLoggedIn = 1;
    if (localStorage.getItem("isLoggedIn") == undefined)
        isLoggedIn = 0;

    document.addEventListener("deviceready", function () {
        var options = {
            android: {
                senderID: "789664744070",
                alert: true,
                icon: "icon"

            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            }
        };

        if (hasNetwork == "none") {
            var kurdistan_market = localStorage.getObject("kurdistan_market");
            if (kurdistan_market == undefined) {
                $scope.currencyRecords = [];
            } else
                $scope.currencyRecords = kurdistan_market;
        } else {
            $ionicLoading.show({
                template: 'Loading...'
            });
            
            
            $cordovaPushV5.initialize(options).then(function () {
                $cordovaPushV5.onNotification();
                $cordovaPushV5.onError();
                $cordovaPushV5.register().then(function (data) {
                    localStorage.setItem("deviceID", data);
                    var is_market = localStorage.getItem("market_screen");

                    var param = "function=showCurrencies&logged_in=" + isLoggedIn + "&android_id=" + localStorage.getItem("deviceID") + "&user_id=" + localStorage.getItem("user_id");
                    postData(param, function (result, status) {

                        if (result.is_login_required == "1" && (is_market == null || is_market == undefined))
                            $state.go("welcome.showCurrencylogin");
                        else {
                            $scope.currencyRecords = result.data;
                            if (result.expired == 1) {
                                localStorage.removeItem("isLoggedIn");
                                localStorage.removeItem("user_id");
                                localStorage.removeItem("user_type");
                                localStorage.setItem("isExpired", "true");
                                $state.go("welcome.login");
                                $cordovaToast.show('Account Expired!!', 'short', 'bottom');
                            } else{
                                localStorage.setObject("kurdistan_market", result.data);}
                        }
                        $ionicLoading.hide();
                        removeItems(result.show, result.expired);
                    }, function () {
                        $cordovaToast.show('Internal Error', 'short', 'bottom');
                        $ionicLoading.hide();
                    });
                })
            });
        }

        $rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {
            console.log(data);
            if (data.additionalData.notification_type == "currencies") {
                console.log(data.additionalData);
                var param = "function=showCurrencies&logged_in=" + isLoggedIn + "&android_id=" + localStorage.getItem("deviceID") + "&user_id=" + localStorage.getItem("user_id");
                $ionicLoading.show({
                    template: 'Loading...'
                });
                postData(param, function (result, status) {
                    $scope.currencyRecords = result.data;
                    if (result.expired == 1) {
                        localStorage.removeItem("isLoggedIn");
                        localStorage.removeItem("user_id");
                        localStorage.removeItem("user_type");
                        localStorage.setItem("isExpired", "true");
                        $state.go("welcome.login");
                        $cordovaToast.show('Account Expired!!', 'short', 'bottom');
                    } else
                        localStorage.setObject("kurdistan_market", result.data);
                    $ionicLoading.hide();
                    removeItems(result.show, result.expired);
                }, function () {
                    $cordovaToast.show('Internal Error', 'short', 'bottom');
                    $ionicLoading.hide();
                });
            }
        });
    }, false);

    $scope.doRefreshCurrencies = function () {
        var param = "function=showCurrencies&logged_in=" + isLoggedIn + "&android_id=" + localStorage.getItem("deviceID") + "&user_id=" + localStorage.getItem("user_id");
        postData(param, function (result, status) {
            $scope.currencyRecords = result.data;
            if (result.expired == 1) {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("user_id");
                localStorage.removeItem("user_type");
                localStorage.setItem("isExpired", "true");
                $state.go("welcome.login");
                $cordovaToast.show('Account Expired!!', 'short', 'bottom');
            } else
                localStorage.setObject("kurdistan_market", result.data);
            $scope.$broadcast('scroll.refreshComplete');
            removeItems(result.show, result.expired);
        }, function () {
            $cordovaToast.show('Internal Error', 'short', 'bottom');
            $ionicLoading.hide();
        });
    };

});



app.controller("MarketCtrl", function ($scope, $ionicModal, $rootScope, $http, $cordovaNetwork, $state, $ionicLoading, $ionicPopup, $cordovaToast, $stateParams, $ionicHistory) {
 
 console.log("iraqii page");
			/*var user_idMy = localStorage.getItem("user_id");
	 		alert(user_idMy);
	 		if(user_idMy !=''){
				 $scope.loginType = "1";
				}
			$scope.logout = function(myType){
				 $state.go("welcome.showCurrencylogin")
				}
	 		*/
 
 
    var hasNetwork = $cordovaNetwork.getNetwork();
    if (hasNetwork == "none") {
        var iraqi_borsa = localStorage.getObject("iraqi_borsa");
        if (iraqi_borsa == undefined) {
            $scope.markets = [];
        } else
            $scope.markets = iraqi_borsa;
    } else {
        var param = "function=displayMarkets&user_id=" + localStorage.getItem("user_id");
        $ionicLoading.show({
            template: 'Loading...'
        });
        postData(param, function (result, status) {
            $scope.markets = result.data;
            if (result.expired == 1) {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("user_id");
                localStorage.removeItem("user_type");
                localStorage.setItem("isExpired", "true");
                $state.go("welcome.login");
                $cordovaToast.show('Account Expired!!', 'short', 'bottom');
            } else
                localStorage.setObject("iraqi_borsa", result.data);
            $ionicLoading.hide();
            removeItems(result.show, result.expired);
        }, function () {
            $cordovaToast.show('Internal Error', 'short', 'bottom');
            $ionicLoading.hide();
        });
    }

    $scope.doRefreshMarkets = function () {
        postData(param, function (result, status) {
            $scope.markets = result.data;
            if (result.expired == 1) {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("user_id");
                localStorage.removeItem("user_type");
                localStorage.setItem("isExpired", "true");
                $state.go("welcome.login");
                $cordovaToast.show('Account Expired!!', 'short', 'bottom');
            } else
                localStorage.setObject("iraqi_borsa", result.data);
            $scope.$broadcast('scroll.refreshComplete');
            removeItems(result.show, result.expired);
        }, function () {
            $cordovaToast.show('Internal Error', 'short', 'bottom');
            $ionicLoading.hide();
        });
    };
    $rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {
        console.log(data);
        if (data.additionalData.notification_type == "market") {
            console.log(data.additionalData);
            $ionicLoading.show({
                template: 'Loading...'
            });
            postData(param, function (result, status) {
                $scope.markets = result.data;
                if (result.expired == 1) {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("user_id");
                    localStorage.removeItem("user_type");
                    localStorage.setItem("isExpired", "true");
                    $state.go("welcome.login");
                    $cordovaToast.show('Account Expired!!', 'short', 'bottom');
                } else
                    localStorage.setObject("iraqi_borsa", result.data);
                $ionicLoading.hide();
                removeItems(result.show, result.expired);
            }, function () {
                $cordovaToast.show('Internal Error', 'short', 'bottom');
                $ionicLoading.hide();
            });
        }
    });
    $scope.goBack = function () {
        $ionicHistory.goBack();
    };

});
app.controller('NotificationCtrl', function ($scope, $translate, $cordovaNetwork, $ionicLoading, $cordovaToast, $ionicHistory) {

    $scope.goBack = function () {
        $ionicHistory.goBack();
    };
    var hasNetwork = $cordovaNetwork.getNetwork();
    if (hasNetwork == "none") {
        var notification = localStorage.getObject("notification");
        if (notification == undefined)
            $scope.notifications = [];
        else
            $scope.notifications = notification;
    } else {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var param = "function=showNotifications&user_id=" + localStorage.getItem("user_id");
        getData(param, function (result, status) {
            $scope.notifications = result.data;
            localStorage.setObject("notification", result.data);
            $ionicLoading.hide();
        }, function () {
            $cordovaToast.show('Internal Error', 'short', 'bottom');
            $ionicLoading.hide();
        });
    }
    $scope.doRefreshNotifications = function () {
        getData(param, function (result, status) {
            $scope.notifications = result.data;
            localStorage.setObject("notification", result.data);
            $scope.$broadcast('scroll.refreshComplete');
        }, function () {
            $cordovaToast.show('Internal Error', 'short', 'bottom');
            $ionicLoading.hide();
        });
    };
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };
});
app.controller('SettingsCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, $cordovaToast, $ionicPopover, $ionicHistory, $translate) {

    $scope.settings = [];
    $scope.onLanguageChanged = function () {

        $translate.use($scope.settings.language).then(function (data) {
            console.log("SUCCESS -> " + data);
            
            if(data == 'ar'){ 
				$rootScope.default_direction = 'rtl'; 
				 localStorage.setItem("direction_set", $rootScope.default_direction);
				//$rootScope.default_direction = data === 'ar' ? 'rtl' : 'ltr';
			}else if(data === 'ku'){
				$rootScope.default_direction = 'rtl'; 
				 localStorage.setItem("direction_set", $rootScope.default_direction);
			}else{
				$rootScope.default_direction = 'ltr'; 
				 localStorage.setItem("direction_set", $rootScope.default_direction);
				}
			
			
           
            localStorage.setItem("selected_Language", $scope.settings.language);
            
            
            //localStorage.setItem("selected_Language", $scope.data);
            $rootScope.$broadcast('popover_text');
            
            
            	//////////////////////
				var user_id = localStorage.getItem("user_id");
				var param = "function=updateLanguage&user_id=" + user_id + "&lang=" + data;
				console.log(param);
				postData(param, function (data, status) {
					console.log(data);
					$ionicLoading.hide();
						if (data.status == "true") {
							$scope.modal.remove();
							//$scope.signup = [];
						}
				$cordovaToast.show(data.message, 'short', 'bottom');
				}, function () {
					$cordovaToast.show('Internal Error', 'short', 'bottom');
					$ionicLoading.hide();
				});
				/////////////////////

        }, function (error) {
            console.log("ERROR -> " + error);
        });
    }


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


function removeItems(show, expired) {
    if (expired == 1) {
        localStorage.removeItem("both_screen");
        localStorage.removeItem("market_screen");
        localStorage.removeItem("market_loggedIn");
        localStorage.removeItem("is_login_required");
        localStorage.removeItem("both_screen");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("borsa_screen");
    }
    if (show == "1") {
        localStorage.removeItem("both_screen");
        localStorage.removeItem("market_screen");
        localStorage.removeItem("market_loggedIn");
    } else if (show == "2") {
        localStorage.removeItem("is_login_required");
        localStorage.removeItem("both_screen");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("borsa_screen");
    } else if (show == "3") {
        localStorage.removeItem("is_login_required");
    }
}
