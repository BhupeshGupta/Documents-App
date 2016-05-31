console.log("Services.js ran");


// Default Http Header Change
angular.module('starter')
    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    });


// Global Loading
angular.module('starter')
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($rootScope, $q) {
            return {
                request: function (config) {
                    if (config.loading && config.loading == true)
                        $rootScope.$broadcast('loading:show');
                    return config;
                },
                response: function (response) {
                    $rootScope.$broadcast('loading:hide');
                    return response;
                },
                requestError: function (err) {
                    $rootScope.$broadcast('loading:hide');
                    return err;
                },
                responseError: function (err) {
                    $rootScope.$broadcast('loading:hide');
                    return $q.reject(err);
                }
            };
        });
    });
angular.module('starter')
    .run(function ($rootScope, $ionicLoading) {
        $rootScope.$on('loading:show', function () {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i><br/>Loading...',
                animation: 'fade-in',
                showBackdrop: true,
                delay: 1000
            });
        });

        $rootScope.$on('loading:hide', function () {
            $ionicLoading.hide();
        });
    });


angular.module('starter')
    .service('getInvoiceMetaData', function ($http, SettingsFactory) {
        this.get_meta = function (meta) {
            return $http({
                url: SettingsFactory.getERPServerBaseUrl() + '/?' + $.param({
                    cmd: "flows.flows.controller.ephesoft_integration.get_meta",
                    doc: meta,
                    _type: 'POST',
                }),
                method: 'GET',
                cache: false
            });
        };
    });

angular.module('starter')
    .factory('DocumentService', function ($http, SettingsFactory, SessionService) {
        var factory = {
            search: function (documentType, query, filters) {
                var data = {
                    txt: query,
                    doctype: documentType,
                    cmd: 'frappe.widgets.search.search_link',
                    _type: 'GET',
                    filters: JSON.stringify(filters)
                };
                var url = SettingsFactory.getERPServerBaseUrl() + '?' + $.param(data);
                return $http({
                    url: url,
                    //                    loading: false,
                    method: 'GET'
                }).then(function (data) {
                    return data.data;
                });
            },
            create: function (documentType, document, review) {
                var server = SettingsFactory.getERPServerBaseUrl();

                if (typeof review != 'undefined' && review) {
                    var server = SettingsFactory.getReviewServerBaseUrl() + '/review';
                }

                return $http({
                    url: server + '/api/resource/' + documentType + '/',
                    loading: true,
                    method: 'POST',
                    data: $.param({
                        data: JSON.stringify(document),
                        sid: SessionService.getToken(),
                        client: "app"
                    })
                });

            }
        };

        return factory;
    });
