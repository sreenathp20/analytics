  
    //console.log("SECTION", SECTION);
    var HirealchemyHcl = angular.module('HirealchemyHcl', ["highcharts-ng", "ngRoute"]);

	HirealchemyHcl.config(['$interpolateProvider', function($interpolateProvider) {
      $interpolateProvider.startSymbol('{[');
      $interpolateProvider.endSymbol(']}');
    }]);

	
    HirealchemyHcl.config(['$routeProvider', function($routeProvider, SECTION) {
    	var SECTION = 'hcl';
	    $routeProvider.
	      when('/', {
	        templateUrl: '/'+SECTION+'/dashboard',
	        controller: 'SummaryController'
	      }).
	      when('/statistics', {
	        templateUrl: '/'+SECTION+'/statistics',
	        controller: 'SummaryController'
	      }).
	      when('/timeseries', {
	        templateUrl: '/'+SECTION+'/timeseries',
	        controller: 'TimeseriesController'
	      }).
	      when('/phones', {
	        templateUrl: 'partials/phone-list.html',
	        controller: 'PhoneListCtrl'
	      }).
	      when('/phones/:phoneId', {
	        templateUrl: 'partials/phone-detail.html',
	        controller: 'PhoneDetailCtrl'
	      }).
	      otherwise({        
	        redirectTo: '/'
	      });
  	}]);

    