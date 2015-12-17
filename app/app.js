'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'LocalStorageModule',
    'myApp.home',
    'myApp.register',
    'myApp.welcome',
    'myApp.addInvoice'

]).config(['$routeProvider', 'localStorageServiceProvider', function ($routeProvider, localStorageServiceProvider) {

        localStorageServiceProvider.setPrefix('invoice');
        localStorageServiceProvider.setStorageType('sessionStorage');
        $routeProvider.otherwise({redirectTo: '/home'});

    }]);
