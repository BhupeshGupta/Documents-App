angular.module('starter')
    .factory('SessionService', sessionService);

function sessionService($http, SettingsFactory, $rootScope, $q, $localStorage, $ionicPopup, $state) {

    var DEFAULT_STATE = {
        userLoaded: false,
        user: null,
        canWrite: []
    };

    var state = angular.copy(DEFAULT_STATE);

    // `session_` prefix
    $localStorage.$default({
        session_loggedIn: false
    });


    function login(usr, pwd) {
        var data = {
            usr: usr,
            pwd: pwd
        };

        var url = SettingsFactory.getERPServerBaseUrl() + '/api/method/login?' + $.param(data);

        return $http({
            url: url,
            method: 'POST',
            loading: true
        }).then(function (data) {
            $localStorage.session_loggedIn = true;
            $localStorage.session_sid = data.data.sid;
            return data;
        });
    }

    function _getStartupData() {
        var data = {
            cmd: 'startup',
            _type: 'POST',
            sid: $localStorage.session_sid
        };
        return $http({
            url: SettingsFactory.getERPServerBaseUrl(),
            data: $.param(data),
            method: 'POST'
        });
    }

    function setupUser() {
        return $q(function (resolve, reject) {
            if (!$localStorage.session_loggedIn) {
                return reject();
            }

            if (state.userLoaded) {
                return resolve();
            }

            _getStartupData()
                .then(function (data) {
                    state.user = data.data.user_info[data.data.user.name];
                    state.canWrite = data.data.user.can_write;

                    if (state.user.image.indexOf('http') == -1)
                        state.user.image = SettingsFactory.getERPServerBaseUrl() + state.user.image;

                    if (data.data.server_date !== moment().format('YYYY-MM-DD'))
                        $ionicPopup.show({
                            template: '<p><strong>Date Mismatch.</strong><br>Please check device date and restart the app.</p>',
                            title: 'Error',
                        });

                    state.userLoaded = true;
                    $localStorage.session_loggedIn = true;

                    return resolve();
                })
                .catch(function () {
                    logout();
                    return reject();
                });
        });
    }

    function getUser() {
        return state.user;
    }

    function logout() {
        state = angular.copy(DEFAULT_STATE);
        $localStorage.session_loggedIn = false;
        $localStorage.session_sid = null;
        $rootScope.$broadcast('user:logout');

        $state.go('root.login');
    }

    function isWriteAuth(doctype) {
        if (!state.userLoaded) {
            return true;
        }
        return $.inArray(doctype, state.canWrite) > -1;
    }

    function isLoggedIn() {
        return $localStorage.session_loggedIn;
    }

    function getToken() {
        return $localStorage.session_sid;
    }

    return {
        login: login,
        setupUser: setupUser,
        getUser: getUser,
        isLoggedIn: isLoggedIn,
        isWriteAuth: isWriteAuth,
        getToken: getToken,
        state: state,
        logout: logout
    };

}
