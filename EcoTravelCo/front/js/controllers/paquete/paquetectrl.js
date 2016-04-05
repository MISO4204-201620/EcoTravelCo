'use strict';

angular.module('materialAdmin')
    .controller('PaqueteCtrl', function ($scope, $rootScope, $http, $location, $window, growlService) {

        $scope.paquetes = [];
        //Datos del paquete a crear
        $scope.paquete = {};
        $scope.datos = [];
        var cuantos = 0;
        $scope.total = 0;
        $scope.mostrar = false;
        $scope.agregado = [];
        $scope.imagen=[];
        $rootScope.imagenesCargadas = [];


        //Insertando el paquete
        $scope.insertarPaquete = function () {
            var error = false;
            // Validamos que se carge almenos una imagen
            if ($rootScope.imagenesCargadas.length == 0) {
                growlService.growl('Se debe ingresar una imagen.', 'danger');
                error = true;
            }

            // Validamos que se asignen por lo menos dos productoss
            if ($scope.agregado < 2) {
                growlService.growl('Se deben seleccionar 2 productos como mínimo.', 'danger');
                error = true;
            }

            if (!error) {
                //Agregar productos asociados al paquete
                $scope.paquete.cuantos = cuantos;
                $scope.paquete.productos = $scope.agregado;
                console.log($scope.paquete);

                var session = {withCredentials: true, headers: {token: sessionStorage.token}};

                $http.post("http://localhost:8181/paquete/", $scope.paquete, session)
                    .success(function (res) {
                        //agregar Imagenes
                        var idProd = res["keys"][0];
                        var principal = 1;
                        for (var i = 0; i < $rootScope.imagenesCargadas.length; i++){
                            var datosImagen = {
                                "imagen": $rootScope.imagenesCargadas[i]["img"],
                                "id_producto":idProd,
                                "principal": principal,
                            }

                            $http.post("http://localhost:8181/galeria/", datosImagen)
                                .success(function (res) {
                                    console.log("El Imagen guardada: " + res);
                                }).error(function (res) {
                                console.log("Doesn't work para Borrar producto");
                                console.log("El error para borar producto: " + res);
                            });
                            principal = 0;
                        }
                        
                        growlService.growl('Se guardo correctamente la información.', 'success');
                        $scope.paquete = {};
                        console.log("La respuesta del backend " + res);
                        $window.location.href = '/#/paquetes/paquetes';
                        // $scope.consultarProductos();
                    }).error(function (res) {
                    growlService.growl(' Ocurrió un error guardando la información.', 'danger');
                    console.log("Doesn't work para insertar paquete");
                    console.log("El error para insertar paquete: " + res);
                });
            }
        }


        $scope.listar = function () {
            var session = {withCredentials: true, headers: {token: sessionStorage.token}};
            $http.get("http://localhost:8181/paquete", session
            ).success(function (res) {
                $scope.paquetes = res;
                $scope.cantidadPaquetes = 0;
                $scope.cantidadPaquetes = $scope.paquetes.length;
            }).error(function (res) {
                console.log("Doesn't work");
                console.log("Que trae esto paquetes " + res);
            });
        };
        $scope.listar();

        //para consultar los productos en la gestion de productos
        $scope.consultarProductos = function () {
            $scope.mostrar = !$scope.mostrar;
            $scope.cantidadProductos = {};

            if($scope.datos.length == 0 && $scope.agregado.length == 0){
                var session = {withCredentials: true, headers: {token: sessionStorage.token}};
                $http.get("http://localhost:8181/producto/", session
                ).success(function (res) {
                    console.log("Consultando productos...");
                    $scope.datos = res;
                    $scope.cantidadProductos = res;
                    var productosTotal = Object.keys($scope.cantidadProductos).length;
                    $scope.cantidadProductos = productosTotal;
                }).error(function (res) {
                    growlService.growl(' Ocurrió un error consultando la información.', 'danger');
                    console.log("Doesn't work");
                    console.log("Que trae esto: " + res);
                });
            }
        };

        $scope.agregarProductos = function (productoId) {
            for (var i = 0; i < $scope.datos.length; i++) {
                if ($scope.datos[i].id === productoId) {
                    $scope.agregado.push($scope.datos[i]);
                    $scope.total = $scope.total + $scope.datos[i].precio;
                    $scope.datos.splice(i, 1);
                }
            }
            console.log($scope.agregado);
        };

        $scope.quitarProducto = function (productoId) {
            for (var i = 0; i < $scope.agregado.length; i++) {
                if ($scope.agregado[i].id === productoId) {
                    $scope.datos.push($scope.agregado[i]);
                    $scope.total = $scope.total - $scope.agregado[i].precio;
                    $scope.agregado.splice(i, 1);
                }
            }
        };

        //borrar paquete
        $scope.borrarPaquete = function (id) {
            var session = {withCredentials: true, headers: {token: sessionStorage.token}};
            $http.delete("http://localhost:8181/paquete/" + id, $scope.productoDelete, session)
                .success(function (res) {
                    $scope.listar();
                    growlService.growl('Se borró correctamente la información.', 'success');
                }).error(function (res) {
                growlService.growl(' Ocurrió un error borrando la información.', 'danger');
                console.log("Doesn't work para Borrar paquete");
                console.log("El error para borar producto: " + res);
            });
        };


        //Manejo de imagenes para crear
        $scope.imageUpload = function (event) {
            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }

        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                var img = {"img":e.target.result};
                $rootScope.imagenesCargadas.push(img);
            });
        }

        $scope.eliminarFoto = function (key) {
            for (var i = 0; i < $rootScope.imagenesCargadas.length; i++){
                if($rootScope.imagenesCargadas[i]["$$hashKey"] == key){
                    $rootScope.imagenesCargadas.splice(i,1);
                }
            }
        }
    });
