'use strict';

angular.module('materialAdmin')
    .controller('ProductosCtrl', function ($scope, $rootScope, $http, $location) {

        $scope.datos = [];
        $scope.data = {};
        $rootScope.load = 0;
        $scope.listaValores = [];

        $scope.queryAllProduct = function () {
            //var id = pathArray[pathArray.length-2];
            $http({method: 'GET', url: 'http://localhost:8181/producto_home/'})
                .success(function (res) {
                    $scope.datos = res
                    $rootScope.load = 1;
                }).error(function (res) {
                console.log("Doesn't work");
                console.log("Que trae esto: " + res);
            })
        };

        $scope.queryProducts = function () {
            $rootScope.busquedaProd = $scope.producto.search;
        };

        if ($rootScope.load == 0) {
            $scope.queryAllProduct();
        }

        $scope.detailProd = function (id) {
            $rootScope.prodId = id;
        };


    });

angular.module('materialAdmin')
        .controller('ProductosCtrlProveedor', function ($scope, $rootScope, $http, $location, $window) {
            $scope.datos = [];
            $scope.listaValores = [];
            //para cargar el combox box de paises
            $scope.combox = function () {
                $http.get("http://localhost:8181/datos", {
                    withCredentials: true,
                    headers: {token: sessionStorage.token}
                }).success(function (res) {
                    $scope.listaValores = res
                }).error(function (res) {
                    console.log("Doesn't work");
                    console.log("Que trae esto paises " + res);
                });
            };
            //para consultar los productos en la gestion de productos
            $scope.consultarProductos = function () {
                $http.get("http://localhost:8181/producto/", {
                    withCredentials: true,
                    headers: {token: sessionStorage.token}
                }).success(function (res) {
                    console.log("Consultando productos...");
                    $scope.datos = res

                    //  console.log("La respuesta en consultar: " + res);
                }).error(function (res) {
                    console.log("Doesn't work");
                    console.log("Que trae esto: " + res);
                });
            };
            //para insertar los productos
            $scope.insertarProducto = function () {
                var i = document.getElementById('imagen').files[0];
                var i2 = document.getElementById('imagen2').files[0];
                var i3 = document.getElementById('imagen3').files[0];

                var imagenBytes = i.result;
                var imagenBytes2 = i2.result;
                var imagenBytes3 = i3.result;
                $scope.producto.imagen = imagenBytes;
                $scope.producto.imagen2 = imagenBytes2;
                $scope.producto.imagen3 = imagenBytes3;
                //console.log("Imagen 1");
                //console.log($scope.producto.imagen);
                $http.post("http://localhost:8181/producto/", $scope.producto, {withCredentials: true, headers: {token: sessionStorage.token}})
                        .success(function (res) {
                            $scope.insertarProducto = {};
                            console.log("La respuesta del backend " + res);
                            $window.location.href = '/#/productos/productos';
                            $scope.consultarProductos();

                        }).error(function (res) {
                    console.log("Doesn't work para insertar producto");
                    console.log("El error para insertar producto: " + res);
                });
            };
            //para borrar los productos
            $scope.borrarProducto = function (id) {
                console.log("Borrar producto en el controlador " + id);
                $http.delete("http://localhost:8181/producto/" + id, $scope.productoDelete, {withCredentials: true, headers: {token: sessionStorage.token}})
                        .success(function (res) {
                            $scope.borrarProducto = {};
                            $scope.consultarProductos();
                            //console.log("La respuesta del backend " + res);
                        }).error(function (res) {
                    console.log("Doesn't work para Borrar producto");
                    console.log("El error para borar producto: " + res);
                });
            };
            //para listar el producto a editar
            $scope.listarProducto = function (id) {
                $rootScope.productoEditar = [];
                $rootScope.actualProducto = {};
                console.log("Listar producto en el controlador " + id);
                $http.get("http://localhost:8181/producto/" + id, {withCredentials: true, headers: {token: sessionStorage.token}})
                        .success(function (res) {
                            $rootScope.actualProducto = res;
                            console.log($rootScope.actualProducto);
                            $rootScope.actualProducto.cantidad = "" + $rootScope.actualProducto.cantidad;
                            $rootScope.actualProducto.latitud = "" + $rootScope.actualProducto.latitud;
                            $rootScope.actualProducto.longitud = "" + $rootScope.actualProducto.longitud;
                            $rootScope.actualProducto.precio = "" + $rootScope.actualProducto.precio;

                            console.log($rootScope.actualProducto);
                        }).error(function (res) {
                    console.log("Doesn't work para listar producto");
                    console.log("El error para borar producto: " + res);
                });
            };
            //para actualizr el producto en la gestion
            $scope.actualizarProducto = function (id) {
                //  var i = document.getElementById('imagen').files[0];
                // var i2 = document.getElementById('imagen2').files[0];
                // var i3 = document.getElementById('imagen3').files[0];

                //   var imagenBytes = i.result;
                /* var imagenBytes2 = i2.result;
                 var imagenBytes3 = i3.result;
                 $scope.producto.imagen = imagenBytes;
                 $scope.producto.imagen2 = imagenBytes2;
                 $scope.producto.imagen3 = imagenBytes3;*/
                //  console.log("Imagen 1");
                //  console.log(imagenBytes);
                //  $scope.actualProducto.imagen = imagenBytes;
                //  console.log("el id para editar "+id);
                // console.log($scope.actualProducto);
                console.log("Actualizado....")
                console.log($scope.actualProducto);
                $http.put("http://localhost:8181/producto/" + id, $scope.actualProducto, {withCredentials: true, headers: {token: sessionStorage.token}})
                        .success(function (res) {
                            $scope.actualProducto = {};
                            console.log("La respuesta del backend " + res);
                            $window.location.href = '/#/productos/productos';
                            $scope.consultarProductos();

                        }).error(function (res) {
                    console.log("Doesn't work para actualizar producto");
                    console.log("El error para actualizar producto: " + res);
                });
            };
            //autocarga de los productos en la gestion
            $scope.consultarProductos();
            $scope.combox();
        });

angular.module('materialAdmin')
    .controller('ProductosDetalle', function ($scope, $rootScope, $http, $location) {

        $scope.datos = [];
        $scope.data = {};

        $scope.myInterval = 0;
        $scope.galeria = [];


        $scope.comentario = [];
        $scope.comentarios = {};

        $scope.detailProd = function () {

            var id=  $rootScope.prodId;

            console.log("Entro?"+id);
            $http({method: 'GET', url: 'http://localhost:8181/producto_detalle/' + id})
                .success(function(res){
                    $scope.datos=res
                    console.log(res);

                }).error(function(res){
                console.log("Doesn't work");
                console.log("Que trae esto: "+res);
            })


            $http({method: 'GET', url: 'http://localhost:8181/galeria/' + id})
                .success(function(res){
                    $scope.galeria=res
                    console.log(res);

                }).error(function(res){
                console.log("Doesn't work");
                console.log("Que trae esto: "+res);
            })

        };


        $scope.detailProd();

    });




angular.module('materialAdmin')

    .controller('ProductosBusqueda', function ($scope, $rootScope, $http, $location, $filter, $sce, ngTableParams, tableService) {

        $scope.datos = [];
        $scope.data = {};

        $scope.comentario = [];
        $scope.comentarios = {};

        $scope.queryProducts = function () {

            var criterios = $rootScope.busquedaProd;

            var criterios=  $rootScope.busquedaProd;
            $http({method: 'GET', url: 'http://localhost:8181/producto_busqueda/' + criterios})
                .success(function(res){
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
                console.log("Doesn't work");
                console.log("Que trae esto: " + res);
            })
        };


        $scope.detailProd = function (id) {
            $rootScope.prodId= id;
        };

        $scope.queryProducts();

    });
