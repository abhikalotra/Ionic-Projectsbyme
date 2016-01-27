'use strict';

angular.module('starter.controllers', ['starter.services'])



.controller('landingCtrl', function($scope,$sessionStorage) {
	var SessionSetId = sessionStorage.getItem("SessionSetId");		
		if(SessionSetId){ 
			window.location.href = "#/dashboard";
		}else{
			window.location.href = "#/landing";
		}
})


/* register Buyer*/
.controller('registerCustomerCtrl', function($scope,$http,$ionicModal, $location, Authentication, $log) {

$scope.registrationCustomerForm = {};

$scope.registrationBuyer = function() {
		
		var password = $scope.registrationCustomerForm.password;
        var email = $scope.registrationCustomerForm.email; 		 
        var datas =   {"email":email,"password":password,"emailVerified": false};
		
		Authentication.Register(datas).then(function(response){
			if(response){
				console.log(response);
				}else{
				$log.alert('Error', 'OK');    
			   }
		});
        
		
		/* $http.post(Url,datas).success(function(data, status, headers, config) {
		var response = data;
		alert("Registration successfully added Details parameters are:----- username,email,password </br> Get the Response ");
		
		}) */
	}	
	
})

/* login */
.controller('loginCustomerCtrl', function($scope,$http,$ionicModal,$sessionStorage,$window, $location, Authentication, $log) {


$scope.loginForm = {};

$scope.login = function() {

        var password = $scope.loginForm.password; 
        var email = $scope.loginForm.email; 
        var datas =   {"email":email,"password":password};
		
		
		 Authentication.login(datas).then(function(response){
		  // console.log(response);		
		  if(response){
			 //alert(response.userId);
				sessionStorage.setItem("SessionSetUserId", response.userId);  
				sessionStorage.setItem("SessionSetId", response.id);   
				var SessionSetUserId = sessionStorage.getItem("SessionSetUserId"); //console.log(SessionSetUserId);	
				var SessionSetId = sessionStorage.getItem("SessionSetId"); //console.log(SessionSetId);	
				window.location.href = "#/dashboard";
		   }else{
			$log.alert('Error', 'OK');    
		   } 
		 });
		
         /*     $http.post(Url,datas).success(function(data, status, headers, config) {
                 var response = data;
				  if(response){
					   sessionStorage.setItem("SessionSetUserId", response.userId); 
					   sessionStorage.setItem("SessionSetId", response.id); 
						var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");
						var SessionSetId = sessionStorage.getItem("SessionSetId");
							window.location.href = "#/dashboard";
							
				 }
			}).error(function(data) {
            var alertPopup = "Invalid Password / email ";
                console.log(alertPopup);
            }); */
			
}	
	
})

/* logout */
 .controller('logoutCustomerCtrl', function($scope,$http,$ionicModal,$sessionStorage,$window, $location, Authentication, $log) {
	 
		Authentication.logout().then(function(response){
			var SessionSetIds = sessionStorage.getItem("SessionSetId");	       		 
		 });	
})

/* dashboard */

.controller('dashboardCtrl', function($scope,$http,$ionicModal,$sessionStorage,$window, $location, CatagoryAllClubShow, $log) {
	var SessionSetId = sessionStorage.getItem("SessionSetId");		
	if(SessionSetId){ 
	window.location.href = "#/dashboard";
	}else{
		window.location.href = "#/landing";
	}
	
	$scope.images = {};
		 CatagoryAllClubShow.catagory().then(function(response){
		  if(response){
			  // 	$log.log(response);	
			  var imageAll = response;			 
				$scope.images = imageAll;
			
		   }else{
			    $log.log('Error', 'OK');
		   } 
		 });
	

})
 
.filter('filterIdentifier', function(){
	return function(arr, searchByIdentifier){
		if(!searchByIdentifier){
			//console.log(arr);
			return arr;			
		}
		var result = [];
		searchByIdentifier = searchByIdentifier.toLowerCase();
		
		angular.forEach(arr, function(item){
			
			if(item.name.toLowerCase().indexOf(searchByIdentifier) !== -1){
				result.push(item); 				
			}
		});
		return result;
	};
})

//search Result
.controller('searchResultCtrl', function($scope,$http,$stateParams, CatagoryShowByID, $log) {
	
	var ids = $stateParams.id;
	
	$scope.showResult = {};
		 CatagoryShowByID.catagoryById(ids).then(function(response){
		  if(response){
			  var getData = response;
			 
				$scope.showResult = getData;
				 console.log($scope.showResult);
		   }else{
			    $log.log('Error', 'OK');
		   } 
		 });
	
	$scope.showStarRatingData = {};
		 CatagoryShowByID.catagoryStarById(ids).then(function(response){
		  if(response){
			  var getData = response;
			 
				$scope.showStarRatingData = getData;
				var total_stars = $scope.showStarRatingData.rating;
				 console.log($scope.showStarRatingData);
				 
				 var star_range = [];
				for(var i=1;i<=total_stars;i++) {
				  star_range.push(i);
				}
				$scope.starRange = star_range;
				
				
		   }else{
			    $log.log('Error', 'OK');
		   } 
		 });
	
	//$log.log(ids);
})

//search map
.controller("mapCtrl", function($scope, $ionicLoading, $compile){
	 
})

//User Details Page map
.controller("userPageDetailCtrl", function($scope){
	 
})
//Day Passes Details 
.controller("dayPassesDetailCtrl", function($scope){
	 
})
//Day Passes  
.controller("dayPassesCtrl", function($scope){
	 
})
//Search Screen
.controller("searchScreenCtrl", function($scope, $cordovaGeolocation){
	 
    $scope.getLocation = function () {

      $cordovaGeolocation
        .getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
        .then(function (position) {
          console.log("position found");
          $scope.position = position;
          // long = position.coords.longitude
		  
		 /*   var lat = "30.7083969"; 
		  var lng = "76.7030854";  */
		    var lat = position.coords.latitude; 
		  var lng = position.coords.longitude; 
		  console.log(position.coords.longitude);
		  console.log(position.coords.latitude);
		  
			var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(lat, lng);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
							$scope.positions = results[0].address_components;
							 console.log(results[0]);
							// alert(results[1].formatted_address);
							// console.log(results[0].address_components[7].long_name);
							 
                           // element.text(results[1].formatted_address);							
                        } else {
                            element.text('Location not found');
                        }
                    } else {
                        element.text('Geocoder failed due to: ' + status);
                    }
                });
		  
          // lat = position.coords.latitude
        }, function (err) {
          console.log("unable to find location");
          $scope.errorMsg = "Error : " + err.message;
        });
    };
})
//home Screen
.controller("homeScreenCtrl", function($scope){
	 
});

