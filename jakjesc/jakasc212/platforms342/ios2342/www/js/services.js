'use strict';
var BASE_URL = "http://clone.jakjesc.pl";
var BASE_API = "/webServices/"; 

var baseurl_User_Register = 	BASE_URL+BASE_API+"registerUser.php";
var baseurl_User_Login = 	BASE_URL+BASE_API+"loginUser.php";


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
	
    Register:function(register_user){
		
           var Url = baseurl_User_Register;		   
           var defer = $q.defer();

           $http.post(Url,register_user).
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
/* .factory('CatagoryAllClubShow',function($http,$sessionStorage,$q){
			
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
 */
/* catagory show like fitness , golf  By id search result */
/* .factory('CatagoryShowByID',function($http,$sessionStorage,$q){
			
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
  */
 