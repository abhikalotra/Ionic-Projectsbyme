/* global angular, document, window */
'use strict';

angular.module('starter.controllers', ['starter.services'])

//-----------  MainCtrl Start --------------------- //
.controller('MainCtrl', function($scope, $log, $http,  $localStorage, $rootScope, $translate) {
    	

var language = $rootScope.language;
//var language = 'it'; 
$translate.use(language); 

//localStorage.clear();
localStorage.removeItem('setMapData');

 //console.log($rootScope.language);
	
})

//-----------  NewsCtrl Start --------------------- //



.controller('NewsCtrl', function($scope, $log, $http, NewsDetail, $rootScope, $localStorage, $ionicLoading, $ionicBackdrop, $translate, $filter, $ionicPopup) {
	

 localStorage.removeItem('setMapData');
 localStorage.removeItem('setEventMapData');
	
var start_date1 = localStorage.getItem("from"); 
var end_date1 = localStorage.getItem("to");	
var filter_text1 = localStorage.getItem("search");	

	$scope.date = $filter("date")(start_date1, 'yyyy-MM-dd');
	$scope.date2 = $filter("date")(end_date1, 'yyyy-MM-dd');
	
	$scope.newsForm = { search: filter_text1};
	//console.log($scope.newsForm);
	
//localStorage.clear();	
		
	$scope.ionicGoBack = function(){
		window.location.href = "#/main";
	};

var language = $rootScope.language;
$translate.use(language); 
	
if(start_date1){
$scope.filterImage = 1;		
}else{
$scope.filterImage = 0;		
}	
	
	$scope.lengths = {};
	$scope.noRecordFound = {};
	$scope.recordFound = {};	
	$scope.dataaa = [];
	$scope.page = 0;

	//$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
   
 $scope.items = [];
   $scope.noMoreItemsAvailable = false;  
   $scope.loadMore = function() {
	   $http.post('http://www.faitango.it/tyg_news_reader.php').success(function(items) {	
		console.log(items.data);
			if(items.responce == 0){				
				$scope.noRecordFound = items.mesg;				
				$scope.showUserScore = 1;	
				$scope.noMoreItemsAvailable = true;

			}else{ 
				$ionicLoading.hide();
				var i = items.data.length;	
				$scope.items = items.data;	
				 if ($scope.items.length == i) {
					 $scope.noMoreItemsAvailable = true;
				  }
				  $scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.noMoreItemsAvailable = true;
					$scope.page +=1; 
					$scope.filterShowData = 1;						
			}		
		 });     
   };
  
	/*  $scope.loadMore = function() { 
	  // $http.post('http://api.faitango.it/tango.php?lang=it&type=news&page='+$scope.page).success(function(items) {
	   $http.post('http://www.faitango.it/tyg_news_reader.php').success(function(items) {		
				console.log(items);	
				//$scope.data = items.data;
		 $scope.noMoreItemsAvailable = false;			
			 if(items.responce == 0){				
				//console.log(items);
				$scope.noRecordFound = items.mesg;				
				$scope.showUserScore = 1;	
				$scope.noMoreItemsAvailable = true;
				
			}else{  				
				var i = items.data.length;	
				$scope.dataaa = $scope.dataaa.concat(items.data);
				$scope.dataaa.push(items);
				//console.log(items.data[0]);
					//$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.noMoreItemsAvailable = true;
					$scope.page +=1; 
					//$scope.showUserScore = 0;	
					$scope.filterShowData = 1;					
					// $scope.recordFound = items.data;	 		
			}  					
    });	
   }     */
		  /* Popup of news  start*/
		 
				  
				$('.lightbox').click(function(){
					$('#main_form_clear')[0].reset();
				  $('.backdrops, .boxes').animate({'opacity':'.50'}, 300, 'linear');
				  $('.boxes').animate({'opacity':'1.00'}, 300, 'linear');
				  $('.backdrops, .boxes').css('display', 'block');
				});
		 
				$('.close').click(function(){
				  close_box();
				});
				
				$('.cancel_ftre').click(function(){					
					$('#main_form_clear')[0].reset();
				  close_box();
				});
				
				 $scope.hideValue = 0;				 
					$('.clear').click(function(){
						$scope.hideValue = 1;	
							/* $scope.$on('$ionicView.enter', function() { */
								localStorage.clear();	
							/* });							 */
					   $('#main_form_clear')[0].reset();				  
					});
		 
				$('.backdrops').click(function(){					
				  close_box();
				});
				 function close_box()
			  {
				  
				$('.backdrops, .boxes').animate({'opacity':'0'}, 300, 'linear', function(){
				  $('.backdrops, .boxes').css('display', 'none');
				});
			  } 
			/*  Popup of news  end*/
	 

			var start_date1 = localStorage.getItem("from"); // console.log(start_date1);	
			var end_date1 = localStorage.getItem("to");	
			var filter_text1 = localStorage.getItem("search");	
									
			$scope.newsForm = { start_date:start_date1, end_date:end_date1, search:filter_text1 };
	
			$scope.newsFilter = function() {
				
				$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
				
				
				var start_date = $scope.newsForm.start_date;  console.log(start_date);
				var end_date = $scope.newsForm.end_date;   console.log(end_date);
				var search = $scope.newsForm.search;  console.log(search);
				
				if(start_date == null || end_date == null){ 
					$ionicLoading.hide();
					$ionicPopup.alert({
						title: 'Select the date first',
						template: 'Select first date or second date'
					});
				}else{
						
					var str1 = start_date;
					var date1 = new Date(str1),
					mnth = ("0" + (date1.getMonth()+1)).slice(-2),
					day  = ("0" + date1.getDate()).slice(-2);
					var date_from =  [ date1.getFullYear(), mnth, day ].join("-");
					//console.log(date_from);
				
					var str2 = end_date;
					var date2 = new Date(str2),
					mnth = ("0" + (date2.getMonth()+1)).slice(-2),
					day  = ("0" + date2.getDate()).slice(-2);
					var date_to =  [ date2.getFullYear(), mnth, day ].join("-");
					//console.log(date_to);
				
				
				
				if(search == undefined){	
				
					var parameter = 'date_from='+date_from+'&date_to='+date_to+'&lang='+language+'';
						localStorage.setItem("from", date_from);  
						localStorage.setItem("to", date_to);   					
					//console.log(parameter);		date_from=2016-03-04&date_to=2016-03-14&lang=en-US
				}else{					
					var parameter = 'date_from='+date_from+'&date_to='+date_to+'&filter_text='+search+'&lang='+language+'';
						localStorage.setItem("from", date_from);  
						localStorage.setItem("to", date_to);   
						localStorage.setItem("search", search);
					//console.log(parameter);		
				}
				//console.log('http://www.faitango.it/tyg_news_reader.php?'+parameter);	
				//$http.post('http://www.faitango.it/tyg_news_reader.php?'+parameter).success(function(res) {
					
				 	NewsDetail.News(parameter).then(function(res){
						console.log(res);
						if(res.responce == 1){
							$scope.filterDetail = res.data;
							$ionicLoading.show({ template: 'No Of Record Are:   '+res.data.length, duration: 3000, noBackdrop: true});
							//console.log(res.data);
							$scope.filterShowData = 0;	
							$scope.filterShow = 1;	
							$scope.filterImage = 1;	
							close_box();
							 
						}else{
						$ionicLoading.show({ template: 'No Record Found!!  Try another!',duration: 3000, noBackdrop: true});
						
						}
					}); 
				}	
				
			}
			
})

//-----------  FestivalCtrl Start --------------------- //
.controller('FestivalCtrl', function($scope, $log, $http, $stateParams, $timeout, $ionicLoading, $rootScope, FestivalCosiService, $translate, $filter, $ionicPopup) {
    	
localStorage.removeItem('setMapData');
localStorage.removeItem('setEventMapData');

	
var start_date1 = localStorage.getItem("from"); // console.log(start_date1);
var end_date1 = localStorage.getItem("to");	
var provincia = localStorage.getItem("provincia");	
var region = localStorage.getItem("region");	
var search = localStorage.getItem("search");	

 $scope.date = $filter("date")(start_date1, 'yyyy-MM-dd');
$scope.date2 = $filter("date")(end_date1, 'yyyy-MM-dd');
 
$scope.festivalForm = { search: search};
//console.log($scope.festivalForm);
		
	 $scope.ionicGoBack = function(){
		window.location.href = "#/main";
	};
	
	
	  var menuName = $stateParams.menuName;
		$scope.menuName = menuName;
		//alert(menuName);
	
var language = $rootScope.language;
//var language = 'it'; 

$translate.use(language); 


if(start_date1){
	$scope.filterImage = 1;	
	$scope.filterShowData = 0;	
	$scope.filterShow = 1;
	$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
	
	if(end_date1 == null || region == null || provincia == null || search == null ){
		//alert(start_date1);	
		if(end_date1 == undefined){  var end_date1 = ''; }else{ var to = end_date1;}
		if(region == undefined){  var region = ''; }else{ var region = region;}
		if(provincia == undefined){  var provincia = ''; }else{ var provincia = provincia;}
		if(search == undefined){  var search = ''; }else{ var search = search;}
		var filterSet = 'from='+start_date1+'&to='+to+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';					
				
	}else{	
						
		var filterSet = 'from='+start_date1+'&to='+end_date1+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';	
		console.log(filterSet);		
	}
	$http.post('http://api.faitango.it/tango.php?'+filterSet).success(function(res){
	console.log(res);
	if(res.responce == 1){
		$scope.filterDetail = res.data;
		$ionicLoading.show({ template: 'No Of Record Are:   '+res.data.length, duration: 3000, noBackdrop: true});
		//console.log(res.data);
		$scope.filterShowData = 0;	
		$scope.filterShow = 1;	

		$scope.filterMapShowData = 1;		
		$scope.mapShowData = 0;
		close_box();							 
		}else{
		$ionicLoading.show({ template: 'No Record Found!!  Try another!',duration: 3000, noBackdrop: true});

		}
		}); 
}else{	
	$scope.filterImage = 0;	
	$scope.filterShowData = 1;	
	
	$scope.lengths = {};
	$scope.region = {};
	$scope.province = {}; 
	$scope.noRecordFound = {};
	$scope.recordFound = {};	
	$scope.data = [];
	$scope.page = 0;
	
	$scope.myTitle = 'Template';
	//$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
  
   $scope.items = [];
   
 /*   $http.post('http://api.faitango.it/tango.php?lang='+language+'&type='+menuName).success(function(items) {	
  // console.log(items.data);
	 var ac = [];		
		angular.forEach(items.data, function(value, key) {
		  ac.push({titolo:value.titolo,citta:value.citta,data_da:value.data_da,img:value.img,testo:value.testo,url:value.url, myKey:key});
		
		  //ac.push(value);		  
		}); 
	//localStorage.setItem('asd', JSON.stringify(ac));
	
   }); */
   
   /* $scope.noMoreItemsAvailable = false;  
   $scope.loadMore = function() {
	    $http.post('http://api.faitango.it/tango.php?lang='+language+'&type='+menuName).success(function(items) {	
		console.log(items.data);
			 if(items.responce == 0){
					//console.log(items);
					$scope.noRecordFound = items.mesg;				
					 $scope.showUserScore = 1;	
					  $scope.noMoreItemsAvailable = true;
							
				}else{ 
				$scope.filterShowData = 1;			
					var i = items.data.length;	
					//$scope.items = $scope.items.concat(items.data);
					//$scope.items.push(items.data);	
					$scope.items = items.data;	
					//console.log(items);

					if ($scope.items.length == i) {
					$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');

				}			
			 });   
			} */
				 FestivalCosiService.GetStartEvent(menuName).then(function(items){
					
						if(items.responce == 0){							
							$scope.noRecordFound = items.mesg;				
							$scope.showUserScore = 1;
							$scope.filterShowData = 0;
						}else{ 						
							$ionicLoading.hide();
							$scope.filterShowData = 1;			
							var i = items.data.length;	
							$scope.items = items.data;
								var tojson = angular.toJson($scope.items);
								localStorage.setItem("setMapData", tojson); 							
								$scope.filterMapShowData = 0;		
								$scope.mapShowData = 1;								
							} 
						//$scope.filterShowData = 1; //orginal this only
					});

					$scope.loadMore = function(){
						FestivalCosiService.GetNextEvent(menuName).then(function(items) {
						//console.log(items.data);
						
						
							if(items.responce == 0){
							$scope.noRecordFound = items.mesg;				
							$scope.showUserScore = 1;	
							$scope.filterShowData = 0;
							}else{ 
							//$scope.filterShowData = 1;
								$scope.filterShowData = 1;			
								$scope.items = $scope.items.concat(items.data);  //orginal this only
								var tojson = angular.toJson($scope.items);
								localStorage.setItem("setMapData", tojson); 
								
									$scope.filterMapShowData = 0;		
									$scope.mapShowData = 1;	
							}				
							$scope.$broadcast('scroll.infiniteScrollComplete');
						});
					};		 
				//};
	}
	
				
			$http.post('http://api.faitango.it/filter.php').success(function(dropdownSucess) {
				$scope.region = dropdownSucess.region;	
				$scope.province = dropdownSucess.province;						
			 }); 
			 
			 
				/* Popup of news  start*/
				$('.lightbox').click(function(){
					$('#main_form_clear')[0].reset();
				  $('.backdrops, .boxesFestival').animate({'opacity':'.50'}, 300, 'linear');
				  $('.boxesFestival').animate({'opacity':'1.00'}, 300, 'linear');
				  $('.backdrops, .boxesFestival').css('display', 'block');
				});
		 
				$('.close').click(function(){
				  close_box();
				});
				
				$('.cancel_ftre').click(function(){
				  close_box();
				});
				
			 $scope.hideValue = 0;				 
					$('.clear').click(function(){
						$scope.hideValue = 1;	
						localStorage.clear();		
					   $('#main_form_clear')[0].reset();				  
					});
		 
				$('.backdrops').click(function(){
				  close_box();
				});
				 function close_box()
			  {
				$('.backdrops, .boxesFestival').animate({'opacity':'0'}, 300, 'linear', function(){
				  $('.backdrops, .boxesFestival').css('display', 'none');
				});
			  } 
			/*  Popup of news  end*/
			
   	
			 
			/* var start_date1 = localStorage.getItem("from"); //console.log(start_date1);	
			var end_date1 = localStorage.getItem("to");	
			var provincia = localStorage.getItem("provincia");	
			var region = localStorage.getItem("region");	
			var search = localStorage.getItem("search");	 */
									
			$scope.festivalForm = { start_date:start_date1, end_date:end_date1, provincia:provincia, region:region, search:search };
			
			$scope.festivalFilter = function() {
				$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'})
				
				var start_date = $scope.festivalForm.start_date;   
				var end_date = $scope.festivalForm.end_date;  
				var region = $scope.festivalForm.region; 
				var provincia = $scope.festivalForm.provincia;  
				var search = $scope.festivalForm.search; 
					
				if(start_date == null || end_date == null){ 
					$ionicLoading.hide();
					$ionicPopup.alert({
						title: 'Select the date first',
						template: 'Select first date or second date'
					});
				}else{
					
					var str1 = start_date;
					var date1 = new Date(str1),
					mnth = ("0" + (date1.getMonth()+1)).slice(-2),
					day  = ("0" + date1.getDate()).slice(-2);
					var from =  [ date1.getFullYear(), mnth, day ].join("-");
					//console.log(from);
				
					var str2 = end_date;
					var date2 = new Date(str2),
					mnth = ("0" + (date2.getMonth()+1)).slice(-2),
					day  = ("0" + date2.getDate()).slice(-2);
					var to =  [ date2.getFullYear(), mnth, day ].join("-");
					//console.log(to);
				
				
				
				if(to == undefined || region == undefined || provincia == undefined || search == undefined ){	
					
					
					if(to == undefined){  var to = ''; }else{ var to = to;}
					if(region == undefined){  var region = ''; }else{ var region = region;}
					if(provincia == undefined){  var provincia = ''; }else{ var provincia = provincia;}
					if(search == undefined){  var search = ''; }else{ var search = search;}
										
					var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';					
						localStorage.setItem("from", from);  
						localStorage.setItem("to", to);   					
						localStorage.setItem("provincia", provincia);   					
						localStorage.setItem("region", region);   					
						localStorage.setItem("search", search);   		
				}else{							
					var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';					
						localStorage.setItem("from", from);  
						localStorage.setItem("to", to);   					
						localStorage.setItem("provincia", provincia);   					
						localStorage.setItem("region", region);   					
						localStorage.setItem("search", search);						
				}

				//console.log('http://api.faitango.it/tango.php?'+parameter);
				
				//NewsDetail.News(parameter).then(function(res){						
				 	$http.post('http://api.faitango.it/tango.php?'+parameter).success(function(res) {				
						//console.log(res);
						if(res.responce == 1){
							$scope.filterDetail = res.data;
							$ionicLoading.show({ template: 'No Of Record Are:   '+res.data.length, duration: 3000, noBackdrop: true});
							//console.log(res.data);
							$scope.filterShowData = 0;	
							$scope.filterShow = 1;	
							
							$scope.filterMapShowData = 1;		
							$scope.mapShowData = 0;
							$scope.filterImage = 1;	
							close_box();							 
						}else{
							$ionicLoading.show({ template: 'No Record Found!!  Try another!',duration: 3000, noBackdrop: true});
						
						}
					}); 
					
				} 
					
					
			}
				
	
/*  if(language == 'en'){ $scope.titleName = 'COURSES';	}else if(language == 'fr'){$scope.titleName = 'COURS';}else if(language == 'es'){$scope.titleName = 'CURSOS';}else if(language == 'de'){$scope.titleName = 'KURS';}else if(language == 'it'){$scope.titleName = 'CORSI';}else{$scope.titleName = 'CORSI';}  */
})

//-----------  CoursesCtrl Start --------------------- //
.controller('CoursesCtrl', function($scope, $log, $http, $rootScope, $translate) {
    	
	$scope.ionicGoBack = function(){
		window.location.href = "#/main";
	};
	$scope.lengths = {};
	$scope.noRecordFound = {};
	$scope.recordFound = {};	
	$scope.dataaa = [];
	$scope.page = 0;

	var  language = $rootScope.language;
	$translate.use(language); 
	
	$scope.items = [];
    $scope.noMoreItemsAvailable = false;  
    $scope.loadMore = function() {
	   $http.post('http://api.faitango.it/tango.php?lang=it&type=corsi').success(function(items) {	
			if(items.responce == 0){				
				$scope.noRecordFound = items.mesg;				
				$scope.showUserScore = 1;	
				$scope.noMoreItemsAvailable = true;
			}else{ 
				var i = items.data.length;	
				$scope.items = items.data;	
				//console.log(items);			
				 if ($scope.items.length == i) {
					 $scope.noMoreItemsAvailable = true;
				  }
				  $scope.$broadcast('scroll.infiniteScrollComplete');
					
					$scope.noMoreItemsAvailable = true;
					$scope.page +=1; 
					//$scope.showUserScore = 0;	
					$scope.filterShowData = 1;					
					// $scope.recordFound = items.data;	
			}		
		 });
   };
	
})

// -----------  EventsCtrl Start --------------------- //
.controller('EventsCtrl', function($scope, $log, $http, $timeout, $stateParams, $ionicLoading, $rootScope, EventService, $translate, $filter, $ionicPopup) {
 
localStorage.removeItem('setMapData');
localStorage.removeItem('setEventMapData');
		 
 
var start_date1 = localStorage.getItem("from"); // console.log(start_date1);
var end_date1 = localStorage.getItem("to");	
var provincia = localStorage.getItem("provincia");	
var region = localStorage.getItem("region");	
var search = localStorage.getItem("search");	

 $scope.date = $filter("date")(start_date1, 'yyyy-MM-dd');
$scope.date2 = $filter("date")(end_date1, 'yyyy-MM-dd');
 
 $scope.eventsForm = { search: search};

 $scope.ionicGoBack = function(){
	window.location.href = "#/main";
	};
	

var menuName = $stateParams.menuName;
$scope.menuName = menuName;

	
var language = $rootScope.language;
//var language = 'it'; 
$translate.use(language); 

if(start_date1){
	
	$scope.filterImage = 1;	
	$scope.filterShowData = 0;	
	$scope.filterShow = 1;
	$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
	
	if(end_date1 == null || region == null || provincia == null || search == null ){
		//alert(start_date1);	
		if(end_date1 == undefined){  var end_date1 = ''; }else{ var to = end_date1;}
		if(region == undefined){  var region = ''; }else{ var region = region;}
		if(provincia == undefined){  var provincia = ''; }else{ var provincia = provincia;}
		if(search == undefined){  var search = ''; }else{ var search = search;}
		var filterSet = 'from='+start_date1+'&to='+to+'&lang='+language+'&type=event&provincia='+provincia+'&region='+region+'&search='+search+'';					
				
	}else{	
						
		var filterSet = 'from='+start_date1+'&to='+end_date1+'&lang='+language+'&type=event&provincia='+provincia+'&region='+region+'&search='+search+'';	
		console.log(filterSet);		
	}
	$http.post('http://api.faitango.it/tango.php?'+filterSet).success(function(res){				
	//console.log(res);
	if(res.responce == 1){
	$scope.filterDetail = res.data;
	$scope.filterMapShowData = 1;		
	$scope.mapShowData = 0;		
	$ionicLoading.show({ template: 'No Of Record Are:   '+res.data.length, duration: 3000, noBackdrop: true});
	//console.log(res.data);
	$scope.filterShowData = 0;	
	$scope.filterShow = 1;	
	close_box();
	}else{
	//console.log(res.responce);	
		//alert("no record found");	
		$ionicLoading.show({ template: 'No Record Found (⌣́_⌣̀)', duration: 3000, noBackdrop: true});
	}
	}); 
}else{
	$scope.filterImage = 0;	
	$scope.filterShowData = 1;	
	
	//$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
	
  $scope.itemsTest = [];
  
	EventService.GetStartEvent().then(function(items){
		console.log(items.responce);
		if(items.responce == 1){
		$ionicLoading.hide();
		$scope.showUserScore = 1;
		$scope.filterShowData = 1;	
		$scope.itemsTest = items.data;
		
		$scope.filterMapShowData = 0;		
		$scope.mapShowData = 1;	
		}else{
			console.log(items);
			$scope.noRecordFound = items.mesg;
			$scope.showUserScore = 1;
			$scope.filterShowData = 0;
		}
			
	});

	$scope.loadMore = function(){
		EventService.GetNextEvent().then(function(items) {
			if(items.responce == 1){
				$ionicLoading.hide();
				//console.log(items.data);
				$scope.filterShowData = 1;	
				$scope.showUserScore = 1;
				$scope.itemsTest = $scope.itemsTest.concat(items.data);
				var tojson = angular.toJson($scope.itemsTest);
				localStorage.setItem("setEventMapData", tojson);
				
				$scope.filterMapShowData = 0;		
				$scope.mapShowData = 1;		
				$scope.$broadcast('scroll.infiniteScrollComplete');
				
			}else{
			console.log(items);
				$scope.noRecordFound = items.mesg;
				$scope.showUserScore = 1;
				$scope.filterShowData = 0;
			//noRecordFound = true;
			}
		});
	};
}	

	

  
  	
		
	$http.post('http://api.faitango.it/filter.php').success(function(dropdownSucess) {	
	//console.log(dropdownSucess);
		
		$scope.region = dropdownSucess.region;	
		$scope.province = dropdownSucess.province;	
			
	 }); 
			 
			/* Popup of event  start*/
				$('.lightbox').click(function(){
					$('#main_form_clear')[0].reset();
				  $('.backdrops, .boxesEvents').animate({'opacity':'.50'}, 300, 'linear');
				  $('.boxesEvents').animate({'opacity':'1.00'}, 300, 'linear');
				  $('.backdrops, .boxesEvents').css('display', 'block');
				});
		 
				$('.close').click(function(){
				  close_box();
				});
				
				$('.cancel_ftre').click(function(){
				  close_box();
				});
				
			 $scope.hideValue = 0;				 
					$('.clear').click(function(){
						$scope.hideValue = 1;	
						localStorage.clear();		
					   $('#main_form_clear')[0].reset();				  
					});
		 
				$('.backdrops').click(function(){
				  close_box();
				});
				 function close_box()
			  {
				$('.backdrops, .boxesEvents').animate({'opacity':'0'}, 300, 'linear', function(){
				  $('.backdrops, .boxesEvents').css('display', 'none');
				});
			  } 
			/*  Popup of event  end*/
			
			$scope.eventsForm = { start_date:start_date1, end_date:end_date1, provincia:provincia, region:region, search:search };
			
			$scope.eventsFilter = function() {
				$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
				
				var start_date = $scope.eventsForm.start_date; // console.log(start_date);
				var end_date = $scope.eventsForm.end_date;  
				var region = $scope.eventsForm.region;  
				var provincia = $scope.eventsForm.provincia;  
				var search = $scope.eventsForm.search; 
				
				if(start_date == null || end_date == null){ 
					$ionicLoading.hide();
					$ionicPopup.alert({
						title: 'Select the date first',
						template: 'Select first date or second date'
					});
				}else{
						
					var str1 = start_date;
					var date1 = new Date(str1),
					mnth = ("0" + (date1.getMonth()+1)).slice(-2),
					day  = ("0" + date1.getDate()).slice(-2);
					var from =  [ date1.getFullYear(), mnth, day ].join("-");
					//console.log(from);
				
					var str2 = end_date;
					var date2 = new Date(str2),
					mnth = ("0" + (date2.getMonth()+1)).slice(-2),
					day  = ("0" + date2.getDate()).slice(-2);
					var to =  [ date2.getFullYear(), mnth, day ].join("-");
					//console.log(to);
				
				
				
				if(to == undefined || region == undefined || provincia == undefined || search == undefined ){	
					
					if(to == undefined){  var to = ''; }else{ var to = to;}
					if(region == undefined){  var region = ''; }else{ var region = region;}
					if(provincia == undefined){  var provincia = ''; }else{ var provincia = provincia;}
					if(search == undefined){  var search = ''; }else{ var search = search;}
				
					var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type=event&provincia='+provincia+'&region='+region+'&search='+search+'';					
						localStorage.setItem("from", from);  
						localStorage.setItem("to", to);   					
						localStorage.setItem("provincia", provincia);   					
						localStorage.setItem("region", region);   					
						localStorage.setItem("search", search);   					
						//console.log(parameter);		
				}else{					
					var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type=event&provincia='+provincia+'&region='+region+'&search='+search+'';					
						localStorage.setItem("from", from);  
						localStorage.setItem("to", to);   					
						localStorage.setItem("provincia", provincia);   					
						localStorage.setItem("region", region);   					
						localStorage.setItem("search", search);		
				}

				console.log('http://api.faitango.it/tango.php?'+parameter);
				
				//NewsDetail.News(parameter).then(function(res){						
				 	$http.post('http://api.faitango.it/tango.php?'+parameter).success(function(res) {					
						//console.log(res);
						if(res.responce == 1){
							$scope.filterDetail = res.data;
								$scope.filterMapShowData = 1;		
								$scope.mapShowData = 0;		
							$ionicLoading.show({ template: 'No Of Record Are:   '+res.data.length, duration: 3000, noBackdrop: true});
							//console.log(res.data);
							$scope.filterShowData = 0;	
							$scope.filterShow = 1;	
							$scope.filterImage = 1;	
							close_box();
							 
						}else{
							//console.log(res.responce);	
							$ionicLoading.show({ template: 'No Record Found (⌣́_⌣̀)', duration: 3000, noBackdrop: true});	
						}
					}); 
				}
			}
	
	
})

//-----------  ChildCtrl Start --------------------- //
.controller('ChildCtrl', function($scope, $log, $http) {
    	// console.log($scope.value);
	
})




//-----------  NewsSlideCtrl Start --------------------- //
.controller('NewsSlideCtrl', function($scope, $localStorage,  $log, $http, $ionicSlideBoxDelegate, $stateParams,$ionicLoading, $rootScope, NewsDetail , $translate) {

   
  $scope.ionicGoBack = function(){
		window.location.href = "#/news";
	};	
  
 
var language = $rootScope.language;
//var language = 'it'; 
$translate.use(language); 

  
  
	$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
     var newsid = $stateParams.newsid;

	$scope.newsSlideDetails = [];
  		
	  $http.post('http://www.faitango.it/tyg_news_reader.php').success(function(items) {				 
		// console.log(items.data);
		$ionicLoading.hide();		
		 $scope.newsSlideDetails = items.data ;
		 
		  setTimeout(function() {			
			$ionicSlideBoxDelegate.slide(newsid); 
			//$ionicSlideBoxDelegate.slide(0); //position of image
			$ionicSlideBoxDelegate.update();
			$scope.$apply();
            }, 50);		
			
			/* 
			 ! function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0],
					
					p = /^http:/.test(items.data[0].citta) ? 'http' : 'https';
					//alert(items.data[0].citta);
				if (!d.getElementById(id)) {
					//alert(id);
					js = d.createElement(s);
					js.id = id;
					js.src = p + '://platform.twitter.com/widgets.js';
					fjs.parentNode.insertBefore(js, fjs);
				}
			}(document, 'script', 'twitter-wjs');
				 */		
		
    }); 
	
})
//-----------  NewsSlideFilterCtrl Start --------------------- //
.controller('NewsSlideFilterCtrl', function($scope, $localStorage,  $log, $http, $ionicSlideBoxDelegate, $stateParams, $ionicLoading, $rootScope, $translate) {


var language = $rootScope.language;
//var language = 'it'; 
$translate.use(language);
	
	var from = localStorage.getItem("from");		
	var to = localStorage.getItem("to");		
	var search = localStorage.getItem("search"); 
	//console.log(filter_text);		
	
   
  $scope.ionicGoBack = function(){
		window.location.href = "#/news";
	};	
  
  $ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
  
     var newsFilterid = $stateParams.newsFilterid;
	
		$scope.newsSlideDetails = [];

		
		if(search == null){
			var parameter = 'date_from='+from+'&date_to='+to+'&lang='+language+'';
			//console.log(parameter);		
		}else{		
			var parameter = 'date_from='+from+'&date_to='+to+'&filter_text='+search+'&lang='+language+'';
			//console.log(parameter);		
		}
		console.log('http://www.faitango.it/tyg_news_reader.php?'+parameter+'');		
		$http.post('http://www.faitango.it/tyg_news_reader.php?'+parameter+'').success(function(items) {				 
		 console.log(items.data);
		 $ionicLoading.hide();
		  $scope.newsSlideDetails = items.data ;
		 
		  setTimeout(function() {
			$ionicSlideBoxDelegate.slide(newsFilterid); 
			//$ionicSlideBoxDelegate.slide(0); //position of image
			$ionicSlideBoxDelegate.update();
			$scope.$apply();
            });		
			 
		
    }); 
	
})


//-----------  FestivalSlideCtrl Start --------------------- //
.controller('FestivalSlideCtrl', function($scope, $log, $http, $ionicSlideBoxDelegate, $stateParams, $ionicLoading, $rootScope, $translate) {
  
  	var menuName = $stateParams.menuName;
		$scope.menuName = menuName;
		//alert(menuName);


$scope.ionicGoBack = function(){
	
 if(menuName == 'festival'){
	  window.location.href = '#/festival/festival';
	  //alert('#/festival/festival');
  }else{
	  window.location.href = '#/festival/corsi'; 
	  //alert('#/festival/corsi');
  }
};	
  
var language = $rootScope.language;
$translate.use(language); 

var setMapData = localStorage.getItem("setMapData");  
var sliderData = angular.fromJson(setMapData);
//console.log(setMapData);
	
var positionFestivalid = $stateParams.festivalid;
	//alert(positionFestivalid); 
	$scope.festivalSlideDetails = []; 
	$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
	 
	 $scope.festivalSlideDetails = sliderData ;	
		
		 setTimeout(function() {		 
			$ionicSlideBoxDelegate.slide(positionFestivalid);
			$ionicSlideBoxDelegate.update();
			$scope.$apply();
			$ionicLoading.hide();			
		 });

	
  
	
	
		
		
	 /* $http.post('http://api.faitango.it/tango.php?lang='+language+'&type='+menuName).success(function(items) {
		 console.log(items.data);
		 $scope.festivalSlideDetails = items.data ;		
		setTimeout(function() {
		$ionicLoading.hide();
		$ionicSlideBoxDelegate.slide(positionFestivalid); 
		$ionicSlideBoxDelegate.update();
		$scope.$apply();
		}); 		
     });  */
	 	
	
})


//-----------  FestivalSlideFilterCtrl Start --------------------- //
.controller('FestivalSlideFilterCtrl', function($scope, $localStorage,  $log, $http, $ionicSlideBoxDelegate, $stateParams, $ionicLoading, $rootScope, $translate) {

 


	var menuName = $stateParams.menuName;
	$scope.menuName = menuName;
	//alert(menuName);
	
$scope.ionicGoBack = function(){
 if(menuName == 'festival'){
	  window.location.href = '#/festival/festival';
	  //alert('#/festival/festival');
  }else{
	  window.location.href = '#/festival/corsi'; 
	//  alert('#/festival/corsi');
  }
};	
	
var language = $rootScope.language;
//var language = 'it'; 
$translate.use(language);  
		
	var from = localStorage.getItem("from", from);  
	var to = localStorage.getItem("to", to);   					
	var provincia = localStorage.getItem("provincia", provincia);   					
	var region = localStorage.getItem("region", region);   					
	var search = localStorage.getItem("search", search);   					
    
	//console.log(filter_text);		
	
  
  
	var festivalFilterid = $stateParams.festivalFilterid;

	$scope.festivalSlideDetails = [];
	$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
		
		if(to == undefined || region == undefined || provincia == undefined || search == undefined ){	
					
					if(to == undefined){  var to = ''; }else{ var to = to;}
					if(region == undefined){  var region = ''; }else{ var region = region;}
					if(provincia == undefined){  var provincia = ''; }else{ var provincia = provincia;}
					if(search == undefined){  var search = ''; }else{ var search = search;}
				
					var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';
					
				}else{					
					var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';					
					//console.log(parameter);		
				}
		console.log('http://api.faitango.it/tango.php?'+parameter+'');
		
		
		
		$http.post('http://api.faitango.it/tango.php?'+parameter+'').success(function(items) {				 
		 //console.log(items.data);
		 
		  $scope.festivalSlideDetails = items.data ;
		 
		  setTimeout(function() {			  
			$ionicLoading.hide();
			$ionicSlideBoxDelegate.slide(festivalFilterid); 
			//$ionicSlideBoxDelegate.slide(0); //position of image
			$ionicSlideBoxDelegate.update();
			$scope.$apply();
            });		
	
    }); 
	
})

//-----------  CoursesSlideCtrl Start --------------------- //
.controller('CoursesSlideCtrl', function($scope, $log, $http, $ionicSlideBoxDelegate, $stateParams, $rootScope, $translate) {
  
  $scope.ionicGoBack = function(){
		window.location.href = "#/courses";
	};	
  
     var coursesid = $stateParams.coursesid;
	//alert(coursesid)
	$scope.coursesSlideDetails = [];
  		
	 $http.post('http://api.faitango.it/tango.php?lang=it&type=corsi').success(function(items) {				 
		 console.log(items.data);
		 $scope.coursesSlideDetails = items.data ;
		 
		  setTimeout(function() {
			$ionicSlideBoxDelegate.slide(coursesid); 
			//$ionicSlideBoxDelegate.slide(0); //position of image
			$ionicSlideBoxDelegate.update();
			$scope.$apply();
            });
		
	
			 /* ! function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0],
					//p = /^http:/.test(d.location) ? 'http' : 'https';
					
					p = /^http:/.test(items.data[0].citta) ? 'http' : 'https';
					//alert(items.data[0].citta);
				if (!d.getElementById(id)) {
					//alert(id);
					js = d.createElement(s);
					js.id = id;
					js.src = p + '://platform.twitter.com/widgets.js';
					fjs.parentNode.insertBefore(js, fjs);
				}
			}(document, 'script', 'twitter-wjs'); */
						
		
    }); 

})

//-----------  EventsSlideCtrl Start --------------------- //
.controller('EventsSlideCtrl', function($scope, $log, $http, $ionicSlideBoxDelegate, $ionicLoading, $stateParams,$rootScope, $translate, $localStorage) {

  $scope.ionicGoBack = function(){
		window.location.href = "#/events";
	};	

	
var language = $rootScope.language;
$translate.use(language); 


var setEventMapData = localStorage.getItem("setEventMapData");  
var sliderData = angular.fromJson(setEventMapData);
//alert(sliderData);
var positionEventsid = $stateParams.eventsid;
	//alert(positionEventsid); 
	$scope.eventsSlideDetails = []; 
	$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
	
	 $scope.eventsSlideDetails = sliderData ;
		
	 console.log(sliderData);
		setTimeout(function() {
		$ionicLoading.hide();
		$ionicSlideBoxDelegate.slide(positionEventsid); 
		$ionicSlideBoxDelegate.update();
		$scope.$apply();
		});
	
  
   /*   var eventsid = $stateParams.eventsid;
	 var pagination = eventsid / 10 ;	 
	 var paFixed = pagination.toFixed(1);
	 var array = paFixed.split(".");
	 var indexNumber = array[1];		
		console.log('eventid----'+eventsid);
		console.log('pagination----'+pagination);
		console.log('indexNumber----'+indexNumber);		
	var pa = parseInt(pagination);
		console.log('pa----'+pa);	
	$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
	 
	$scope.eventsSlideDetails = [];	
  	$scope.page = 0;
	 $http.post('http://api.faitango.it/tango.php?lang='+language+'&type=event&page='+pa).success(function(items) {				 
		$ionicLoading.hide();
		$scope.eventsSlideDetails = items.data ;
		var total_pages = items.total_pages ;
		  //console.log(items.data[pa]);
		  setTimeout(function() {
				$ionicSlideBoxDelegate.slide(indexNumber); 				
				//$ionicSlideBoxDelegate.slide(0); //position of image
				$ionicSlideBoxDelegate.update();
				$scope.$apply();
			});
			var items = new Array();					
			 $scope.slideHasChanged = function(sliderValue){				
			var totalSlides = $ionicSlideBoxDelegate.slidesCount()-1;
			if(total_pages < pa){	
				if(sliderValue == totalSlides){
						 pa++;
							 $http.post('http://api.faitango.it/tango.php?lang=en&type=event&page='+pa).success(function(items) {								
									angular.forEach(items.data, function(value, key) {
									$scope.eventsSlideDetails.push({titolo:value.titolo,data_da:value.data_da,citta:value.citta,img:value.img});			  
								}); 
									setTimeout(function() {
									$ionicSlideBoxDelegate.update();
									$scope.$apply();
								});
							});   						
					}
			}	
			};		
    });  */
})


//-----------  EventsSlideFilterCtrl Start --------------------- //
.controller('EventsSlideFilterCtrl', function($scope, $localStorage,  $log, $http, $ionicSlideBoxDelegate, $stateParams, $ionicLoading, $rootScope, $translate) {

	var menuName = "event";

var language = $rootScope.language;
//var language = 'it'; 
$translate.use(language);  
		
	var from = localStorage.getItem("from", from);  
	var to = localStorage.getItem("to", to);   					
	var provincia = localStorage.getItem("provincia", provincia);   					
	var region = localStorage.getItem("region", region);   					
	var search = localStorage.getItem("search", search);  		
	
   
  $scope.ionicGoBack = function(){
		window.location.href = "#/events";
	};	
  
  $ionicLoading.show({ template: "Loading ... "});
  
     var eventsFilterid = $stateParams.eventsFilterid;

		$scope.eventsSlideDetails = [];

		if(to == undefined || region == undefined || provincia == undefined || search == undefined ){	
					
			if(to == undefined){  var to = ''; }else{ var to = to;}
			if(region == undefined){  var region = ''; }else{ var region = region;}
			if(provincia == undefined){  var provincia = ''; }else{ var provincia = provincia;}
			if(search == undefined){  var search = ''; }else{ var search = search;}
		
			var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';
			
			}else{					
				var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';					
				//console.log(parameter);		
			}
		console.log('http://api.faitango.it/tango.php?'+parameter);
		
		
		$http.post('http://api.faitango.it/tango.php?'+parameter+'').success(function(items) {				 
		 //console.log(items.data);
		 $ionicLoading.hide();
		  $scope.eventsSlideDetails = items.data ;
		 
		  setTimeout(function() {
			$ionicSlideBoxDelegate.slide(eventsFilterid); 
			//$ionicSlideBoxDelegate.slide(0); //position of image
			$ionicSlideBoxDelegate.update();
			$scope.$apply();
            });		
    }); 
	
})


//-----------  NewsMapDetailsCtrl Start --------------------- //
.controller('NewsMapDetailsCtrl', function($scope, $log, $http, $ionicLoading, 	$rootScope, $translate) {
    	
	$scope.ionicGoBack = function(){
		window.location.href = "#/news";
	};	
	
var language = $rootScope.language;
//var language = 'it'; 
$translate.use(language); 

	
	$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
	
	  $http.post('http://www.faitango.it/tyg_news_reader.php').success(function(res) {				 
		 	
		$ionicLoading.hide();
		var getFirstLat = res.data[0].lat;
		var getFirstLong = res.data[0].long;
		
		var abhi = new Array();			  

		angular.forEach(res.data, function(value, key) {
		//console.log(key);			
		var mapLat = value; 
			abhi.push([mapLat.citta+'&nbsp; <a href="#/newsslide/'+key+'">Click Here</a>', mapLat.lat, mapLat.long, 7]); 	
		}); 	
		//console.log(abhi);
		var locations =  abhi;		

		var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 2,
		center: new google.maps.LatLng(37.5297772, 15.1123483),	//center: new google.maps.LatLng(37.5297772, 15.1123483),
		mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		var infowindow = new google.maps.InfoWindow();

		var marker, i;

		for (i = 0; i < locations.length; i++) { 
		marker = new google.maps.Marker({
		position: new google.maps.LatLng(locations[i][1], locations[i][2]),
		map: map
		});

		google.maps.event.addListener(marker, 'click', (function(marker, i) {
		return function() {
		infowindow.setContent(locations[i][0]);
		infowindow.open(map, marker);
		}
		})(marker, i));
		}
		
    });
	
})

//-----------  FestivalMapDetailsCtrl Start --------------------- //
.controller('FestivalMapDetailsCtrl', function($scope, $log, $http, $stateParams, $ionicLoading, $rootScope, $translate) {
	
//localStorage.clear();    
	
	var setMapData = localStorage.getItem("setMapData");  
//console.log(setMapData);
	
var menuName = $stateParams.menuName;
$scope.menuName = menuName;

if(menuName == 'festival'){
$scope.urlLink = '#/festival/festival';
}else{
$scope.urlLink = '#/courses/corsi';
}	
	
	$scope.ionicGoBack = function(){
		 if(menuName == 'festival'){
			  window.location.href = '#/festival/festival';
		  }else{
				window.location.href = '#/courses/corsi';
		  }
	};
	
	$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});


	
var language = $rootScope.language;
//var language = 'it'; 
$translate.use(language); 
		
	

	   /* $http.post('http://api.faitango.it/tango.php?lang='+language+'&type='+menuName).success(function(res) {				 
		 $ionicLoading.hide();	
		var getFirstLat = res.data[0].lat;
		var getFirstLong = res.data[0].long;
			 */

var getLocalMapdataCooldude = angular.fromJson(setMapData);
//console.log(getLocalMapdataCooldude[0].lat);	
var getFirstLat = getLocalMapdataCooldude[0].lat;
var getFirstLong = getLocalMapdataCooldude[0].long; 
			 
		 var abhi = new Array();			  
		
		angular.forEach(getLocalMapdataCooldude, function(value, key) {
			//console.log(value.titolo);				
		 var mapLat = value; 
				abhi.push([mapLat.titolo+'&nbsp; <a href="#/festivalslide/'+menuName+'/'+key+'">Click Here</a>', mapLat.lat, mapLat.long, 7]);  	
		}); 	
		
		//console.log(abhi);
		 var locations =  abhi;			
		
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: new google.maps.LatLng(getFirstLat, getFirstLong),	
      //center: new google.maps.LatLng(37.5297772, 15.1123483),	
	 
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

     for (i = 0; i < locations.length; i++) { 
	
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });
		 $ionicLoading.hide();
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    } 
		
    /* });	 */
})

//-----------  FestivalFilterMapCtrl Start --------------------- //
.controller('FestivalFilterMapCtrl', function($scope, $log, $http, $stateParams, $ionicLoading, $rootScope, $translate) {
    
var menuName = $stateParams.menuName;
$scope.menuName = menuName;
//alert(menuName);

var language = $rootScope.language;
//var language = 'it'; 
$translate.use(language);  
 
		 
 		
if(menuName == 'festival'){
$scope.urlLink = '#/festival/festival';
}else{
$scope.urlLink = '#/courses/corsi'; 
} 
		  
	$scope.ionicGoBack = function(){
		 if(menuName == 'festival'){
			  window.location.href = '#/festival/festival';
		  }else{
			  window.location.href = '#/courses/corsi'; 
		  }
	};
	
	
$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});

	
var from = localStorage.getItem("from", from);  
var to = localStorage.getItem("to", to);   					
var provincia = localStorage.getItem("provincia", provincia);   					
var region = localStorage.getItem("region", region);   					
var search = localStorage.getItem("search", search);  

if(to == undefined || region == undefined || provincia == undefined || search == undefined ){	
					
					if(to == undefined){  var to = ''; }else{ var to = to;}
					if(region == undefined){  var region = ''; }else{ var region = region;}
					if(provincia == undefined){  var provincia = ''; }else{ var provincia = provincia;}
					if(search == undefined){  var search = ''; }else{ var search = search;}
				
					var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';
					
				}else{					
					var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';					
					//console.log(parameter);		
				}
		console.log('http://api.faitango.it/tango.php?'+parameter+'');
		
	  $http.post('http://api.faitango.it/tango.php?'+parameter+'').success(function(res) {				 
		 $ionicLoading.hide();	
		var getFirstLat = res.data[0].lat;
		var getFirstLong = res.data[0].long;
			
		 var abhi = new Array();			  
		
		angular.forEach(res.data, function(value, key) {
			//console.log(key);	
			
		var mapLat = value; 
				abhi.push([mapLat.titolo+'&nbsp; <a href="#/festivalfilterslide/'+menuName+'/'+key+'">Click Here</a>', mapLat.lat, mapLat.long, 7]); 	
		}); 	
			
		//console.log(abhi);
		var locations =  abhi;			
		
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: new google.maps.LatLng(getFirstLat, getFirstLong),	//center: new google.maps.LatLng(37.5297772, 15.1123483),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) { 
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
		
    });	
})

//-----------  EventsFilterMapCtrl Start --------------------- //
.controller('EventsFilterMapCtrl', function($scope, $log, $http, $stateParams, $ionicLoading, $rootScope, $translate) {
    
var menuName = "event";

var language = $rootScope.language;
//var language = 'it'; 
$translate.use(language);    
		
		
	$scope.ionicGoBack = function(){
		 window.location.href = '#/events';
		 /* if(menuName == 'festival'){
			  window.location.href = '#/events/festival';
		  }else{
			  window.location.href = '#/events/corsi'; 
		  } */
	};
	
	
$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});

	
var from = localStorage.getItem("from", from);  
var to = localStorage.getItem("to", to);   					
var provincia = localStorage.getItem("provincia", provincia);   					
var region = localStorage.getItem("region", region);   					
var search = localStorage.getItem("search", search);  

if(to == undefined || region == undefined || provincia == undefined || search == undefined ){	
					
					if(to == undefined){  var to = ''; }else{ var to = to;}
					if(region == undefined){  var region = ''; }else{ var region = region;}
					if(provincia == undefined){  var provincia = ''; }else{ var provincia = provincia;}
					if(search == undefined){  var search = ''; }else{ var search = search;}
				
					var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';
					
				}else{					
					var parameter = 'from='+from+'&to='+to+'&lang='+language+'&type='+menuName+'&provincia='+provincia+'&region='+region+'&search='+search+'';					
					//console.log(parameter);		
				}
		console.log('http://api.faitango.it/tango.php?'+parameter+'');
		
	  $http.post('http://api.faitango.it/tango.php?'+parameter+'').success(function(res) {				 
		 $ionicLoading.hide();	
		var getFirstLat = res.data[0].lat;
		var getFirstLong = res.data[0].long;
			
		 var abhi = new Array();			  
		
		angular.forEach(res.data, function(value, key) {
			//console.log(key);	
			
		var mapLat = value; 
				abhi.push([mapLat.titolo+'&nbsp; <a href="#/eventsfilterslide/'+key+'">Click Here</a>', mapLat.lat, mapLat.long, 7]); 	
		}); 	
			
		//console.log(abhi);
		var locations =  abhi;			
		
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: new google.maps.LatLng(getFirstLat, getFirstLong),	//center: new google.maps.LatLng(37.5297772, 15.1123483),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) { 
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
		
    });	
})

//-----------  EventsMapDetailsCtrl Start --------------------- //
.controller('EventsMapDetailsCtrl', function($scope, $log, $http, $ionicLoading, $rootScope , $translate) {
    	
	$scope.ionicGoBack = function(){
		window.location.href = "#/events";
	};	
	
	  //$http.post('http://www.faitango.it/tyg_news_reader.php').success(function(res) {				 
		
var language = $rootScope.language;
//var language = 'it'; 
$translate.use(language);    
		
		
	$ionicLoading.show({ template: 'Loading ... <sub><sub><sub><ion-spinner icon="lines"></ion-spinner></sub></sub></sub>'});
	
	/* $http.post('http://api.faitango.it/tango.php?lang='+language+'&type=event').success(function(res) {
	$ionicLoading.hide();
		
		var getFirstLat = res.data[0].lat;
		var getFirstLong = res.data[0].long;
		 */
	var setEventMapData = localStorage.getItem("setEventMapData");  
	var getLocalMapdataCooldude = angular.fromJson(setEventMapData);
	//console.log(getLocalMapdataCooldude[0].lat);	
	var getFirstLat = getLocalMapdataCooldude[0].lat;
	var getFirstLong = getLocalMapdataCooldude[0].long; 
	 
		var abhi = new Array();			  

		angular.forEach(getLocalMapdataCooldude, function(value, key) {
		//console.log(key);			
		var mapLat = value; 
			abhi.push([mapLat.titolo+'&nbsp; <a href="#/eventsslide/'+key+'">Click Here</a>', mapLat.lat, mapLat.long, 7]); 	
		}); 	
		//console.log(abhi);
		var locations =  abhi;		

		var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: new google.maps.LatLng(getFirstLat, getFirstLong),
		//center: new google.maps.LatLng(37.5297772, 15.1123483),	//center: new google.maps.LatLng(37.5297772, 15.1123483),
		mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		var infowindow = new google.maps.InfoWindow();

		var marker, i;

		for (i = 0; i < locations.length; i++) { 
		 $ionicLoading.hide();
		marker = new google.maps.Marker({
		position: new google.maps.LatLng(locations[i][1], locations[i][2]),
		map: map
		});

		google.maps.event.addListener(marker, 'click', (function(marker, i) {
		return function() {
		infowindow.setContent(locations[i][0]);
		infowindow.open(map, marker);
		}
		})(marker, i));
		}
		
    /* }); */
	
})
;

