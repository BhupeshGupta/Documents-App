angular.module('starter')
  .factory('SettingsFactory', settingsFactory);

function settingsFactory($localStorage, $http) {
  var SETTINGS_PREFIX = 'settings_';
  var urlConfigCache = SETTINGS_PREFIX + 'urlConf';

  var defaultSettings = {
    serverBaseUrl: 'https://erp.arungas.com',
    reviewServerBaseUrl: '/review',
    language: 'hi',
    autoVoucherId: true
  };

  if (!$localStorage.settings) {
    $localStorage.settings = defaultSettings;
  }

  function setupConfig() {
    angular.extend($localStorage.settings, $localStorage[urlConfigCache]);
  }

  setupConfig();

  function loadAppConfig() {
    return $http.get($localStorage.settings.serverBaseUrl + "/app_conf.json?" + moment().valueOf())
      .then(function(data) {
        $localStorage[urlConfigCache] = data.data;
        setupConfig();
      });
  }

  return {
    get: function() {
      return $localStorage.settings;
    },
    getERPServerBaseUrl: function() {
      if (window.location.protocol != 'http:')
        return 'https://erp.arungas.com';
      else
        return '/api'
    },
    getReviewServerBaseUrl: function() {
      if (window.location.protocol != 'http:')
        return 'http://approve.arungas.com/api';
      else
        return '/review'
    },
    loadAppConfig: loadAppConfig
  };

}
