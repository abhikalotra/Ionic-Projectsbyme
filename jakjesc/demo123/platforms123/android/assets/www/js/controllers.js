/* global angular, document, window */
'use strict';

angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $sessionStorage) {
    	
   $scope.SessionName = {};
   $scope.SessionEmail = {};
   
	var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");		
	var SessionSetEmail = sessionStorage.getItem("SessionSetEmail");		
	var SessionSetName = sessionStorage.getItem("SessionSetName"); 
	
		$scope.SessionName = SessionSetName;
		$scope.SessionEmail = SessionSetEmail;
		if(SessionSetUserId){ 
			$scope.showMenu = 1;
			window.location.href = "#/app/profile";
		}else{
			window.location.href = "#/app/login";
		} 
		
	// Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, $location, Authentication, $http, $ionicModal, $log,$sessionStorage,$window ) {
	 
	 
	if(navigator.onLine == false){ 
	alert("Please check your Internet Connection !!");
	}
	 
	 var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");		
		if(SessionSetUserId){ 
			window.location.href = "#/app/profile";
		}else{
			window.location.href = "#/app/login";
		}

  $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
	
		
			$scope.loginForm = {};
			$scope.loginUser = function() {
		
			
			

			var email = $scope.loginForm.email;  
			var password = $scope.loginForm.password; 
			var datas =   {"email":email,"password":password};

			Authentication.login(datas).then(function(getResponse){
			if(getResponse.status == 'Success'){
				//console.log(getResponse.response);	   
				 sessionStorage.setItem("SessionSetUserId", getResponse.response.id);  
				 sessionStorage.setItem("SessionSetEmail", getResponse.response.email);   
				 sessionStorage.setItem("SessionSetName", getResponse.response.name);   
				var SessionSetUserId = sessionStorage.getItem("SessionSetUserId"); //console.log(SessionSetUserId);	
				var SessionSetEmail = sessionStorage.getItem("SessionSetEmail"); //console.log(SessionSetId);	
				var SessionSetName = sessionStorage.getItem("SessionSetName"); //console.log(SessionSetId);	
				$scope.sucess = "Sucessfully Login";
				window.location.href = "#/app/profile"; 
			}else{	

				 $scope.error = "error";
			} 
			});

				
		} 
				
		
	
	/* var datas =   {"email":email,"password":password};
		var Url = "http://clone.jakjesc.pl/webServices/loginUser.php";
		//console.log(Url);
		 $http.post(Url,datas).success(function(getResponse) {
			if(getResponse.status == 'Success'){
				console.log(getResponse.response);	   
				 sessionStorage.setItem("SessionSetUserId", getResponse.response.id);  
				 sessionStorage.setItem("SessionSetEmail", getResponse.response.email);   
				 sessionStorage.setItem("SessionSetName", getResponse.response.name);   
				var SessionSetUserId = sessionStorage.getItem("SessionSetUserId"); //console.log(SessionSetUserId);	
				var SessionSetEmail = sessionStorage.getItem("SessionSetEmail"); //console.log(SessionSetId);	
				var SessionSetName = sessionStorage.getItem("SessionSetName"); //console.log(SessionSetId);	
				$scope.sucess = "Sucessfully Login";
				window.location.href = "#/app/profile"; 
		   }else{	
		   
				 $scope.error = "error";
		   } 
		
		});  */
		
})


/* logout */
 .controller('LogoutCtrl', function($scope,$http,$ionicModal,$sessionStorage,$window, $location, Authentication, $log) {
	 
		Authentication.logout().then(function(response){
			var SessionSetUserIds = sessionStorage.getItem("SessionSetUserId");	       		 
		 });	
})

//.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, BookingDetails, $http, $ionicModal,$sessionStorage,$window, $location, $log) {
.controller('ProfileCtrl', function($scope, $stateParams, $timeout , ionicMaterialInk, BookingDetails, $http, $ionicModal,$sessionStorage,$window, $location, $log) {
   
    $scope.SessionUserId = {};
   $scope.SessionName = {};
   $scope.SessionEmail = {};
   $scope.resultDetails = {};
   $scope.remaingDay = {};
   
	var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");		
	var SessionSetEmail = sessionStorage.getItem("SessionSetEmail");		
	var SessionSetName = sessionStorage.getItem("SessionSetName"); 
	
		$scope.SessionUserId = SessionSetUserId;
		$scope.SessionName = SessionSetName;
		$scope.SessionEmail = SessionSetEmail;
		if(SessionSetUserId){ 
		
			window.location.href = "#/app/profile";
		}else{
			window.location.href = "#/app/login";
		}
		
		 var datas =   {"userId":SessionSetUserId};
			BookingDetails.details(datas).then(function(getResponse){					
			//console.log(getResponse);
			 var responseRemaingDay = getResponse.remaingDays;
			 
			 var getData = getResponse.responseDetails;
			 
			$scope.resultDetails = getData; 	
			$scope.remaingDay = responseRemaingDay; 	

			
			var abhi = new Array();			  
			  angular.forEach(getResponse.responseDate, function(value, key) {					
					var dateDate = value; 
						//console.log(dateDate.dzien);
					abhi.push({start:dateDate.dzien,backgroundColor:'#33CD5F'}); 	
			  }); 

			var abhi2 = new Array();			  
			  angular.forEach(getResponse.responsePreviousDate, function(value, key) {					
					var PreviousDate = value; 
						
					abhi2.push({start:PreviousDate.dzien,backgroundColor:'#FF0000'}); 	
			  }); 
			  
			   var abhiFinal = abhi2.concat(abhi); 
				//console.log(abhiFinal);
				
				 $('#calendar').fullCalendar({
					defaultDate: moment(),					
						events: abhiFinal, 					
				}); 

				}); 
		
		
	
   // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Ink
    ionicMaterialInk.displayEffect();
	
	 
	
})

.controller('SniadanieCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, SniadanieDetails, $http, $ionicModal,$sessionStorage,$window, $location, $log) {
	
	$scope.SessionUserId = {};
	$scope.SessionName = {};
   $scope.SessionEmail = {};
   $scope.resultDetails = {};
   
	var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");
	var SessionSetEmail = sessionStorage.getItem("SessionSetEmail");		
	var SessionSetName = sessionStorage.getItem("SessionSetName"); 
	
		$scope.SessionUserId = SessionSetUserId;
		$scope.SessionName = SessionSetName;
		$scope.SessionEmail = SessionSetEmail;
		if(SessionSetUserId){ 
		
			window.location.href = "#/app/profile";
		}else{
			window.location.href = "#/app/login";
		}		
			 
			 $scope.ionicGoBack = function() { 
				window.location.href = "#/app/profile";
			 }
			
		//*****************see the Sniadanie *****************************
				var breakfastId = 1;
					
				var datas =   {"userId":SessionSetUserId,"breakfastId":breakfastId};
				
				// var Url = "http://clone.jakjesc.pl/webServices/sniadanieDetails.php";
				
				SniadanieDetails.details(datas).then(function(getResponse){
					 console.log(getResponse);
					if(getResponse.status == 'Success'){
						//alert("dfs");
						$scope.myValue = getResponse.response;  
						$scope.getDayNames = getResponse.getDay;
						$scope.showUserScore = 1;
						$scope.showUserMobile = 0;						
						$scope.Underdevelopment = 0;						
				   } else if(getResponse.status == 'SuccessUnder'){
					   $scope.showUserScore = 0;
						$scope.showUserMobile = 0;							
						$scope.showUserMobile = 1;							
					   $scope.errors = "Twoje Menu jest w trakcie opracowywania";
				   }else{	
				   $scope.showUserScore = 0;
				   $scope.Underdevelopment = 0;
					$scope.showUserMobile = 1;										 
						$scope.errors = "Niestety Twoje zamówienie nie obejmuje dzisiejszego dnia";
				   }  				
				});  
		
	
   // $scope.$parent.showHeader();
     $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
   /*  $scope.isExpanded = true;
    $scope.$parent.setExpanded(true); */
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200); 

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})


.controller('DrugiesniadanieCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, DrugiesniadanieDetail, $http, $ionicModal,$sessionStorage,$window, $location, $log) {
	
	$scope.SessionUserId = {};
	$scope.SessionName = {};
   $scope.SessionEmail = {};
   $scope.resultDetails = {};
   
	var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");
	var SessionSetEmail = sessionStorage.getItem("SessionSetEmail");		
	var SessionSetName = sessionStorage.getItem("SessionSetName"); 
	
		$scope.SessionUserId = SessionSetUserId;
		$scope.SessionName = SessionSetName;
		$scope.SessionEmail = SessionSetEmail;
		if(SessionSetUserId){ 
		
			window.location.href = "#/app/profile";
		}else{
			window.location.href = "#/app/login";
		}
			
			$scope.ionicGoBack = function() { 
				window.location.href = "#/app/profile";
			}			
		//*****************see the DrugiesniadanieCtrl *****************************
					// var Url = "http://clone.jakjesc.pl/webServices/DrugieSniadanieDetails.php";
					
			var DrugiesniadanieId = 2;				
			var datas =   {"userId":SessionSetUserId,"DrugiesniadanieId":DrugiesniadanieId};
				DrugiesniadanieDetail.details(datas).then(function(getResponse){
					// console.log(getResponse);
					if(getResponse.status == 'Success'){
						$scope.myValue = getResponse.response; 
						$scope.getDayNames = getResponse.getDay;
						$scope.showUserScore = 1;
						$scope.showUserMobile = 0;						
						$scope.Underdevelopment = 0;						
				   }else if(getResponse.status == 'SuccessUnder'){					   
					   $scope.showUserScore = 0;
						$scope.showUserMobile = 0;							
						$scope.showUserMobile = 1;							
					   $scope.errors = "Twoje Menu jest w trakcie opracowywania";
				   }else{					   
				   $scope.showUserScore = 0;
				   $scope.Underdevelopment = 0;
					$scope.showUserMobile = 1;										 
						$scope.errors = "Niestety Twoje zamówienie nie obejmuje dzisiejszego dnia";
				   } 				
				});  
			
	
   // $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
   /*  $scope.isExpanded = true;
    $scope.$parent.setExpanded(true); */
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('ObiadCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, ObiadDetails, $http, $ionicModal,$sessionStorage,$window, $location, $log) {
	
	$scope.SessionUserId = {};
	$scope.SessionName = {};
   $scope.SessionEmail = {};
   $scope.resultDetails = {};
   
	var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");
	var SessionSetEmail = sessionStorage.getItem("SessionSetEmail");		
	var SessionSetName = sessionStorage.getItem("SessionSetName"); 
	
		$scope.SessionUserId = SessionSetUserId;
		$scope.SessionName = SessionSetName;
		$scope.SessionEmail = SessionSetEmail;
		if(SessionSetUserId){ 
		
			window.location.href = "#/app/profile";
		}else{
			window.location.href = "#/app/login";
		}

			$scope.ionicGoBack = function() { 
				window.location.href = "#/app/profile";
			}		
		//*****************see the Obiad Ctrl *****************************
			 //var Url = "http://clone.jakjesc.pl/webServices/ObiadDetails.php";
			var ObiadId = 3;
			var datas =   {"userId":SessionSetUserId,"ObiadId":ObiadId};
			
				 ObiadDetails.details(datas).then(function(getResponse){
					// console.log(getResponse);
					if(getResponse.status == 'Success'){
						$scope.myValue = getResponse.response; 
						$scope.getDayNames = getResponse.getDay;
						$scope.showUserScore = 1;
						$scope.showUserMobile = 0;						
						$scope.Underdevelopment = 0;						
				   }else if(getResponse.status == 'SuccessUnder'){					   
					   $scope.showUserScore = 0;
						$scope.showUserMobile = 0;							
						$scope.showUserMobile = 1;							
					   $scope.errors = "Twoje Menu jest w trakcie opracowywania";
				   }else{					   
				   $scope.showUserScore = 0;
				   $scope.Underdevelopment = 0;
					$scope.showUserMobile = 1;										 
						$scope.errors = "Niestety Twoje zamówienie nie obejmuje dzisiejszego dnia";
				   } 	 				
				});  
	
   // $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
   /*  $scope.isExpanded = true;
    $scope.$parent.setExpanded(true); */
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('PodwieczorekCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, PodwieczorekDetails, $http, $ionicModal,$sessionStorage,$window, $location, $log) {
	
	$scope.SessionUserId = {};
	$scope.SessionName = {};
   $scope.SessionEmail = {};
   $scope.resultDetails = {};
   
	var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");
	var SessionSetEmail = sessionStorage.getItem("SessionSetEmail");		
	var SessionSetName = sessionStorage.getItem("SessionSetName"); 
	
		$scope.SessionUserId = SessionSetUserId;
		$scope.SessionName = SessionSetName;
		$scope.SessionEmail = SessionSetEmail;
		if(SessionSetUserId){ 
		
			window.location.href = "#/app/profile";
		}else{
			window.location.href = "#/app/login";
		}
		
			$scope.ionicGoBack = function() { 
				window.location.href = "#/app/profile";
			}		
		//*****************see the Podwieczorek Ctrl *****************************
			//var Url = "http://clone.jakjesc.pl/webServices/PodwieczorekDetails.php";
			var PodwieczorekId = 4;
			var datas = {"userId":SessionSetUserId,"PodwieczorekId":PodwieczorekId};
				
				PodwieczorekDetails.details(datas).then(function(getResponse){
					 //console.log(getResponse);
					if(getResponse.status == 'Success'){
						$scope.myValue = getResponse.response; 
						$scope.getDayNames = getResponse.getDay;
						$scope.showUserScore = 1;
						$scope.showUserMobile = 0;						
						$scope.Underdevelopment = 0;						
				   }else if(getResponse.status == 'SuccessUnder'){					   
					   $scope.showUserScore = 0;
						$scope.showUserMobile = 0;							
						$scope.showUserMobile = 1;							
					   $scope.errors = "Twoje Menu jest w trakcie opracowywania";
				   }else{					   
				   $scope.showUserScore = 0;
				   $scope.Underdevelopment = 0;
					$scope.showUserMobile = 1;										 
						$scope.errors = "Niestety Twoje zamówienie nie obejmuje dzisiejszego dnia";
				   } 				
				});  
	
   // $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
   /*  $scope.isExpanded = true;
    $scope.$parent.setExpanded(true); */
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('KolacjaCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, KolacjaDetails, $http, $ionicModal,$sessionStorage,$window, $location, $log) {
	
   $scope.SessionUserId = {};
   $scope.SessionName = {};
   $scope.SessionEmail = {};
   $scope.resultDetails = {};
   
	var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");
	var SessionSetEmail = sessionStorage.getItem("SessionSetEmail");		
	var SessionSetName = sessionStorage.getItem("SessionSetName"); 
	
		$scope.SessionUserId = SessionSetUserId;
		$scope.SessionName = SessionSetName;
		$scope.SessionEmail = SessionSetEmail;
		if(SessionSetUserId){ 
		
			window.location.href = "#/app/profile";
		}else{
			window.location.href = "#/app/login";
		}
	
			$scope.ionicGoBack = function() { 
				window.location.href = "#/app/profile";
			}	
		//*****************see the Kolacja Ctrl *****************************
			
		// var Url = "http://clone.jakjesc.pl/webServices/KolacjaDetails.php";
		var KolacjaId = 5;	
		var datas =   {"userId":SessionSetUserId,"KolacjaId":KolacjaId};
				
				 KolacjaDetails.details(datas).then(function(getResponse){
					// console.log(getResponse);
						if(getResponse.status == 'Success'){
						$scope.myValue = getResponse.response; 
						$scope.getDayNames = getResponse.getDay;
						$scope.showUserScore = 1;
						$scope.showUserMobile = 0;						
						$scope.Underdevelopment = 0;						
				   }else if(getResponse.status == 'SuccessUnder'){					   
					   $scope.showUserScore = 0;
						$scope.showUserMobile = 0;							
						$scope.showUserMobile = 1;							
					   $scope.errors = "Twoje Menu jest w trakcie opracowywania";
				   }else{					   
				   $scope.showUserScore = 0;
				   $scope.Underdevelopment = 0;
					$scope.showUserMobile = 1;										 
						$scope.errors = "Niestety Twoje zamówienie nie obejmuje dzisiejszego dnia";
				   } 				
				});  
	
   // $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
   /*  $scope.isExpanded = true;
    $scope.$parent.setExpanded(true); */
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})


/* exit */
 .controller('ExitCtrl', function($scope, $ionicPlatform) {
	
	 var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");		
		if(SessionSetUserId){ 
			window.location.href = "#/app/profile";
		}else{
			window.location.href = "#/app/login";
		}
		
		navigator.app.exitApp();
		
});


/* 
.controller('activityKurieraCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, BookingDetails, $http, $ionicModal,$sessionStorage,$window, $location, $log) {
	
	$scope.SessionUserId = {};
	$scope.SessionName = {};
   $scope.SessionEmail = {};
   $scope.resultDetails = {};
   
	var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");
	var SessionSetEmail = sessionStorage.getItem("SessionSetEmail");		
	var SessionSetName = sessionStorage.getItem("SessionSetName"); 
	
		$scope.SessionUserId = SessionSetUserId;
		$scope.SessionName = SessionSetName;
		$scope.SessionEmail = SessionSetEmail;
		if(SessionSetUserId){ 
		
			window.location.href = "#/app/profile";
		}else{
			window.location.href = "#/app/login";
		}
		
		  var datas =   {"userId":SessionSetUserId};
			BookingDetails.details(datas).then(function(getResponse){
			 //console.log(getResponse);
			   if(getResponse){
				//var getData = getResponse;
				var getData = getResponse.response;
				$scope.resultDetails = getData; 
			}else{	

				 $scope.error = "error";
			}    
			});  
			
		//*****************see the Etykietki *****************************
		 	$scope.KurieraForm = {};			
			
			$scope.KurieraDetails = function() {
				var getdate = $scope.KurieraForm.date;				
				  var weekday = new Array(7);
					weekday[0] = "niedziela";
					weekday[1] = "poniedziałek";
					weekday[2] = "wtorek";
					weekday[3] = "środa";
					weekday[4] = "czwartek";
					weekday[5] = "piątek";
					weekday[6] = "sobota";	
		
				var getDayName = weekday[getdate.getDay()];
					//console.log()	
				var datas =   {"selectdate":getdate,"userId":SessionSetUserId,"getDayName":getDayName};
				 var Url = "http://clone.jakjesc.pl/webServices/etykietkiDeatils.php";
				 $http.post(Url,datas).success(function(getResponse) {
					// console.log(getResponse);
					if(getResponse.status == 'Success'){
						$scope.myValue = getResponse.response;
						$scope.getDayNames = getResponse.getDayName;
						$scope.showUserScore = 1;
						$scope.showUserMobile = 0;						
				   }else{	
				   $scope.showUserScore = 0;
					$scope.showUserMobile = 1;										 
						$scope.errors = "No Records Found !";													
				   } 				
				});  
			} 	
	
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})
 */

