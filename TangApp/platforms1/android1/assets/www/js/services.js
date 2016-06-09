'use strict';

var BASE_URL = "http://www.faitango.it/";
var BASE_URL_1 = "http://api.faitango.it/";


var News_URL = BASE_URL+"tyg_news_reader.php?";
//var EVENT_URL = BASE_URL_1+"tango.php?lang=en&type=event";

angular.module('starter.services',[])


/* NewsDetail */
 .factory('NewsDetail',function($http,$q){
	
return{
    News:function(detail){
		  var Url = News_URL; 
           var defer = $q.defer();
			
           $http.post(Url+detail).
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

 
.factory('FestivalCosiService', function($http, $rootScope){

	
	var language = $rootScope.language;
		
	var EVENT_URL = 'http://api.faitango.it/tango.php?lang='+language;
	var eventItems = [];
	var i = 0;
	
	
	var cnt = 99999999;
	return {
		GetStartEvent: function(menuName){
			i = 0;
		console.log(i);
		console.log(EVENT_URL+'&type='+menuName+'&page='+i);
		
			return $http.post(EVENT_URL+'&type='+menuName+'&page='+i).then(function(response){
				
				eventItems = response.data;
				return eventItems;
			});
		},
		GetNextEvent: function(menuName){
			//alert(i);
			console.log(i+'next');
			if(i <= cnt)
			{			
					i++;
					return $http.post(EVENT_URL+'&type='+menuName+'&page='+i).then(function(response){
					eventItems = response.data;
					
					cnt = response.data.total_pages;
					
						return eventItems;		
				});
			}
			else
			{
				return false;
			}
			
		}
	}
}) 

.factory('EventService', function($http, $rootScope){


	//var BASE_URLs = "http://api.faitango.it/tango.php?lang=en&type=event";
	var language = $rootScope.language;
	
	var EVENT_URL = BASE_URL_1+'tango.php?lang='+language+'&type=event';
		
	
	
	var items = [];
	var i = 0;
	var cnt = 99999999;
	return {
		GetStartEvent: function(){
			i = 0;
			console.log(i);
			return $http.post(EVENT_URL+'&page='+i).then(function(response){
				
	
				items = response.data;
				return items;
			})/* .then(function(response, status) {
				items = 'Repos error';
				//console.log('Repos error');
				return items;
				}) */;
		},
		GetNextEvent: function(){
			console.log(i+'next');
			//console.log(cnt);
			if(i <= cnt)
			{
				i++;
					return $http.post(EVENT_URL+'&page='+i).then(function(response){
					items = response.data;
					
					cnt = response.data.total_pages;
					
						return items;		
				});
			}
			else
			{
				return false;
			}
			
		}
	}
}) 
