﻿// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js 
angular.module('starter', ['ionic','ngStorage', 'starter.controllers','starter.services', 'ionic-material', 'ionMdInput'])

.run(function($ionicPlatform) {
     $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-pizza"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })
	
    .state('app.sniadanie', {
        url: '/sniadanie',
        views: {
            'menuContent': {
                templateUrl: 'templates/sniadanie.html',
                controller: 'SniadanieCtrl'
            }
        }
    })
    .state('app.drugiesniadanie', {
        url: '/drugiesniadanie',
        views: {
            'menuContent': {
                templateUrl: 'templates/drugiesniadanie.html',
                controller: 'DrugiesniadanieCtrl'
            }
        }
    })
    .state('app.obiad', {
        url: '/obiad',
        views: {
            'menuContent': {
                templateUrl: 'templates/obiad.html',
                controller: 'ObiadCtrl'
            }
        }
    })
    .state('app.podwieczorek', {
        url: '/podwieczorek',
        views: {
            'menuContent': {
                templateUrl: 'templates/podwieczorek.html',
                controller: 'PodwieczorekCtrl'
            }
        }
    })
    .state('app.kolacja', {
        url: '/kolacja',
        views: {
            'menuContent': {
                templateUrl: 'templates/kolacja.html',
                controller: 'KolacjaCtrl'
            }
        }
    })
	
	
    .state('app.activityKuriera', {
        url: '/activityKuriera',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity-Kuriera.html',
                controller: 'activityKurieraCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-beer"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    .state('app.register', {
        url: '/register',
        views: {
            'menuContent': {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
	
    .state('app.calender', {
        url: '/calender',
        views: {
            'menuContent': {
                templateUrl: 'templates/calender.html',
                controller: 'CalenderCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
	
    .state('app.logout', {
        url: '/logout',
        views: {
            'menuContent': {
                templateUrl: 'templates/logout.html',
                controller: 'LogoutCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    .state('app.exit', {
        url: '/exit',
        views: {
            'menuContent': {
                templateUrl: 'templates/exit.html',
                controller: 'ExitCtrl'
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            }/* ,
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);
                }
            } */
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/app/register');
    $urlRouterProvider.otherwise('/app/login');
});
