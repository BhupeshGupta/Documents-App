// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
  'ionic',
  'ngCordova',
  'ion-autocomplete',
  'pascalprecht.translate',
  'ngStorage'

])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login/');

    $stateProvider

      .state('root', {
      templateUrl: 'components/main/main.html',
      controller: 'MainController',
      controllerAs: 'mc',
      url: "/",
      absract: true
    })

    .state('root.login', {
      url: 'login/',
      templateUrl: 'components/login/login.html',
      controller: 'LoginController',
      resolve: {
        settings: function(SessionService, $state, $timeout) {
          if (SessionService.isLoggedIn()) {
            $timeout(function() {
              $state.go('root.home');
            }, 0);
          }
        }
      }
    })

    .state('root.home', {
      url: 'home',
      controller: 'HomeController',
      controllerAs: 'hc',
      templateUrl: 'components/home/home.html',
      resolve: {
        user: function(SessionService) {
          SessionService.setupUser();
        }
      }
    })

    .state('root.invoice', {
        url: 'invoice',
        templateUrl: 'components/invoice/invoice.html',
        controller: 'InvoiceFlowController',
        controllerAs: 'ifc'

      })
      .state('root.invoice.step1', {
        url: '/step1',
        views: {
          'invoice_view': {
            templateUrl: 'components/invoice/forms/step_1.html'
          }
        }
      })
      .state('root.invoice.step1-1', {
        url: '/step1-1',
        views: {
          'invoice_view': {
            templateUrl: 'components/invoice/forms/step_1-1.html'
          }
        }
      })
      .state('root.invoice.step2', {
        url: '/step2',
        views: {
          'invoice_view': {
            templateUrl: 'components/invoice/forms/step_2.html'
          }
        }
      })
      .state('root.invoice.step3', {
        url: '/step3',
        views: {
          'invoice_view': {
            templateUrl: 'components/invoice/forms/step_3.html'
          }
        }
      })
      .state('root.invoice.step4', {
        url: '/step4',
        views: {
          'invoice_view': {
            templateUrl: 'components/invoice/forms/step_4.html'
          }
        }
      })

    .state('root.cheque', {
        url: 'cheque',
        templateUrl: 'components/cheque/cheque.html',
        controller: 'ChequeController',
        controllerAs: 'cq'

      })
      .state('root.cheque.step1', {
        url: '/step1',
        views: {
          'cheque_view': {
            templateUrl: 'components/cheque/forms/step_1.html'
          }
        }
      })
      .state('root.cheque.step2', {
        url: '/step2',
        views: {
          'cheque_view': {
            templateUrl: 'components/cheque/forms/step_2.html'
          }
        }
      })
      .state('root.cheque.step3', {
        url: '/step3',
        views: {
          'cheque_view': {
            templateUrl: 'components/cheque/forms/step_3.html'
          }
        }
      })
      .state('root.cheque.step4', {
        url: '/step4',
        views: {
          'cheque_view': {
            templateUrl: 'components/cheque/forms/step_4.html'
          }
        }
      })
      .state('root.cheque.payslipStep1', {
        url: '/payslipStep1',
        views: {
          'cheque_view': {
            templateUrl: 'components/cheque/forms/payslip_step1.html'
          }
        }
      })
      .state('root.cheque.payslipStep2', {
        url: '/payslipStep2',
        views: {
          'cheque_view': {
            templateUrl: 'components/cheque/forms/payslip_step2.html'
          }
        }
      });
  });
