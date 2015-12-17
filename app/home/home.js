'use strict';

angular.module('myApp.home', ['ngRoute', 'firebase', 'LocalStorageModule'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/home', {
                    templateUrl: 'home/home.html',
                    controller: 'HomeCtrl'
                });
            }])

        .controller('HomeCtrl', ['$scope', '$location', 'CommonProp', '$firebaseAuth', function ($scope, $location, CommonProp, $firebaseAuth) {

                var firebaseObj = new Firebase("https://nsscapstone.firebaseio.com/");
                var loginObj = $firebaseAuth(firebaseObj);

                loginObj.$onAuth(function (authData) {
                    if (authData) {
                        CommonProp.setUser(authData.uid);
                        $location.path('/welcome');
                    }
                });

                $scope.user = {};
                var login = {};

                $scope.test = function () {
                    login.loading = true;
                }

                $scope.login = login;
                $scope.SignIn = function (e) {
                    login.loading = true;
                    e.preventDefault();
                    var username = $scope.user.email;
                    var password = $scope.user.password;

                    loginObj.$authWithPassword({
                        email: username,
                        password: password
                    }).then(function (user) {
                        //Success callback
                        login.loading = false;
                        console.log('Authentication successful');
                        CommonProp.setUser(user.uid);
                        $location.path('/welcome');
                    }, function (error) {
                        //Failure callback
                        login.loading = false;
                        console.log('Authentication failure');
                    });
                }
            }])
        .service('CommonProp', ['$location', '$firebaseAuth', '$firebase', 'localStorageService', function ($location, $firebaseAuth, $firebase, localStorageService) {
                var username = '';
                var firebaseObj = new Firebase("https://nsscapstone.firebaseio.com/");
                var loginObj = $firebaseAuth(firebaseObj);

                return {
                    getUser: function () {
                        if (username == '') {
                            username = localStorage.getItem('username');
                        }
                        console.log(localStorageService.get('user'));
                        return username;
                    },
                    setUser: function (uid) {
                        var firebaseObj = new Firebase("https://nsscapstone.firebaseio.com/users/" + uid);
                        var sync = $firebase(firebaseObj);
                        var user = sync.$asObject();
                        console.log(user);
                        localStorageService.set('user', user);
                        localStorage.setItem("username", uid);
                    },
                    logoutUser: function () {
                        loginObj.$unauth();
                        username = '';
                        localStorage.removeItem('username');
                        localStorageService.clearAll();
                        $location.path('/home');
                    }
                };
            }])
        .directive('laddaLoading', [
            function () {
                return {
                    link: function (scope, element, attrs) {
                        var Ladda = window.Ladda;
                        var ladda = Ladda.create(element[0]);
                        // Watching login.loading for change
                        scope.$watch(attrs.laddaLoading, function (newVal, oldVal) {
                            // if true show loading indicator
                            if (newVal) {
                                ladda.start();
                            } else {
                                ladda.stop();
                            }
                        });
                    }
                };
            }
        ]);
