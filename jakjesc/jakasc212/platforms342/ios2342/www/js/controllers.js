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

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, $location, Authentication, $http, $ionicModal, $log,$sessionStorage,$window) {
  
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
		
		//abhinandankalotra.orem@gmail.com
		//9418373591  magneto8$#
       /*  var datas =   {"email":email,"password":password};
			
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
		 });  */ 
		 
		 
		var datas =   {"email":email,"password":password};
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
		
		}); 
		 
			
	}
		
})


/* logout */
 .controller('LogoutCtrl', function($scope,$http,$ionicModal,$sessionStorage,$window, $location, Authentication, $log) {
	 
		Authentication.logout().then(function(response){
			var SessionSetUserIds = sessionStorage.getItem("SessionSetUserId");	       		 
		 });	
})

/* register user*/  //	var Url = "http://clone.jakjesc.pl/webServices/registerUser.php";
.controller('RegisterCtrl', function($scope, $timeout, $stateParams, Authentication, ionicMaterialInk, $http, $ionicModal, $log) {
    
	$scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();	
	
	$scope.registrationForm = {};
	$scope.registrationUser = function() {
		
        var email = $scope.registrationForm.email; 	
		var password = $scope.registrationForm.password;	 
        var datas =   {"email":email,"password":password};
		//alert(email);
		
		 Authentication.Register(datas).then(function(response){
			if(response){
				console.log(response);
				alert("Registration successfully added ");
				}else{
				$log.alert('Error', 'OK');    
			   }
		});        
		/* $http.post(Url,datas).success(function(data, status, headers, config) {
		var response = data;
		alert("Registration successfully added ");
		
		}) */
		
	}	

	
	
})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $http, $ionicModal,$sessionStorage,$window, $location, $log) {
   
   $scope.SessionName = {};
   $scope.SessionEmail = {};
   $scope.resultDetails = {};
   
	var SessionSetUserId = sessionStorage.getItem("SessionSetUserId");		
	var SessionSetEmail = sessionStorage.getItem("SessionSetEmail");		
	var SessionSetName = sessionStorage.getItem("SessionSetName"); 
	
		$scope.SessionName = SessionSetName;
		$scope.SessionEmail = SessionSetEmail;
		if(SessionSetUserId){ 
		
			window.location.href = "#/app/profile";
		}else{
			window.location.href = "#/app/login";
		}
		
	 var datas =   {"userId":SessionSetUserId};
	 var Url = "http://clone.jakjesc.pl/webServices/userDetails.php";
		//console.log(Url);
		 $http.post(Url,datas).success(function(getResponse) {
			console.log(getResponse);
			  var getData = getResponse.response;
			$scope.resultDetails = getData; 
		
		});
	
	
   // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
	
	
	
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
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

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

;
