
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'pascalprecht.translate'])

        .run(function ($ionicPlatform, $cordovaPushV5, $rootScope, $cordovaDevice) {
			
			
			
            $ionicPlatform.ready(function () {
				
				var direction_set = localStorage.getItem("direction_set");
				$rootScope.default_direction = direction_set;

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
                $cordovaPushV5.initialize(options).then(function () {
                    $cordovaPushV5.onNotification();
                    $cordovaPushV5.onError();
                    $cordovaPushV5.register().then(function (data) {
                        localStorage.setItem("deviceID", data);
                    })
                });
                $rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {
                    console.log(data);
                    if (data.additionalData.notification_type == "settings") {
                        localStorage.setItem("is_login_required", data.additionalData.is_login_required);
                        localStorage.setItem("is_signup", data.additionalData.is_signup);
                    }
                });
                $rootScope.$on('$cordovaPushV5:errorOcurred', function (event, e) {
                    alert(e.message);
                });
                var uuid = $cordovaDevice.getUUID();
                localStorage.setItem("uuid", uuid);
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleLightContent();
                }
            });
        })
        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $translateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/',
                suffix: '.json'
            });
            var selectedLanguage = localStorage.getItem("selected_Language");
            
            
            console.log(selectedLanguage);
            if (selectedLanguage == null || selectedLanguage == undefined)
                selectedLanguage = "en";
            $translateProvider.preferredLanguage(selectedLanguage);
            $translateProvider.useMissingTranslationHandlerLog();
            $ionicConfigProvider.tabs.position('bottom');
            $stateProvider
                    .state('welcome.login', {
                        url: '/login',
                        views: {
                            'iraqimarket': {
                                templateUrl: 'templates/login.html',
                                controller: 'LoginCtrl'
                            }
                        },
                        onEnter: function ($state) {
                            var is_login_required = localStorage.getItem("is_login_required");
                            var borsa_loggedIn = localStorage.getItem("borsa_screen");
                            var is_both = localStorage.getItem("both_screen");
                            if ((is_both == "3" || borsa_loggedIn == "1") && $state.transition)
                                $state.go("welcome.iraqimarket");
                        }
                    })

                    .state('welcome.showCurrencylogin', {
                        url: '/showCurrencylogin',
                        views: {
                            'showCurrency': {
                                templateUrl: 'templates/showCurrencylogin.html',
                                controller: 'LoginCtrl'
                            }
                        },
                        onEnter: function ($state) {
                            var is_login_required = localStorage.getItem("is_login_required");
                            var is_both = localStorage.getItem("both_screen");
                            var is_market = localStorage.getItem("market_screen");
                            if ((is_login_required == "0" || is_both == "3" || is_market == "2") && $state.transition)
                                $state.go("welcome.showCurrencylogin");
                        }
                    })

                    .state('welcome', {
                        url: '/welcome',
                        templateUrl: 'templates/welcome.html',
                        controller: 'AppCtrl',
                        abstract: true
                    })
                    .state('welcome.showCurrency', {
                        url: '/showCurrency',
                        views: {
                            'showCurrency': {
                                templateUrl: 'templates/showCurrency.html',
                                controller: 'ShowCurrencyDetailsCtrl'
                            }
                        },
                        onEnter: function ($state) {
                            var is_login_required = localStorage.getItem("is_login_required");
                            var is_market_loggedIn = localStorage.getItem("market_loggedIn");
                            var is_both = localStorage.getItem("both_screen");
								if (is_login_required == "1" && (is_market_loggedIn == null || is_market_loggedIn == undefined)  && (is_both == null || is_both == undefined))
                                $state.go("welcome.showCurrencylogin");
                        }
                    })
                    .state('welcome.iraqimarket', {
                        url: '/iraqimarket',
                        views: {
                            'iraqimarket': {
                                templateUrl: 'templates/market.html',
                                controller: 'MarketCtrl'
                            }
                        },
                        onEnter: function ($state) {
                            var isLoggedIn = localStorage.getItem("isLoggedIn");
                            var isBorsaAccessible = localStorage.getItem("borsa_screen");
                            var is_both = localStorage.getItem("both_screen");
                            if ((isBorsaAccessible == undefined || isBorsaAccessible == null)
                                    && isLoggedIn == undefined && $state.transition && (is_both == null || is_both == undefined)) {
                                $state.go("welcome.login");
                            }


                        }
                    })
                    .state('welcome.notification', {
                        url: '/notification',
                        views: {
                            'notification': {
                                templateUrl: 'templates/notification.html',
                                controller: 'NotificationCtrl'
                            }
                        }
                    })
                    .state('welcome.settings', {
                        url: '/settings',
                        views: {
                            'settings': {
                                templateUrl: 'templates/settings.html',
                                controller: 'SettingsCtrl'
                            }
                        }
                    })

            $urlRouterProvider.otherwise('/welcome/showCurrency')
        });


