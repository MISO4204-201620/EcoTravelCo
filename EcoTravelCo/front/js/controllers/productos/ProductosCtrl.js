'use strict';

/**
 * @ngdoc function
 * @name sistemagestionuniversitario.controller:PersonaListaCtrl
 * @description
 * # PersonaListaCtrl
 * Controller of the PersonaLista
 */
angular.module('materialAdmin')
  .controller('ProductosCtrl', function ($scope, $rootScope, $http, $location) {
	  
      	$scope.datos = [];
      	$scope.data = {};	    
	    
	    console.log("Consultar los(las) Persona(s)");
	    $http.get("http://localhost:8181/producto/")
	    
	    .success(function(res){

$scope.datos=res
	    	
	    	
	    	 
	    	console.log(res);
	    
	    }).error(function(res){	  	  
	        console.log("Doesn't work");

	    });
	    
    
    
  });
  
  
  
  