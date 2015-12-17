'use strict';

angular.module('myApp.welcome', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/welcome', {
                    templateUrl: 'welcome/welcome.html',
                    controller: 'WelcomeCtrl'
                });
            }])

        .controller('WelcomeCtrl', ['$scope', '$firebase', '$location', 'CommonProp', function ($scope, $firebase, $location, CommonProp) {
                $scope.username = CommonProp.getUser();
                $scope.invoice = [];
                $scope.invoice.services = [];
                $scope.service = {};

                if (!$scope.username) {
                    $location.path('/home');
                }

                var firebaseObj = new Firebase("https://nsscapstone.firebaseio.com/Invoices/");
                var sync = $firebase(firebaseObj.startAt($scope.username).endAt($scope.username));
                $scope.invoices = sync.$asArray();

                $scope.logout = function () {
                    CommonProp.logoutUser();
                };


                $scope.editInvoice = function (id) {
                    $scope.service = {};
                    console.log(id);

                    var firebaseObj = new Firebase("https://nsscapstone.firebaseio.com/Invoices/" + id);
                    var syn = $firebase(firebaseObj);
                    $scope.invoice = syn.$asObject();
                    $('#editModal').modal();
                };

                $scope.addService = function () {
                    console.log('here');
                    if (!$scope.invoice.service.name) {
                        return;
                    }
                    $scope.invoice.services.push($scope.invoice.service);
                    $scope.invoice.service = {};
                };

                $scope.deleteService = function (service)
                {
                    var originalServices = $scope.invoice.services.slice(0);
                    $scope.invoice.services.splice($scope.invoice.services.indexOf(service), 1);
                }

                $scope.getTotal = function () {
                    var total = 0;
                    if (!$scope.invoice.services)
                    {
                        return total;
                    }
                    for (var i = 0; i < $scope.invoice.services.length; i++) {
                        var service = $scope.invoice.services[i];
                        total += service.amount;
                    }
                    return total;
                };


                $scope.update = function () {
                    delete $scope.invoice.service;

                    var username = CommonProp.getUser();
                    var firebaseObj = new Firebase("https://nsscapstone.firebaseio.com/Invoices/" + $scope.invoice.$id);
                    var fb = $firebase(firebaseObj);

                    $scope.invoice.services = angular.copy($scope.invoice.services);
                    $scope.invoice.total = $scope.getTotal();

                    var invoice =
                            {
                                car_model: $scope.invoice.car_model,
                                customer: $scope.invoice.customer,
                                note: $scope.invoice.note,
                                services: $scope.invoice.services
                            };

                    fb.$update(invoice).then(function (ref) {
                        console.log(ref.key()); // bar
                        $('#editModal').modal('hide');
                    }, function (error) {
                        console.log("Error:", error);
                    });
                };

                $scope.confirmDelete = function (id) {
                    console.log(id);
                    var fb = new Firebase("https://nsscapstone.firebaseio.com/Invoices/" + id);
                    var invoice = $firebase(fb);
                    $scope.postToDelete = invoice.$asObject();
                    $('#deleteModal').modal();
                };

                $scope.deleteInvoice = function () {
                    console.log('here');
                    var fb = new Firebase("https://nsscapstone.firebaseio.com/Invoices/" + $scope.postToDelete.$id);
                    var invoice = $firebase(fb);
                    invoice.$remove().then(function (ref) {
                        $('#deleteModal').modal('hide');
                    }, function (error) {
                        console.log("Error:", error);
                    });
                };
            }]);
