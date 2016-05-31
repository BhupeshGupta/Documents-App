'use strict';

angular.module('starter')

.controller('HomeController', homeController);


function homeController($state) {
    var vm = this;

    vm.cashFlow = function () {
        $state.go('root.cash.details');
    };

    vm.invoiceFlow = function () {
        $state.go('root.invoice.step1');
    };

    vm.chequeFlow = function () {
        $state.go('root.cheque.step1');
    };

    console.log("Hi from Home Controller");

}
