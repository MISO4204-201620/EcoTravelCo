/**
 * Created by Jorge on 27/03/2016.
 */

'use strict';



angular.module('materialAdmin')

    .controller('MisPreguntasCtrl', function ($scope, $rootScope, $http, $location, $filter, $sce, ngTableParams, tableService) {

        $scope.datos = [];
        $scope.data = {};

        $scope.queryPreguntas = function () {

            $http.get("http://localhost:8181/preguntas/usuario/",  {withCredentials: true, headers: {token: sessionStorage.token}})
                .success(function (res) {
                    $scope.datos=res;

                    $scope.tableBasic = new ngTableParams(
                        {page: 1, count: 5},
                        {
                            total: res.length,
                            getData: function ($defer, params) {

                                $defer.resolve(res.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                            }
                        }
                    );
                    console.log(res);
                }).error(function (res) {
                console.log("Doesn't work para insertar pregunta");
                console.log("El error para insertar pregunta: " + res);
            });

        }


        $scope.detailProd = function (id) {
            $rootScope.prodId= id;
        };

        $scope.queryPreguntas();

    });



angular.module('materialAdmin')

    .controller('ResPreguntasCtrl', function ($scope, $rootScope, $http, $location, $filter, $sce, ngTableParams, tableService) {
        $scope.datos = [];
        $scope.data = {};

        $scope.datos = [];
        $scope.data = {};

        $scope.queryPreguntas = function () {

            $http.get("http://localhost:8181/preguntas/proveedor/",  {withCredentials: true, headers: {token: sessionStorage.token}})
                .success(function (res) {
                    $scope.datos=res;

                    $scope.tableBasic = new ngTableParams(
                        {page: 1, count: 5},
                        {
                            total: res.length,
                            getData: function ($defer, params) {

                                $defer.resolve(res.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                            }
                        }
                    );
                    console.log(res);
                }).error(function (res) {
                console.log("Doesn't work para insertar pregunta");
                console.log("El error para insertar pregunta: " + res);
            });

        }



        $scope.responder = function (id) {


            $scope.upPreg = {
                respuesta : document.getElementById('respuesta').value,
                pregunta : id
            }

            $http.put("http://localhost:8181/preguntas/",$scope.upPreg,{withCredentials: true,headers: {token:sessionStorage.token }})
                .success(function(res){
                    $scope.queryPreguntas();
                    growlService.growl('Se actualizó correctamente la información.', 'inverse');

                }).error(function(res){
                growlService.growl(' Ocurrió un error actualizando la información.', 'inverse');

            });

        };


        $scope.detailProd = function (id) {
            $rootScope.prodId= id;
        };

        $scope.queryPreguntas();


    });

