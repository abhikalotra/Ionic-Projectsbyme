'use strict';

angular.module('starter', ['ionic','ngStorage','starter.controllers','starter.services','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider) {

   $stateProvider

    .state('landing', {
     url: '/landing',
     templateUrl: 'template/landing.html',
	 controller: 'landingCtrl'	  
  })  
  .state('register', {
    url: '/register',
     templateUrl: 'template/register.html',
      controller: 'registerCustomerCtrl'
     
  })
  .state('login', {
    url: '/login',
     templateUrl: 'template/login.html',
      controller: 'loginCustomerCtrl'
     
  })
  .state('logout', {
    url: '/logout',
     templateUrl: 'template/logout.html', 
      controller: 'logoutCustomerCtrl'
     
  })
   .state('dashboard', {
    url: '/dashboard',
     templateUrl: 'template/dashboard.html',
      controller: 'dashboardCtrl'     
  })
   .state('map', {
    url: '/map',
     templateUrl: 'template/map.html',
      controller: 'mapCtrl'     
  })
  
  .state('searchresult', {
    url: '/searchresult/:id',
     templateUrl: 'template/search_result.html',
      controller: 'searchResultCtrl'     
  })
  .state('userpage', {
    url: '/userpage',
     templateUrl: 'template/user_page_detail.html',
      controller: 'userPageDetailCtrl'     
  })
  .state('daypassesdetail', {
    url: '/daypassesdetail',
     templateUrl: 'template/day_passes_detail.html',
      controller: 'dayPassesDetailCtrl'     
  })
  .state('daypasses', {
    url: '/daypasses',
     templateUrl: 'template/day_passes.html',
      controller: 'dayPassesCtrl'     
  })
  .state('searchscreen', {
    url: '/searchscreen',
     templateUrl: 'template/search_screen.html',
      controller: 'searchScreenCtrl'     
  })
  .state('homescreen', {
    url: '/homescreen',
     templateUrl: 'template/home_screen.html',
      controller: 'homeScreenCtrl'     
  });

  //$urlRouterProvider.otherwise('/dashboard');
  $urlRouterProvider.otherwise('/landing');

});
