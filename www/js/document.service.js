angular.module('starter')
  .factory('DocUpload', docUpload);

function docUpload($localStorage, $http, SettingsFactory) {

  return {
    createQueueInstance: createQueueInstance
  };

  function createQueueInstance(data) {
    return $http({
      url: SettingsFactory.getReviewServerBaseUrl() + "/queue",
      method: 'POST',
      data: data,
      // transformRequest: angular.identity,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  }



}
