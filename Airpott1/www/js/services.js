'use strict';
var BASE_URL = "http://test.airspott.com";
var BASE_API = "/api/"; 

var globalVariable_Buyer = "?access_token=J2Zd9qh9eO1LWeohmbZHfrEvM9RgcRZyiCSWCpSxcbDGDi5ufxf4s146qs0njnxq";

var baseurl_Login_Customers = 	BASE_URL+BASE_API+"Customers/login";
var baseurl_Post_Customers = 	BASE_URL+BASE_API+"Customers";
var baseurl_Get_AllCatagoy_Club = 	BASE_URL+BASE_API+"Clubs";
var baseurl_Get_Catagoy_By_Id_Star = BASE_URL+BASE_API+"Ratings";


angular.module('starter.services',[])

.factory('Authentication',function($http,$sessionStorage,$q){
			
  return{
    login:function(item){
		 
		   var Url = baseurl_Login_Customers+globalVariable_Buyer; 
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
			window.location.href = "#/landing";
		 return defer.promise;
		 
		
		 
    }, 
	
    Register:function(item_customers){
		
           var Url = baseurl_Post_Customers+globalVariable_Buyer;		   
           var defer = $q.defer();

           $http.post(Url,item_customers).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.reject();
              });

            return defer.promise;

    },

    auth_token:function(){
      var user_data =  storageService.get('user_data');
      var data = JSON.parse(user_data);
      return  data[0].auth_token;
    }

  }

})

/* catagory show like fitness , golf */
.factory('CatagoryAllClubShow',function($http,$sessionStorage,$q){
			
  return{
    catagory:function(){
		 
		   var Url = baseurl_Get_AllCatagoy_Club+globalVariable_Buyer; 
           var defer = $q.defer();

           $http.get(Url).
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

/* catagory show like fitness , golf  By id search result */
.factory('CatagoryShowByID',function($http,$sessionStorage,$q){
			
  return{
    catagoryById:function(idPass){
		 
		   var Url = baseurl_Get_AllCatagoy_Club+"/"+idPass+globalVariable_Buyer; 
           //console.log(Url);
		   var defer = $q.defer();

           $http.get(Url).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.reject();
              });

            return defer.promise;
    },
	
	 catagoryStarById:function(idStarPass){
		 
		   var Url = baseurl_Get_Catagoy_By_Id_Star+"/"+idStarPass+globalVariable_Buyer; 
           var defer = $q.defer();

           $http.get(Url).
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
 
 