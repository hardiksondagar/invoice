'use strict';

angular.module('myApp.addInvoice', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/addInvoice', {
                    templateUrl: 'addInvoice/addInvoice.html',
                    controller: 'AddInvoiceCtrl'
                });
            }])

        .controller('AddInvoiceCtrl', ['$scope', '$firebase', '$location', 'CommonProp', function ($scope, $firebase, $location, CommonProp) {

                if (!CommonProp.getUser()) {
                    $location.path('/home');
                }
                var login = {};
                $scope.login = login;

                $scope.invoice = [];
                $scope.invoice.services = [];
                $scope.service = {};

                $scope.addService = function () {
                    console.log('here');
                    if (!$scope.invoice.service.name) {
                        return;
                    }
                    $scope.invoice.services.push($scope.invoice.service);
                    $scope.invoice.service = {};
                };

                $scope.getTotal = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.invoice.services.length; i++) {
                        var service = $scope.invoice.services[i];
                        total += service.amount;
                    }
                    return total;
                }

                $scope.deleteService = function (service)
                {
                    var originalServices = $scope.invoice.services.slice(0);
                    $scope.invoice.services.splice($scope.invoice.services.indexOf(service), 1);
                }

                $scope.logout = function () {
                    CommonProp.logoutUser();
                }

                $scope.AddInvoice = function () {
                    delete $scope.invoice.service;

                    login.loading = true;

                    var username = CommonProp.getUser();


                    var firebaseObj = new Firebase("https://nsscapstone.firebaseio.com/Invoices");
                    var fb = $firebase(firebaseObj);

                    var invoice = {
                        username: username,
                        '.priority': username
                    };

                    $scope.invoice.services = angular.copy($scope.invoice.services);
                    $scope.invoice.total = $scope.getTotal();
                    invoice = angular.extend($scope.invoice, invoice);
                    fb.$push(invoice).then(function (ref) {
                        login.loading = false;
                        console.log(ref);
                        $location.path('/welcome');
                    }, function (error) {
                        login.loading = false;
                        console.log("Error:", error);
                    });

                }
            }]);

