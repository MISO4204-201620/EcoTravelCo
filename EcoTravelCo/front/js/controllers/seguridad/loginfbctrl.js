'use strict';

materialAdmin
        .controller('LoginfbCtrl', function ($scope, $rootScope, $http, $location, jwtHelper, $state, $window, growlService) {
            $scope.registrofb = {};
            $scope.usuario = {correo: ""};

            var app_id = '985703204846099';
            var scopes = 'email, user_friends, user_online_presence,publish_actions';

            var statusChangeCallback = function (response, callback) {
                console.log("verificacion de status");
                console.log(response);
                if (response.status === 'connected'){
                    getFacebookData();
                } else {
                    	callback(false);
                }
            }

            var checkLoginState = function (callback) {
                FB.getLoginStatus(function (response) {
                    callback(response);
                });
            }

            var getFacebookData = function () {
                FB.api('/me?fields=id,name,email,permissions', function (response) {

                    console.log(response.status);
                    if (response.status == undefined) {
                        //sessionStorage.token = res.token;
                        sessionStorage.setItem("auth", "fb");
                        sessionStorage.setItem("nombreusuario", response.name);
                        sessionStorage.setItem("correousuario", response.email);
                        sessionStorage.setItem("tipo", "CLIENTE");
                        sessionStorage.setItem("foto", 'http://graph.facebook.com/' + response.id + '/picture?type=large');
                        // console.log(sessionStorage.getItem("nombreusuario"));

                        $scope.registrofb.apellido_sec = null;
                        $scope.registrofb.tipo = "CLIENTE";
                        $scope.registrofb.correo_electronico = sessionStorage.getItem("correousuario");
                        $scope.usuario.correo = sessionStorage.getItem("correousuario");
                        $scope.registrofb.login = sessionStorage.getItem("correousuario");
                        $scope.registrofb.foto = sessionStorage.getItem("foto");
                        $scope.registrofb.nombre = sessionStorage.getItem("nombreusuario");
                        $scope.registrofb.id_direccion_id = null;
                        $scope.registrofb.apellido = null;
                        $scope.registrofb.nombre_sec = null;
                        $scope.registrofb.telefono = "5556060";
                        $scope.registrofb.contrasenia = "12345";

                        $scope.autenticarUsuario();

                    } else if(response.error.code==2500){
                        console.log("Else");
                        console.log(response.error.code);

                    }

                });

            }

            var facebookLogin = function () {
                checkLoginState(function (data) {
                    if (data.status !== 'connected') {
                        console.log("entra al si");
                        FB.login(function (response) {
                            if (response.status === 'connected')
                                console.log("Se conecto...");
                                getFacebookData();
                        }, {scope: scopes});
                    }
                })
            }

            var facebookLogout = function () {
                checkLoginState(function (data) {
                    if (data.status === 'connected') {
                        console.log("Cierra sesión");
                        FB.logout(function (response) {
                            window.location.href = 'http://localhost:9291/login.html#/home';
                        })
                    }
                })

            }

            $(document).on('click', '#loginFB', function (e) {
                e.preventDefault();
                console.log("Presiono login");
                //   facebookLogin();
            })

            $(document).on('click', '#logout', function (e) {
                alert("Salir");
                e.preventDefault();
                facebookLogout();
            })

            $scope.autenticarUsuario = function () {
                $http.post("http://localhost:8181/seguridad/autenticar/fb", $scope.usuario, {})
                        .success(function (res) {
                            $scope.registro = {};
                            console.log(jwtHelper.decodeToken(res.token));
                            sessionStorage.token = res.token;
                            sessionStorage.setItem("nombreusuario", res.nombre + " " + res.apellido);
                            sessionStorage.setItem("correousuario", res.correo_electronico);
                            sessionStorage.setItem("tipo", res.tipo);
                            sessionStorage.setItem("foto", res.foto);

                            console.log(sessionStorage.getItem("nombreusuario"));
                            $window.location.href = '/#/home';
                            console.log(sessionStorage.token);
                        }).error(function (res) {
                    $scope.registrarUsuarioFB();
                });
            };
            $scope.registrarUsuarioFB = function () {
                console.log($scope.registrofb);
                $http.post("http://localhost:8181/cliente/", $scope.registrofb, {})
                        .success(function (res) {
                            $scope.registrofb = {};
                            $scope.autenticarUsuario();
                            $window.location.href = '/#/home';
                        }).error(function (res) {
                    console.log("Error respuesta guardar fb: " + res);
                });
            };
            $scope.iniciarfb = function () {

                (function () {
                    console.log("inicia fb..");
                    FB.init({
                        appId: app_id,
                        xfbml: true,
                        version: 'v2.6'
                    });
                    FB.getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            console.log("Conectado a fb");
                            getFacebookData();
                        } else if (response.status === 'not_authorized') {
                            console.log("No iniciado en fb");
                            facebookLogin();
                        } else {
                            console.log("No Conectado a fb");
                            facebookLogin();
                        }
                    });

                })();
            }
        });
