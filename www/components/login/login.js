'use strict';

angular.module('starter')

.controller('LoginController', loginController);



function loginController($scope, $state, SessionService, SettingsFactory, $localStorage, $ionicHistory) {
  console.log("Hi from Login Controller");



  $scope.login_func = function() {





    SessionService.login($scope.loginData.username, $scope.loginData.password).then(
      function(response) {
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $state.go('root.home');

        $localStorage.login = {
          username: $scope.loginData.username
        };
        $scope.loginData.password = '';
      },
      function(error) {
        console.log("Invalid Login!");
      }
    );
    console.log("Hi from Login Function");
  };

  $scope.loginData = $localStorage.login || {
    username: '',
    password: ''
  };
}
