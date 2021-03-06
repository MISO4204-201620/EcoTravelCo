'use strict';

materialAdmin
    .controller('LoginCtrl', function ($scope, $rootScope, $http, $location, jwtHelper, $state, $window, growlService) {
        $scope.registro = {};
        $scope.usuario = {login: "", contrasenia: ""};
        this.login = 1;
        this.register = 0;
        this.forgot = 0;

        $scope.registrarUsuario = function () {
            $http.post("http://localhost:8181/cliente/", $scope.registro, {})
                .success(function (res) {
                    $scope.registro = {};
                    $scope.usuario = {login: document.getElementById("login").value, contrasenia: document.getElementById("pass").value};
                    $scope.autenticarUsuario();
                }).error(function (res) {
                console.log("Doesn't work");
                console.log("Que trae esto: " + res);
            });
        };

        $scope.autenticarUsuario = function () {

            $http.post("http://localhost:8181/seguridad/autenticar", $scope.usuario, {})

                .success(function (res) {
                    $scope.registro = {};
                    console.log(jwtHelper.decodeToken(res.token));

                    sessionStorage.token = res.token;
                    sessionStorage.setItem("nombreusuario", res.nombre + " " + res.apellido);
                    sessionStorage.setItem("correousuario", res.correo_electronico);
                    sessionStorage.setItem("tipo", res.tipo);
                    sessionStorage.setItem("foto", res.foto);

                    console.log(sessionStorage.getItem("nombreusuario"));
                    console.log(res);

                    $window.location.href = '/#/home';
                    console.log(sessionStorage.token);
                }).error(function (res) {
                //    growlService.growl('Error de autenticación.', 'danger');
                console.log("Doesn't work");
                console.log("Que trae esto: " + res);
            });
        };

        $scope.limpiarSesion = function () {
            var isFB = sessionStorage.getItem("auth");
            if (isFB == "fb") {
                (function () {
                    console.log("Ejecutando logout fb");
                    try{
                    FB.init({
                                            appId: '985703204846099',
                                            xfbml: true,
                                            version: 'v2.6'
                                        });
                                        FB.getLoginStatus(function (response) {
                                            if (response.status === 'connected'){
                                                console.log("Conectado a fb");
                                                FB.logout(function (response){
                                                    console.log("cerrando sesión");
                                                })
                                            } else if (response.status === 'not_authorized'){
                                                console.log("No iniciado en fb desde login");
                                            } else {
                                                console.log("No Conectado a fb desde login");
                                            }
                                        });
                    }catch(e){
                    }




                })();
                sessionStorage.clear();
            }else{
                sessionStorage.clear();
            }

        }


        $scope.iniciartw = function () {
            $http.get("http://localhost:8181/seguridad/autenticar/twitter", {})

                .success(function (res) {
                    $window.location.href = res.url;
                }).error(function (res) {
                //    growlService.growl('Error de autenticación.', 'danger');
                console.log("Doesn't work");
                console.log("Que trae esto: " + res);
            });


        }

        $scope.loginTwitter = function () {

            var uri = $location.absUrl().split("oauth_token=");
            if (uri.length > 1) {
                var uri2 = uri[1].split("&oauth_verifier=");
                var uri3 = uri2[1].split("#");
                var oauth_token = uri2[0];
                var oauth_verifier = uri3[0];
                sessionStorage.setItem("oauth_status", 0);
                var valido = uri[0],
                    substring = "localhost";
                if(valido.indexOf(substring) > -1){
                    $http.get("http://localhost:8181/seguridad/twitter/"+oauth_token+"/"+oauth_verifier, {})
                        .success(function (res) {
                            sessionStorage.token = res.token;
                            sessionStorage.setItem("nombreusuario", res.nombre + " " + res.apellido);
                            sessionStorage.setItem("correousuario", res.correo_electronico);
                            sessionStorage.setItem("tipo", res.tipo);
                            sessionStorage.setItem("foto", res.foto);
                            sessionStorage.setItem("oauth_token", res.oauth_token);
                            sessionStorage.setItem("oauth_verifier", res.oauth_verifier);
                            $window.location.href = '/#/home';
                        }).error(function (res) {
                        //    growlService.growl('Error de autenticación.', 'danger');
                        console.log("Doesn't work");
                        console.log("Que trae esto: " + res);
                    });
                }else {
                    $window.location.href = "http://localhost:9291/login.html?oauth_token="+oauth_token+"&oauth_verifier="+oauth_verifier;
                }

            }




        }


        this.getLocalStorageById=function(id){
            return localStorage.getItem(id);
        }

        $scope.limpiarSesion();
        $scope.loginTwitter();

    });