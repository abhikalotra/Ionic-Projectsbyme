
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

        .run(function ($ionicPlatform, $cordovaPushV5, $rootScope) {
            $ionicPlatform.ready(function () {

                var options = {
                    android: {
                        senderID: "789664744070"
                    },
                    ios: {
                        alert: "true",
                        badge: "true",
                        sound: "true"
                    },
                    windows: {}
                };

                $cordovaPushV5.initialize(options).then(function () {
                    $cordovaPushV5.onNotification();
                    $cordovaPushV5.onError();
                    $cordovaPushV5.register().then(function (data) {
//                        alert(data);
                        localStorage.setItem("admindeviceID", data);
                    })
                });

                $rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {
                    // data.message,
                    // data.title,
                    // data.count,
                    // data.sound,
                    // data.image,
                    // data.additionalData
                });

                // triggered every time error occurs
                $rootScope.$on('$cordovaPushV5:errorOcurred', function (event, e) {
                    alert(e.message);
                });

                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleLightContent();
                }
            });
        })
        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
            $ionicConfigProvider.tabs.position('bottom');
            $stateProvider
                    .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    })
                    .state('welcome', {
                        url: '/welcome',
                        templateUrl: 'templates/welcome.html',
                        abstract: true,
                        controller: 'AppCtrl',
                        onEnter: function ($state) {
                            var isLoggedIn = localStorage.getItem("isLoggedIn");
                            if (isLoggedIn == undefined) {
                                $state.go("login");
                            }
                        }})

                    .state('welcome.home', {
                        url: '/home',
                        views: {
                            'home': {
                                templateUrl: 'templates/home.html',
                                controller: 'HomeCtrl'
                            }
                        }
                    })
                    .state('welcome.ads', {
                        url: '/ads',
                        views: {
                            'home': {
                                templateUrl: 'templates/ads.html',
                                controller: 'AdsCtrl'
                            }
                        }
                    })
                    .state('welcome.add', {
                        url: '/add',
                        views: {
                            'home': {
                                templateUrl: 'templates/add.html',
                                controller: 'AddCtrl'
                            }
                        },
                        params: {
                            dataObject: null,
                            isSave: false
                        }
                    })

                    .state('welcome.iraqimarket', {
                        url: '/iraqimarket',
                        views: {
                            'home': {
                                templateUrl: 'templates/market.html',
                                controller: 'MarketCtrl'
                            }
                        }
                    })

                    .state('welcome.marketadd', {
                        url: '/marketadd',
                        views: {
                            'home': {
                                templateUrl: 'templates/marketadd.html',
                                controller: 'MarketAddCtrl'
                            }
                        },
                        params: {
                            marketdataObject: null,
                            isSave: false
                        }
                    })

                    .state('welcome.currencyrate', {
                        url: '/currencyrate',
                        views: {
                            'home': {
                                templateUrl: 'templates/currencyrate.html',
                                controller: 'CurrencyrateCtrl'
                            }
                        },
                        params: {
                            dataObject: null,
                            isSave: false,
                            currencyData: null
                        }
                    })

                    .state('welcome.showCurrency', {
                        url: '/showCurrency',
                        views: {
                            'home': {
                                templateUrl: 'templates/showCurrency.html',
                                controller: 'ShowCurrencyDetailsCtrl'
                            }
                        }
                    })

                    .state('welcome.manageUserOptions', {
                        url: '/manageUserOptions',
                        views: {
                            'home': {
                                templateUrl: 'templates/manageUserOptions.html',
                                controller: 'ManageUserOptionsCtrl'
                            }
                        }
                    })
                    .state('welcome.manageUser', {
                        url: '/manageUser',
                        views: {
                            'home': {
                                templateUrl: 'templates/manageUser.html',
                                controller: 'ManageUserCtrl'
                            }
                        }
                    })
                    .state('welcome.addManageUser', {
                        url: '/addManageUser',
                        views: {
                            'home': {
                                templateUrl: 'templates/addManageUser.html',
                                controller: 'AddManageUserCtrl'
                            }
                        },
                        params: {
                            dataObject: null,
                            isSave: false
                        }
                    })
                    .state('welcome.manageCompany', {
                        url: '/manageUser',
                        views: {
                            'home': {
                                templateUrl: 'templates/manageCompany.html',
                                controller: 'ManageCompanyCtrl'
                            }
                        }
                    })
                    .state('welcome.addManageCompany', {
                        url: '/addManageCompany',
                        views: {
                            'home': {
                                templateUrl: 'templates/addManageCompany.html',
                                controller: 'AddManageCompanyCtrl'
                            }
                        },
                        params: {
                            dataObject: null,
                            isSave: false
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
                    .state('welcome.info', {
                        url: '/info',
                        views: {
                            'info': {
                                templateUrl: 'templates/info.html',
                                controller: 'InfoCtrl'
                            }
                        }
                    })



            $urlRouterProvider.otherwise('/welcome/home')
        });


