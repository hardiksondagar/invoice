'use strict';

angular.module('myApp.register', ['ngRoute', 'firebase'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/register', {
                    templateUrl: 'register/register.html',
                    controller: 'RegisterCtrl'
                });
            }])

        .controller('RegisterCtrl', ['$scope', '$location', '$firebaseAuth', '$firebase', 'CommonProp', function ($scope, $location, $firebaseAuth, $firebase, CommonProp) {
                $scope.mesg = 'Hello';
                var firebaseObj = new Firebase("https://nsscapstone.firebaseio.com/");
                var auth = $firebaseAuth(firebaseObj);

                var login = {};
                $scope.login = login;


                $scope.signUp = function () {
                    if (!$scope.regForm.$invalid) {
                        var email = $scope.user.email;
                        var password = $scope.user.password;
                        var newUser = {
                            email: $scope.user.email,
                            password: $scope.user.password,
                            displayName: $scope.user.displayName,
                            businessName: $scope.user.businessName
                        };
                        if (email && password) {
                            login.loading = true;
//                            auth.$createUser({email: email, password: password})
                            auth.$createUser(email, password)
                                    .then(function (userData) {
                                        // do things if success
                                        console.log('User creation success');
//                                        console.log("User " + userData.uid + " created successfully!");
                                        return auth.$authWithPassword({
                                            email: email,
                                            password: password
                                        });
                                    })
                                    .then(function (authData) {
                                        console.log("Logged in as:", authData.uid);
                                        var firebaseObj = new Firebase("https://nsscapstone.firebaseio.com/users/" + authData.uid);
                                        var fb = $firebase(firebaseObj);
                                        fb.$update(newUser).then(function (ref) {
                                            CommonProp.setUser(authData.uid);
                                        }, function (error) {

                                        });
                                        $location.path('/home');

                                    }).
                                    catch (function (error) {
                                        // do things if failure
                                        console.log(error);
                                        $scope.regError = true;
                                        $scope.regErrorMessage = error.message;
                                    });
                        }
                    }
                };
            }]);
