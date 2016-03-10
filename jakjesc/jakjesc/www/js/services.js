'use strict';
var BASE_URL = "http://clone.jakjesc.pl";
var BASE_API = "/webServices/"; 

var baseurl_User_Register = 	BASE_URL+BASE_API+"registerUser.php";
var baseurl_User_Login = 	BASE_URL+BASE_API+"loginUser.php";
var baseurl_User_Details = 	BASE_URL+BASE_API+"userDetails.php";
var baseurl_Recipes_Images = 	BASE_URL+BASE_API+"speciesImages.php";
var baseurl_Sniadanie_Details = BASE_URL+BASE_API+"sniadanieDetails.php";
var baseurl_Drugie_Sniadanie_Details = BASE_URL+BASE_API+"DrugieSniadanieDetails.php";
var baseurl_Obiad_Details = BASE_URL+BASE_API+"ObiadDetails.php";
var baseurl_Podwieczorek_Details = BASE_URL+BASE_API+"PodwieczorekDetails.php";
var baseurl_Kolacja_Details = BASE_URL+BASE_API+"KolacjaDetails.php";


angular.module('starter.services',[])

.factory('Authentication',function($http,$sessionStorage,$q){
			
  return{
    login:function(item){
		 
		   var Url = baseurl_User_Login; 
           var defer = $q.defer();

           $http.post(Url,item).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.reject();
              });

            return defer.promise;
    },

    logout:function(){
      var defer = $q.defer();		  
			sessionStorage.clear();
			window.location.href = "#/app/login";
		 return defer.promise;
		 
		
		 
    }, 
	 auth_token:function(){
      var user_data =  storageService.get('user_data');
      var data = JSON.parse(user_data);
      return  data[0].auth_token;
    }

  }

})

/* DetailsBooking show like fitness , golf */
 .factory('BookingDetails',function($http,$sessionStorage,$q){
			
  return{
    details:function(detail){
		 
		   var Url = baseurl_User_Details; 
           var defer = $q.defer();

           $http.post(Url,detail).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.reject();
              });

            return defer.promise;
    }
	
  }

})


/* SniadanieDetails show like fitness , golf */
 .factory('SniadanieDetails',function($http,$sessionStorage,$q){
			
  return{
    details:function(detail){
		 
		   var Url = baseurl_Sniadanie_Details; 
           var defer = $q.defer();

           $http.post(Url,detail).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.reject();
              });

            return defer.promise;
    }
	
  }

})

/* DrugiesniadanieDetail */
 .factory('DrugiesniadanieDetail',function($http,$sessionStorage,$q){			
  return{
    details:function(detail){
		 
		   var Url = baseurl_Drugie_Sniadanie_Details; 
           var defer = $q.defer();

           $http.post(Url,detail).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.reject();
              });

            return defer.promise;
    }
	
  }

})
 
/* ObiadDetails */
 .factory('ObiadDetails',function($http,$sessionStorage,$q){			
  return{
    details:function(detail){
		 
		   var Url = baseurl_Obiad_Details; 
           var defer = $q.defer();

           $http.post(Url,detail).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.reject();
              });

            return defer.promise;
    }
	
  }

})

/* PodwieczorekDetails */
 .factory('PodwieczorekDetails',function($http,$sessionStorage,$q){			
  return{
    details:function(detail){
		 
		   var Url = baseurl_Podwieczorek_Details; 
           var defer = $q.defer();

           $http.post(Url,detail).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.reject();
              });

            return defer.promise;
    }
	
  }

})

/* KolacjaDetails */
 .factory('KolacjaDetails',function($http,$sessionStorage,$q){			
  return{
    details:function(detail){
		 
		   var Url = baseurl_Kolacja_Details; 
           var defer = $q.defer();

           $http.post(Url,detail).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.reject();
              });

            return defer.promise;
    }
	
  }

})
 